<template>
  <v-card class="text-center">
    <v-card-text>
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
import Vue from "vue";
import { defineComponent, computed, ref } from "nuxt-composition-api";
import { conferenceStatusStore, globalStore } from "~/store";

export default defineComponent({
  name: "LocalMediaCheck",
  components: {
    Media: () => import("~/components/Media.vue"),
  },

  setup(props, { root }) {
    const localTracks = ref({ localStream: ref({ video: null, audio: null }) });

    const videoStream = computed(() => localTracks.value.localStream.video);
    const audioStream = computed(() => localTracks.value.localStream.audio);
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
      getLocalTracks();
    }

    function confirm() {
      globalStore.showDeviceSettings(false);
      // root.$options.router.push({ path: roomUrl.value });
    }

    function cancel() {
      // Vue.prototype.$localTracks = null;
      // localTracks.value.localStream.video.dispose();
      // localTracks.value.localStream.audio.dispose();
      // root.$delete(localTracks, "localStream");
      // root.$connection.disconnect();
      // globalStore.showDeviceSettings(false);
    }

    async function getLocalTracks() {
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
      props.localTracks.localStream.value.video.dispose();
      props.localTracks.localStream.value.audio.dispose();
      try {
        const tracks = await jitsi.createLocalTracks({
          devices: ["audio", "video"],
          micDeviceId: id,
        });
        onLocalTracks(tracks);
      } catch (err) {
        // console.error("Exception:", err);
      }
    }

    function changeOutputDevice(id) {
      jitsi.mediaDevices.setAudioOutputDevice(id);
    }

    async function changeMicrophoneDevice(id) {
      props.localTracks.localStream.value.video.dispose();
      props.localTracks.localStream.value.audio.dispose();
      // console.log(event);
      try {
        const tracks = await jitsi.createLocalTracks({
          devices: ["audio", "video"],
          micDeviceId: id,
        });
        onLocalTracks(tracks);
      } catch (err) {
        // console.error("Exception:", err);
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
          root.$set(localTracks.value.localStream, "video", tracks[i]);
        }
        if (type === "audio") {
          conferenceStatusStore.updateOuputId(
            jitsi.mediaDevices.getAudioOutputDevice(),
          );
          conferenceStatusStore.updateMicId(tracks[i].getDeviceId());
          root.$set(localTracks.value.localStream, "audio", tracks[i]);
        }
      }
      console.log("onLocalTracks done");
      Vue.prototype.$localTracks = localTracks;
    }

    return {
      videoStream,
      audioStream,
      confirm,
      cancel,
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
