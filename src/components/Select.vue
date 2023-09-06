<template>
  <div
    class="select"
    @click="isOpen = !isOpen"
  >
    <template v-if="optionLabel">
      {{ model[optionLabel] }}
    </template>
    <template v-else>
      {{ model }}
    </template>
    <template v-if="isOpen">
      <div>
        <div
          v-for="(option, index) in options"
          :key="index"
          @click="onValueSelect"
        >
          <template v-if="optionLabel">
            {{ option[optionLabel] }}
          </template>
          <template v-else>
            {{ option }}
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {shallowRef} from "vue";

type Props = {
  options: any[]
  modelValue: any
  optionLabel?: string
  optionValue?: string
}

type Emits = {
  'update:modelValue': [value: unknown]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = shallowRef(false)
const model = shallowRef(props.modelValue)

function onValueSelect(value: any) {
  if (props.optionValue) {
    emit('update:modelValue', value[props.optionValue])
  } else {
    emit('update:modelValue', value)
  }
}
</script>

<style lang="scss" scoped>
.select {
  color: white;
  background-color: #343434;
  border-radius: 0.4rem;
  padding: 0.8rem 1.2rem;
  font-weight: 600;
  font-size: 0.8rem;
}
</style>