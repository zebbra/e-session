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
import { defineComponent, useMeta, ref } from "nuxt-composition-api";
import Vue from "vue";
import { initOptions, options } from "~/utils/jitsi";
import { conferenceStatusStore, globalStore } from "~/store";

export default defineComponent({
  name: "Index",
  head: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    const roomName = ref("ExampleRoomName");
    const attendeeName = ref("");
    useMeta({ title: "Jitsi Meeting" });

    let connection: any;
    let jitsi: any;

    function connect() {
      conferenceStatusStore.updateDisplayName(attendeeName.value);
      conferenceStatusStore.updateRoomName(roomName.value);

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
      }
    }

    function onConnectionSuccess() {
      console.log("onConnectionSuccess");
      Vue.prototype.$connection = connection;
      globalStore.showDeviceSettings(true);
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
