<template>
  <v-container>
    <v-row class="mb-5">
      <e-session-tenant-logo class="mx-auto" />
    </v-row>
    <v-form v-model="valid">
      <v-card
        color="rgb(0, 0, 0, 0.2)"
        class="mx-auto"
        max-width="600"
        outlined
      >
        <v-card-title>You are the Speaker</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="userName"
            :rules="nameRules"
            :counter="32"
            :disabled="!!user"
            required
            outlined
            label="Enter your Name"
            @keydown.enter="valid && submit()"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="user" color="primary" outlined @click="logout">
            Exit
          </v-btn>
          <v-btn color="primary" outlined :disabled="!valid" @click="submit">
            Enter
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
  components: {
    ESessionTenantLogo: () =>
      import("~/components/parl/ESessionTenantLogo.vue"),
  },
  setup() {
    const { redirect } = useContext();
    sessionStore.setRole("moderator");
    const userRef = computed(() => sessionStore.user);
    const userName = ref("");
    if (userRef.value) {
      userName.value = userRef.value.name;
    } else if (process.client && localStorage.getItem("username")) {
      userName.value = localStorage.getItem("username");
    }
    const { mutate: login } = useLogin(userName, sessionStore.role);
    const { mutate: logout } = useLogout(userRef);

    const roomRef = computed(() => roomStore.room);
    const roomName = ref("demositting");
    if (roomRef.value) {
      roomName.value = roomRef.value.name;
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
        redirect(`/parl/${room.name}`);
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
    };
  },
});
</script>
