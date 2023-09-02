import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ref} from "vue";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import {
  Group,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SpotLight,
  MeshBasicMaterial,
  Mesh, ExtrudeGeometry, DoubleSide
} from 'three';

let scene = new Scene();
let camera: PerspectiveCamera
let renderer: WebGLRenderer
let controls: OrbitControls
let group = new Group();

scene.add(group)

export function useCanvasService() {
  const loading = ref(false)

  function init(element: HTMLElement) {
    camera = new PerspectiveCamera(75, element.offsetWidth / element.offsetHeight, 0.1, 1000)
    camera.position.z = 3

    const light = new SpotLight()
    light.position.set(20, 20, 20)
    scene.add(light)

    renderer = new WebGLRenderer();
    renderer.setSize(element.offsetWidth, element.offsetHeight );
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
  
  function setBaseModel(stlUrl: string){
    const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    const stlLoader = new STLLoader()
    
    stlLoader.load(
        stlUrl,
        function (geometry) {
          loading.value = true
          
          const mesh = new Mesh(geometry, material)
          group.add(mesh)
        },
        () => {
          loading.value = false
        },
        (error) => {
          throw error
        }
    )
  }
  
  function setIconSvg(svgUrl: string) {
    const loader = new SVGLoader();

// load a SVG resource
    loader.load(
        // resource URL
        svgUrl,
        // called when the resource is loaded
        function ( data : any) {

          const paths = data.paths;

          for ( let i = 0; i < paths.length; i ++ ) {

            const path = paths[ i ];

            const material = new MeshBasicMaterial( {
              color: '#550000',
              side: DoubleSide,
              depthWrite: false
            } );

            const shapes = SVGLoader.createShapes( path );

            for ( let j = 0; j < shapes.length; j ++ ) {

              const shape = shapes[ j ];
              const geometry = new ExtrudeGeometry( shape, {
                steps: 2,
                depth: 16,
              } );
              const mesh = new Mesh( geometry, material );
              group.add( mesh );


            }

          }

          scene.add( group );

        },
        // called when loading is in progresses
         ( xhr: any )=> {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
         ( error ) => {

          console.log( error );

        }
    );
  }
  
  function exportStl() {
    // Instantiate an exporter
    const exporter = new STLExporter();

    // Configure export options
    const options = { binary: true }

    // Parse the input and generate the STL encoded output
    const result = exporter.parse( group, options );

    return new Blob( [result], { type : 'text/plain' } );

  }
  
  return {init, setBaseModel, setIconSvg, exportStl}
}