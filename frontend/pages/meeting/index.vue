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
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useMeta,
  ref,
  useContext,
} from "nuxt-composition-api";
import Vue from "vue";
import consola from "consola";
import { initOptions, options } from "~/utils/jitsi";
import { conferenceStatusStore } from "~/store";

export default defineComponent({
  name: "Index",
  head: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    const localTracks = ref({ localStream: ref({ video: null, audio: null }) });
    const roomName = ref("ExampleRoomName");
    const attendeeName = ref("");
    useMeta({ title: "Jitsi Meeting" });
    const { app } = useContext();

    let connection: any;

    function connect() {
      conferenceStatusStore.updateDisplayName(attendeeName.value);
      conferenceStatusStore.updateRoomName(roomName.value);

      if (process.browser) {
        app.$jitsi.setLogLevel(app.$jitsi.logLevels.WARN);
        app.$jitsi.init(initOptions);

        connection = new app.$jitsi.JitsiConnection(null, null, options);
        connection.addEventListener(
          app.$jitsi.events.connection.CONNECTION_ESTABLISHED,
          () => onConnectionSuccess(),
        );
        connection.addEventListener(
          app.$jitsi.events.connection.CONNECTION_FAILED,
          () => onConnectionFailed(),
        );
        connection.addEventListener(
          app.$jitsi.events.connection.CONNECTION_DISCONNECTED,
          () => onDisconnect(),
        );
        connection.connect();
      }
    }

    function onConnectionSuccess() {
      consola.log("onConnectionSuccess");
      Vue.prototype.$localTracks = localTracks;
      Vue.prototype.$connection = connection;
      conferenceStatusStore.showSetup(true);
    }

    function onConnectionFailed() {}

    function onDisconnect() {}

    return {
      roomName,
      attendeeName,
      connect,
    };
  },
});
</script>
