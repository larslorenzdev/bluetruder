<template>
  <Menu>
    <MenuSection>
      <h1>Configuration</h1>
    </MenuSection>
    <MenuSection
      title="Options"
      hint="fun"
    >
      <MenuOption title="Model">
        <InputSelect
          v-model="activeConfiguration"
          label="Model"
          :options="configurationStore.configurations"
          option-label="name"
        />

        <a
          v-if="activeConfiguration.baseModelSource"
          :href="activeConfiguration.baseModelSource"
          target="_blank"
        >
          <span>
            <FontAwesomeIcon :icon="['fas', 'link']" /> Model Source
          </span>
        </a>
      </MenuOption>
      <MenuOption title="Icon">
        <InputFile
          v-model="iconFile"
          label="Open file"
          accept=".svg"
        />
      </MenuOption>
      <MenuOption title="Scale">
        <InputSlider
          v-model="iconScale"
          :min="1"
          :max="5"
          :step="0.1"
        />
      </MenuOption>
    </MenuSection>
    <MenuSection>
      <Button
        label="Download"
        @click="downloadModel"
      />
    </MenuSection>
  </Menu>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useConfigurationStore} from "@/stores/configurationStore.ts";
import Menu from "@/components/menu/Menu.vue";
import MenuSection from "@/components/menu/MenuSection.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import InputSelect from "@/components/controls/InputSelect.vue";
import InputFile from "@/components/controls/InputFile.vue";
import Button from "@/components/controls/Button.vue";
import {useModelStore} from "@/stores/model-store/modelStore.ts";
import {downloadBlob} from "@/utils.ts";
import InputSlider from "@/components/controls/InputSlider.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const configurationStore = useConfigurationStore()
const modelStore = useModelStore()
const {activeConfiguration, iconFile, iconScale} = storeToRefs(configurationStore)

function downloadModel() {
  downloadBlob(modelStore.exportModelBlob(), 'model.stl')
}
</script>
