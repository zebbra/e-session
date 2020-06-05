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
          @input="$emit('onUsersFiltered', filter)"
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
  setup() {
    const filter = ref("");

    return {
      filter,
    };
  },
});
</script>
