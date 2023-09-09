import {
  AmbientLight,
  DirectionalLight, MathUtils, Mesh, MeshStandardMaterial,
  OrthographicCamera, PCFSoftShadowMap,
  PlaneGeometry,
  PointLight,  Scene, WebGLRenderer,
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export function initLoop(element: HTMLElement) {
  const scene = new Scene()
  const factor = 40
  const camera = new OrthographicCamera(-element.offsetWidth / factor, element.offsetWidth / factor, element.offsetHeight / factor, -element.offsetHeight / factor,-1000,1000)
  camera.position.setX(1)
  camera.position.setY(2)
  camera.position.setZ(2)

  const pointLight = new PointLight(0xffffff, 10000)
  pointLight.position.set (0,50,0)
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 512; // default
  pointLight.shadow.mapSize.height = 512; // default
  pointLight.shadow.camera.near = 0.5; // default
  pointLight.shadow.camera.far = 500; // default
  scene.add(pointLight)

  const pointLight2 = new DirectionalLight(0xffffff, 10)
  pointLight2.position.set (20,20,-200)
  pointLight2.castShadow = true;
  pointLight2.shadow.mapSize.width = 512; // default
  pointLight2.shadow.mapSize.height = 512; // default
  pointLight2.shadow.camera.near = 0.5; // default
  pointLight2.shadow.camera.far = 500; // default
  scene.add(pointLight2)

  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight)

  const geometry = new PlaneGeometry(50, 50);
  geometry.rotateX(MathUtils.degToRad(90))
  const material = new MeshStandardMaterial( { color: 0x00ff00} )
  const plane = new Mesh(geometry, material);
  plane.receiveShadow = true;
  plane.position.setY(-5)
  // const gridHelper = new GridHelper(250, 25, 0xffffff, 0xffffff);
  // gridHelper.material.transparent = true;
  // gridHelper.material.opacity = 0.2;
  // plane.add(gridHelper)
  scene.add(plane);

  const renderer = new WebGLRenderer({alpha: true});
  renderer.setSize(element.offsetWidth, element.offsetHeight );
  renderer.setClearColor( 0x000000, 0 );
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;
  element.appendChild( renderer.domElement );

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.maxZoom = 1
  controls.minZoom = 0.2
  controls.maxPolarAngle = MathUtils.degToRad(75)
  controls.minPolarAngle = MathUtils.degToRad(0)
  controls.enablePan = false
  
  window.addEventListener('resize', () => {
    renderer.setSize(element.offsetWidth, element.offsetHeight)
  }, false)

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  animate()
  
  return scene
}