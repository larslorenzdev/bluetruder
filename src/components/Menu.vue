<template>
  <aside class="menu">
    <slot/>
  </aside>
</template>

<script setup lang="ts">

</script>

<style scoped>
.menu {
  border-radius: 2rem;
  backdrop-filter: blur(12px);
  padding: 1rem;
  position: fixed;
  top: 2rem;
  right: 2rem;
  bottom: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  width: 20rem;
}
</style>