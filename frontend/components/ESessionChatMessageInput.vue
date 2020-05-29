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
import { defineComponent, computed, ref } from "nuxt-composition-api";
import { useOnMessagePosted, useSend } from "~/composable/useMessage";
import { roomStore, sessionStore } from "~/store";

export default defineComponent({
  name: "ESessionChatMessageInput",
  setup() {
    const userRef = computed(() => sessionStore.user);
    const roomRef = computed(() => roomStore.room);
    const message = ref("");
    const valid = ref(false);

    const { mutate: postMessage } = useSend(roomRef, userRef, message);
    function sendMessage() {
      if (valid.value && message.value.length) {
        postMessage();
        message.value = "";
      }
    }

    useOnMessagePosted(roomRef);

    return {
      message,
      messageRules: [(v) => v.length <= 100],
      sendMessage,
      valid,
    };
  },
});
</script>
