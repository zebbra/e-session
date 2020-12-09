<template>
  <v-container>
    <v-row class="mb-5">
      <e-session-tenant-logo class="mx-auto" />
    </v-row>
    <v-row>
      <v-col class="text-center hoverBlock">
        <v-btn class="mr-2" light to="/parl/speaker">
          join as the Speaker
        </v-btn>
        <v-btn light to="/parl/member">
          join as a Member
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";
export default defineComponent({
  name: "Index",
  components: {
    ESessionTenantLogo: () =>
      import("~/components/parl/ESessionTenantLogo.vue"),
  },
});
</script>
<style scoped>
.hoverBlock {
  position: relative;
  top: -300px;
  z-index: 2;
}
</style>
