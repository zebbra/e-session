<template>
  <div>
    <pie-chart :chart-data="data"></pie-chart>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "nuxt-composition-api";
// import consola from "consola";
// import Vue from "vue";
import { pollStore } from "~/store";

export default defineComponent({
  name: "ESessionParlVotingBar",
  components: {
    PieChart: () => import("~/utils/PieChart"),
  },
  setup() {
    const pollRef = computed(() => pollStore.poll);
    const data = computed(() => {
      return {
        labels: ["yes", "no", "abstain"],
        datasets: [
          {
            label: "Result",
            backgroundColor: ["green", "red", "cyan"],
            data: [
              pollStore.poll.yes.length,
              pollStore.poll.no.length,
              pollStore.poll.abstain.length,
            ],
            borderColor: "gray",
          },
        ],
      };
    });

    return {
      poll: pollRef,
      data,
    };
  },
});
</script>

<style></style>
