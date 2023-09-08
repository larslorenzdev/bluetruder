<template>
  <div
    class="select"
    @click="isOpen = !isOpen"
  >
    <div class="select__value">
      <template v-if="optionLabel">
        {{ model[optionLabel] }}
      </template>
      <template v-else>
        {{ model }}
      </template>
      <FontAwesomeIcon :icon="['fas', isOpen ? 'caret-up' : 'caret-down']" />
    </div>
    <Transition>
      <div
        v-if="isOpen"
        class="select__options"
      >
        <div
          v-for="(option, index) in options"
          :key="index"
          class="select__option"
          @click="onValueSelect(option)"
        >
          <template v-if="optionLabel">
            {{ option[optionLabel] }}
          </template>
          <template v-else>
            {{ option }}
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {shallowRef, watch} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

type Props = {
  options: any[]
  modelValue: any
  optionLabel?: string
}

type Emits = {
  'update:modelValue': [value: unknown]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = shallowRef(false)
const model = shallowRef(props.modelValue)

function onValueSelect(value: any) {
  emit('update:modelValue', value)
}

watch(() => props.modelValue, (value) => {
  model.value = value
})
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  color: white;
  background-color: #343434;
  border-radius: 0.4rem;
  padding: 0.8rem 1.2rem;
  font-weight: 600;
  font-size: 0.8rem;
  height: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #1e1e1e;
  }
  
  &__value {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  &__options{
    position: absolute;
    top: 2.6rem;
    right: 0;
    max-height: 10rem;
    width: 100%;
    background-color: #343434;
    border-radius: 0.4rem;
    overflow-y: scroll;
    box-shadow: 0 0 2px #000000;
  }
  
  &__option{
    padding: 0.8rem 1.2rem;
    background-color: #343434;
    height: 1rem;
    user-select: none;
    cursor: pointer;
    
    &:hover {
      background-color: #1e1e1e;
    }
  }
}
</style>