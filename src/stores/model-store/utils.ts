import {STLExporter} from "three/examples/jsm/exporters/STLExporter";
import {ExtrudeGeometry, Group, Material, MathUtils, Mesh, Object3D} from "three";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";
import {ModelOptions} from "./modelStore";

export function toStlBlob(models: Object3D[]) {
  const exporter = new STLExporter();
  const options = { binary: true }

  const group = new Group()
  models.forEach((model) => {
    group.add(model.clone())
  })

  const result = exporter.parse( group, options );

  return new Blob( [result], { type : 'text/plain' } );
}

export function applyConfiguration(object: Object3D, configuration?: ModelOptions) {
  const group = new Group()
  group.add(object)

  group.rotateX(MathUtils.degToRad(configuration?.rotationX ?? 0))
  group.rotateY(MathUtils.degToRad(configuration?.rotationY ?? 0))
  group.rotateZ(MathUtils.degToRad(configuration?.rotationZ ?? 0))

  group.position.setX(configuration?.offsetX ?? 0)
  group.position.setY(configuration?.offsetY ?? 0)
  group.position.setZ(configuration?.offsetZ ?? 0)

  return group
}

export async function loadStl(stlUrl: string, material: Material): Promise<Group> {
  const svgLoader = new STLLoader();

  return new Promise((resolve, reject) => {
    svgLoader.load(
        stlUrl,
        (geometry) => {
          const group = new Group()
          const mesh = new Mesh(geometry, material)

          group.add(mesh)

          resolve(group)
        },
        undefined,
        (error) => {
          reject(error)
        }
    );
  })
}

export async function loadSvg(svgUrl: string, material: Material): Promise<Group> {
  const svgLoader = new SVGLoader();

  return new Promise((resolve, reject) => {
    svgLoader.load(
        svgUrl,
        ( data)=> {
          const paths = data.paths;
          const group = new Group();

          for ( let i = 0; i < paths.length; i ++ ) {
            const path = paths[ i ];
            const shapes = SVGLoader.createShapes( path );

            for ( let j = 0; j < shapes.length; j ++ ) {
              const shape = shapes[ j ];
              const geometry = new ExtrudeGeometry( shape, {depth: 0.4});
              const mesh = new Mesh( geometry, material );

              group.add( mesh );
            }
          }

          resolve(group)
        },
        undefined,
        (error) => {
          reject(error)
        }
    );
  })
}