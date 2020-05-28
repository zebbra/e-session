<template>
  <section>
    <v-card>
      <v-card-text v-if="room">
        <v-text-field  v-model="userFilter" placeholder="Filter" solo />
        <v-list v-for="(user, index) in room.users" :key="index">
          {{ user.name }}
        </v-list>
      </v-card-text>
      <v-card-text v-else>
        Join room first
      </v-card-text>
    </v-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "nuxt-composition-api";
import { sessionStore, moderationStore } from "~/store";

export default defineComponent({
  name: "ESessionUserList",

  setup() {
    console.log("Setup ESessionChat")
    const room = computed(() => moderationStore.room);
    const userListActivated = computed(() => room.value != null)
    const userFilter = ref("")

    return{
      room,
      userFilter
    }
  }
});
</script>
