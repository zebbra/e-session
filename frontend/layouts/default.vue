<template>
  <v-app dark>
    <e-session-snackbar />
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-btn v-if="roomJoined" icon @click.stop="leaveRoom">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
      <v-btn v-if="roomJoined" icon @click.stop="toggleModerationDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <e-session-moderation-drawer v-if="roomJoined" />
    <v-footer fixed>
      <span>&copy; zebbra AG {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  useContext,
  computed,
} from "nuxt-composition-api";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { useLeave } from "~/composable/useRoom";
import { sessionStore, roomStore, globalStore } from "~/store";

export default defineComponent({
  name: "DefaultLayout",
  components: {
    ESessionSnackbar: () => import("~/components/ESessionSnackbar.vue"),
    ESessionModerationDrawer: () =>
      import("~/components/ESessionModerationDrawer.vue"),
  },
  setup() {
    const { app, redirect } = useContext();
    provide(DefaultApolloClient, app.apolloProvider.defaultClient);

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
      items: [
        {
          icon: "mdi-apps",
          title: "Join Room",
          to: "/",
        },
        {
          icon: "mdi-home-floor-1",
          title: "Example Room",
          to: "/rooms/1",
        },
      ],
      title: "E-Session",
      roomJoined,
      toggleModerationDrawer,
      leaveRoom,
    };
  },
});
</script>
