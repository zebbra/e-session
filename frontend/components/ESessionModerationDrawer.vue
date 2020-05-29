<template>
  <v-navigation-drawer :value="moderationDrawer" :width="300" app right fixed>
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

    <template v-slot:append>
      <e-session-chat-message-input v-if="selectedTab === 1" />
      <e-session-users-search-box v-else @onUsersFiltered="onUsersFiltered" />
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "nuxt-composition-api";
import { globalStore, roomStore } from "~/store";

export default defineComponent({
  name: "ESessionModerationDrawer",
  components: {
    ESessionChat: () => import("~/components/ESessionChat.vue"),
    ESessionChatMessageInput: () =>
      import("~/components/ESessionChatMessageInput.vue"),
    ESessionUsers: () => import("~/components/ESessionUsers.vue"),
    ESessionUsersSearchBox: () =>
      import("~/components/ESessionUsersSearchBox.vue"),
    ESessionModerationDrawerHeader: () =>
      import("~/components/ESessionModerationDrawerHeader.vue"),
  },
  setup() {
    const moderationDrawer = computed(() => globalStore.moderationDrawer);
    const roomRef = computed(() => roomStore.room);

    const selectedTab = ref(0);
    watch(selectedTab, (tab) => {
      if (tab === 1) {
        roomStore.setUsersFilter("");
      }
    });

    function onUsersFiltered(value) {
      roomStore.setUsersFilter(value);
    }

    return {
      moderationDrawer,
      room: roomRef,
      selectedTab,
      onUsersFiltered,
    };
  },
});
</script>

<style>
.message-input input {
  font-size: 0.8em;
}
</style>
