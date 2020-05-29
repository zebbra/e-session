<template>
  <v-list-item two-line>
    <v-list-item-content>
      <v-list-item-title>{{ user.name }}</v-list-item-title>
      <v-list-item-subtitle
        >{{ room.name }}
        {{ isModerator ? " - (Moderator)" : "" }}</v-list-item-subtitle
      >
    </v-list-item-content>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon @click.stop="leaveRoom">
          <v-icon v-on="on">mdi-exit-to-app</v-icon>
        </v-btn>
      </template>
      <span>Leave Room</span>
    </v-tooltip>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, computed, useContext } from "nuxt-composition-api";
import { useLeave } from "~/composable/useRoom";
import { roomStore, sessionStore } from "~/store";

export default defineComponent({
  name: "ESessionModerationDrawerHeader",
  setup() {
    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);
    const isModerator = computed(() => sessionStore.role === "moderator");

    const { redirect } = useContext();

    const { mutate: leave, onDone } = useLeave(userRef, roomRef);
    function leaveRoom() {
      onDone(() => {
        redirect("/");
      });
      leave();
    }

    return {
      room: roomRef,
      user: userRef,
      isModerator,
      leaveRoom,
    };
  },
});
</script>
