<template>
  <!-- <v-row>
    <v-col>
        <span class="info--text">{{ roomName }}</span>
    </v-col>
    <v-col class="localMedia">
      <peer :mediaTracks="localTracks.value.localStream" :displayName="displayName" />
    </v-col>
  </v-row> -->
  <div>
    <!-- <v-row class="d-flex justify-center align-center mt-2">
      <v-btn class="ma-2" outlined fab small disabled>
        <v-icon small>mdi-hand-right</v-icon>
      </v-btn>
      <v-btn class="ma-2" outlined fab small color="error" @click="endCall">
        <v-icon small>mdi-phone-hangup</v-icon>
      </v-btn>
      <v-btn class="ma-2" outlined fab small disabled>
        <v-icon small>mdi-monitor</v-icon>
      </v-btn>
      <v-btn class="ma-2" outlined fab small @click="showSettings">
        <v-icon small>mdi-cog</v-icon>
      </v-btn>
    </v-row> -->
    <div class="my-container">
      <v-row class="d-flex justify-center align-center ma-2">
        <div :class="peerWrapperClassName">
          <peer
            v-for="(value, key) in remoteTracks"
            :key="key"
            class="peer"
            :media-tracks="value"
          />
        </div>
      </v-row>
    </div>
    <v-dialog v-model="settingsDialog" persistent max-width="600">
      <e-session-local-media-settings />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import consola from "consola";
import { defineComponent, computed, useContext } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionConference",
  head: {},
  components: {
    Peer: () => import("~/components/Peer.vue"),
    ESessionLocalMediaSettings: () =>
      import("~/components/ESessionLocalMediaSettings.vue"),
  },
  setup() {
    const { app } = useContext();
    const settingsDialog = computed(
      () => conferenceStore.deviceSettingsVisible,
    );
    const localTracks: any = computed(() => app.$localTracks);
    const remoteTracks = app.$remoteTracks;

    const peerWrapperClassName = computed(() => {
      consola.log("peerWrapperClassName: ", app.$remoteTracks);
      const numOfPeers = Object.keys(app.$remoteTracks.value).length;
      // console.log("remoteTracks lenght: ", Object.keys(remoteTracks.value).length)
      if (numOfPeers > 0) {
        return "grid-" + numOfPeers;
      } else if (numOfPeers > 6) {
        return "grid-6";
      } else {
        return "grid-1";
      }
    });

    function showSettings() {
      conferenceStore.showDeviceSettings(true);
    }

    function endCall() {}

    return {
      remoteTracks,
      localTracks,
      peerWrapperClassName,
      settingsDialog,
      showSettings,
      endCall,
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
  justify-self: stretch;
  overflow: hidden;
  min-width: 0;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 5px;
}
.grid-1 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-auto-flow: column;
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
  grid-auto-flow: column;
}
.grid-5 {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-template-rows: repeat(3, 1fr);
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
  height: 100%;
  align-items: center;
  display: flex;
}
</style>
