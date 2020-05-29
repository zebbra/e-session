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
      <e-session-moderation-drawer-header />
    </template>

    <v-divider></v-divider>

    <v-tabs v-model="selectedTab" centered grow>
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
      <e-session-chat-message-input />
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "nuxt-composition-api";
import { globalStore, roomStore } from "~/store";

export default defineComponent({
  name: "ESessionModerationDrawer",
  components: {
    ESessionChat: () => import("~/components/ESessionChat.vue"),
    ESessionChatMessageInput: () =>
      import("~/components/ESessionChatMessageInput.vue"),
    ESessionUsers: () => import("~/components/ESessionUsers.vue"),
    ESessionModerationDrawerHeader: () =>
      import("~/components/ESessionModerationDrawerHeader.vue"),
  },
  setup() {
    const moderationDrawer = computed(() => globalStore.moderationDrawer);
    const roomRef = computed(() => roomStore.room);

    const selectedTab = ref(0);

    return {
      moderationDrawer,
      room: roomRef,
      selectedTab,
    };
  },
});
</script>
