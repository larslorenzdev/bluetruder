<template>
  <div class="container" ref="container"/>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {CanvasConfiguration, useCanvasService} from "@/components/canvas/canvasService.ts";

type Props = {
  configuration: CanvasConfiguration
  svgUrl: string
}

const props = defineProps<Props>()
const {init, setConfiguration, setIconSvg} = useCanvasService()
const container = ref()

onMounted(() => {
  init(container.value)
  setConfiguration(props.configuration)
  setIconSvg(props.svgUrl)
})

watch(() => props.configuration, (value) => {
  setConfiguration(value)
})

watch(() => props.svgUrl, (value) => {
  setIconSvg(value)
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>