<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Label Generator</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <Viewer/>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import Viewer from "@/components/Viewer.vue";

const drawer = ref(null)
</script>

<script>
export default {
  data: () => ({ drawer: null }),
}
</script>