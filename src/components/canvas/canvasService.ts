import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import {
  Group,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  ExtrudeGeometry,
  Box3,
  Vector3,
  PointLight,
  AmbientLight,
  PointLightHelper,
  GridHelper, MeshStandardMaterial, Object3D, MathUtils
} from 'three';

export type CanvasConfiguration = {
  modelUrl: string
  rotationX: number
  rotationY: number
  rotationZ: number
  iconOffsetX: number
  iconOffsetY: number
  iconScale: number
  iconDepth: number
}

let activeConfiguration: CanvasConfiguration
let scene = new Scene();
let camera: PerspectiveCamera
let renderer: WebGLRenderer
let controls: OrbitControls
let group = new Group();

let baseMesh: Mesh
let iconMeshGroup: Group

scene.add(group)

export function useCanvasService() {
  function init(element: HTMLElement) {
    camera = new PerspectiveCamera(75, element.offsetWidth / element.offsetHeight, 0.1, 1000)

    const pointLight = new PointLight(0xffffff)
    pointLight.position.set (5,5,5)

    const ambientLight = new AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight)

    const lightHelper = new PointLightHelper(pointLight)
    const gridHelper = new GridHelper(200, 50);
    scene.add(lightHelper, gridHelper)

    renderer = new WebGLRenderer({alpha: true});
    renderer.setSize(element.offsetWidth, element.offsetHeight );
    renderer.setClearColor( 0x000000, 0 );
    element.appendChild( renderer.domElement );

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)
    
    animate()
  }
  
  function animate() {
    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)
  }

  /**
   * Retrieves the size of a given Object3D.
   *
   * @param {Object3D} object - The Object3D instance to get the size from.
   * @return {Vector3} - The size of the Object3D.
   */
  function getSize(object: Object3D){
    const meshABoundingBox = new Box3().setFromObject(object);
    
    return meshABoundingBox.getSize(new Vector3());
  }

  /**
   * Scales objectB to have the same size as objectA.
   *
   * @param {Object3D} objectA - The first object to compare size with.
   * @param {Object3D} objectB - The object to be scaled.
   */
  function scaleEqually(objectA: Object3D, objectB: Object3D, offset = 1)  {
    const meshASize = getSize(objectA)
    const meshBSize = getSize(objectB)

    const meshAMaxDimension = Math.max(meshASize.x, meshASize.y, meshASize.z);
    const meshBMaxDimension = Math.max(meshBSize.x, meshBSize.y, meshBSize.z);

    const defaultScale = meshAMaxDimension / meshBMaxDimension;
    const offsetScale = defaultScale * offset;

    objectB.scale.set(offsetScale, offsetScale, 1);
  }
  
  function setConfiguration(configuration: CanvasConfiguration){
    const material = new MeshStandardMaterial( { color: 0x111111 } );
    const stlLoader = new STLLoader()
    
    stlLoader.load(
        configuration.modelUrl,
        function (geometry) {
          if (baseMesh) {
            group.remove(baseMesh)
          }
          
          baseMesh = new Mesh(geometry, material)
          baseMesh.geometry.center()

          // Move the object z axis to the 0 z axis of the scene
          const size = getSize(baseMesh)
          baseMesh.translateZ(size.z / 2)
          
          // Apply configuration
          group.rotateX(MathUtils.degToRad(configuration.rotationX))
          group.rotateY(MathUtils.degToRad(configuration.rotationY))
          group.rotateZ(MathUtils.degToRad(configuration.rotationZ))
          
          group.add(baseMesh)
          
          // Set camera position
          if (!activeConfiguration) {
            const baseMeshSize = getSize(baseMesh)
            const baseMeshMaxDimension = Math.max(baseMeshSize.x, baseMeshSize.y, baseMeshSize.z);

            camera.position.setX(baseMeshMaxDimension / 2)
            camera.position.setY(baseMeshMaxDimension / 2)
            camera.position.setZ(baseMeshMaxDimension)
          }

          activeConfiguration = configuration
        }
    )
  }
  
  function setIconSvg(svgUrl: string) {
    const svgLoader = new SVGLoader();
    const material = new MeshStandardMaterial( {color: 0xffffff} );
    
    svgLoader.load(
        svgUrl,
        function ( data : any) {

          const paths = data.paths;

          if (iconMeshGroup) {
            group.remove(iconMeshGroup)
          }

          iconMeshGroup = new Group();

          for ( let i = 0; i < paths.length; i ++ ) {

            const path = paths[ i ];
            
            const shapes = SVGLoader.createShapes( path );
            
            for ( let j = 0; j < shapes.length; j ++ ) {

              const shape = shapes[ j ];
              const geometry = new ExtrudeGeometry( shape, {
                depth: activeConfiguration.iconDepth,
              });

              const mesh = new Mesh( geometry, material );

              iconMeshGroup.add( mesh );
            }
            
            scaleEqually(baseMesh, iconMeshGroup, activeConfiguration.iconScale)

            // Center svg in center of scene
            const size = getSize(iconMeshGroup)
            iconMeshGroup.translateX((size.x / 2 * -1) + activeConfiguration.iconOffsetX)
            iconMeshGroup.translateY((size.y / 2 * -1) + activeConfiguration.iconOffsetY)

            // Move the object z axis to the 0 z axis of the scene
            iconMeshGroup.translateZ(size.z * -1)
            
            iconMeshGroup.rotateX(MathUtils.degToRad(180))

            group.add( iconMeshGroup );
          }
        }
    );
  }
  
  function exportStl() {
    const exporter = new STLExporter();
    const options = { binary: true }
    const result = exporter.parse( group, options );

    return new Blob( [result], { type : 'text/plain' } );
  }
  
  return {init, setConfiguration, setIconSvg, exportStl}
}