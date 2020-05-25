<template>
  <v-card class="text-center" height="580px">
    <v-card-text style="height: 480px;">
      <v-row>
        <v-col>
          <media :video-stream="videoStream" :audio-stream="audioStream" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="mb-4 blue--text">{{ displayName }}</div>
          <div id="audioOutputSelectWrapper">
            Audio Output
            <div id="audioOutputSelect">Audio Output select</div>
          </div>
          <div class="controllsWrapper mt-8">
            <v-btn class="controll" outlined @click="confirm">
              <v-icon class="mr-2">mdi-check</v-icon>OK
            </v-btn>
            <v-btn class="controll ml-2" outlined color="error" @click="cancel">
              <v-icon class="mr-2">mdi-cancel</v-icon>Cancel
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import { conferenceStatusStore } from "~/store";

export default defineComponent({
  name: "LocalMediaCheck",
  props: {
    localTracks: Object,
  },
  components: {
    Media: () => import("~/components/Media.vue"),
  },

  setup(props, { emit }) {
    const videoStream = computed(
      () => props.localTracks.localStream.value.video,
    );
    const audioStream = computed(
      () => props.localTracks.localStream.value.audio,
    );
    const displayName = computed(
      () => conferenceStatusStore.status.displayName,
    );

    function confirm() {
      emit("checkPassed", true);
    }

    function cancel() {
      emit("checkPassed", false);
    }

    return {
      videoStream,
      audioStream,
      confirm,
      cancel,
      displayName,
    };
  },
});
</script>

<style></style>
