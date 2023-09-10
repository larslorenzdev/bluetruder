import {STLExporter} from "three/examples/jsm/exporters/STLExporter";
import {ExtrudeGeometry, Group, Material, MathUtils, Mesh, Object3D} from "three";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";
import {ModelOptions} from "./modelStore";
import {getCenter, getSize} from "@/stores/model-store/helper.ts";
import {shallowRef} from "vue";

export function toStlBlob(models: Object3D[]) {
  const exporter = new STLExporter();
  const options = {binary: true}

  const group = new Group()
  models.forEach((model) => {
    group.add(model.clone())
  })

  const result = exporter.parse(group, options);

  return new Blob([result], {type: 'text/plain'});
}

export function applyScaleOptions3d(object: Object3D, configuration?: ModelOptions) {
  const scale = configuration?.scale ?? 1

  object.scale.set(scale, scale, scale)
}

export function applyScaleOptions2d(targetObject: Object3D, sourceObject: Object3D, configuration?: ModelOptions) {
  const offset = configuration?.scale ?? 1
  const sourceObjectSize = getSize(sourceObject)
  const targetObjectSize = getSize(targetObject)

  const sourceMaxDimension = Math.min(sourceObjectSize.x, sourceObjectSize.z);
  const targetMaxDimension = Math.max(targetObjectSize.x, targetObjectSize.z);

  const defaultScale = sourceMaxDimension / targetMaxDimension;
  const offsetScale = defaultScale * offset;

  targetObject.scale.set(offsetScale, offsetScale, 1);
}

export function createCenterObjectOriginGroup(object: Object3D) {
  const center = getCenter(object)
  const group = new Group()
  group.name = 'center-group'

  group.add(object);

  object.translateX(-center.x);
  object.translateY(-center.y);
  object.translateZ(-center.z);

  return group
}

export function alignToYAxis(object: Object3D) {
  const objectSize = getSize(object)

  object.translateY(objectSize.y / 2)
}

export function applyRotationOptions(object: Object3D, configuration?: ModelOptions) {
  object.rotation.x = MathUtils.degToRad(configuration?.rotationX ?? 0)
  object.rotation.y = MathUtils.degToRad(configuration?.rotationY ?? 0)
  object.rotation.z = MathUtils.degToRad(configuration?.rotationZ ?? 0)
}

export function applyPositionOptions(object: Object3D, configuration?: ModelOptions) {
  object.position.x = configuration?.offsetX ?? 0
  object.position.y = configuration?.offsetY ?? 0
  object.position.z = configuration?.offsetZ ?? 0
}

export function useStlLoader() {
  const svgLoader = new STLLoader();
  const progress = shallowRef()

  async function load(stlUrl: string, material: Material): Promise<Group> {
    return new Promise((resolve, reject) => {
      svgLoader.load(
          stlUrl,
          (geometry) => {
            const mesh = new Mesh(geometry, material)
            const group = new Group()
            group.name = 'stl-loader-group'

            group.add(mesh)

            resolve(group)
          },
          (event) => {
            progress.value = (event.loaded / event.total) * 100
          },
          (error) => {
            reject(error)
          }
      );
    })
  }

  return {load, progress}
}

export function useSvgLoad() {
  const svgLoader = new SVGLoader();
  const progress = shallowRef()

  async function load(svgUrl: string, material: Material): Promise<Group> {
    return new Promise((resolve, reject) => {
      svgLoader.load(
          svgUrl,
          (data) => {
            const paths = data.paths;
            const group = new Group();
            group.name = 'svg-loader-group'

            for (let i = 0; i < paths.length; i++) {
              const path = paths[i];
              const shapes = SVGLoader.createShapes(path);

              for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j];
                const geometry = new ExtrudeGeometry(shape, {depth: 0.4});
                const mesh = new Mesh(geometry, material);

                group.add(mesh);
              }
            }

            resolve(group)
          },
          (event) => {
            progress.value = (event.loaded / event.total) * 100
          },
          (error) => {
            reject(error)
          }
      );
    })
  }

  return {load, progress}
}