<template>
  <div class="d-flex">
    <video
      v-if="videoStream"
      :id="id"
      ref="videoRef"
      class="video-insert"
      autoplay
      @dblclick="fullscreenEvent"
    />
    <audio v-if="audioStream" ref="audioRef" autoplay />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  watch,
  ref,
  computed,
} from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionMedia",
  props: {
    videoStream: Object || null,
    audioStream: Object || null,
  },
  setup(props, context) {
    const videoRef = ref(null);
    const audioRef = ref(null);
    const id = computed(() => conferenceStore.status.id);

    async function doConnectVideoStream(stream: any) {
      if (stream) {
        await context.root.$nextTick();
        stream.attach(videoRef.value);
      }
    }

    async function doConnectAudioStream(stream: any) {
      if (stream) {
        await context.root.$nextTick();
        stream.attach(audioRef.value);
      }
    }

    onMounted(() => {
      doConnectVideoStream(props.videoStream);
      doConnectAudioStream(props.audioStream);
    });

    function fullscreenEvent(event: any) {
      if (event.target.requestFullscreen) {
        event.target.requestFullscreen();
      }
    }
    watch(
      // getter
      () => props.videoStream,
      // callback
      (newVal) => {
        doConnectVideoStream(newVal);
      },
      // watch Options
      {
        lazy: false, // immediate: true
      },
    );

    watch(
      // getter
      () => props.audioStream,
      // callback
      (newVal) => {
        doConnectAudioStream(newVal);
      },
      // watch Options
      {
        lazy: false, // immediate: true
      },
    );
    return { videoRef, audioRef, fullscreenEvent, id };
  },
});
</script>

<style>
.participant-id {
  position: absolute;
  font-size: small;
}
.video-insert {
  height: 100%;
  width: 100%;
  background-size: cover;
}
video::-webkit-media-controls {
  display: none !important;
}
</style>
