<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <span>{{ room && room.name }}</span>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useMeta, computed } from "nuxt-composition-api";
import {
  useSignal,
  useOnJoined,
  useOnLeft,
  useJoin,
} from "~/composable/useRoom";
import { roomStore, sessionStore } from "~/store";

export default defineComponent({
  name: "Room",
  head: {},
  setup() {
    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);
    useMeta({ title: roomRef.value.name });

    useSignal(userRef, roomRef);
    useOnJoined(userRef, roomRef);
    useOnLeft(userRef, roomRef);

    const { mutate: join } = useJoin(userRef, roomRef);
    join();

    return {
      room: roomRef,
    };
  },
});
</script>
