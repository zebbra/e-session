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

export default defineComponent({
  name: "ESessionUsers",
  components: {
    ESessionUserItem: () => import("~/components/ESessionUserItem.vue"),
  },
  setup() {
    const userRef = computed(() => sessionStore.user);
    const isModerator = computed(() => sessionStore.isModerator);
    const role = computed(() => sessionStore.userRole);
    const processedUsers = computed(() => roomStore.processedUsers);

    return {
      currentUser: userRef,
      isModerator,
      role,
      processedUsers,
    };
  },
});
</script>
