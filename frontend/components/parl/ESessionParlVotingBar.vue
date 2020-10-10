<template>
  <div>
    <v-btn tile large :color="vote.yes ? 'green' : ''" @click.stop="voteYes">
      <v-icon :color="vote.yes ? 'white' : 'green'">
        mdi-thumb-up
      </v-icon>
    </v-btn>
    <v-btn tile large :color="vote.no ? 'red' : ''" @click.stop="voteNo">
      <v-icon :color="vote.no ? 'white' : 'red'">
        mdi-thumb-down
      </v-icon>
    </v-btn>
    <v-btn tile large :color="vote.abstain ? 'cyan' : ''" @click.stop="voteAbs">
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
import { useOnPollUpdate, useVote } from "~/composable/usePoll";

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
      voteYes,
      voteNo,
      voteAbs,
      vote,
    };
  },
});
</script>

<style></style>
