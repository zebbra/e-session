<template>
  <v-snackbar
    top
    :value="message"
    :timeout="timeout"
    :color="color"
    @input="onInputChanged"
  >
    {{ message }}
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import { globalStore } from "~/store";

export default defineComponent({
  name: "ESessionSnackbar",
  setup() {
    const errorMessage = computed(() => globalStore.errorMessage);

    function onInputChanged(visible) {
      if (!visible) {
        globalStore.clearErrorMessage();
      }
    }

    return {
      message: errorMessage,
      color: "error",
      timeout: 5000,
      onInputChanged,
    };
  },
});
</script>
