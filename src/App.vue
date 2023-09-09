<template>
  <header>
    <MenuBar @toggle="isSidebarVisible = !isSidebarVisible" />
  </header>
  <Transition
    @enter="onSidebarEnter"
    @leave="onSidebarLeave"
  >
    <aside
      v-if="isSidebarVisible"
      class="sidebar"
    >
      <MenuConfiguration />
    </aside>
  </Transition>
  <main>
    <Viewer
      ref="canvasElement"
    />
  </main>
  <aside>
    <Badge class="info" />
  </aside>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import gsap from "gsap";
import MenuConfiguration from "@/app/MenuConfiguration.vue";
import MenuBar from "@/app/MenuBar.vue";
import Viewer from "@/app/Viewer.vue";
import Badge from "@/components/utils/Badge.vue";
import {useDropZone} from "@vueuse/core";
import {useModelStore} from "@/stores/model-store/modelStore.ts";
import {fileToDataUrl} from "@/utils";

const modelStore = useModelStore()
const isSidebarVisible = ref(true)
useDropZone(document.body, loadFile)

async function loadFile(files: File[] | null) {
  if (files && files.length > 0) {
    const file = files[0];

    if (file.type === 'image/svg+xml') {
      const iconUrl = await fileToDataUrl(file)
      
      await modelStore.setIconModel(iconUrl)
    }
  }
}


function onSidebarEnter(element: Element, done: () => void) {
  gsap.fromTo(element, {
    left: '-2rem',
    opacity: 0
  },{
    left: '1rem',
    opacity: 1,
    duration: 0.3,
    onComplete: done
  })
}

function onSidebarLeave(element: Element, done: () => void) {
  gsap.fromTo(element,{
    left: '1rem',
    opacity: 1,

  }, {
    left: '-2rem',
        opacity: 0,
    duration: 0.3,
    onComplete: done
  })
}
</script>

<style lang="scss" scoped>
main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sidebar {
  position: absolute;
  top: 6rem;
  left: 1rem;
  bottom: 1rem;
  z-index: 1000;
}

header {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 1000;
}

.info {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
}
</style>