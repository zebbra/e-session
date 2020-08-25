<template>
  <v-row>
    <v-spacer />
    <v-btn tile large @click.stop="moveHand">
      <v-icon :color="user.handRaised ? 'secondary' : 'white'">
        mdi-hand-right
      </v-icon>
    </v-btn>
    <v-btn tile large :disabled="!isSpeaker" @click.stop="toggleMic">
      <v-icon :color="micMuted ? 'red' : 'white'"
        >{{ micMuted ? "mdi-microphone-off" : "mdi-microphone" }}
      </v-icon>
    </v-btn>
    <v-btn tile large :disabled="!isSpeaker" @click.stop="toggleCam">
      <v-icon :color="camMuted ? 'red' : 'white'">{{
        camMuted ? "mdi-video-off" : "mdi-video"
      }}</v-icon>
    </v-btn>
    <v-btn tile large :disabled="!isSpeaker" @click.stop="toggleShare">
      <v-icon :color="isSharing ? 'secondary' : 'white'"
        >mdi-monitor-share</v-icon
      >
    </v-btn>
    <e-session-control-toolbar-settings-menu />
    <v-btn tile large @click.stop="leaveRoom">
      <v-icon color="red">mdi-exit-to-app</v-icon>
    </v-btn>
    <v-spacer />
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  computed,
  watch,
} from "nuxt-composition-api";
// import consola from "consola";
import { roomStore, sessionStore, conferenceStore } from "~/store";
import {
  useLeave,
  useRaiseHand,
  useLowerHand,
  useStartShare,
  useEndShare,
} from "~/composable/useRoom";

export default defineComponent({
  name: "ESessionControlToolbar",
  components: {
    ESessionControlToolbarSettingsMenu: () =>
      import("~/components/conference/ESessionControlToolbarSettingsMenu.vue"),
  },
  setup() {
    const { redirect, app } = useContext();
    const user = computed(() => sessionStore.user);
    const room = computed(() => roomStore.room);
    const micMuted = computed(() => conferenceStore.status.micMuted);
    const camMuted = computed(() => conferenceStore.status.camMuted);
    const isSharing = computed(() => conferenceStore.status.isSharing);
    const isSpeaker = computed(() => conferenceStore.status.isSpeaker);

    const { mutate: leave, onDone } = useLeave(user.value, room.value);
    function leaveRoom() {
      onDone(() => {
        app.$closeJitsiConnection();
        roomStore.setUsersFilter("");
        conferenceStore.doClearConferenceStatus();
        redirect("/");
      });
      leave();
    }

    const { mutate: raiseHand } = useRaiseHand(user.value, room.value);
    const { mutate: lowerHand } = useLowerHand(user.value, room.value);

    const { mutate: startShare } = useStartShare(user.value, room.value);
    const { mutate: endShare } = useEndShare(user.value, room.value);

    function moveHand() {
      if (user.value.handRaised) {
        lowerHand();
      } else {
        raiseHand();
      }
    }

    function toggleShare() {
      conferenceStore.updateIsSharing(!conferenceStore.status.isSharing);
    }

    function toggleMic() {
      if (micMuted.value) {
        conferenceStore.updateMicMuted(false);
        app.$localTracks.value.localStream.audio.unmute();
      } else {
        conferenceStore.updateMicMuted(true);
        app.$localTracks.value.localStream.audio.mute();
      }
    }

    function toggleCam() {
      if (camMuted.value) {
        conferenceStore.updateCamMuted(false);
        app.$localTracks.value.localStream.video.unmute();
      } else {
        conferenceStore.updateCamMuted(true);
        app.$localTracks.value.localStream.video.mute();
      }
    }

    watch(
      // getter
      () => conferenceStore.status.isSharing,
      // callback
      (newVal) => {
        // console.log("conferenceStore.status.isSharing", newVal);
        if (newVal === true) {
          startShare();
          app.$startShare();
        } else {
          endShare();
          app.$endShare();
        }
      },
      // watch Options
      {
        lazy: true,
      },
    );

    return {
      leaveRoom,
      moveHand,
      user,
      room,
      micMuted,
      camMuted,
      isSharing,
      toggleMic,
      toggleCam,
      toggleShare,
      isSpeaker,
    };
  },
});
</script>

<style></style>
