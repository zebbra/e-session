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
    <v-btn tile large>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
    <v-btn tile large @click.stop="leaveRoom">
      <v-icon color="red">mdi-exit-to-app</v-icon>
    </v-btn>
    <v-spacer />
  </v-row>
</template>

<script lang="ts">
import { defineComponent, useContext, computed } from "nuxt-composition-api";
// import consola from "consola";
import { roomStore, sessionStore, conferenceStore } from "~/store";
import { useLeave, useRaiseHand, useLowerHand } from "~/composable/useRoom";

export default defineComponent({
  name: "ESessionControlToolbar",
  components: {},
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
        redirect("/");
      });
      leave();
    }

    const { mutate: raiseHand } = useRaiseHand(user.value, room.value);
    const { mutate: lowerHand } = useLowerHand(user.value, room.value);

    function moveHand() {
      if (user.value.handRaised) {
        lowerHand();
      } else {
        raiseHand();
      }
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

    async function toggleShare() {
      if (conferenceStore.status.isSharing) {
        await app.$localTracks.value.localStream.video.dispose();
      } else {
        app.$switchShare();
      }
    }

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