<template>
  <div class="tooltip">
    <div class="tooltip__icon">
      <FontAwesomeIcon :icon="['fas', 'circle-info']" />
    </div>
    <div class="tooltip__content">
      You can also just drop an svg file onto the model.
    </div>
  </div>
</template>

<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
</script>

<style lang="scss" scoped>
.tooltip {
  height: 4rem;
  width: 4rem;
  background-color: var(--color-background);
  border-radius: var(--border-radius-large);
  transition: all ease 300ms;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow);

  &:hover {
    width: 20rem;
  }

  &__icon {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.2rem;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, var(--color-background) 20%, var(--color-background) 100%);
    z-index: 1;

    svg {
      width: 1.6rem;
      height: 1.6rem;
    }
  }

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 1rem;
    line-height: 1rem;
    width: 15rem;
    height: 2rem;
  }
}
</style>