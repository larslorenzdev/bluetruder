import {defineStore, storeToRefs} from "pinia";
import {shallowRef, watch} from "vue";
import {Group, MeshStandardMaterial, Object3D, Scene} from "three";
import {initLoop} from "./loop";
import {
  applyPositionOptions,
  applyRotationOptions, applyScaleOptions2d, applyScaleOptions3d, createCenterObjectOriginGroup,
  useStlLoader,
  useSvgLoad,
  toStlBlob, alignToYAxis
} from "./utils";
import {useConfigurationStore} from "@/stores/configurationStore.ts";

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
  const {activeConfiguration, iconUrl} = storeToRefs(useConfigurationStore())
  const element = shallowRef()
  const scene = shallowRef<Scene>()
  const baseObject = shallowRef<Object3D>()
  const iconObject = shallowRef<Object3D>()
  const centerGroup = shallowRef<Group>(new Group())
  const objectGroup = shallowRef<Group>(new Group())

  function exportModelBlob() {
    return toStlBlob([objectGroup.value])
  }

  watch(activeConfiguration, async (value) => {
    const material = new MeshStandardMaterial({color: 0x000000});
    const {load} = useStlLoader()
    const model = await load(value.baseModelUrl, material)
    model.castShadow = true;
    model.receiveShadow = false
    model.name = 'base-model'

    const centeredModel = createCenterObjectOriginGroup(model)

    const newObjectGroup = new Group()
    newObjectGroup.name = 'object-group'
    newObjectGroup.add(centeredModel)

    applyScaleOptions3d(centeredModel, value?.baseModelOptions)
    applyPositionOptions(centeredModel, value?.baseModelOptions)
    applyRotationOptions(centeredModel, value?.baseModelOptions)

    const newCenterGroup = createCenterObjectOriginGroup(objectGroup.value)
    alignToYAxis(newCenterGroup)
    newCenterGroup.add(newObjectGroup)

    scene.value?.remove(centerGroup.value)
    scene.value?.add(newCenterGroup)

    centerGroup.value = newCenterGroup
    objectGroup.value = newObjectGroup
    baseObject.value = centeredModel

    if (iconObject.value) {
      // applyScaleOptions2d(iconObject.value, model, value?.iconModelOptions)
      applyPositionOptions(iconObject.value, value.iconModelOptions)
      applyRotationOptions(iconObject.value, value.iconModelOptions)
    }
  }, {immediate: true})

  watch(iconUrl, async (value) => {
    const material = new MeshStandardMaterial({color: 0xffffff});
    const {load} = useSvgLoad()
    const model = await load(value, material)
    model.name = 'icon-model'

    const centeredModel = createCenterObjectOriginGroup(model)

    objectGroup.value.add(centeredModel)

    if (baseObject.value) {
      // applyScaleOptions2d(baseObject.value, model, activeConfiguration.value?.iconModelOptions)
    }

    applyPositionOptions(centeredModel, activeConfiguration.value.iconModelOptions)
    applyRotationOptions(centeredModel, activeConfiguration.value.iconModelOptions)

    if (iconObject.value) {
      objectGroup.value?.remove(iconObject.value)
    }

    iconObject.value = centeredModel
  }, {immediate: true})

  watch(element, (value) => {
    scene.value = initLoop(value)

    if (import.meta.env.DEV) {
      console.log(scene.value)
    }
  })

  return {element, exportModelBlob}
})
