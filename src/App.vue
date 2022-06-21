<template>
  <div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  beforeCreate() {
    // for-loading-overLay-true
    this.$store.dispatch("lodaing", true);
  },
  created() {
    // for-loading-overLay-false
    this.$store.dispatch("lodaing", false);
  },
  unmounted() {},
};
</script>
