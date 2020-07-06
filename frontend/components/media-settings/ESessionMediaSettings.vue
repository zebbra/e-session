<template>
  <div>
    <v-row>
      <v-col>
        <e-session-media :video-stream="videoStream" :audio-stream="null" />
        <local-audio-indicator />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="mb-4 blue--text">{{ displayName }}</div>
        <v-select
          v-model="initialDeviceSelection.camera"
          :items="cameraDevices"
          label="Camera"
          dense
          item-text="label"
          item-value="deviceId"
          prepend-icon="mdi-camera"
          @change="changeCamera"
        ></v-select>
        <v-select
          v-model="initialDeviceSelection.mic"
          :items="microphoneDevices"
          label="Microphone"
          dense
          item-text="label"
          item-value="deviceId"
          prepend-icon="mdi-microphone"
          @change="changeMicrophoneDevice"
        ></v-select>
        <v-select
          v-model="initialDeviceSelection.output"
          :items="outputDevices"
          label="Audio Output"
          dense
          item-text="label"
          item-value="deviceId"
          prepend-icon="mdi-speaker"
          @change="changeOutputDevice"
        ></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, useContext } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionLocalMedia",
  components: {
    ESessionMedia: () => import("~/components/conference/ESessionMedia.vue"),
    LocalAudioIndicator: () =>
      import(
        "~/components/media-settings/ESessionLocalMediaAudioLevelIndicator.vue"
      ),
  },

  setup() {
    const { app } = useContext();
    const localTracks: any = computed(() => app.$localTracks);
    const videoStream = computed(
      () => localTracks.value.value.localStream.video,
    );
    const audioStream = computed(
      () => localTracks.value.value.localStream.audio,
    );
    const displayName = computed(() => conferenceStore.status.displayName);
    const initialDeviceSelection = computed(() => {
      return {
        camera: conferenceStore.devices.cameraId,
        mic: conferenceStore.devices.micId,
        output: conferenceStore.devices.outputId,
      };
    });

    const cameraDevices = computed(() => conferenceStore.devices.cameraDevices);
    const microphoneDevices = computed(
      () => conferenceStore.devices.microphoneDevices,
    );
    const outputDevices = computed(() => conferenceStore.devices.outputDevices);

    function changeCamera(id) {
      app.$disposeAndRecreateVideoTrack(id);
    }

    function changeOutputDevice(id) {
      app.$jitsi.mediaDevices.setAudioOutputDevice(id);
    }

    function changeMicrophoneDevice(id) {
      app.$disposeAndRecreateAudioTrack(id);
    }

    return {
      videoStream,
      audioStream,
      displayName,
      cameraDevices,
      microphoneDevices,
      outputDevices,
      changeCamera,
      changeOutputDevice,
      changeMicrophoneDevice,
      initialDeviceSelection,
    };
  },
});
</script>

<style></style>
