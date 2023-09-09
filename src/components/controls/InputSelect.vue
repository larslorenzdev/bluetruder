<template>
  <div
    class="select"
    :tabindex="tabindex"
    @click="isOpen = !isOpen"
    @blur="isOpen = false"
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
    <Transition
      name="fade"
    >
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
  tabindex?: number
}

type Emits = {
  'update:modelValue': [value: unknown]
}

const props = withDefaults(defineProps<Props>(), {
  optionLabel: undefined,
  tabindex: 0
})
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
  background-color: var(--control-background-color);
  border-radius: var(--border-radius);
  font-weight: var(--control-font-weight);
  padding: var(--control-padding);
  border: var(--control-border);
  cursor: pointer;
  width: 100%;

  &:hover, &:focus {
    background-color: var(--control-background-color-focus);
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
    width: 100%;
    background-color: rgba(52, 52, 52, 0.6);
    border-radius: var(--border-radius);
    box-shadow: 0 0 2px #000000;
    backdrop-filter: blur(6px);
    border: var(--control-border);
    padding: 0.4rem 0;
  }
  
  &__option{
    margin: 0.4rem 0.8rem;
    padding: 0.4rem 0.6rem;
    height: 1rem;
    user-select: none;
    cursor: pointer;
    border-radius: 0.4rem;
    line-height: 1rem;
    
    &:hover, &:focus {
      background-color: var(--color-accent);
      color: var(--color-accent-text);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all ease 100ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
  top: 2rem;
}
</style>