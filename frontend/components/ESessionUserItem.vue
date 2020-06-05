<template>
  <section>
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
        <v-tooltip v-if="user.handRaised && isModerator" left>
          <template v-slot:activator="{ on }">
            <v-list-item-icon>
              <v-icon color="grey" v-on="on" @click.stop="decline">
                mdi-hand-left
              </v-icon>
            </v-list-item-icon>
          </template>
          <span>Lower Hand</span>
        </v-tooltip>
        <v-tooltip v-if="!user.conferenceJoined" left>
          <template v-slot:activator="{ on }">
            <v-list-item-icon>
              <v-icon color="grey" v-on="on" @click.stop="join">
                mdi-arrow-left-bold-circle-outline
              </v-icon>
            </v-list-item-icon>
          </template>
          <span>Join {{ user.name }}</span>
        </v-tooltip>
        <v-tooltip v-else left>
          <template v-slot:activator="{ on }">
            <v-list-item-icon>
              <v-icon color="grey" v-on="on" @click.stop="exit">
                mdi-arrow-right-bold-circle-outline
              </v-icon>
            </v-list-item-icon>
          </template>
          <span>Exit {{ user.name }}</span>
        </v-tooltip>
      </v-list-item>
      <template v-slot:actions><span /></template>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="py-0">
      <v-card flat tile>
        <v-card-text>
          User Information
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";
import { useMutation } from "@vue/apollo-composable";
import consola from "consola";
import { mutations } from "~/apollo";
import { useJoinConference, useLeaveConference } from "~/composable/useSession";
import { IUser, IRoom } from "~/types";

export default defineComponent({
  name: "ESessionUserItem",
  props: {
    user: Object as () => IUser,
    room: Object as () => IRoom,
    currentUser: Object as () => IUser,
    role: String,
    isModerator: Boolean,
  },
  setup({ room, user }) {
    const { mutate: joinConference } = useJoinConference(user, room);
    const { mutate: leaveConference } = useLeaveConference(user, room);

    function join() {
      consola.log("join", user.id);
      joinConference();
    }

    const { mutate: lowerHand } = useMutation(mutations.room.lowerHand);
    function decline() {
      lowerHand({ userId: user.id, roomId: room.id });
    }

    function exit() {
      consola.log("exit", user.id);
      leaveConference();
    }

    return {
      join,
      decline,
      exit,
    };
  },
});
</script>
