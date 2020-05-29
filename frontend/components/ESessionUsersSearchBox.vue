<template>
  <v-card>
    <v-card-text>
      <v-form @submit.prevent>
        <v-text-field
          v-model="filter"
          filled
          placeholder="Filter Users"
          type="text"
          class="message-input"
          append-outer-icon="mdi-account-search"
          hide-details
          @input="emitToParent"
        >
        </v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "nuxt-composition-api";

export default defineComponent({
  name: "ESessionUsersSearchBox",
  setup(_, { emit }) {
    const filter = ref("");

    function emitToParent() {
      emit("onUsersFiltered", filter.value);
    }

    return {
      filter,
      emitToParent,
    };
  },
});
</script>
