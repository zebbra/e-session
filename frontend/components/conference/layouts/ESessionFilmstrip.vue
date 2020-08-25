<template>
  <div>
    <div v-for="(value, key) in participants" :key="key" class="filmStrip">
      <e-session-local-peer
        v-if="lastPresenterId === 'localStream'"
        class="peer"
        :media-tracks="value"
      />
      <e-session-remote-peer v-else class="peer" :media-tracks="value" />
    </div>
  </div>
</template>

<script lang="ts">
import consola from "consola";
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

    const dominantMediaTracks: any = computed(() => {
      consola.log("lastPresenterId", lastPresenterId);
      consola.log(
        "participants[lastPresenterId];",
        participants.value[lastPresenterId],
      );
      return participants.value[lastPresenterId];
    });

    return {
      participants,
      dominantMediaTracks,
      lastPresenterId,
    };
  },
});
</script>

<style scoped>
.filmStrip {
  height: 150px;
}
</style>
