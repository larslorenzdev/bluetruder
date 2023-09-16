<template>
  <div
    class="file-input"
    :tabindex="tabindex"
    @click="onFileSelect"
  >
    <span>{{ label }}</span>
    <input
      ref="inputElement"
      type="file"
      :accept="accept"
    >
  </div>
</template>

<script setup lang="ts">
import {shallowRef, watch} from "vue";

type Props = {
  accept?: string
  label?: string
  modelValue?: File
  tabindex?: number
}

type Emits = {
  'update:modelValue': [value: File]
}

const props = withDefaults(defineProps<Props>(), {
  tabindex: 0,
  modelValue: undefined,
  accept: undefined,
  label: undefined
})
const emit = defineEmits<Emits>()

const inputElement = shallowRef<HTMLInputElement>()
const model = shallowRef(props.modelValue)

function onFileSelect() {
  inputElement.value?.addEventListener('input', (e) => {
    const element = e.target as HTMLInputElement

    if (element.files && element.files[0]) {
      emit('update:modelValue', element.files[0])
    }
  })

  inputElement.value?.dispatchEvent(new MouseEvent('click'));
}

watch(() => props.modelValue, (value) => {
  model.value = value
})

</script>

<style lang="scss" scoped>
.file-input {
  padding: var(--control-padding);
  background-color: var(--control-background-color);
  border-radius: var(--border-radius);
  border: var(--control-border);
  text-align: center;
  cursor: pointer;
  font-weight: var(--control-font-weight);
  width: 100%;
  box-sizing: border-box;

  &:hover, &:focus {
    background-color: var(--control-background-color-focus);
  }

  input {
    display: none;
  }
}
</style>