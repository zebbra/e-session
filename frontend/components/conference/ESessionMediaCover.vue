<template @mouseover="mouseover" @mouseleave="mouseleave">
  <div
    class="d-flex justify-center align-center cover-wrapper"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
  >
    <div class="icon-container">
      <v-icon x-large color="red">
        mdi-video-off
      </v-icon>
    </div>
    <img :src="giphySrc" class="gif-insert" />
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
    const giphyStill = ref();
    const giphyOriginal = ref();

    const displayName = computed(() => conferenceStore.status.displayName);

    async function fetchGiphy() {
      const giphy = await fetch(
        "https://api.giphy.com/v1/gifs/random?api_key=E9LxdOaJBxOhcllZL7IXpiJ9kOktXDcm&tag=space&rating=PG-13",
      ).then((res) => res.json());
      giphyStill.value = giphy.data.images.original_still.url;
      giphyOriginal.value = giphy.data.images.original.url;
      giphySrc.value = giphyStill.value;
    }

    function mouseover() {
      giphySrc.value = giphyOriginal.value;
    }

    function mouseleave() {
      giphySrc.value = giphyStill.value;
    }
    return { giphySrc, displayName, mouseleave, mouseover };
  },
});
</script>

<style scoped>
.cover-wrapper {
  background-color: rgba(39, 39, 39, 0.5);
  backdrop-filter: blur(5px) contrast(0.8);
  height: 100%;
  width: 100%;
}
.gif-insert {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-color: rgba(39, 39, 39, 0.5);
}
.icon-container {
  /* backdrop-filter: blur(5px) contrast(0.8); */
  position: absolute;
  z-index: 1;
  /* border: white; */
  border-radius: 81px;
  padding: 40px;
  background-color: rgba(39, 39, 39, 0.7);

  /* opacity: 0.7; */
  /* border: solid; */
  /* border-color: gray; */
  /* border-width: 1px; */
}
</style>
