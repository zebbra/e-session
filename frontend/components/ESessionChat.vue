<template>
  <v-list dense class="py-0">
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
</template>
<script lang="ts">
import { defineComponent } from "nuxt-composition-api";
import { IRoom, IUser } from "~/types";

export default defineComponent({
  name: "ESessionChat",
  props: {
    room: Object as () => IRoom,
    user: Object as () => IUser,
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
