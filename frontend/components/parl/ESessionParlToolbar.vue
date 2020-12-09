<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex justify-center col-md-4 col-6">
        <e-session-parl-voting-bar v-if="isVoting" />
      </v-col>
      <v-col>
        <v-row class="d-flex justify-center">
          <v-btn
            v-if="!isModerator"
            tile
            large
            :disabled="conferenceJoined"
            @click.stop="moveHand"
          >
            <v-icon :color="user.handRaised ? 'secondary' : 'white'">
              mdi-hand-right
            </v-icon>
          </v-btn>
          <v-btn v-if="isModerator" tile large @click.stop="toggleVote">
            <v-icon :color="isVoting ? 'green' : 'white'">
              mdi-vote
            </v-icon>
          </v-btn>
          <v-btn v-if="isSpeaker" tile large @click.stop="toggleMic">
            <v-icon :color="micMuted ? 'red' : 'white'"
              >{{ micMuted ? "mdi-microphone-off" : "mdi-microphone" }}
            </v-icon>
          </v-btn>
          <v-btn v-if="isSpeaker" tile large @click.stop="toggleCam">
            <v-icon :color="camMuted ? 'red' : 'white'">{{
              camMuted ? "mdi-video-off" : "mdi-video"
            }}</v-icon>
          </v-btn>
          <v-btn v-if="isSpeaker" tile large @click.stop="toggleShare">
            <v-icon :color="isSharing ? 'secondary' : 'white'"
              >mdi-monitor-share</v-icon
            >
          </v-btn>
          <e-session-parl-toolbar-more />
          <v-btn tile large @click.stop="leaveRoom">
            <v-icon color="red">mdi-exit-to-app</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="showVoteResult" persistent width="350">
      <v-card>
        <v-card-title class="headline">
          Voting Result
        </v-card-title>
        <v-card-text>
          <e-session-parl-voting-result />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click.stop="hideVoteResult">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  computed,
  watch,
} from "nuxt-composition-api";
// import consola from "consola";
import { roomStore, sessionStore, conferenceStore, pollStore } from "~/store";
import {
  useLeave,
  useRaiseHand,
  useLowerHand,
  useStartShare,
  useEndShare,
} from "~/composable/useRoom";
import { useCreate, useEnd } from "~/composable/usePoll";

export default defineComponent({
  name: "ESessionParlToolbar",
  components: {
    ESessionParlVotingResult: () =>
      import("~/components/parl/ESessionParlVotingResult.vue"),
    ESessionParlToolbarMore: () =>
      import("~/components/parl/ESessionParlToolbarMore.vue"),
    ESessionParlVotingBar: () =>
      import("~/components/parl/ESessionParlVotingBar.vue"),
  },
  setup() {
    const { app } = useContext();
    const user = computed(() => sessionStore.user);
    const room = computed(() => roomStore.room);
    const micMuted = computed(() => conferenceStore.status.micMuted);
    const camMuted = computed(() => conferenceStore.status.camMuted);
    const isSharing = computed(() => conferenceStore.status.isSharing);
    const isSpeaker = computed(() => conferenceStore.status.isSpeaker);
    const isModerator = computed(() => sessionStore.isModerator);

    const { mutate: leave, onDone } = useLeave(user.value, room.value);

    function leaveRoom() {
      const wasModerator = isModerator.value;
      onDone(() => {
        app.$closeJitsiConnection();
        conferenceStore.doClearConferenceStatus();
        if (wasModerator) {
          window.location.href = "/parl";
        } else {
          window.location.href = "/parl";
        }
      });
      leave();
    }

    const { mutate: raiseHand } = useRaiseHand(user.value, room.value);
    const { mutate: lowerHand } = useLowerHand(user.value, room.value);

    const { mutate: startShare } = useStartShare(user.value, room.value);
    const { mutate: endShare } = useEndShare(user.value, room.value);

    const { mutate: createPoll } = useCreate(room.value);
    const { mutate: endPoll } = useEnd();

    const isVoting = computed(() => {
      if (pollStore.poll && pollStore.poll.status === "started") {
        return true;
      } else {
        return false;
      }
    });

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

    function toggleVote() {
      if (isVoting.value) {
        endPoll();
      } else {
        createPoll();
      }
    }

    const showVoteResult = computed(() => {
      return pollStore.poll && pollStore.poll.status === "ended";
    });

    function hideVoteResult() {
      pollStore.resetPoll();
      roomStore.resetVoteAllUser();
    }

    const conferenceJoined = computed(() => {
      const usrs = roomStore.room.users.filter(
        (item) => item.id === sessionStore.user.id,
      );
      return usrs.length > 0 ? usrs[0].conferenceJoined : false;
    });

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
      isModerator,
      toggleVote,
      isVoting,
      showVoteResult,
      hideVoteResult,
      conferenceJoined,
    };
  },
});
</script>

<style></style>
