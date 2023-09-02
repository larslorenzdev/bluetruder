<template>
  <div class="container" ref="container"/>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useCanvasService} from "@/components/canvas/canvasService.ts";

export type CanvasConfiguration = {
  modelUrl: string
  svg: string
}

type Props = {
  configuration: CanvasConfiguration
}

const props = defineProps<Props>()
const {init, setBaseModel, setIconSvg} = useCanvasService()
const container = ref()

onMounted(() => {
  init(container.value)
  setBaseModel(props.configuration.modelUrl)
  setIconSvg(props.configuration.svg)
})

watch(() => props.configuration, (value) => {
  setBaseModel(value.modelUrl)
  setIconSvg(value.svg)
},{deep: true})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>