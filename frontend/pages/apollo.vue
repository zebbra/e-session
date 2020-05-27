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
    <v-row v-if="user && user.room">
      <v-col>
        <v-card>
          <v-card-title>Messages</v-card-title>
          <v-card-text>
            <v-list v-for="(message, index) in room.messages" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  {{ message.author.name }} - {{ message.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <input v-model="text" placeholder="Enter a message" />
            <button @click="addMessage()">
              Send message
            </button>
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
  onBeforeUnmount,
  ref,
} from "nuxt-composition-api";
import {
  useResult,
  useSubscription,
  useMutation,
} from "@vue/apollo-composable";
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

    if (process.client) {
      useSubscription(
        require("~/graphql/subscriptions/userConnected.graphql"),
        () => {
          return {
            userId: user.value && user.value.id,
            roomId: room.value && room.value.id,
          };
        },
        () => {
          const enabled = !!user.value;
          return {
            enabled,
          };
        },
      );
    }

    watch(user, (user) => {
      refetch();
      if (user && process.client) {
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
      }
    });

    const text = ref("");
    const postMessageTypeMutation = require("~/graphql/mutations/postMessage.graphql");
    const { mutate: sendMessage } = useMutation(
      postMessageTypeMutation,
      () => ({
        update: () => {
          refetch();
          text.value = "";
        },
      }),
    );
    // do not allow empty message
    function addMessage() {
      if (text.value !== "") {
        sendMessage({
          room: room.value.name,
          author: user.value.id,
          text: text.value,
        });
      }
    }

    onBeforeUnmount(() => {
      if (sessionStore.user && sessionStore.user.room) {
        sessionStore.leaveRoom();
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
      text,
      addMessage,
    };
  },
});
</script>
