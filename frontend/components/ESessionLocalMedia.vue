<template>
  <div>
    <v-row>
      <v-col>
        <media :video-stream="videoStream" :audio-stream="null" />
        <local-audio-indicator :audio-level="audioLevel" />
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
import {
  defineComponent,
  computed,
  ref,
  watch,
  useContext,
} from "nuxt-composition-api";
import consola from "consola";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionLocalMedia",
  components: {
    Media: () => import("~/components/Media.vue"),
    LocalAudioIndicator: () =>
      import("~/components/ESessionLocalMediaAudioLevelIndicator.vue"),
  },

  setup(_, { root }) {
    const { app } = useContext();
    const localTracks: any = computed(() => app.$localTracks);
    const audioLevel: any = ref(0);
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

    const cameraDevices = ref([]);
    const microphoneDevices = ref([]);
    const outputDevices = ref([]);

    if (process.browser) {
      if (app.$jitsi.mediaDevices.isDeviceChangeAvailable("output")) {
        app.$jitsi.mediaDevices.enumerateDevices((devices) => {
          consola.log(devices);
          outputDevices.value = devices.filter((d) => d.kind === "audiooutput");
          microphoneDevices.value = devices.filter(
            (d) => d.kind === "audioinput",
          );
          cameraDevices.value = devices.filter((d) => d.kind === "videoinput");
        });
      }
    }

    watch(
      () => conferenceStore.setupVisible,
      (newVal) => {
        consola.log("newVal: ", newVal);
        if (
          newVal === true &&
          (!localTracks.value.value.localStream.video ||
            !localTracks.value.value.localStream.audio)
        ) {
          consola.log("making new tracks");
          createLocalTracks();
        }
      },
      // watch Options
      {
        lazy: false, // immediate: true
      },
    );

    async function createLocalTracks() {
      try {
        const tracks = await app.$jitsi.createLocalTracks({
          devices: ["audio", "video"],
        });
        onLocalTracks(tracks);
      } catch (err) {
        consola.error("Exception:", err);
      }
    }

    async function changeCamera(id) {
      localTracks.value.value.localStream.video.dispose();
      root.$set(localTracks.value.value.localStream, "video", null);
      try {
        const tracks = await app.$jitsi.createLocalTracks({
          devices: ["video"],
          cameraDeviceId: id,
        });
        onLocalTracks(tracks);
      } catch (err) {
        // consola.error("Exception:", err);
      }

      if (conferenceStore.status.isJoned) {
        app.$room.addTrack(localTracks.value.value.localStream.video);
      }
    }

    function changeOutputDevice(id) {
      app.$jitsi.mediaDevices.setAudioOutputDevice(id);
    }

    async function changeMicrophoneDevice(id) {
      localTracks.value.value.localStream.audio.dispose();
      root.$set(localTracks.value.value.localStream, "audio", null);
      // consola.log(event);
      try {
        const tracks = await app.$jitsi.createLocalTracks({
          devices: ["audio"],
          micDeviceId: id,
        });
        onLocalTracks(tracks);
      } catch (err) {
        // consola.error("Exception:", err);
      }
      if (conferenceStore.status.isJoned) {
        app.$room.addTrack(localTracks.value.value.localStream.audio);
      }
    }

    function onLocalTracks(tracks) {
      // consola.log("tracks: ", tracks);
      for (let i = 0; i < tracks.length; i++) {
        // consola.log("track device id", tracks[i].getDeviceId());
        tracks[i].addEventListener(
          app.$jitsi.events.track.TRACK_MUTE_CHANGED,
          () => consola.log("local track muted"),
        );
        tracks[i].addEventListener(
          app.$jitsi.events.track.LOCAL_TRACK_STOPPED,
          () => consola.log("local track stoped"),
        );
        tracks[i].addEventListener(
          app.$jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
          (deviceId: String) =>
            consola.log(`track audio output device was changed to ${deviceId}`),
        );
        const type = tracks[i].getType();
        // consola.log(localTracks);
        if (type === "video") {
          conferenceStore.updateCameraId(tracks[i].getDeviceId());
          root.$set(localTracks.value.value.localStream, "video", tracks[i]);
        }
        if (type === "audio") {
          tracks[i].addEventListener(
            app.$jitsi.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            (level: any) => _onLocalAudioLevelChange(level),
          );
          conferenceStore.updateOuputId(
            app.$jitsi.mediaDevices.getAudioOutputDevice(),
          );
          conferenceStore.updateMicId(tracks[i].getDeviceId());
          root.$set(localTracks.value.value.localStream, "audio", tracks[i]);
        }
      }
      consola.log("onLocalTracks done");

      function _onLocalAudioLevelChange(level) {
        consola.log("_onLocalAudioLevelChange", level);
        audioLevel.value = level;
      }
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
      audioLevel,
    };
  },
});
</script>

<style></style>
