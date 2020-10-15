<template>
  <div class="local-peer-container">
    <e-session-expression-colors
      v-if="isExpressionsDetection"
      class="emotion-hue"
    />
    <div class="participant-displayName subtitle-1 pl-2 pr-2">
      {{ displayName }}
    </div>
    <e-session-media-cover v-if="showCover" class="stack-top" />
    <e-session-media :video-stream="videoStream" :audio-stream="null" />
    <div class="muted-icon">
      <v-icon v-if="micMuted" color="red">
        mdi-microphone-off
      </v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import { conferenceStore, detectionStore } from "~/store";

export default defineComponent({
  name: "ESessionLocalPeer",
  props: {
    mediaTracks: Object,
  },
  components: {
    ESessionExpressionColors: () =>
      import("~/components/features/ESessionExpressionColors.vue"),
    ESessionMedia: () => import("~/components/conference/ESessionMedia.vue"),
    ESessionMediaCover: () =>
      import("~/components/conference/ESessionMediaCover.vue"),
  },
  setup(props) {
    const videoStream = computed(() =>
      props.mediaTracks && props.mediaTracks.video
        ? props.mediaTracks.video
        : null,
    );
    const audioStream = computed(() =>
      props.mediaTracks && props.mediaTracks.audio
        ? props.mediaTracks.audio
        : null,
    );
    const participantId = computed(() => conferenceStore.status.id);
    const displayName = computed(() => conferenceStore.status.displayName);
    const micMuted = computed(() => conferenceStore.status.micMuted);
    const showCover = computed(() => {
      return !!(
        conferenceStore.status.camMuted && !conferenceStore.status.isSharing
      );
    });

    const isExpressionsDetection = computed(
      () => detectionStore.expressionsDetection,
    );

    return {
      videoStream,
      audioStream,
      displayName,
      participantId,
      micMuted,
      showCover,
      isExpressionsDetection,
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
.emotion-hue {
  position: absolute;
  width: 100%;
  height: 100%;
}
.local-peer-container {
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
