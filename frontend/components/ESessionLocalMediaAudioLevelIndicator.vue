<template>
  <v-progress-linear :value="value" color="indigo darken-2"></v-progress-linear>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";

export default defineComponent({
  name: "ESessionLocalMediaAudioLevelIndicator",
  props: {
    audioLevel: Number,
  },
  setup(props) {
    const value = computed(() => props.audioLevel * 100);
    return {
      value,
    };
  },
});
</script>

<style></style>
