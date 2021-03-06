<template>
  <section>
    <v-expansion-panel-header :user="user" class="py-0">
      <v-list-item class="full-width">
        <e-session-user-itemVote-indicator
          v-if="showVoteIndicator"
          :user="user"
        />
        <v-list-item-content>
          <v-list-item-title>
            {{ user.name }} {{ user.id === currentUser.id ? " (You)" : "" }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.role }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <div class="d-flex">
          <v-tooltip v-if="user.handRaised" left>
            <template v-slot:activator="{ on }">
              <v-list-item-icon>
                <v-icon v-if="user.conferenceJoined" color="blue">
                  mdi-account-voice
                </v-icon>
                <v-icon
                  v-else-if="isModerator"
                  color="orange"
                  v-on="on"
                  @click.stop="decline(user)"
                >
                  mdi-hand-left
                </v-icon>
                <v-icon v-else color="orange" v-on="on">
                  mdi-hand-left
                </v-icon>
              </v-list-item-icon>
            </template>
            <span>Lower Hand</span>
          </v-tooltip>
          <div
            v-if="
              isModerator && (user.handRaised || user.id === currentUser.id)
            "
          >
            <v-tooltip v-if="!user.conferenceJoined" left>
              <template v-slot:activator="{ on }">
                <v-list-item-icon class="mr-0">
                  <v-icon color="green" v-on="on" @click.stop="join(user)">
                    mdi-arrow-left-bold-circle-outline
                  </v-icon>
                </v-list-item-icon>
              </template>
              <span>Join {{ user.name }}</span>
            </v-tooltip>
            <v-tooltip v-else left>
              <template v-slot:activator="{ on }">
                <v-list-item-icon class="mr-0">
                  <v-icon color="red" v-on="on" @click.stop="exit(user)">
                    mdi-arrow-right-bold-circle-outline
                  </v-icon>
                </v-list-item-icon>
              </template>
              <span>Exit {{ user.name }}</span>
            </v-tooltip>
          </div>
        </div>
      </v-list-item>
      <template v-slot:actions><span /></template>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="py-0">
      <v-card flat tile>
        <v-card-text>
          {{ user.id }}
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, useContext } from "nuxt-composition-api";
import { useMutation } from "@vue/apollo-composable";
import consola from "consola";
import { mutations } from "~/apollo";
import { useJoinConference, useLeaveConference } from "~/composable/useSession";
import { IUser, IRoom } from "~/types";

import { pollStore, detectionStore } from "~/store/";

export default defineComponent({
  name: "ESessionUserItem",
  props: {
    user: Object as () => IUser,
    room: Object as () => IRoom,
    currentUser: Object as () => IUser,
    role: String,
    isModerator: Boolean,
  },
  components: {
    ESessionUserItemVoteIndicator: () =>
      import("~/components/ESessionUserItemVoteIndicator.vue"),
  },
  setup({ room }) {
    const { app } = useContext();

    const { mutate: joinConference } = useJoinConference();
    const { mutate: leaveConference } = useLeaveConference();

    function join(user) {
      consola.log("join", user.id);
      joinConference({
        userId: user.id,
        roomId: room.id,
      });
    }
    const { mutate: lowerHand } = useMutation(mutations.room.lowerHand);

    function decline(user) {
      consola.log("decline", user.id);
      lowerHand({ userId: user.id, roomId: room.id });
    }

    function exit(user) {
      consola.log("exit", user.id);
      lowerHand({ userId: user.id, roomId: room.id });
      leaveConference({
        userId: user.id,
        roomId: room.id,
      });
      if (detectionStore.expressionsDetection) {
        app.$stopFaceApi();
        detectionStore.toggleExpressionsDetection();
      }
    }

    const showVoteIndicator = computed(
      () => pollStore.poll && pollStore.poll.status === "started",
    );

    return {
      join,
      decline,
      exit,
      showVoteIndicator,
    };
  },
});
</script>

<style scoped>
.full-width {
  padding: 0px !important;
}
</style>
