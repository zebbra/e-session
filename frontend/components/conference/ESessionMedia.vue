<template>
  <div class="d-flex">
    <video v-if="videoStream" ref="videoRef" class="video-insert" autoplay />
    <audio v-if="audioStream" ref="audioRef" autoplay />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "nuxt-composition-api";

export default defineComponent({
  name: "ESessionMedia",
  props: {
    videoStream: Object || null,
    audioStream: Object || null,
  },
  setup(props, context) {
    const videoRef = ref(null);
    const audioRef = ref(null);

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

    return { videoRef, audioRef };
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
</style>
