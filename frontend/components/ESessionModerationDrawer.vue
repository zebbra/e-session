<template>
  <v-navigation-drawer
    :value="moderationDrawer"
    :width="300"
    app
    right
    bottom
    overlay-color="blue"
    fixed
    clipped
  >
    <template v-slot:prepend>
      <e-session-moderation-drawer-header :room="room" :user="user" />
    </template>

    <v-divider></v-divider>

    <v-tabs v-model="selectedTab" centered grow>
      <v-tab class="custom-theme">
        <v-icon>mdi-account-multiple-outline</v-icon> People ({{
          room.users.length
        }})
      </v-tab>
      <v-tab-item :transition="false" :reverse-transition="false">
        <e-session-users :current-user="user" :room="room" />
      </v-tab-item>
      <v-tab class="custom-theme"> <v-icon>mdi-message</v-icon> Chat </v-tab>
      <v-tab-item :transition="false" :reverse-transition="false">
        <e-session-chat :room="room" :user="user" />
      </v-tab-item>
    </v-tabs>

    <template v-slot:append>
      <e-session-chat-message-input
        v-if="selectedTab === 1"
        :room="room"
        :user="user"
      />
      <e-session-users-search-box v-else @onUsersFiltered="onUsersFiltered" />
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "nuxt-composition-api";
import { globalStore, roomStore, sessionStore } from "~/store";

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
    const userRef = computed(() => sessionStore.user);

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
      user: userRef,
      selectedTab,
      onUsersFiltered,
    };
  },
});
</script>

<style scoped>
.message-input input {
  font-size: 0.8em;
}
.custom-theme {
  background-color: var(--v-background-base) !important;
}
</style>
