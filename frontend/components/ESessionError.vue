<template>
  <v-container>
    <v-card class="mx-auto" max-width="600" outlined>
      <v-card-title>
        <h1>
          {{ errorMsg }}
        </h1>
      </v-card-title>
      <v-card-text>
        <span>
          {{ errorResolution }}
        </span>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" outlined @click.stop="reset">Reload</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, useContext } from "nuxt-composition-api";
import { conferenceStore, roomStore } from "~/store";

export default defineComponent({
  name: "ESessionError",

  setup() {
    const errorMsg = computed(() => conferenceStore.status.errorMsg);
    const errorResolution = computed(
      () => conferenceStore.status.errorResolution,
    );
    const { redirect } = useContext();

    function reset() {
      roomStore.clearRoom();
      conferenceStore.updateErrorFlag(false);
      redirect("/");
    }

    return { errorMsg, reset, errorResolution };
  },
});
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
