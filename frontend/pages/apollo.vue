<template>
  <v-container fluid>
    <v-row dense>
      <v-col key="session-card" cols="6">
        <v-card>
          <v-card-title>Example Session</v-card-title>
          <v-card-text>
            <section v-if="user">
              User: {{ user.name }}
              <button @click="logoutUser()">
                Logout
              </button>
            </section>
            <section v-if="!user">
              <input v-model="variables.name" placeholder="Enter your name" />
              <button :disabled="variables.name === ''" @click="loginUser()">
                Login
              </button>
            </section>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col key="room-card" cols="6">
        <v-card :loading="loading">
          <v-card-title>Example Room</v-card-title>
          <v-card-text> Room: {{ room.name }} </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useMeta,
  computed,
  reactive,
} from "nuxt-composition-api";
import { useResult } from "@vue/apollo-composable";
import { fetchRoom } from "~/composable/useRoom";
import { login, logout } from "~/composable/useUser";
import { sessionStore } from "~/store";

export default defineComponent({
  name: "ApolloExample",
  head: {},
  setup() {
    useMeta({ title: "Apollo Example " });

    const { result, loading } = fetchRoom("Example Name");
    const room = useResult(result, { name: "Room was not found" });

    const variables = reactive({
      name: "",
    });
    const user = computed(() => sessionStore.user);
    const { mutate: loginUser } = login(variables);
    const { mutate: logoutUser } = logout(user);

    return {
      room,
      loading,
      variables,
      user,
      loginUser,
      logoutUser,
    };
  },
});
</script>
