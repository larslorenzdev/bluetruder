<template>
  <div
    ref="element"
    class="container"
  />
</template>

<script setup lang="ts">
import {watch} from "vue";
import {storeToRefs} from "pinia";
import {useConfigurationStore} from "@/stores/configurationStore.ts";
import {useModelStore} from "@/stores/model-store/modelStore.ts";

const {activeConfiguration, iconUrl} = storeToRefs(useConfigurationStore())
const modelStore = useModelStore()
const {element} = storeToRefs(modelStore)

watch(activeConfiguration, async (value) => {
  await modelStore.setBaseModel(value.baseModelUrl, activeConfiguration.value)
}, {immediate: true})

watch(iconUrl, async (value) => {
  await modelStore.setIconModel(value)
}, {immediate: true} )
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>