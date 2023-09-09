<template>
  <div class="bar">
    <div class="bar__container">
      <span
        class="bar__burger-menu"
        @click="emit('toggle')"
      >
        <FontAwesomeIcon :icon="['fas', 'bars']" />
      </span>
      <span class="bar__title">Label Generator</span>
    </div>
    <span class="bar__hint">
      by
      <a 
        target="_blank"
        href="https://larslorenz.dev"
      >larslorenz.dev 
      </a>
    </span>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

type Emits = {
  'toggle': []
}

const emit = defineEmits<Emits>()
</script>

<style lang="scss" scoped>
.bar {
  height: 2rem;
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  gap: 1rem;
  box-shadow: var(--shadow);
  border: var(--border);
  border-radius: var(--border-radius-large);
  
  &__burger-menu {
    cursor: pointer;
  }
  
  &__container {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
      height: 1.4rem;
      width: 1.4rem;
    }
  }
  
  &__title {
    font-size: 1.4rem;
  }
  
  &__hint {
    font-weight: 500;
    color: var(--color-text-secondary);
    
    a {
      @extend .bar__hint
    }
  }
}
</style>