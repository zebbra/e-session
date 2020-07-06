<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn tile large v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <!-- <v-list-item-title>{{ item.title }}</v-list-item-title> -->
      <v-btn tile large> <v-icon>mdi-cog</v-icon> Settings</v-btn>
      <v-btn tile large> <v-icon>mdi-fullscreen</v-icon> Fullscreen</v-btn>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";
import { conferenceStore } from "~/store";

export default defineComponent({
  name: "ESessionControlToolbarSettingsMenu",

  setup() {
    function confirm() {
      conferenceStore.showSetup(false);
    }
    return {
      confirm,
    };
  },
});
</script>

<style></style>
