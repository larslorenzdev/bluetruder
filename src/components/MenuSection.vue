<template>
  <div class="menu__section">
    <h3
      v-if="title"
      class="menu__section__title"
    >
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
type Props = {
  title?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.menu__section {
  padding: 1.5rem;
  background-color: rgba(0, 0, 0,0.75);
  
  &__title {
    margin: 0 0 1.5rem;
    font-weight: 600;
    font-size: 1rem;
  }
}
</style>