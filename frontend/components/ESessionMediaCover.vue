<template>
  <div style="height: inherit;">
    <div
      style="height: inherit; height: 100%; width: 100%; border-radius: 5px;"
    >
      <div class="name-container">
        <v-icon x-large color="red">
          mdi-video-off
        </v-icon>
      </div>
      <img :src="giphySrc" style="width: 120%; filter: blur(8px);" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
} from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESSessionMediaCover",
  setup() {
    onMounted(() => {
      fetchGiphy();
    });

    const giphySrc = ref();
    const displayName = computed(() => conferenceStore.status.displayName);

    async function fetchGiphy() {
      const giphy = await fetch(
        "https://api.giphy.com/v1/gifs/random?api_key=E9LxdOaJBxOhcllZL7IXpiJ9kOktXDcm&tag=colors&rating=PG-13",
      ).then((res) => res.json());
      giphySrc.value = giphy.data.images.original.url;
    }

    return { giphySrc, displayName };
  },
});
</script>

<style scoped>
.name-container {
  background-color: #272727;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  border: white;
  border-radius: 81px;
  padding: 40px;
}
</style>
