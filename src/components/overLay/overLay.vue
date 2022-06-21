<template>
  <div class="loading-overlay">
    <span class="fas fa-spinner fa-3x fa-spin text-white"></span>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.loading-overlay {
  display: flex;
  background: rgb(108 117 125 / 79%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9999999;
  height: 100vh;
  align-items: center;
  justify-content: center;
}
.code {
  font-family: monospace;
  /*   font-size: .9em; */
  color: white !important;
  background-color: rgb(238, 238, 238);
  padding: 0 3px;
}
</style>
