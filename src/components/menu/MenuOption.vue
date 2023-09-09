<template>
  <div class="menu__option">
    <label
      :for="id"
      class="menu__option__title"
    >
      {{ title }}
    </label>
    <slot :id="id" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  title: string
}

defineProps<Props>()

const id = `${Math.random() * 10000}`
</script>

<style lang="scss" scoped>
.menu__option {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  &__title {
    width: 10rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }
}
</style>