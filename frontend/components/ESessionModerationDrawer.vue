<template>
  <v-navigation-drawer
    v-model="show"
    right
    temporary
    fixed
    color="primary"
    dark
  >
    <e-session-user-list />
    <e-session-chat />
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";

export default defineComponent({
  name: "ESessionModerationDrawer",
  components: {
    ESessionChat: () => import("~/components/ESessionChat.vue"),
    ESessionUserList: () => import("~/components/ESessionUserList.vue"),
  },
  props: {
    show: Boolean,
  },
});
</script>
