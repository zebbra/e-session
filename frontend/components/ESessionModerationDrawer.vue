<template>
  <v-navigation-drawer
    :value="moderationDrawer"
    :width="300"
    app
    right
    fixed
    light
  >
    <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ room.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-tabs v-model="selectedTab" centered grow right>
      <v-tab>
        <v-icon>mdi-account-multiple-outline</v-icon> People ({{
          room.users.length
        }})
      </v-tab>
      <v-tab-item :transition="false" :reverse-transition="false">
        <e-session-users />
      </v-tab-item>
      <v-tab> <v-icon>mdi-message</v-icon> Chat </v-tab>
      <v-tab-item :transition="false" :reverse-transition="false">
        <e-session-chat />
      </v-tab-item>
    </v-tabs>

    <template v-if="selectedTab === 1" v-slot:append>
      <v-card>
        <v-card-text>
          <v-form v-model="valid">
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
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "nuxt-composition-api";
import { useSend, useOnMessagePosted } from "~/composable/useMessage";
import { globalStore, roomStore, sessionStore } from "~/store";

export default defineComponent({
  name: "ESessionModerationDrawer",
  components: {
    ESessionChat: () => import("~/components/ESessionChat.vue"),
    ESessionUsers: () => import("~/components/ESessionUsers.vue"),
  },
  setup() {
    const moderationDrawer = computed(() => globalStore.moderationDrawer);

    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);

    const selectedTab = ref(0);

    useOnMessagePosted(roomRef);
    const message = ref("");
    const valid = ref(false);
    const { mutate: postMessage } = useSend(roomRef, userRef, message);
    function sendMessage() {
      if (valid.value) {
        postMessage();
        message.value = "";
      }
    }

    return {
      moderationDrawer,
      room: roomRef,
      user: userRef,
      message,
      messageRules: [(v) => v.length <= 100],
      sendMessage,
      valid,
      selectedTab,
    };
  },
});
</script>

<style>
.message-input input {
  font-size: 0.8em;
}
</style>
