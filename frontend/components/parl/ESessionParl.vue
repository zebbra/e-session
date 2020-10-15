<template>
  <v-container>
    <v-row justify="space-between" no-gutters>
      <v-col cols="6" md="4"><e-session-agenda class="mr-4" /></v-col>
      <v-col cols="12" sm="6" md="8">
        <e-session-parl-layout />
      </v-col>
    </v-row>
    <v-dialog v-model="settingsDialog" persistent max-width="600">
      <e-session-local-media-settings />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
// import consola from "consola";
import { defineComponent, computed } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionConference",
  head: {},
  components: {
    ESessionParlLayout: () =>
      import("~/components/parl/ESessionParlLayout.vue"),
    ESessionAgenda: () => import("~/components/parl/ESessionAgenda.vue"),
  },
  setup() {
    // const { app } = useContext();

    const settingsDialog = computed(
      () => conferenceStore.deviceSettingsVisible,
    );

    function showSettings() {
      conferenceStore.showDeviceSettings(true);
    }

    return {
      settingsDialog,
      showSettings,
    };
  },
});
</script>

<style scoped>
.localMedia {
  height: 150px;
}
.peer-wrapper {
  width: 100%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, 1fr);
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-auto-flow: column;
}
.peer {
  border-radius: 5px;
  width: 100%;
  overflow: hidden;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 5px;
  background-color: rgba(39, 39, 39, 0.5);
  backdrop-filter: blur(5px) contrast(0.8);
}
.grid-1 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-auto-flow: column;
  /* min-width: 100%; */
  /* width: auto; */
}
.grid-2 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-auto-flow: column;
}
.grid-3 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-auto-flow: column;
}
.grid-4 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, 1fr);
}
.grid-5 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-template-rows: repeat(2, 1fr);
  grid-auto-flow: column;
}
.grid-6 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-template-rows: repeat(2, 1fr);
  grid-auto-flow: column;
}
.my-container {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
}
.participantWrapper {
  padding: 3px;
}
</style>
