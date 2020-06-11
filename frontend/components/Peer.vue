<template>
  <div class="peer-container">
    <div class="participant-displayName">
      {{ displayName }} - {{ participantId }}
    </div>
    <media :video-stream="videoStream" :audio-stream="audioStream" />
    <div class="muted-icon">
      <v-icon v-if="micMuted" color="red">
        mdi-microphone-off
      </v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import consola from "consola";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "Peer",
  props: {
    mediaTracks: Object,
  },
  components: {
    Media: () => import("~/components/Media.vue"),
  },

  setup(props) {
    consola.log("Peer props", props);
    const videoStream = computed(() =>
      props.mediaTracks.value.video ? props.mediaTracks.value.video : null,
    );
    const audioStream = computed(() => {
      if (
        props.mediaTracks.value.audio &&
        props.mediaTracks.value.audio.isLocal()
      ) {
        return null;
      } else {
        return props.mediaTracks.value.audio
          ? props.mediaTracks.value.audio
          : null;
      }
    });

    const displayName = computed(() => conferenceStore.status.displayName);
    const participantId = computed(() => {
      if (videoStream.value && videoStream.value.isLocal()) {
        return conferenceStore.status.id;
      } else if (videoStream.value) {
        return videoStream.value.getParticipantId();
      } else if (audioStream.value) {
        return audioStream.value.getParticipantId();
      } else {
        return null;
      }
    });
    const micMuted = computed(() => {
      if (conferenceStore.mutedTracks.includes(participantId.value)) {
        return true;
      } else {
        return false;
      }
    });
    return {
      videoStream,
      audioStream,
      displayName,
      participantId,
      micMuted,
    };
  },
});
</script>

<style scoped>
.participant-displayName {
  position: absolute;
  font-size: small;
  color: white;
}
.peer-container {
  position: relative;
}
.muted-icon {
  position: absolute;
  bottom: 10px;
  left: 5px;
}
</style>
