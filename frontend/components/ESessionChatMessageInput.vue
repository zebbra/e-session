<template>
  <v-card>
    <v-card-text>
      <v-form v-model="valid" @submit.prevent>
        <v-text-field
          v-model="message"
          :rules="messageRules"
          :counter="100"
          required
          filled
          placeholder="Send a message to everyone"
          type="text"
          class="message-input"
          append-outer-icon="mdi-send"
          @click:append-outer="sendMessage"
          @keydown.enter="sendMessage"
        >
        </v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "nuxt-composition-api";
import { useOnMessagePosted, useSend } from "~/composable/useMessage";
import { IRoom, IUser } from "~/types";

export default defineComponent({
  name: "ESessionChatMessageInput",
  props: {
    room: Object as () => IRoom,
    user: Object as () => IUser,
  },
  setup({ room, user }) {
    const message = ref("");
    const valid = ref(false);

    const { mutate: postMessage } = useSend(room, user, message);
    function sendMessage() {
      if (valid.value && message.value.length) {
        postMessage();
        message.value = "";
      }
    }

    useOnMessagePosted(room);

    return {
      message,
      messageRules: [(v) => v.length <= 100],
      sendMessage,
      valid,
    };
  },
});
</script>
