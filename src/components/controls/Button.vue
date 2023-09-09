<template>
  <button>{{ label }}</button>
</template>

<script lang="ts" setup>
type Props = {
  label?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
button {
  background-color: var(--control-background-color);
  border: var(--control-border);
  border-radius: var(--border-radius);
  padding: var(--control-padding);
  font-weight: var(--control-font-weight);

  &:hover, &:focus {  
    background-color: var(--color-accent);
    color: var(--color-accent-text);
  }
}
</style>