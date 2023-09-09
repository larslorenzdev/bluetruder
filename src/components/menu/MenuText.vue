<template>
  <p class="menu__text">
    {{ text }}
  </p>
</template>

<script setup lang="ts">
type Props = {
  text: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.menu__text {
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
  font-weight: 400;
  margin: 0;
}
</style>