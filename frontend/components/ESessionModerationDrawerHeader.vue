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
        <v-btn icon @click.stop="moveHand">
          <v-icon :color="user.handRaised ? 'secondary' : 'grey'" v-on="on">
            mdi-hand-left
          </v-icon>
        </v-btn>
      </template>
      <span>{{ user.handRaised ? "Lower Hand" : "Raise Hand" }}</span>
    </v-tooltip>
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
import {
  useLeave,
  useRaiseHand,
  useLowerHand,
  useOnHandMoved,
} from "~/composable/useRoom";
import { roomStore, sessionStore } from "~/store";

export default defineComponent({
  name: "ESessionModerationDrawerHeader",
  setup() {
    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);
    const isModerator = computed(() => sessionStore.isModerator);

    const { redirect } = useContext();

    const { mutate: leave, onDone } = useLeave(userRef, roomRef);
    function leaveRoom() {
      onDone(() => {
        roomStore.setUsersFilter("");
        redirect("/");
      });
      leave();
    }

    const { mutate: raiseHand } = useRaiseHand(userRef, roomRef);
    const { mutate: lowerHand } = useLowerHand(userRef, roomRef);
    useOnHandMoved(roomRef);
    function moveHand() {
      if (userRef.value.handRaised) {
        lowerHand();
      } else {
        raiseHand();
      }
    }

    return {
      room: roomRef,
      user: userRef,
      isModerator,
      leaveRoom,
      moveHand,
    };
  },
});
</script>
