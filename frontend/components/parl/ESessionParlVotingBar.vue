<template>
  <div>
    <v-btn
      tile
      large
      :color="vote.yes ? 'green' : ''"
      @click.stop="checkAndVoteYes"
    >
      <v-icon :color="vote.yes ? 'white' : 'green'">
        mdi-thumb-up
      </v-icon>
    </v-btn>
    <v-btn
      tile
      large
      :color="vote.no ? 'red' : ''"
      @click.stop="checkAndVoteNo"
    >
      <v-icon :color="vote.no ? 'white' : 'red'">
        mdi-thumb-down
      </v-icon>
    </v-btn>
    <v-btn
      tile
      large
      :color="vote.abstain ? 'cyan' : ''"
      @click.stop="checkAndVoteAbs"
    >
      <v-icon :color="vote.abstain ? 'white' : 'cyan'">
        mdi-thumbs-up-down
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
// import consola from "consola";
// import Vue from "vue";
import { pollStore, sessionStore } from "~/store";
import { useOnPollUpdate, useVote, useDidNotVote } from "~/composable/usePoll";

export default defineComponent({
  name: "ESessionParlVotingBar",

  setup() {
    const pollRef = computed(() => pollStore.poll);

    useOnPollUpdate(pollRef.value);

    const userRef = computed(() => sessionStore.user);

    const { mutate: voteYes } = useVote(
      pollStore.poll.id,
      sessionStore.user.id,
      "yes",
    );
    const { mutate: voteNo } = useVote(
      pollStore.poll.id,
      sessionStore.user.id,
      "no",
    );
    const { mutate: voteAbs } = useVote(
      pollStore.poll.id,
      sessionStore.user.id,
      "abstain",
    );

    const { mutate: didNotVote } = useDidNotVote(
      pollStore.poll.id,
      sessionStore.user.id,
    );

    didNotVote();

    function checkAndVoteYes() {
      if (pollStore.poll.yes.includes(sessionStore.user.id)) {
        didNotVote();
      } else {
        voteYes();
      }
    }

    function checkAndVoteNo() {
      if (pollStore.poll.no.includes(sessionStore.user.id)) {
        didNotVote();
      } else {
        voteNo();
      }
    }

    function checkAndVoteAbs() {
      if (pollStore.poll.abstain.includes(sessionStore.user.id)) {
        didNotVote();
      } else {
        voteAbs();
      }
    }

    const vote = computed(() => {
      return {
        yes: pollStore.poll.yes
          ? pollStore.poll.yes.includes(userRef.value.id)
          : false,
        no: pollStore.poll.no
          ? pollStore.poll.no.includes(userRef.value.id)
          : false,
        abstain: pollStore.poll.abstain
          ? pollStore.poll.abstain.includes(userRef.value.id)
          : false,
      };
    });

    return {
      checkAndVoteYes,
      checkAndVoteNo,
      checkAndVoteAbs,
      vote,
    };
  },
});
</script>

<style></style>
