import {defineStore} from "pinia";
import {shallowRef, watch} from "vue";
import hookModelUrl from "@/assets/models/hook.stl?url";
import clipModelUrl from "@/assets/models/clip.stl?url";
import defaultIconUrl from "@/assets/icons/print.svg?url";
import {ModelOptions} from "@/stores/model-store/modelStore.ts";
import {fileToDataUrl} from "@/utils.ts";

export type Configuration = {
  name: string
  baseModelUrl: string
  baseModelOptions?: ModelOptions
  iconModelOptions?: ModelOptions
}

const configurations: Configuration[] = [{
  name: 'Hook',
  baseModelUrl: hookModelUrl,
  baseModelOptions: {
    rotationX: -90,
  },
  iconModelOptions: {
    rotationX: 90,
    offsetY: 1,
    offsetZ: 15,
    scale: 0.03
  }
}, {
  name: 'Clip',
  baseModelUrl: clipModelUrl,
  baseModelOptions: {
    rotationX: -90,
    rotationZ: 90
  },
  iconModelOptions: {
    rotationX: 180,
    offsetZ: 8,
    scale: 0.025
  }
}]

export const useConfigurationStore = defineStore('ConfigurationStore', () => {
  const activeConfiguration = shallowRef<Configuration>(configurations[0])
  const iconFile = shallowRef<File>()
  const iconUrl = shallowRef<string>(defaultIconUrl)

  watch(iconFile, async (value) => {
    if (value) {
      iconUrl.value = await fileToDataUrl(value)
    }
  })

  return {configurations, activeConfiguration, iconFile, iconUrl}
})
