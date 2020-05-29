<template>
  <div>
    <v-row>
      <v-col>
        <media :video-stream="videoStream" :audio-stream="null" />
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
import { defineComponent, computed, ref, watch } from "nuxt-composition-api";
import { conferenceStatusStore } from "~/store";

export default defineComponent({
  name: "ESessionLocalMedia",
  components: {
    Media: () => import("~/components/Media.vue"),
  },

  setup(_, { root }) {
    const localTracks: any = computed(() => root.$localTracks);
    const videoStream = computed(
      () => localTracks.value.value.localStream.video,
    );
    const audioStream = computed(
      () => localTracks.value.value.localStream.audio,
    );
    const displayName = computed(
      () => conferenceStatusStore.status.displayName,
    );
    const initialDeviceSelection = computed(() => {
      return {
        camera: conferenceStatusStore.devices.cameraId,
        mic: conferenceStatusStore.devices.micId,
        output: conferenceStatusStore.devices.outputId,
      };
    });

    const cameraDevices = ref([]);
    const microphoneDevices = ref([]);
    const outputDevices = ref([]);

    let jitsi: any;

    if (process.browser) {
      jitsi = root.$jitsi;
      if (jitsi.mediaDevices.isDeviceChangeAvailable("output")) {
        jitsi.mediaDevices.enumerateDevices((devices) => {
          console.log(devices);
          outputDevices.value = devices.filter((d) => d.kind === "audiooutput");
          microphoneDevices.value = devices.filter(
            (d) => d.kind === "audioinput",
          );
          cameraDevices.value = devices.filter((d) => d.kind === "videoinput");
        });
      }
    }

    watch(
      () => conferenceStatusStore.setupVisible,
      (newVal) => {
        console.log("newVal: ", newVal);
        if (
          newVal === true &&
          (!localTracks.value.value.localStream.video ||
            !localTracks.value.value.localStream.audio)
        ) {
          console.log("making new tracks");
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
        const tracks = await jitsi.createLocalTracks({
          devices: ["audio", "video"],
        });
        onLocalTracks(tracks);
      } catch (err) {
        console.error("Exception:", err);
      }
    }

    async function changeCamera(id) {
      localTracks.value.value.localStream.video.dispose();
      root.$set(localTracks.value.value.localStream, "video", null);
      try {
        const tracks = await jitsi.createLocalTracks({
          devices: ["video"],
          cameraDeviceId: id,
        });
        onLocalTracks(tracks);
      } catch (err) {
        // console.error("Exception:", err);
      }

      if (conferenceStatusStore.status.isJoned) {
        const room = root.$room;
        room.addTrack(localTracks.value.value.localStream.video);
      }
    }

    function changeOutputDevice(id) {
      jitsi.mediaDevices.setAudioOutputDevice(id);
    }

    async function changeMicrophoneDevice(id) {
      localTracks.value.value.localStream.audio.dispose();
      root.$set(localTracks.value.value.localStream, "audio", null);
      // console.log(event);
      try {
        const tracks = await jitsi.createLocalTracks({
          devices: ["audio"],
          micDeviceId: id,
        });
        onLocalTracks(tracks);
      } catch (err) {
        // console.error("Exception:", err);
      }
      if (conferenceStatusStore.status.isJoned) {
        const room = root.$room;
        room.addTrack(localTracks.value.value.localStream.audio);
      }
    }

    function onLocalTracks(tracks) {
      // console.log("tracks: ", tracks);
      for (let i = 0; i < tracks.length; i++) {
        // console.log("track device id", tracks[i].getDeviceId());

        // this.localTracks[i].addEventListener( JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, audioLevel => console.log(`Audio Level local: ${audioLevel}`));
        tracks[i].addEventListener(jitsi.events.track.TRACK_MUTE_CHANGED, () =>
          console.log("local track muted"),
        );
        tracks[i].addEventListener(jitsi.events.track.LOCAL_TRACK_STOPPED, () =>
          console.log("local track stoped"),
        );
        /* tracks[i].addEventListener(
          jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
          (deviceId: String) =>
            console.log(`track audio output device was changed to ${deviceId}`),
        ); */
        const type = tracks[i].getType();
        // console.log(localTracks);
        if (type === "video") {
          conferenceStatusStore.updateCameraId(tracks[i].getDeviceId());
          root.$set(localTracks.value.value.localStream, "video", tracks[i]);
        }
        if (type === "audio") {
          conferenceStatusStore.updateOuputId(
            jitsi.mediaDevices.getAudioOutputDevice(),
          );
          conferenceStatusStore.updateMicId(tracks[i].getDeviceId());
          root.$set(localTracks.value.value.localStream, "audio", tracks[i]);
        }
      }
      console.log("onLocalTracks done");
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
