<template>
  <v-app>
    <v-navigation-drawer>
      <h1>Configuration</h1>

      <v-container class="d-flex flex-column justify-space-between">
        <v-form>
          <v-select
              label="Model"
              :items="models"
              item-title="label"
              v-model="model"
              return-object
          />
          <v-file-input @change="onImageSelect" label="Icon" accept=".svg"/>
        </v-form>

        <v-btn @click="onDownloadClick">Download</v-btn>
      </v-container>
    </v-navigation-drawer>
    
    <v-main>
      <Canvas :configuration="configuration" :svg-url="svgUrl"/>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {type CanvasConfiguration, useCanvasService} from "@/components/canvas/canvasService";
import Canvas from "@/components/canvas/Canvas.vue";
import {downloadBlob} from '@/utils'
import hookModelUrl from "@/assets/hook_simple.stl?url";
// import defaultModelUrl from "@/assets/model.stl?url";
import testModelUrl from "@/assets/test.stl?url";
import defaultSvgUrl from "@/assets/print-solid.svg?url";

type Model = {
  label: string
  configuration: CanvasConfiguration
}

const models: Model[] = [{
  label: 'Default Model',
  configuration: {
    modelUrl: hookModelUrl,
    rotationX: 90,
    rotationY: 0,
    rotationZ: 180,
    iconOffsetX: 0,
    iconOffsetY: 0,
    iconScale: 0.3,
    iconDepth: 0.4
  }
}, {
  label: 'Test Model',
  configuration: {
    modelUrl: testModelUrl,
    rotationX: 90,
    rotationY: 90,
    rotationZ: 90,
    iconOffsetX: 0,
    iconOffsetY: 0,
    iconScale: 1,
    iconDepth: 0.4
  }
}]

const {exportStl} = useCanvasService()
const model = ref<Model>(models[0])
const svgUrl = ref(defaultSvgUrl)
const configuration = computed(() => model.value.configuration)

function onImageSelect(event: InputEvent) {
  const element = event.target as HTMLInputElement
  
  if (element.files && element.files.length > 0) {
    const file = element.files[0];
    const reader = new FileReader();
    
    reader.addEventListener('load', () => {
      svgUrl.value = reader.result as string
    });

    reader.readAsDataURL(file);
  }
}

function onDownloadClick(){
  downloadBlob(exportStl(), 'model.stl')
}
</script>
