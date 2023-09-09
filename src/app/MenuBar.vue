<template>
  <div class="header">
    <div class="container">
      <span
        class="toggle"
        @click="emit('toggle')"
      >
        <FontAwesomeIcon :icon="['fas', 'bars']" />
      </span>
      <span class="title">Label Generator</span>
    </div>
    <span class="hint">by Lars Lorenz</span>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

type Emits = {
  'toggle': []
}

const emit = defineEmits<Emits>()
</script>

<style scoped>
.header {
  height: 2rem;
  background-color: #000000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  gap: 1rem;
  border-radius: 1rem;
  
  .toggle {
    cursor: pointer;
  }
  
  .container {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
      height: 1.5rem;
      width: 1.5rem;
    }
    
    .title {
      font-size: 1.2rem;
      font-weight: 700;
    }
  }
  
  .hint {
    font-size: 0.8rem;
    font-weight: 500;
    color: #666666;
  }
}
</style>