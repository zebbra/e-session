/* eslint-disable prettier/prettier */
<template>
  <img alt="Logo" src="/bundeshaus.png" style="width: 90%; opacity: 60%;" />
</template>

<script lang="ts">
import { defineComponent } from "nuxt-composition-api";

export default defineComponent({
  name: "ESessionTenantLogo",
  head: {},
  /* components: {
    TenantLogo: () => import("~/static/tenant-logo.svg"),
  }, */
});
</script>
