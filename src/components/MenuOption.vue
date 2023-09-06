<template>
  <div class="menu__option">
    <div class="menu__option__title">
      {{ title }}
    </div>
    <div class="menu__option__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  title: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.menu__option {
  display: flex;
  align-items: center;
  
  &__title {
    width: 30%;
    font-size: 0.8rem;
    font-weight: 500;
    color: #666666;
    
  }
  
  &__content {
    width: 70%;
  }
}
</style>