<template>
  <v-row class="filmStripWrapper d-flex justify-center">
    <v-col
      v-for="(value, key) in filmstripMembers"
      :key="key"
      class="filmStrip"
    >
      <e-session-local-peer
        v-if="key === 'localStream'"
        class="peer"
        :media-tracks="value"
      />
      <e-session-remote-peer v-else class="peer" :media-tracks="value" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
// import consola from "consola";
import { defineComponent, computed, useContext } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionDominantSpeaker",
  head: {},
  components: {
    ESessionRemotePeer: () =>
      import("~/components/conference/ESessionRemotePeer.vue"),
    ESessionLocalPeer: () =>
      import("~/components/conference/ESessionLocalPeer.vue"),
  },
  setup() {
    const { app } = useContext();

    const participants: any = computed(() => {
      if (conferenceStore.status.isSpeaker) {
        return { ...app.$localTracks.value, ...app.$remoteTracks.value };
      } else {
        return app.$remoteTracks.value;
      }
    });

    const lastPresenterId =
      conferenceStore.presenterTracks[
        conferenceStore.presenterTracks.length - 1
      ];

    const filmstripMembers: any = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [lastPresenterId]: _, ...without } = participants.value;
      return without;
    });

    return {
      filmstripMembers,
    };
  },
});
</script>

<style scoped>
.filmStripWrapper {
  position: absolute;
  /* height: 150px; */
  /* display: flex; */
  bottom: 35px;
  left: 0px;
  height: 150px;
  width: 100%;
}
.filmStrip {
  max-width: 250px;
}
</style>
