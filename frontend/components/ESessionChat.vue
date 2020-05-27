<template>
  <section>
    <input v-model="text" placeholder="Enter a message" />
    <button @click="addMessage()">
      Send message
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "nuxt-composition-api";
import { useSendMessage } from "~/composable/useRoom";
import { sessionStore, moderationStore } from "~/store";

export default defineComponent({
  name: "ESessionChat",
  props: {
    room: String,
  },
  setup() {
    const user = computed(() => sessionStore.user);
    const room = computed(() => moderationStore.room);
    const message = ref("");
    const { mutate: sendMessage } = useSendMessage(room, user, message);

    function addMessage() {
      if (message.value !== "") {
        sendMessage();
      }
    }

    return {
      addMessage,
    };
  },
});
</script>
