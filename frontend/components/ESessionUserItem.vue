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
              <v-icon color="grey" v-on="on" @click.stop="decline(user)">
                mdi-hand-left
              </v-icon>
            </v-list-item-icon>
          </template>
          <span>Lower Hand</span>
        </v-tooltip>
        <v-tooltip v-if="!user.conferenceJoined" left>
          <template v-slot:activator="{ on }">
            <v-list-item-icon>
              <v-icon color="grey" v-on="on" @click.stop="join(user)">
                mdi-arrow-left-bold-circle-outline
              </v-icon>
            </v-list-item-icon>
          </template>
          <span>Join {{ user.name }}</span>
        </v-tooltip>
        <v-tooltip v-else left>
          <template v-slot:activator="{ on }">
            <v-list-item-icon>
              <v-icon color="grey" v-on="on" @click.stop="exit(user)">
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
import { defineComponent, computed } from "nuxt-composition-api";
import { useMutation } from "@vue/apollo-composable";
import consola from "consola";
import { mutations } from "~/apollo";
import { useJoinConference, useLeaveConference } from "~/composable/useSession";
import { roomStore } from "~/store";

export default defineComponent({
  name: "ESessionUserItem",
  props: {
    user: Object,
    currentUser: Object,
    role: String,
    isModerator: Boolean,
  },
  setup() {
    const roomRef = computed(() => roomStore.room);
    const { mutate: joinConference } = useJoinConference();
    const { mutate: leaveConference } = useLeaveConference();

    function join(user) {
      consola.log("join", user.id);

      joinConference({
        userId: user.id,
        roomId: roomRef.value.id,
      });
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
    }

    return {
      join,
      decline,
      exit,
    };
  },
});
</script>
