<template>
  <h1 class="menu__header">
    {{ title }}
  </h1>
</template>

<script setup lang="ts">
type Props = {
  title: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.menu__header {
  font-weight: 400;
  font-size: 1.2rem;
  margin: 0;
  
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>