<template>
  <aside class="container">
    <div class="menu">
      <slot />
    </div> 
  </aside>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.container {
  border: solid 1px rgba(255,255,255,0.1);
  border-radius: 1.2rem;
  overflow: hidden;
  width: 20rem;
}

.menu {
  height: 100%;
  backdrop-filter: blur(12px);
  color: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  
  :deep(.menu__section:not(:last-child)) {
    border-bottom: solid 1px rgba(255,255,255,0.1);
  }

  :nth-last-child(2) {
    flex-grow: 1;
  }
}
</style>