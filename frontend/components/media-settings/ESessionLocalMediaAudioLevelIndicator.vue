<template>
  <v-progress-linear :value="value" color="indigo darken-2"></v-progress-linear>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionLocalMediaAudioLevelIndicator",
  setup() {
    const value = computed(() => conferenceStore.status.localAudioLevel * 100);
    return {
      value,
    };
  },
});
</script>

<style></style>
