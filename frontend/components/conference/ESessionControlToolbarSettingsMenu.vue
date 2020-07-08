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
        <v-list-item
          v-for="(item, i) in items"
          :id="item.id"
          :key="i"
          @click="menuSelection"
        >
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
import { openFullscreen, closeFullscreen } from "~/utils/helpers";

export default defineComponent({
  name: "ESessionControlToolbarSettingsMenu",

  setup() {
    const items = ref([
      { text: "Settings", icon: "mdi-cog", id: "SHOW_SETTINGS" },
      { text: "Fullscreen", icon: "mdi-fullscreen", id: "TOGGLE_FULLSCREEN" },
      /* { text: "Hide Background", icon: "mdi-blur" }, */
      { text: "Toggle Grid", icon: "mdi-grid", id: "TOGGLE_GRID" },
      /* { text: "Record Session", icon: "mdi-record" }, */
    ]);
    const appIsFullscreen = ref(false);

    function menuSelection(event: any) {
      switch (event.target.id) {
        case "SHOW_SETTINGS":
          consola.log("SHOW_SETTINGS");
          break;
        case "TOGGLE_FULLSCREEN":
          if (appIsFullscreen.value) {
            closeFullscreen(document);
          } else {
            openFullscreen(document.body);
            document.body.onfullscreenchange = handleFullscreenChange;
          }
          break;
        case "TOGGLE_GRID":
          consola.log("TOGGLE_GRID");
          break;
        default:
          consola.log("DEFAULT");
      }
    }

    function handleFullscreenChange(event) {
      const elem = event.target;
      const isFullscreen = document.fullscreenElement === elem;
      if (isFullscreen) {
        // consola.log("Full start");
        appIsFullscreen.value = true;
      } else {
        // consola.log("Full end");
        appIsFullscreen.value = false;
      }
    }

    return {
      menuSelection,
      items,
    };
  },
});
</script>

<style></style>
