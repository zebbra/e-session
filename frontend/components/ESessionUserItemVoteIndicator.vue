<template>
  <div>
    <div
      class="pa-2 mr-3 circle d-inline-block"
      :class="voteIndicatorClass"
    ></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "nuxt-composition-api";
import { roomStore } from "~/store";
import { IUser } from "~/types";

export default defineComponent({
  name: "ESessionUserItemVoteIndicator",
  props: {
    user: Object as () => IUser,
  },
  setup({ user }) {
    const userRef = computed(() => {
      return roomStore.room.users.filter((item) => item.id === user.id)[0];
    });

    const voteIndicatorClass = computed(() => {
      if (userRef.value) {
        if (userRef.value.vote === "yes") {
          return "yes-vote";
        } else if (userRef.value.vote === "no") {
          return "no-vote";
        } else if (userRef.value.vote === "abstain") {
          return "abstain-vote";
        } else {
          return "did-not-vote";
        }
      } else {
        return "did-not-vote";
      }
    });

    return {
      voteIndicatorClass,
    };
  },
});
</script>

<style scoped>
.circle {
  border-radius: 50%;
}
.yes-vote {
  background-color: green;
  box-shadow: 0px 0px 6px 2px green;
}
.no-vote {
  background-color: red;
  box-shadow: 0px 0px 6px 2px red;
}
.abstain-vote {
  background-color: cyan;
  box-shadow: 0px 0px 6px 2px cyan;
}
.did-not-vote {
  background-color: gray;
}
</style>
