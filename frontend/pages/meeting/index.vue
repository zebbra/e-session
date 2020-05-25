<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="info--text">{{ roomName }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              v-model="roomName"
              label="Room Name"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="attendeeName"
              label="Your Name"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn @click="connect">Join</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="localMediaCheckDialog" persistent max-width="600">
      <local-media-check
        :local-tracks="localTracks"
        @checkPassed="checkPassed"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useMeta, ref, computed } from "nuxt-composition-api";
import Vue from "vue";
import { initOptions, options } from "~/utils/jitsi";
import { conferenceStatusStore } from "~/store";

export default defineComponent({
  name: "Index",
  head: {},
  components: {
    LocalMediaCheck: () => import("~/components/LocalMediaCheck.vue"),
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    const localMediaCheckDialog = ref(false);
    const roomName = ref("ExampleRoomName");
    const attendeeName = ref("");
    const roomUrl = computed(() => "/meeting/room/" + roomName.value);
    const localTracks = ref({});
    useMeta({ title: "Jitsi Meeting" });

    let connection: any;
    let jitsi: any;

    async function connect() {
      conferenceStatusStore.updateDisplayName(attendeeName.value);
      if (process.browser) {
        // console.log("jitsi connect", context);
        jitsi = context.root.$jitsi;
        jitsi.setLogLevel(jitsi.logLevels.WARN);
        jitsi.init(initOptions);

        connection = new jitsi.JitsiConnection(null, null, options);
        connection.addEventListener(
          jitsi.events.connection.CONNECTION_ESTABLISHED,
          () => onConnectionSuccess(),
        );
        connection.addEventListener(
          jitsi.events.connection.CONNECTION_FAILED,
          () => onConnectionFailed(),
        );
        connection.addEventListener(
          jitsi.events.connection.CONNECTION_DISCONNECTED,
          () => onDisconnect(),
        );

        connection.connect();

        try {
          const tracks = await jitsi.createLocalTracks({
            devices: ["audio", "video"],
          });
          context.root.$set(localTracks.value, "localStream", ref({}));
          onLocalTracks(tracks);
        } catch (err) {
          // console.error("Exception:", err);
        }
        // console.log("setup done");
      }
    }

    function onConnectionSuccess() {
      // console.log("onConnectionSuccess");
      Vue.prototype.$connection = connection;
    }

    function onConnectionFailed() {}

    function onDisconnect() {}

    function onLocalTracks(tracks) {
      // console.log("tracks: ", tracks);
      for (let i = 0; i < tracks.length; i++) {
        // this.localTracks[i].addEventListener( JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, audioLevel => console.log(`Audio Level local: ${audioLevel}`));
        tracks[i].addEventListener(jitsi.events.track.TRACK_MUTE_CHANGED, () =>
          console.log("local track muted"),
        );
        tracks[i].addEventListener(jitsi.events.track.LOCAL_TRACK_STOPPED, () =>
          console.log("local track stoped"),
        );
        tracks[i].addEventListener(
          jitsi.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
          (deviceId: String) =>
            console.log(`track audio output device was changed to ${deviceId}`),
        );
        const type = tracks[i].getType();
        console.log(localTracks);
        if (type === "video") {
          context.root.$set(
            localTracks.value.localStream.value,
            "video",
            tracks[i],
          );
        }
        if (type === "audio") {
          tracks[i].mute(); // mute local track
          context.root.$set(
            localTracks.value.localStream.value,
            "audio",
            tracks[i],
          );
        }
      }
      console.log("onLocalTracks dopne");
      Vue.prototype.$localTracks = localTracks;
      localMediaCheckDialog.value = true;
    }

    function checkPassed(event: Boolean) {
      if (event) {
        context.root.$options.router.push({ path: roomUrl.value });
      } else {
        localMediaCheckDialog.value = false;
      }
    }

    return {
      roomName,
      attendeeName,
      roomUrl,
      localTracks,
      localMediaCheckDialog,
      connect,
      checkPassed,
    };
  },
});
</script>
