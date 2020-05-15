<template>
  <v-card>
    <v-card-title>
      <span class="info--text">{{ roomName }}</span>
    </v-card-title>
    <v-card-text>
      {{ userId }}
      <!-- @Marke your code goes here -->
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, useMeta, ref } from "nuxt-composition-api";

export default defineComponent({
  name: "Room",
  head: {},
  setup() {
    const roomName = ref("Example Room");
    const userId = ref(1);
    useMeta({ title: roomName.value });

    return {
      roomName,
      userId,
    };
  },
});
</script>
