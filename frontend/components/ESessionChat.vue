<template>
  <section>
    <v-card>
      <v-card-title>Messages</v-card-title>
        <v-card-text v-if="room">
          <v-card-text>
            {{ room.name }}
          </v-card-text>
          <v-list v-for="(message, index) in room.messages" :key="index">
            <v-list-item-content>
              <v-list-item-title>
                {{ message.author.name }} - {{ message.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list>
        </v-card-text>
        <v-card-text v-else>
          No room joined
        </v-card-text>
    </v-card>
    <input v-model="message" placeholder="Enter a message" />
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

  setup() {
    console.log("Setup ESessionChat")
    const user = computed(() => sessionStore.user);
    const room = computed(() => moderationStore.room);
    const message = ref("");
    const chatActivated = computed(() => room.value != null && user.value != null)
    const { mutate: sendMessage } = useSendMessage(room, user, message);

    function addMessage() {
      console.log(chatActivated.value)
      console.log(user.value)
      console.log(room.value)
      if(chatActivated.value){
        console.log("send message " + message.value + ".")
        if (message.value !== "") {
          sendMessage();
        }
      } else {
        console.log("Join room first")
      }

    }

    return {
      addMessage,
      user, 
      room,
      message
    };
  },
});
</script>
