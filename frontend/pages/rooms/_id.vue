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
import { roomStore } from "~/store";

export default defineComponent({
  name: "Room",
  head: {},
  setup() {
    const roomRef = computed(() => roomStore.room);
    useMeta({ title: roomRef.value.name });

    return {
      room: roomRef,
    };
  },
});
</script>
