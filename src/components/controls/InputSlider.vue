<template>
  <div class="slider">
    <input
      v-model.number="model"
      type="number"
      class="slider__input"
      :step="step"
      :min="min"
      :max="max"
    >
    <input
      v-model.number="model"
      class="slider__range"
      type="range"
      :min="min"
      :max="max"
      :step="step"
    >
  </div>
</template>

<script setup lang="ts">
import {shallowRef, watch} from "vue";

type Props = {
  min?: number
  max?: number
  step?: number
  modelValue?: number
}

type Emits = {
  'update:modelValue': [value: unknown]
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  modelValue: 0
})
const emit = defineEmits<Emits>()
const model = shallowRef(props.modelValue)

watch(() => props.modelValue, (value) => {
  model.value = value
})

watch(model, (value) => {
  emit('update:modelValue', value)
})
</script>

<style lang="scss" scoped>
.slider {
  width: 100%;
  display: flex;
  gap: 1rem;
  box-sizing: border-box;

  &__range {
    width: 100%;
  }

  &__input {
    background-color: var(--control-background-color);
    border-radius: var(--border-radius);
    font-weight: var(--control-font-weight);
    padding: var(--control-padding);
    border: var(--control-border);
    color: var(--color-text);
    width: 3rem;
  }
}

</style>