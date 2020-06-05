<template>
  <v-row justify="center">
    <v-expansion-panels
      accordion
      multiple
      focusable
      hover
      flat
      :disabled="!isModerator"
    >
      <v-expansion-panel v-for="(user, index) in processedUsers" :key="index">
        <e-session-user-item
          :user="user"
          :room="room"
          :current-user="currentUser"
          :role="role"
          :is-moderator="isModerator"
        />
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import { roomStore, sessionStore } from "~/store";
import { IUser, IRoom } from "~/types";

export default defineComponent({
  name: "ESessionUsers",
  components: {
    ESessionUserItem: () => import("~/components/ESessionUserItem.vue"),
  },
  props: {
    currentUser: Object as () => IUser,
    room: Object as () => IRoom,
  },
  setup() {
    const isModerator = computed(() => sessionStore.isModerator);
    const role = computed(() => sessionStore.userRole);
    const processedUsers = computed(() => roomStore.processedUsers);

    return {
      isModerator,
      role,
      processedUsers,
    };
  },
});
</script>
