import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import {
  Group,
  Scene,
  WebGLRenderer,
  Mesh,
  ExtrudeGeometry,
  PointLight,
  AmbientLight,
  PointLightHelper,
  OrthographicCamera,
  GridHelper,
  MeshStandardMaterial,
  Object3D,
  MathUtils,
  Material,
  BoxHelper, PlaneGeometry, MeshBasicMaterial, DoubleSide
} from 'three';
import {applyScale2d, getSize, moveToCenter} from "@/components/canvas/utils.ts";

export type Configuration = {
  rotationX?: number
  rotationY?: number
  rotationZ?: number
  offsetX?: number
  offsetY?: number
  offsetZ?: number
  scale?: number
}

let scene = new Scene();
let baseModel: Object3D
let iconModel: Object3D

export function useCanvasService(debug= false) {
  function init(element: HTMLElement) {
    const factor = 40
    const camera = new OrthographicCamera(element.offsetWidth / - factor, element.offsetWidth / factor, element.offsetHeight / factor, element.offsetHeight / - factor,-1000,1000)
    camera.position.setX(1)
    camera.position.setY(2)
    camera.position.setZ(2)
    
    const pointLight = new PointLight(0xffffff, 1000)
    pointLight.position.set (0,20,0)
    scene.add(pointLight)

    const ambientLight = new AmbientLight(0xffffff);
    scene.add(ambientLight)
    
    const renderer = new WebGLRenderer({alpha: true});
    renderer.setSize(element.offsetWidth, element.offsetHeight );
    renderer.setClearColor( 0x000000, 0 );
    element.appendChild( renderer.domElement );

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    const geometry = new PlaneGeometry(250, 250);
    const material = new MeshBasicMaterial({color: 0xaaaaaa, side: DoubleSide});
    const plane = new Mesh(geometry, material);
    plane.rotateX(MathUtils.degToRad(90))
    plane.position.setY(-0.1)
    scene.add(plane);

    if (debug) {
      const lightHelper = new PointLightHelper(pointLight)
      scene.add(lightHelper)

      const gridHelper = new GridHelper(250, 50);
      scene.add(gridHelper)
    }
    
    window.addEventListener('resize', () => {
      renderer.setSize(element.offsetWidth, element.offsetHeight)
    }, false)
    
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    
    animate()
  }
  
  async function setBaseModel(modelUrl: string, configuration: Configuration){
    if (baseModel) {
      scene.remove(baseModel)
    }
    
    const material = new MeshStandardMaterial( { color: 0x000000 } );
    const model = await loadStl(modelUrl, material)

    // Apply scale
    model.scale.set(configuration.scale ?? 1,configuration.scale?? 1,configuration.scale ?? 1)
    
    moveToCenter(model)
    
    baseModel = applyConfiguration(model, configuration)
    
    // Set flat on surface
    const size = getSize(baseModel)
    baseModel.position.setY(size.y / 2)
    
    scene.add(baseModel)

    if(debug) {
      addBoxHelper(baseModel)
    }
  }
  
  async function setIconModel(svgUrl: string, configuration: Configuration) {
    if (iconModel) {
      scene.remove(iconModel)
    }
    
    const material = new MeshStandardMaterial( {color: 0xffffff} );
    const model = await loadSvg(svgUrl, material)

    applyScale2d(baseModel, model, configuration.scale)
    moveToCenter(model)
    iconModel = applyConfiguration(model, configuration)

    // Set flat on base model
    const baseModelSize = getSize(baseModel)
    const iconModelSize = getSize(iconModel)
    iconModel.position.setY((iconModelSize.y / 2) + baseModelSize.y)
    
    scene.add( iconModel );

    if(debug) {
      addBoxHelper(iconModel)
    }
  }

  function applyConfiguration(object: Object3D, configuration: Configuration) {
    const group = new Group()
    group.add(object)
    
    group.rotateX(MathUtils.degToRad(configuration.rotationX ?? 0))
    group.rotateY(MathUtils.degToRad(configuration.rotationY ?? 0))
    group.rotateZ(MathUtils.degToRad(configuration.rotationZ ?? 0))

    group.position.setX(configuration.offsetX ?? 0)
    group.position.setY(configuration.offsetY ?? 0)
    group.position.setZ(configuration.offsetZ ?? 0)
    
    return group
  }
  
  function addBoxHelper(object: Object3D){
      object.children.forEach((object) => {
        if (object instanceof Group) {
          const box = new BoxHelper( baseModel, 0xffff00 ); // Yellow

          object.add(box)
        }

        if (object instanceof Mesh) {
          const box = new BoxHelper( baseModel, 0xff00ff ); // Purple

          object.add(box)
        }
        
        if (object.children.length > 0) {
          addBoxHelper(object)
        }
      })

  }
  
  function exportStl() {
    const exporter = new STLExporter();
    const options = { binary: true }
    
    const group = new Group()
    group.add(baseModel.clone(), iconModel.clone())
    
    const result = exporter.parse( group, options );

    return new Blob( [result], { type : 'text/plain' } );
  }

  async function loadStl(stlUrl: string, material: Material): Promise<Group> {
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
  
  async function loadSvg(svgUrl: string, material: Material): Promise<Group> {
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
  
  return {init, setBaseModel, setIconModel, exportStl}
}