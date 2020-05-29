<template>
  <v-card class="text-center">
    <v-card-text>
      <e-session-local-media />
      <v-row class="justify-center">
        <div>
          <v-btn outlined @click="confirm">
            <v-icon class="mr-2">mdi-check</v-icon>OK
          </v-btn>
        </div>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionLocalMediaSetup",
  components: {
    ESessionLocalMedia: () => import("~/components/ESessionLocalMedia.vue"),
  },

  setup() {
    function confirm() {
      conferenceStore.showSetup(false);
    }
    return {
      confirm,
    };
  },
});
</script>

<style></style>
