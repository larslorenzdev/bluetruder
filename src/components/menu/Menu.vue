<template>
  <div class="container">
    <div class="menu">
      <slot />
    </div> 
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.container {
  border: solid 1px rgba(255,255,255,0.1);
  border-radius: 1.2rem;
  overflow: hidden;
  width: 20rem;
  height: 100%;
}

.menu {
  height: 100%;
  backdrop-filter: blur(1rem);
  color: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  
  :deep(.menu__section:not(:last-child)) {
    border-bottom: solid 1px rgba(255,255,255,0.1);
  }

  :nth-last-child(2) {
    flex-grow: 1;
  }
}
</style>