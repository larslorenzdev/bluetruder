<template>
  <Header class="header" />
  <main>
    <Canvas
      ref="canvasElement"
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
          option-label="name"
        />
      </MenuOption>
      <MenuOption title="Icon">
        <InputFile
          v-model="iconFile"
          label="Open file"
          accept=".svg"
        />
      </MenuOption>
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
import {ref, shallowRef, watch} from 'vue'
import { useCanvasService} from "@/components/canvas/canvasService";
import Canvas, {type ModelConfiguration} from "@/components/canvas/Canvas.vue";
import {downloadBlob} from '@/utils'
import hookModelUrl from "@/assets/hook_simple.stl?url";
import defaultSvgUrl from "@/assets/print-solid.svg?url";
import Menu from "@/components/Menu.vue";
import MenuSection from "@/components/MenuSection.vue";
import MenuHeader from "@/components/MenuHeader.vue";
import MenuText from "@/components/MenuText.vue";
import Button from "@/components/Button.vue";
import Header from "@/components/Header.vue";
import Tooltip from "@/components/Tooltip.vue";
import Select from "@/components/Select.vue";
import MenuOption from "@/components/MenuOption.vue";
import InputFile from "@/components/InputFile.vue";
import {useDropZone} from "@vueuse/core";

const baseModelConfigurations: ModelConfiguration[] = [{
    name: 'Hook',
    url: hookModelUrl,
    configuration: {
      rotationX: -90,
    }
}]

const canvasElement = ref()
const {exportStl} = useCanvasService()
useDropZone(canvasElement, loadFile)
const iconFile = shallowRef<File>()
const baseModelConfiguration = ref<ModelConfiguration>(baseModelConfigurations[0])
const iconModelConfiguration = ref<ModelConfiguration>({
  name: '',
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
    }
  }
}

function onDownloadClick(){
  downloadBlob(exportStl(), 'model.stl')
}

watch(iconFile, (value) => {
  if (value && value.type === 'image/svg+xml'){
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      iconModelConfiguration.value.url = reader.result as string
    });

    reader.readAsDataURL(value);
  }
})
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
</style>