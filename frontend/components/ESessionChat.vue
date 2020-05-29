<template>
  <v-row dense no-gutters>
    <v-col v-if="room.messages.length">
      <v-card light tile flat>
        <v-list dense>
          <v-list-item v-for="(message, index) in room.messages" :key="index">
            <v-list-item-content
              :class="user.id === message.author.id ? 'text-right' : ''"
            >
              <v-list-item-title
                v-if="
                  index === 0 ||
                  room.messages[index - 1].author.id !== message.author.id
                "
                >{{ message.author.name }}</v-list-item-title
              >
              <v-list-item-subtitle class="wrap-text">{{
                message.text
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import { roomStore, sessionStore } from "../store";

export default defineComponent({
  name: "ESessionChat",
  setup() {
    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);

    return {
      room: roomRef,
      user: userRef,
    };
  },
});
</script>

<style>
.wrap-text {
  -webkit-line-clamp: unset !important;
  word-wrap: break-word;
  white-space: normal !important;
}
</style>
