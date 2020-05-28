<template>
  <e-session-join-room-form />
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";

export default defineComponent({
  name: "Index",
  components: {
    ESessionJoinRoomForm: () => import("~/components/ESessionJoinRoomForm.vue"),
  },
});
</script>
