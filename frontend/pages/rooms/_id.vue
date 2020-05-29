<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <span>{{ room && room.name }}</span>
      </v-card-title>
    </v-card>
    <e-session-conference />
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useMeta,
  computed,
  useContext,
} from "nuxt-composition-api";
import {
  useSignal,
  useOnJoined,
  useOnLeft,
  useJoin,
} from "~/composable/useRoom";
import { roomStore, sessionStore, conferenceStore } from "~/store";
import { initOptions, options } from "~/utils/jitsi";

export default defineComponent({
  name: "Room",
  head: {},
  components: {
    ESessionConference: () => import("~/components/ESessionConference.vue"),
  },
  setup() {
    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);
    useMeta({ title: roomRef.value.name });
    const { app } = useContext();

    useSignal(userRef, roomRef);
    useOnJoined(roomRef);
    useOnLeft(roomRef);

    const { mutate: join } = useJoin(userRef, roomRef);
    join();

    conferenceStore.updateDisplayName(userRef.value.name);
    conferenceStore.updateRoomName(roomRef.value.name);

    if (process.browser) {
      app.$jitsi.setLogLevel(app.$jitsi.logLevels.WARN);
      app.$jitsi.init(initOptions);

      app.$connection = new app.$jitsi.JitsiConnection(null, null, options);
      app.$connection.addEventListener(
        app.$jitsi.events.connection.CONNECTION_ESTABLISHED,
        () => app.$onConnectionSuccess(),
      );
      app.$connection.addEventListener(
        app.$jitsi.events.connection.CONNECTION_FAILED,
        () => app.$onConnectionFailed(),
      );
      app.$connection.addEventListener(
        app.$jitsi.events.connection.CONNECTION_DISCONNECTED,
        () => app.$onDisconnect(),
      );
      app.$connection.connect();
    }
    return {
      room: roomRef,
    };
  },
});
</script>
