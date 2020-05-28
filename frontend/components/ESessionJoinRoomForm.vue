<template>
  <v-container>
    <v-form v-model="valid">
      <v-card class="mx-auto" max-width="600" outlined>
        <v-card-title>Join Room</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="userName"
            :rules="nameRules"
            :counter="10"
            required
            outlined
            label="Username"
          />
          <v-text-field
            v-model="roomName"
            :rules="nameRules"
            :counter="10"
            required
            outlined
            label="Room"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="user" color="primary" outlined @click="logout"
            >Logout</v-btn
          >
          <v-btn color="primary" outlined :disabled="!valid" @click="submit"
            >Join</v-btn
          >
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
    const userRef = computed(() => sessionStore.user);
    const userName = ref(userRef.value ? userRef.value.name : "");
    const { mutate: login } = useLogin(userName);
    const { mutate: logout } = useLogout(userRef);

    const roomRef = computed(() => roomStore.room);
    const roomName = ref(roomRef.value ? roomRef.value.name : "");
    const { mutate: create } = useCreate(roomName);

    function submit() {
      if (!userRef.value) {
        login();
      }
      if (!roomRef.value) {
        create();
      }
    }

    const { redirect } = useContext();
    watch([userRef, roomRef], ([user, room]) => {
      if (user && room) {
        redirect(`/rooms/${room.name}`);
      } else if (!user) {
        userName.value = "";
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
        (v) => v.length <= 10 || "Attribute must be less than 10 characters",
      ],
      submit,
      logout,
    };
  },
});
</script>
