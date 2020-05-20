<template>
  <v-card>
    <v-card-title>Example Subscriptions for {{ room.name }}</v-card-title>
    <v-card-text>
      <h2>Messages</h2>
      <input v-model="text" placeholder="Enter a message" />
      <button @click="addMessage()">
        Send message
      </button>
      <ul id="messages-list">
        <li v-for="(message, index) in room.messages" :key="index">
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
    const name = "Example Room";
    const { result, loading, subscribeToMore } = fetchRoom(name);
    const room = useResult(result, { name: "Room was not found " });

    subscribeToMore<{}, { messagePosted: { text: string } }>(() => ({
      document: require("~/graphql/subscriptions/messagePosted.graphql"),
      variables: { room: name },
      updateQuery: (previousResult, { subscriptionData }) => {
        text.value = "";
        const message = subscriptionData.data.messagePosted;
        previousResult.room.messages.push(message);
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
          room: name,
          message: text.value,
        });
      }
    }

    return { loading, room, text, addMessage };
  },
});
</script>
