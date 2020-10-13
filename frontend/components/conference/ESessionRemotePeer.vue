<template>
  <div class="peer-container">
    <div class="participant-displayName subtitle-1 pl-2 pr-2">
      {{ displayName }}
    </div>
    <e-session-media-cover v-if="showCover" class="stack-top" />
    <e-session-media :video-stream="videoStream" :audio-stream="audioStream" />
    <div class="muted-icon">
      <v-icon v-if="micMuted" color="red">
        mdi-microphone-off
      </v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, useContext } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionRemotePeer",
  props: {
    mediaTracks: Object,
  },
  components: {
    ESessionMedia: () => import("~/components/conference/ESessionMedia.vue"),
    ESessionMediaCover: () =>
      import("~/components/conference/ESessionMediaCover.vue"),
  },

  setup(props) {
    const { app } = useContext();
    const videoStream = computed(() =>
      props.mediaTracks.value.video ? props.mediaTracks.value.video : null,
    );
    const audioStream = computed(() =>
      props.mediaTracks.value.audio ? props.mediaTracks.value.audio : null,
    );

    const participantId = computed(() => {
      if (videoStream.value) {
        return videoStream.value.getParticipantId();
      } else if (audioStream.value) {
        return audioStream.value.getParticipantId();
      } else {
        return null;
      }
    });

    const displayName = computed(() =>
      app.$room.getParticipantById(participantId.value)
        ? app.$room.getParticipantById(participantId.value)._displayName
        : "",
    );

    const micMuted = computed(
      () => !!conferenceStore.mutedAudioTracks.includes(participantId.value),
    );

    const showCover = computed(
      () =>
        !!(
          conferenceStore.mutedVideoTracks.includes(participantId.value) &&
          !conferenceStore.presenterTracks.includes(participantId.value)
        ),
    );

    return {
      videoStream,
      audioStream,
      displayName,
      participantId,
      micMuted,
      showCover,
    };
  },
});
</script>

<style scoped>
.participant-displayName {
  position: absolute;
  mix-blend-mode: difference;
  z-index: 2;
  left: 10px;
  top: 10px;
  backdrop-filter: blur(5px) brightness(1.5);
  -webkit-backdrop-filter: blur(5px) brightness(1.5);
  border-radius: 5px;
  z-index: 7;
}
.peer-container {
  position: relative;
  min-width: 100%;
  /* min-height: 100%; */
  width: auto;
  /* height: calc(100vw * 0.5625); */
  align-self: center;
}
.muted-icon {
  position: absolute;
  bottom: 10px;
  left: 5px;
  z-index: 7;
}
.stack-top {
  position: absolute;
  z-index: 1;
}
</style>
