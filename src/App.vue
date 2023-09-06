<template>
  <Header class="header" />
  <main>
    <Canvas
      :base="baseModelConfiguration"
      :icon="iconModelConfiguration"
    />
  </main>
  <Menu class="sidebar">
    <MenuSection>
      <MenuHeader title="Configuration" />
      <MenuText text="This is a tool to generate a STL file for 3d printing to label cables." />
    </MenuSection>
    <MenuSection title="Options">
      <MenuOption title="Model">
        <Select
          v-model="baseModelConfiguration"
          label="Model"
          :options="baseModelConfigurations"
          option-label="label"
          option-value="model"
        />
      </MenuOption>
      <div
        v-if="false"
        ref="dropZoneRef"
        class="dropzone"
        :class="{'dropzone--active': isOverDropZone}"
        @click="onDropzoneClick"
      >
        <span>Click or drop SVG file here</span>
      </div>
    </MenuSection>
    <MenuSection>
      <Button @click="onDownloadClick">
        Download
      </Button>
    </MenuSection>
  </Menu>
  <Tooltip class="info" />
</template>

<script setup lang="ts">
import { ref} from 'vue'
import { useCanvasService} from "@/components/canvas/canvasService";
import Canvas, {type ModelConfiguration} from "@/components/canvas/Canvas.vue";
import {downloadBlob, openFile} from '@/utils'
import hookModelUrl from "@/assets/hook_simple.stl?url";
import defaultSvgUrl from "@/assets/print-solid.svg?url";
import {useDropZone} from "@vueuse/core";
import Menu from "@/components/Menu.vue";
import MenuSection from "@/components/MenuSection.vue";
import MenuHeader from "@/components/MenuHeader.vue";
import MenuText from "@/components/MenuText.vue";
import Button from "@/components/Button.vue";
import Header from "@/components/Header.vue";
import Tooltip from "@/components/Tooltip.vue";
import Select from "@/components/Select.vue";
import MenuOption from "@/components/MenuOption.vue";

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
main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sidebar {
  position: absolute;
  top: 6rem;
  left: 1rem;
  bottom: 1rem;
  z-index: 1000;
}

.header {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 1000;
}

.info {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
}

.dropzone {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10rem;
  border-style: solid;
  background-color: rgba(255, 255, 255, 0.05);
  border-width: 0 0 1px 0;
  border-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  
  &:hover, &--active {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 1);
  }
}
</style>