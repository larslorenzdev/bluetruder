import {defineStore, storeToRefs} from "pinia";
import {shallowRef, watch} from "vue";
import {Group, MeshStandardMaterial, Object3D, Scene} from "three";
import {initLoop} from "./loop";
import {
  applyPositionOptions,
  applyRotationOptions,
  applyScaleOptions3d,
  createCenterObjectOriginGroup,
  useStlLoader,
  useSvgLoad,
  toStlBlob,
  translateToCenter, applyScaleOptions2d
} from "./utils";
import {useConfigurationStore} from "@/stores/configurationStore.ts";
import {getSize} from "@/stores/model-store/helper.ts";

export type ModelOptions = {
  rotationX?: number
  rotationY?: number
  rotationZ?: number
  offsetX?: number
  offsetY?: number
  offsetZ?: number
  scale?: number
}

export const useModelStore = defineStore('ModelStore', () => {
  const {activeConfiguration, iconUrl, iconScale} = storeToRefs(useConfigurationStore())
  const element = shallowRef()
  const scene = shallowRef<Scene>()
  const baseObject = shallowRef<Object3D>()
  const iconObject = shallowRef<Object3D>()
  const mainGroup = shallowRef(new Group())
  const objectGroup = shallowRef(new Group())

  function exportModelBlob() {
    return toStlBlob(objectGroup.value)
  }

  function updateObjectGroupPosition(group: Group) {
    translateToCenter(group)
    // alignToYAxis(group)
  }

  watch(activeConfiguration, async (value) => {
    const material = new MeshStandardMaterial({color: 0x000000});
    const {load} = useStlLoader()
    const model = await load(value.baseModelUrl, material)
    model.name = 'base-model'

    const centeredBaseObject = createCenterObjectOriginGroup(model)

    if (baseObject.value) {
      objectGroup.value?.remove(baseObject.value)
    }

    objectGroup.value?.add(centeredBaseObject)

    baseObject.value = centeredBaseObject

    applyScaleOptions3d(centeredBaseObject, value?.baseModelOptions)
    applyPositionOptions(centeredBaseObject, value?.baseModelOptions)
    applyRotationOptions(centeredBaseObject, value?.baseModelOptions)

    if (iconObject.value) {
      applyScaleOptions2d(iconObject.value, value.iconModelOptions?.scale)
      applyPositionOptions(iconObject.value, value.iconModelOptions)
      applyRotationOptions(iconObject.value, value.iconModelOptions)
    }

    updateObjectGroupPosition(objectGroup.value)

    if (import.meta.env.DEV) {
      console.debug('base size', getSize(centeredBaseObject))
    }
  }, {immediate: true})

  watch(iconUrl, async (value) => {
    const material = new MeshStandardMaterial({color: 0xffffff});
    const {load} = useSvgLoad()
    const model = await load(value, material)
    model.name = 'icon-model'

    const centeredIconObject = createCenterObjectOriginGroup(model)

    if (iconObject.value) {
      objectGroup.value?.remove(iconObject.value)
    }

    objectGroup?.value.add(centeredIconObject)

    iconObject.value = centeredIconObject

    if (baseObject.value) {
      applyScaleOptions2d(centeredIconObject, activeConfiguration.value?.iconModelOptions?.scale)
    }

    applyPositionOptions(centeredIconObject, activeConfiguration.value.iconModelOptions)
    applyRotationOptions(centeredIconObject, activeConfiguration.value.iconModelOptions)

    updateObjectGroupPosition(objectGroup.value)

    if (import.meta.env.DEV) {
      console.debug('icon size', getSize(centeredIconObject))
    }
  }, {immediate: true})

  watch(iconScale, (value) => {
    if (iconObject.value) {
      applyScaleOptions2d(iconObject.value, value)
    }
  })

  watch(element, (value) => {
    scene.value = initLoop(value)

    mainGroup.value = new Group()
    mainGroup.value.name = 'main-group'
    scene.value.add(mainGroup.value)

    objectGroup.value = new Group()
    objectGroup.value.name = 'object-group'
    mainGroup.value.add(objectGroup.value)

    if (import.meta.env.DEV) {
      console.debug('main scene', scene.value)
    }
  })

  return {element, exportModelBlob}
})
