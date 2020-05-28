<template>
  <v-navigation-drawer
    :value="moderationDrawer"
    right
    temporary
    hide-overlay
    fixed
    @input="toggleModerationDrawer"
  >
    <section>{{ user }} {{ room }}</section>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
import { globalStore, roomStore, sessionStore } from "~/store";

export default defineComponent({
  name: "ESessionModerationDrawer",
  setup() {
    const moderationDrawer = computed(() => globalStore.moderationDrawer);
    function toggleModerationDrawer(shown) {
      if (!shown && moderationDrawer.value) {
        globalStore.toggleModerationDrawer();
      }
    }

    const roomRef = computed(() => roomStore.room);
    const userRef = computed(() => sessionStore.user);

    return {
      moderationDrawer,
      toggleModerationDrawer,
      room: roomRef,
      user: userRef,
    };
  },
});
</script>
