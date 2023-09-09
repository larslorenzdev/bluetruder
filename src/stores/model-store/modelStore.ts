import {defineStore} from "pinia";
import { shallowRef, watch} from "vue";
import { MeshStandardMaterial, Object3D, Scene} from "three";
import {initLoop} from "./loop";
import {applyConfiguration, loadStl, loadSvg, toStlBlob} from "./utils";
import {applyScale2d, getSize, moveToCenter} from "./helper";
import {Configuration} from "@/stores/configurationStore.ts";

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
  const element = shallowRef()
  const scene = shallowRef<Scene>()
  const baseModel= shallowRef<Object3D>()
  const iconModel= shallowRef<Object3D>()
  const conf= shallowRef<Configuration>()
  
  function exportModelBlob () {
    if (baseModel.value && iconModel.value) {
      return toStlBlob([baseModel.value, iconModel.value])
    }
    
    throw new Error()
  }

  async function setBaseModel(modelUrl: string, configuration: Configuration){
    if (baseModel.value) {
      scene.value?.remove(baseModel.value)
    }

    conf.value = configuration

    const material = new MeshStandardMaterial( { color: 0x000000 } );
    const model = await loadStl(modelUrl, material)
    model.castShadow = true;
    model.receiveShadow = false

    // Apply scale
    model.scale.set(conf.value?.baseModelOptions?.scale ?? 1,conf.value?.baseModelOptions?.scale?? 1,conf.value?.baseModelOptions?.scale ?? 1)

    moveToCenter(model)

    baseModel.value = applyConfiguration(model, conf.value?.baseModelOptions)

    // Set flat on surface
    const size = getSize(baseModel.value)
    baseModel.value.position.setY(size.y / 2)

    scene.value?.add(baseModel.value)
    
    if(iconModel.value) {
      // TODO: This should be possible but destroys the position of the icon; i guess because of the additional group which is added to the model
      applyConfiguration(iconModel.value, conf.value.iconModelOptions)
    }
  }

  async function setIconModel(iconUrl: string) {
    if (iconModel.value) {
      scene.value?.remove(iconModel.value)
    }

    const material = new MeshStandardMaterial( {color: 0xffffff} );
    const model = await loadSvg(iconUrl, material)

    if (baseModel.value) {
      applyScale2d(baseModel.value, model, conf.value?.iconModelOptions?.scale)
    }
    
    moveToCenter(model)
    
    iconModel.value = applyConfiguration(model, conf.value?.iconModelOptions)

    if (baseModel.value) {
    // Set flat on base model
    const baseModelSize = getSize(baseModel.value)
    const iconModelSize = getSize(iconModel.value)
    iconModel.value.position.setY((iconModelSize.y / 2) + baseModelSize.y)
    }

    scene.value?.add( iconModel.value );
  }
  
  
  
  watch(element, (value)=> {
    scene.value = initLoop(value)
  })
  
  return {element, setBaseModel, setIconModel, exportModelBlob}
})
