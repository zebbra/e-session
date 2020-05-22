<template>
  <v-container fluid>
    <v-row dense>
      <v-col key="session-card" cols="6">
        <v-card>
          <v-card-title>Example Session</v-card-title>
          <v-card-text>
            <section v-if="user">
              <section>User: {{ `${user.name} (${user.id})` }}</section>
              <section>Room: {{ user.room && user.room.name }}</section>
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
          <v-card-text>
            <section>Room: {{ `${room.name} (${room.id})` }}</section>
            <section v-if="user && !user.room">
              <button @click="joinRoom()">
                Join Room
              </button>
            </section>
            <section v-if="user && user.room">
              <button @click="leaveRoom()">
                Leave Room
              </button>
            </section>
            <section>Users:</section>
            <v-list>
              <v-list-item v-for="(user, index) in room.users" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{
                    `${user.name} (${user.id})`
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
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
  watch,
} from "nuxt-composition-api";
import { useResult } from "@vue/apollo-composable";
import { fetchRoom } from "~/composable/useRoom";
import { login, logout, join, leave } from "~/composable/useUser";
import { sessionStore } from "~/store";
import { IUser } from "~/types";

export default defineComponent({
  name: "ApolloExample",
  head: {},
  setup() {
    useMeta({ title: "Apollo Example " });

    const { result, loading, subscribeToMore, refetch } = fetchRoom(
      "Example Name",
    );
    const room = useResult(result, {
      id: null,
      name: "Room was not found",
      messages: [],
      users: [],
    });

    const variables = reactive({
      name: "",
    });
    const user = computed(() => sessionStore.user);
    const { mutate: loginUser } = login(variables);
    const { mutate: logoutUser } = logout(user);
    const { mutate: joinRoom } = join(user, room);
    const { mutate: leaveRoom } = leave(user, room);

    watch(user, (user) => {
      if (user) {
        subscribeToMore<{}, { roomJoined: IUser }>(() => ({
          document: require("~/graphql/subscriptions/roomJoined.graphql"),
          variables: { userId: user.id, roomId: room.value.id },
          updateQuery: (previousResult, { subscriptionData }) => {
            previousResult.room.users.push(subscriptionData.data.roomJoined);
            return previousResult;
          },
          onError: (_error) => {
            // handle error
          },
        }));

        subscribeToMore<{}, { roomLeft: IUser }>(() => ({
          document: require("~/graphql/subscriptions/roomLeft.graphql"),
          variables: { userId: user.id, roomId: room.value.id },
          updateQuery: (previousResult) => {
            refetch();
            return previousResult;
          },
          onError: (_error) => {
            // handle error
          },
        }));
      }
    });

    return {
      room,
      loading,
      variables,
      user,
      loginUser,
      logoutUser,
      joinRoom,
      leaveRoom,
    };
  },
});
</script>
