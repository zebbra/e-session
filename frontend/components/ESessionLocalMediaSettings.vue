<template>
  <v-card class="text-center">
    <v-card-title>
      <v-btn class="ma-2" outlined fab small @click="hideSettings">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <e-session-local-media />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";
import { conferenceStatusStore } from "~/store";

export default defineComponent({
  name: "ESessionLocalMediaSettings",
  components: {
    ESessionLocalMedia: () => import("~/components/ESessionLocalMedia.vue"),
  },

  setup() {
    function hideSettings() {
      conferenceStatusStore.showDeviceSettings(false);
    }

    return {
      hideSettings,
    };
  },
});
</script>

<style></style>
