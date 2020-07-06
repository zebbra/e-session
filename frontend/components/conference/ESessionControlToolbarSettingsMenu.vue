<template>
  <div class="text-center">
    <v-menu offset-y top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn tile large v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <!-- <v-list-item-title>{{ item.title }}</v-list-item-title> -->
      <v-list dense>
        <v-list-item v-for="(item, i) in items" :key="i" @click="menuSelection">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <v-btn tile large> <v-icon>mdi-cog</v-icon> Settings</v-btn>
      <v-btn tile large> <v-icon>mdi-fullscreen</v-icon> Fullscreen</v-btn> -->
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "nuxt-composition-api";
import consola from "consola";

export default defineComponent({
  name: "ESessionControlToolbarSettingsMenu",

  setup() {
    const items = ref([
      { text: "Settings", icon: "mdi-cog" },
      { text: "Fullscreen", icon: "mdi-fullscreen" },
      { text: "Hide Background", icon: "mdi-blur" },
      { text: "Toggle Grid", icon: "mdi-grid" },
    ]);

    function menuSelection() {
      consola.log("select");
    }
    return {
      menuSelection,
      items,
    };
  },
});
</script>

<style></style>
