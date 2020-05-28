<template>
  <v-container>
    <v-card class="mx-auto" max-width="600" outlined>
      <v-card-title>
        <h1 v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </h1>
        <h1 v-else>
          {{ otherError }}
        </h1>
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" outlined nuxt to="/">Home page</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
export default {
  name: "ErrorLayout",
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    };
  },
  head(this: any) {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
