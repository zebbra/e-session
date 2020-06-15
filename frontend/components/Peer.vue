<template>
  <div class="peer-container">
    <div class="participant-displayName subtitle-1 pl-2 pr-2">
      {{ displayName }} - {{ participantId }}
    </div>
    <e-session-media-cover
      v-if="camMuted"
      class="stack-top"
      :style="coverStyle"
    />
    <media
      ref="mediaRef"
      :video-stream="videoStream"
      :audio-stream="audioStream"
    />
    <div class="muted-icon">
      <v-icon v-if="micMuted" color="red">
        mdi-microphone-off
      </v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "Peer",
  props: {
    mediaTracks: Object,
  },
  components: {
    Media: () => import("~/components/Media.vue"),
    ESessionMediaCover: () => import("~/components/ESessionMediaCover.vue"),
  },

  setup(props) {
    const mediaRef = ref(null);
    const videoStream = computed(() =>
      props.mediaTracks.value.video ? props.mediaTracks.value.video : null,
    );
    const audioStream = computed(() => {
      if (
        props.mediaTracks.value.audio &&
        props.mediaTracks.value.audio.isLocal()
      ) {
        return null;
      } else {
        return props.mediaTracks.value.audio
          ? props.mediaTracks.value.audio
          : null;
      }
    });
    const coverStyle = computed(() => {
      // console.log("mediaRef", mediaRef);
      return {
        height: mediaRef.value.$el.clientHeight + "px",
        width: mediaRef.value.$el.clientWidth + "px",
      };
    });

    const displayName = computed(() => conferenceStore.status.displayName);
    const participantId = computed(() => {
      if (videoStream.value && videoStream.value.isLocal()) {
        return conferenceStore.status.id;
      } else if (videoStream.value) {
        return videoStream.value.getParticipantId();
      } else if (audioStream.value) {
        return audioStream.value.getParticipantId();
      } else {
        return null;
      }
    });
    const micMuted = computed(() => {
      if (conferenceStore.mutedAudioTracks.includes(participantId.value)) {
        return true;
      } else {
        return false;
      }
    });

    const camMuted = computed(() => {
      if (conferenceStore.mutedVideoTracks.includes(participantId.value)) {
        return true;
      } else {
        return false;
      }
    });

    return {
      videoStream,
      audioStream,
      displayName,
      participantId,
      micMuted,
      camMuted,
      coverStyle,
      mediaRef,
    };
  },
});
</script>

<style scoped>
.participant-displayName {
  position: absolute;
  color: white;
  z-index: 2;
  left: 10px;
  top: 10px;
  backdrop-filter: blur(5px) brightness(1.5);
  -webkit-backdrop-filter: blur(5px) brightness(1.5);
  border-radius: 5px;
  z-index: 9;
}
.peer-container {
  position: relative;
}
.muted-icon {
  position: absolute;
  bottom: 10px;
  left: 5px;
}
.stack-top {
  position: absolute;
  z-index: 1;
}
</style>
