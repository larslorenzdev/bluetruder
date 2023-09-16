<template>
  <div class="menu__option">
    <label
      :for="id"
      class="menu__option__title"
    >
      {{ title }}
    </label>
    <div class="menu__option__content">
      <slot :id="id" />
    </div>
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

  &__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__title {
    display: block;
    width: 8rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }
}
</style>