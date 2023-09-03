<template>
  <v-app>
    <v-navigation-drawer>
      <h1>Configuration</h1>

      <v-container class="d-flex flex-column justify-space-between">
        <v-form>
          <v-select
              label="Model"
              :items="baseModelConfigurations"
              item-title="label"
              item-value="model"
              v-model="baseModelConfiguration"
          />
          <v-file-input @change="onImageSelect" label="Icon" accept=".svg"/>
        </v-form>

        <v-btn @click="onDownloadClick">Download</v-btn>
      </v-container>
    </v-navigation-drawer>
    
    <v-main>
      <Canvas :base="baseModelConfiguration" :icon="iconModelConfiguration" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref} from 'vue'
import { useCanvasService} from "@/components/canvas/canvasService";
import Canvas, {type ModelConfiguration} from "@/components/canvas/Canvas.vue";
import {downloadBlob} from '@/utils'
import hookModelUrl from "@/assets/hook_simple.stl?url";
import defaultSvgUrl from "@/assets/print-solid.svg?url";

type ModelOption = {
  label: string
  model: ModelConfiguration
}

const baseModelConfigurations: ModelOption[] = [{
  label: 'Default Model',
  model: {
    url: hookModelUrl,
    configuration: {
      rotationX: -90,
    }
  }
}]

const {exportStl} = useCanvasService()
const baseModelConfiguration = ref<ModelConfiguration>(baseModelConfigurations[0].model)
const iconModelConfiguration = ref<ModelConfiguration>({
  url: defaultSvgUrl,
  configuration: {
    rotationX: 90,
    offsetZ: 15,
    scale: 0.3
  }
})

function onImageSelect(event: InputEvent) {
  const element = event.target as HTMLInputElement
  
  if (element.files && element.files.length > 0) {
    const file = element.files[0];
    const reader = new FileReader();
    
    reader.addEventListener('load', () => {
      iconModelConfiguration.value.url = reader.result as string
    });

    reader.readAsDataURL(file);
  }
}

function onDownloadClick(){
  downloadBlob(exportStl(), 'model.stl')
}
</script>
