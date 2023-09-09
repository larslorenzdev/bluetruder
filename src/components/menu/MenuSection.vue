<template>
  <section class="menu__section">
    <div class="menu__section__header">
      <template v-if="title">
        <h2 class="menu__option__title">
          {{ title }}
        </h2>
      </template>
      <template v-if="hint">
        <span class="menu__section__hint">
          <FontAwesomeIcon :icon="['fas', 'circle-question']" />
        </span>
      </template>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

type Props = {
  title?: string
  hint?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.menu__section {
  padding: 1.5rem;
  background-color: var(--color-background);

  &:nth-last-child(2) {
    flex-grow: 1;
  }

  &:first-child {
    border-top-left-radius: var(--border-radius-large);
    border-top-right-radius: var(--border-radius-large);
  }

  &:last-child {
    border-bottom-left-radius: var(--border-radius-large);
    border-bottom-right-radius: var(--border-radius-large);
  }

  &:not(:last-child) {
    border-bottom: var(--border);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__title {
    margin: 0 0 1.8rem 0;
  }
  
  &__hint {
    cursor: help;
  }
}
</style>