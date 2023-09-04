<template>
  <v-app>
    <v-navigation-drawer>
      <v-container class="d-flex flex-column h-100">
        <div class="flex-grow-1">
          <h1 class="text-center ">Configuration</h1>
          <p class="mb-5">
            <small>
              This is a tool to generate a <code>STL</code> file for 3d printing to label cables.
            </small>
          </p>
          <v-select
              label="Model"
              :items="baseModelConfigurations"
              item-title="label"
              item-value="model"
              v-model="baseModelConfiguration"
          />
          <div class="dropzone" :class="{'dropzone--active': isOverDropZone}" ref="dropZoneRef" @click="onDropzoneClick">
            <span>Click or drop SVG file here</span>
          </div>
        </div>
        <v-btn @click="onDownloadClick">Download</v-btn>
      </v-container>
    </v-navigation-drawer>
    
    <v-main>
      <Canvas :base="baseModelConfiguration" :icon="iconModelConfiguration" />
    </v-main>

    <v-snackbar
        v-model="snackbar"
        multi-line
    >
      File type is not supported

      <template v-slot:actions>
        <v-btn
            color="red"
            variant="text"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref} from 'vue'
import { useCanvasService} from "@/components/canvas/canvasService";
import Canvas, {type ModelConfiguration} from "@/components/canvas/Canvas.vue";
import {downloadBlob, openFile} from '@/utils'
import hookModelUrl from "@/assets/hook_simple.stl?url";
import defaultSvgUrl from "@/assets/print-solid.svg?url";
import {useDropZone} from "@vueuse/core";

type ModelOption = {
  label: string
  model: ModelConfiguration
}

const baseModelConfigurations: ModelOption[] = [{
  label: 'Hook',
  model: {
    url: hookModelUrl,
    configuration: {
      rotationX: -90,
    }
  }
}]

const snackbar = ref()
const dropZoneRef = ref()
const {exportStl} = useCanvasService()
const { isOverDropZone } = useDropZone(dropZoneRef, loadFile)
const baseModelConfiguration = ref<ModelConfiguration>(baseModelConfigurations[0].model)
const iconModelConfiguration = ref<ModelConfiguration>({
  url: defaultSvgUrl,
  configuration: {
    rotationX: 90,
    offsetZ: 15,
    scale: 0.8
  }
})

function loadFile(files: File[] | null) {
  if (files && files.length > 0) {
    const file = files[0];

    if (file.type === 'image/svg+xml'){
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        iconModelConfiguration.value.url = reader.result as string
      });

      reader.readAsDataURL(file);
    } else {
      snackbar.value = true
    }
  }
}

async function onDropzoneClick () {
  const files = await openFile('.svg')

  if(files) {
    loadFile([...files])
  }
}

function onDownloadClick(){
  downloadBlob(exportStl(), 'model.stl')
}
</script>

<style lang="scss" scoped>
.dropzone {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10rem;
  border-style: solid;
  background-color: #F6F6F6;
  border-width: 0 0 1px 0;
  border-color: #A5A5A5;
  
  &:hover, &--active {
    background-color: #EDEDED;
    border-color: #3A3A3A;
  }
}
</style>