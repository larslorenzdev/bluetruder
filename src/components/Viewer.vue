<template>
  <div class="container" ref="container"/>
</template>

<script setup lang="ts">
import YourSvg from "@/assets/print-solid.svg?url";
import YourModel from "@/assets/model.stl?url";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module'
import * as THREE from 'three';
import {onMounted, ref} from "vue";

const container = ref()

onMounted(() => {
  const containerElement = container.value as HTMLElement
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
      75,
      containerElement.offsetWidth / containerElement.offsetHeight,
      0.1,
      1000
  )
  camera.position.z = 3
  
  const light = new THREE.SpotLight()
  light.position.set(20, 20, 20)
  scene.add(light)
  
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(containerElement.offsetWidth, containerElement.offsetHeight );
  containerElement.appendChild( renderer.domElement );

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  
  const stlLoader = new STLLoader()
  stlLoader.load(
      YourModel,
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
  )


  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
  }

  const stats = new Stats()
  document.body.appendChild(stats.dom)

  function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
  }

  function render() {
    renderer.render(scene, camera)
  }

  animate()


  const loader = new SVGLoader();

// load a SVG resource
  loader.load(
      // resource URL
      YourSvg,
      // called when the resource is loaded
      function ( data ) {

        const paths = data.paths;
        const group = new THREE.Group();

        for ( let i = 0; i < paths.length; i ++ ) {

          const path = paths[ i ];

          const material = new THREE.MeshBasicMaterial( {
            color: '#550000',
            side: THREE.DoubleSide,
            depthWrite: false
          } );

          const shapes = SVGLoader.createShapes( path );

          for ( let j = 0; j < shapes.length; j ++ ) {

            const shape = shapes[ j ];
            const geometry = new THREE.ShapeGeometry( shape );
            const mesh = new THREE.Mesh( geometry, material );
            group.add( mesh );

          }

        }

        scene.add( group );

      },
      // called when loading is in progresses
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.log( 'An error happened' );

      }
  );
  
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>