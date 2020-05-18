<template>
  <v-card>
    <v-card-title>Example Subscriptions for {{ name }}</v-card-title>
    <v-card-text>
      <h2>Messages</h2>
      <input v-model="text" placeholder="Enter a message" />
      <button @click="addMessage()">
        Send message
      </button>
      <ul id="messages-list">
        <li v-for="(message, index) in messages" :key="index">
          {{ message.text }}
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "nuxt-composition-api";
import { useResult, useMutation } from "@vue/apollo-composable";
import { fetchRoom } from "~/composable/useRoom";

export default defineComponent({
  name: "ApolloSubscriptions",
  head: {
    title: "Example Subscriptions",
  },
  setup() {
    const { result, loading, subscribeToMore, refetch } = fetchRoom(
      "Example Room",
    );
    const name = useResult(result, "Room not found", (data) => data.room.name);
    const messages = useResult(result, [], (data) => data.room.messages);

    // here we use the signal approach to simply refetch the room on message added
    // another approach would be to change the backend to send the newly addes message
    // and we add it to the messages array manually
    // not sure which approach to use
    subscribeToMore(() => ({
      document: require("~/graphql/subscriptions/messagePosted.graphql"),
      variables: { room: name.value },
      updateQuery: (previousResult) => {
        text.value = "";
        refetch();
        return previousResult;
      },
      onError: (_error) => {
        // handle error
      },
    }));

    const text = ref("");
    const postMessageTypeMutation = require("~/graphql/mutations/postMessage.graphql");
    const { mutate: sendMessage } = useMutation(postMessageTypeMutation);

    // do not allow empty message
    function addMessage() {
      if (text.value !== "") {
        sendMessage({
          room: name.value,
          message: text.value,
        });
      }
    }

    return { loading, name, messages, text, addMessage };
  },
});
</script>
