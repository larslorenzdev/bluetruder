<template>
  <Menu>
    <MenuSection>
      <MenuHeader title="Configuration" />
      <MenuText text="This is a tool to generate a STL file for 3d printing to label cables." />
    </MenuSection>
    <MenuSection title="Options">
      <MenuOption title="Model">
        <InputSelect
          v-model="activeConfiguration"
          label="Model"
          :options="configurationStore.configurations"
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
      <Button @click="downloadModel">
        Download
      </Button>
    </MenuSection>
  </Menu>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useConfigurationStore} from "@/stores/configurationStore.ts";
import Menu from "@/components/menu/Menu.vue";
import MenuSection from "@/components/menu/MenuSection.vue";
import MenuHeader from "@/components/menu/MenuHeader.vue";
import MenuText from "@/components/menu/MenuText.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import InputSelect from "@/components/controls/InputSelect.vue";
import InputFile from "@/components/controls/InputFile.vue";
import Button from "@/components/controls/Button.vue";
import {useModelStore} from "@/stores/model-store/modelStore.ts";
import {downloadBlob} from "@/utils.ts";

const configurationStore = useConfigurationStore()
const modelStore = useModelStore()
const {activeConfiguration , iconFile} = storeToRefs(configurationStore)

function downloadModel() {
  downloadBlob(modelStore.exportModelBlob(), 'model.stl')
}
</script>
