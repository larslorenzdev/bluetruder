<template>
  <div class="menu">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.menu {
  border: var(--border);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow);
  width: 22rem;
  height: 100%;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
  }
}
</style>