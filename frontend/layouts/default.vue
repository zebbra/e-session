<template>
  <v-app dark>
    <e-session-snackbar />
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-btn v-if="roomJoined" icon @click.stop="toggleModerationDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-tooltip v-if="roomJoined && !moderationDrawer" bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon @click.stop="leaveRoom">
            <v-icon v-on="on">mdi-exit-to-app</v-icon>
          </v-btn>
        </template>
        <span>Leave Room</span>
      </v-tooltip>
    </v-app-bar>
    <v-content>
      <div>
        <nuxt />
      </div>
      <v-dialog v-model="setupDialog" persistent max-width="600">
        <e-session-local-media-setup />
      </v-dialog>
    </v-content>
    <e-session-moderation-drawer v-if="roomJoined" />
    <v-footer fixed>
      <span
        >&#9994; e-session
        <a href="https://github.com/zebbra/e-session" target="_blank"
          >prototype</a
        ></span
      >
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import {
  defineComponent,
  provide,
  useContext,
  computed,
} from "nuxt-composition-api";
import { DefaultApolloClient } from "@vue/apollo-composable";

import { useLeave } from "~/composable/useRoom";
import {
  sessionStore,
  roomStore,
  globalStore,
  conferenceStatusStore,
} from "~/store";

export default defineComponent({
  name: "DefaultLayout",
  components: {
    ESessionSnackbar: () => import("~/components/ESessionSnackbar.vue"),
    ESessionModerationDrawer: () =>
      import("~/components/ESessionModerationDrawer.vue"),
    ESessionLocalMediaSetup: () =>
      import("~/components/ESessionLocalMediaSetup.vue"),
  },
  setup() {
    const { app, redirect } = useContext();
    provide(DefaultApolloClient, app.apolloProvider.defaultClient);

    if (process.browser) {
      Vue.prototype.$jitsi = window.JitsiMeetJS;
    }
    const setupDialog = computed(() => conferenceStatusStore.setupVisible);
    const moderationDrawer = computed(() => globalStore.moderationDrawer);
    const userRef = computed(() => sessionStore.user);
    const roomRef = computed(() => roomStore.room);
    const roomJoined = computed(
      () => userRef.value !== null && roomRef.value !== null,
    );

    function toggleModerationDrawer() {
      globalStore.toggleModerationDrawer();
    }

    const { mutate: leave, onDone } = useLeave(userRef, roomRef);
    function leaveRoom() {
      onDone(() => {
        redirect("/");
      });
      leave();
    }
    return {
      title: "E-Session",
      roomJoined,
      moderationDrawer,
      toggleModerationDrawer,
      leaveRoom,
      setupDialog,
    };
  },
});
</script>
<style scoped></style>>
