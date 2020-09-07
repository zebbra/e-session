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
    <div v-if="dominantSpeakerView">
      <e-session-dominant-speaker />
    </div>
    <div v-else :class="peerWrapperClassName">
      <div
        v-for="(value, key) in participants"
        :key="key"
        class="participantWrapper"
      >
        <e-session-local-peer
          v-if="key === 'localStream'"
          class="peer"
          :media-tracks="value"
        />
        <e-session-remote-peer v-else class="peer" :media-tracks="value" />
      </div>
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
    ESessionRemotePeer: () =>
      import("~/components/conference/ESessionRemotePeer.vue"),
    ESessionLocalPeer: () =>
      import("~/components/conference/ESessionLocalPeer.vue"),
    ESessionDominantSpeaker: () =>
      import("~/components/conference/layouts/ESessionDominantSpeaker.vue"),
  },
  setup() {
    const { app } = useContext();
    const dominantSpeakerView = computed(() => {
      if (conferenceStore.presenterTracks.length > 0) {
        consola.log("dominantSpeakerView on");
        return true;
      } else {
        consola.log("dominantSpeakerView off");
        return false;
      }
    });
    const settingsDialog = computed(
      () => conferenceStore.deviceSettingsVisible,
    );

    const participants: any = computed(() => {
      if (conferenceStore.status.isSpeaker) {
        return { ...app.$localTracks.value, ...app.$remoteTracks.value };
      } else {
        return app.$remoteTracks.value;
      }
    });

    const peerWrapperClassName = computed(() => {
      consola.log("peerWrapperClassName: ", app.$remoteTracks);
      const numOfPeers =
        Object.keys(app.$remoteTracks.value).length +
        Object.keys(app.$localTracks.value).length;
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
      participants,
      peerWrapperClassName,
      settingsDialog,
      showSettings,
      endCall,
      dominantSpeakerView,
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
