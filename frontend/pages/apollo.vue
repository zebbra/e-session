<template>
  <v-card :loading="loading">
    <v-card-title>Apollo Examples</v-card-title>
    <v-card-text>
      <section>
        <span>User: {{ user }} </span>
        <v-btn small @click="changeUser">Toggle User</v-btn>
      </section>
      <section v-if="room">Room: {{ room }}</section>
      <section v-if="!room">
        Room: Room was not found
      </section>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, useMeta, reactive } from "nuxt-composition-api";
import { useResult } from "@vue/apollo-composable";
import { fetchUserAndRoom } from "~/composable/useUserAndRoom";

export default defineComponent({
  name: "ApolloExample",
  head: {},
  setup() {
    useMeta({ title: "Apollo Example " });

    const variables = reactive({
      id: 100,
      name: "Example Name",
    });

    const { result, loading } = fetchUserAndRoom(variables);
    const user = useResult(result, null, (data) => data.user);
    const room = useResult(result, null, (data) => data.room);

    function changeUser() {
      if (variables.id === 100) {
        variables.id = 200;
      } else {
        variables.id = 100;
      }
    }

    return {
      user,
      room,
      loading,
      changeUser,
    };
  },
});
</script>
