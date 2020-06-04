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
        <v-expansion-panel-header class="py-0">
          <v-list-item dense>
            <v-list-item-content>
              <v-list-item-title dense>
                {{ user.name }} {{ user.id === currentUser.id ? " (You)" : "" }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ user.id === currentUser.id ? role : "User" }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon v-if="user.handRaised">
              <v-icon color="secondary">mdi-hand-left</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <template v-slot:actions><span /></template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="py-0">
          <v-card flat tile>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip v-if="!user.conferenceJoined" left>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click.stop="join(user)">
                    <v-icon color="success darken-1" v-on="on">
                      mdi-arrow-left-bold-circle
                    </v-icon>
                  </v-btn>
                </template>
                <span>Join {{ user.name }}</span>
              </v-tooltip>
              <v-tooltip v-else left>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click.stop="exit(user)">
                    <v-icon color="warning darken-1" v-on="on">
                      mdi-arrow-right-bold-circle
                    </v-icon>
                  </v-btn>
                </template>
                <span>Exit {{ user.name }}</span>
              </v-tooltip>
              <v-tooltip v-if="user.handRaised" left>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click.stop="decline(user)">
                    <v-icon color="error" v-on="on">
                      mdi-close-circle
                    </v-icon>
                  </v-btn>
                </template>
                <span>Decline {{ user.name }}</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useContext,
  ref,
} from "nuxt-composition-api";
import { useMutation } from "@vue/apollo-composable";
import consola from "consola";
import { mutations } from "~/apollo";
import { useJoinConference, useLeaveConference } from "~/composable/useSession";
import { roomStore, sessionStore, conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionUsers",
  setup(_, context) {
    const { app } = useContext();
    const userRef = computed(() => sessionStore.user);
    const roomRef = computed(() => roomStore.room);
    const isModerator = computed(() => sessionStore.isModerator);
    const role = computed(() => sessionStore.userRole);
    const processedUsers = computed(() => roomStore.processedUsers);

    const { mutate: joinConference } = useJoinConference();
    const { mutate: leaveConference } = useLeaveConference();

    function join(user) {
      consola.log("join", user.id);

      joinConference({
        userId: user.id,
        roomId: roomRef.value.id,
      });

      if (user.id === sessionStore.user.id) {
        context.root.$set(
          app.$remoteTracks.value,
          conferenceStore.status.id,
          ref({}),
        );
        conferenceStore.updateIsSpeaker(true);
        /* TODO Desktop and check if stream available */
        consola.log(app.$localTracks);
        app.$room.addTrack(app.$localTracks.value.localStream.video);
        app.$room.addTrack(app.$localTracks.value.localStream.audio);
      }
    }

    const { mutate: lowerHand } = useMutation(mutations.room.lowerHand);
    function decline(user) {
      lowerHand({ userId: user.id, roomId: roomRef.value.id });
    }

    function exit(user) {
      consola.log("exit", user.id);

      leaveConference({
        userId: user.id,
        roomId: roomRef.value.id,
      });

      if (user.id === sessionStore.user.id) {
        conferenceStore.updateIsSpeaker(false);
        app.$disposeAndRecreateLocalTracks();
      }
    }

    return {
      currentUser: userRef,
      isModerator,
      role,
      processedUsers,
      join,
      decline,
      exit,
    };
  },
});
</script>
