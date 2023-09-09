<template>
  <div
    class="file-input"
    :tabindex="tabindex"
    @click="onFileSelect"
  >
    <span v-if="fileName">{{ fileName }}</span>
    <span v-else>{{ label }}</span>
    <input
      ref="inputElement"
      type="file"
      :accept="accept"
    >
  </div>
</template>

<script setup lang="ts">
import {computed, shallowRef, watch} from "vue";

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
const fileName = computed(() => model.value?.name)

function onFileSelect() {
  inputElement.value?.addEventListener('input',(e) => {
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
.file-input{
  padding: 0.8rem 1.2rem;
  height: 1rem;
  background-color: #3a3a3a;
  border-radius: 0.4rem;
  line-height: 1rem;
  font-size: 0.8rem;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: orangered;
    color: black;
  }
  
  input{
    display: none;
  }
}
</style>