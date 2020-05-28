<template>
  <v-navigation-drawer
    v-model="show"
    right
    permanent
    fixed
    dark
  >
    <v-tabs
      v-model="tabs"
      color="primary"
      dark
      slider-color="primary"
      centered="centered"
      grow="grow"
      right="right"
    >
      <v-tab>
        Users
      </v-tab>
      <v-tab-item>
        <e-session-user-list />
      </v-tab-item>
      <v-tab>
        Chat
      </v-tab>
      <v-tab-item>
        <e-session-chat />
      </v-tab-item>
    </v-tabs>
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
