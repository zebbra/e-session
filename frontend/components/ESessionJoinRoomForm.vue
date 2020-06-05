<template>
  <v-container>
    <v-form v-model="valid">
      <v-card
        color="rgb(0, 0, 0, 0.2)"
        class="mx-auto"
        max-width="600"
        outlined
      >
        <v-card-title>Join Room</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="userName"
            :rules="nameRules"
            :counter="32"
            :disabled="!!user"
            required
            outlined
            label="Username"
          />
          <v-text-field
            v-model="roomName"
            :rules="nameRules"
            :counter="32"
            required
            outlined
            label="Room"
          />
          <v-checkbox v-model="moderator" label="Moderator"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="user" color="primary" outlined @click="logout">
            Logout
          </v-btn>
          <v-btn color="primary" outlined :disabled="!valid" @click="submit">
            Join
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch,
  useContext,
} from "nuxt-composition-api";
import { useCreate } from "~/composable/useRoom";
import { useLogin, useLogout } from "~/composable/useSession";
import { sessionStore, roomStore } from "~/store";

export default defineComponent({
  name: "ESessionJoinRoomForm",
  setup() {
    const { redirect, query } = useContext();
    if (query.value.role) {
      sessionStore.setRole(query.value.role.toString());
    }
    const userRef = computed(() => sessionStore.user);
    const userName = ref("");
    if (userRef.value) {
      userName.value = userRef.value.name;
    } else if (process.client && localStorage.getItem("username")) {
      userName.value = localStorage.getItem("username");
    }
    const { mutate: login } = useLogin(userName);
    const { mutate: logout } = useLogout(userRef);

    const roomRef = computed(() => roomStore.room);
    const roomName = ref("");
    if (roomRef.value) {
      roomName.value = roomRef.value.name;
    } else if (query.value.room) {
      roomName.value = query.value.room.toString();
    } else if (process.client && localStorage.getItem("roomname")) {
      roomName.value = localStorage.getItem("roomname");
    }
    const { mutate: create } = useCreate(roomName);

    function submit() {
      if (!userRef.value) {
        login();
      }
      if (!roomRef.value) {
        create();
      }
    }

    watch([userRef, roomRef], ([user, room]) => {
      if (user && room) {
        localStorage.setItem("username", user.name);
        localStorage.setItem("roomname", room.name);
        redirect(`/rooms/${room.name}`);
      }
    });

    const moderator = ref(true);
    watch(moderator, (isModerator) => {
      if (isModerator) {
        sessionStore.setRole("moderator");
      } else {
        sessionStore.setRole("User");
      }
    });

    return {
      user: userRef,
      userName,
      roomName,
      valid: false,
      nameRules: [
        (v) => !!v || "Attribute is required",
        (v) => v.length >= 3 || "Attribute must be more than 3 characters",
        (v) => v.length <= 32 || "Attribute must be less than 32 characters",
      ],
      submit,
      logout,
      moderator,
    };
  },
});
</script>
