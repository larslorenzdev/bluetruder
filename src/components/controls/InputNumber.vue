<template>
  <div class="input-number">
    <input
      v-model.number="model"
      class="input-number__input"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      @input="preventInput"
    >
    <div
      v-if="suffix"
      class="input-number__suffix"
    >
      <slot name="suffix">
        {{ suffix }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {shallowRef, watch} from "vue";

type Props = {
  min?: number
  max?: number
  step?: number
  modelValue?: number
  suffix?: string
}

type Emits = {
  'update:modelValue': [value: number]
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  modelValue: 0,
  suffix: undefined
})
const emit = defineEmits<Emits>()
const model = shallowRef(props.modelValue)

function preventInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value);

  console.log(value)

  if (isNaN(value) || value < props.min) {
    model.value = props.min;
  } else if (value > props.max) {
    model.value = props.max;
  }
}

watch(() => props.modelValue, (value) => {
  model.value = value
})

watch(model, (value) => {
  emit('update:modelValue', value)
})
</script>

<style lang="scss" scoped>
.input-number {
  position: relative;
  width: 100%;
  box-sizing: border-box;

  &__suffix {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 1rem;
  }

  &__input {
    background-color: var(--control-background-color);
    border-radius: var(--border-radius);
    font-weight: var(--control-font-weight);
    padding: var(--control-padding);
    border: var(--control-border);
    color: var(--color-text);
    width: 100%;
    line-height: 1rem;
    box-sizing: border-box;
    height: 100%;

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type=number] {
      -moz-appearance: textfield;
    }
  }
}
</style>