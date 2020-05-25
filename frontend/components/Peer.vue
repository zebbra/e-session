<template>
  <div style="height: inherit;">
    <div style="height: inherit;">
      <div style="height: inherit;">
        <div class="participant-displayName">{{ displayName }}</div>
        <media
          style="height: inherit;"
          :video-stream="videoStream"
          :audio-stream="audioStream"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";

export default defineComponent({
  name: "Peer",
  props: {
    mediaTracks: Object,
    displayName: String,
  },
  components: {
    Media: () => import("~/components/Media.vue"),
  },

  setup(props) {
    console.log("Peer props", props);
    const videoStream = computed(() =>
      props.mediaTracks.value.video ? props.mediaTracks.value.video : null,
    );
    const audioStream = computed(() =>
      props.mediaTracks.value.audio ? props.mediaTracks.value.audio : null,
    );
    return {
      videoStream,
      audioStream,
      // displayName
    };
  },
});
</script>

<style>
.participant-displayName {
  position: absolute;
  font-size: small;
  color: black;
}
</style>
