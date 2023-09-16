<template>
  <div class="zoom">
    <Button
      label="-"
      class="zoom__button"
      @click="onSubtract"
    />
    <InputNumber
      v-model.number="model"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      class="zoom__input"
      suffix="%"
    />
    <Button
      label="+"
      class="zoom__button"
      @click="onAdd"
    />
  </div>
</template>

<script setup lang="ts">
import {shallowRef, watch} from "vue";
import Button from "@/components/controls/Button.vue";
import InputNumber from "@/components/controls/InputNumber.vue";

type Props = {
  min?: number
  max?: number
  step?: number
  modelValue?: number
}

type Emits = {
  'update:modelValue': [value: number]
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 1,
  step: 1,
  modelValue: 1
})
const emit = defineEmits<Emits>()
const model = shallowRef(props.modelValue)

function onAdd() {
  if (model.value + props.step < props.max) {
    model.value += props.step
  } else {
    model.value = props.max
  }
}

function onSubtract() {
  if (model.value - props.step > props.min) {
    model.value -= props.step
  } else {
    model.value = props.min
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
.zoom {
  display: flex;
  gap: 0.4rem;
  width: 12.5rem;
  height: 3.2rem;

  &__input {
    flex-grow: 1;
  }

  &__button {
    width: 3rem;
    box-sizing: content-box;
  }
}
</style>