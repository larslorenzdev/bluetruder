import {
  DirectionalLight, DirectionalLightHelper, GridHelper,
  OrthographicCamera, PCFSoftShadowMap,
  Scene, WebGLRenderer,
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export function initLoop(element: HTMLElement) {
  const scene = new Scene()
  const factor = 40
  const camera = new OrthographicCamera(-element.offsetWidth / factor, element.offsetWidth / factor, element.offsetHeight / factor, -element.offsetHeight / factor, -1000, 1000)
  camera.position.setX(1)
  camera.position.setY(2)
  camera.position.setZ(2)

  const lightHeight = 20

  const fillLight = new DirectionalLight(0xffffff, 1)
  fillLight.position.set(-100, lightHeight, 80)
  fillLight.castShadow = true;
  scene.add(fillLight)

  if (import.meta.env.DEV) {
    const fillLightHelper = new DirectionalLightHelper(fillLight, 2, 0x0000FF)
    scene.add(fillLightHelper)
  }

  const keyLight = new DirectionalLight(0xffffff, 3)
  keyLight.position.set(50, lightHeight, 50)
  keyLight.castShadow = true;
  scene.add(keyLight)

  if (import.meta.env.DEV) {
    const keyLightHelper = new DirectionalLightHelper(keyLight, 2, 0x00FF00)
    scene.add(keyLightHelper)
  }

  const backLight = new DirectionalLight(0xffffff, 3)
  backLight.position.set(-50, lightHeight, -50)
  backLight.castShadow = true;
  scene.add(backLight)

  if (import.meta.env.DEV) {
    const backLightHelper = new DirectionalLightHelper(backLight, 2, 0xFF0000)
    scene.add(backLightHelper)
  }

  // const geometry = new PlaneGeometry(50, 50);
  // geometry.rotateX(MathUtils.degToRad(-90))
  // const material = new MeshStandardMaterial({color: 0xffffff})
  // const plane = new Mesh(geometry, material);
  // plane.receiveShadow = true;
  // plane.position.setY(-2)
  // scene.add(plane);

  if (import.meta.env.DEV) {
    const gridHelper = new GridHelper(250, 25, 0xffffff, 0x999999);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    scene.add(gridHelper)
  }

  const renderer = new WebGLRenderer({alpha: true});
  renderer.setSize(element.offsetWidth, element.offsetHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;
  element.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.maxZoom = 1
  controls.minZoom = 0.1
  // controls.maxPolarAngle = MathUtils.degToRad(75)
  // controls.minPolarAngle = MathUtils.degToRad(0)
  controls.enablePan = false

  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);

    camera.left = -width / factor;
    camera.right = width / factor;
    camera.top = height / factor;
    camera.bottom = -height / factor;

    camera.updateProjectionMatrix();
  }, false)

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }


  animate()

  return {scene, camera}
}