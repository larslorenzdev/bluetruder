<template>
  <div class="container" ref="container"/>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {Configuration, useCanvasService} from "@/components/canvas/canvasService.ts";

export type ModelConfiguration = {
  url: string
  configuration: Configuration
}

type Props = {
  base: ModelConfiguration
  icon: ModelConfiguration
}

const props = defineProps<Props>()
const {init, setBaseModel, setIconModel} = useCanvasService(false)
const container = ref()

onMounted(async () => {
  init(container.value)
  await setBaseModel(props.base.url, props.base.configuration)
  await setIconModel(props.icon.url, props.icon.configuration)
})

watch(() => props.base, async (value) => {
  await setBaseModel(value.url, value.configuration)
}, {deep: true})

watch(() => props.icon, async (value) => {
  await setIconModel(value.url, value.configuration)
}, {deep: true})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>