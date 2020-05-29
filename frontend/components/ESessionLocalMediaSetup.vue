<template>
  <v-card class="text-center">
    <v-card-text>
      <e-session-local-media />
      <v-row>
        <div class="controllsWrapper mt-8">
          <v-btn class="controll" outlined @click="confirm">
            <v-icon class="mr-2">mdi-check</v-icon>OK
          </v-btn>
          <v-btn class="controll ml-2" outlined color="error" @click="cancel">
            <v-icon class="mr-2">mdi-cancel</v-icon>Cancel
          </v-btn>
        </div>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import { conferenceStatusStore } from "~/store";

export default defineComponent({
  name: "ESessionLocalMediaSetup",
  components: {
    ESessionLocalMedia: () => import("~/components/ESessionLocalMedia.vue"),
  },

  setup(_, { root }) {
    const roomUrl = computed(
      () => "/meeting/room/" + conferenceStatusStore.status.roomName,
    );

    function confirm() {
      conferenceStatusStore.showSetup(false);
      root.$options.router.push({ path: roomUrl.value });
    }

    function cancel() {
      conferenceStatusStore.showSetup(false);
    }

    return {
      confirm,
      cancel,
    };
  },
});
</script>

<style></style>
