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
              item-value="url"
              v-model="configuration.modelUrl"
          />
          <v-file-input label="Icon" accept=".svg"/>
        </v-form>

        <v-btn @click="onDownloadClick">Download</v-btn>
      </v-container>
    </v-navigation-drawer>
    
    <v-main>
      <Canvas v-if="configuration" :configuration="configuration"/>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { reactive} from 'vue'
import {useCanvasService} from "@/components/canvas/canvasService";
import Canvas, {type CanvasConfiguration} from "@/components/canvas/Canvas.vue";
import {downloadBlob} from '@/utils'
import defaultModelUrl from "@/assets/model.stl?url";
import defaultSvgUrl from "@/assets/print-solid.svg?url";



const {exportStl} = useCanvasService()
const configuration = reactive<CanvasConfiguration>({
  modelUrl: defaultModelUrl,
  svg: defaultSvgUrl
})

const models = [{
  label: 'Default Model',
  url: defaultModelUrl
}]

function onDownloadClick(){
  downloadBlob(exportStl(), 'model.stl')
}
</script>
