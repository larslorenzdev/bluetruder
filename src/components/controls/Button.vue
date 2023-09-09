<template>
  <button>
    <slot />
  </button>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
button {
  background-color: transparent;
  border: solid 1px rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  border-radius: 0.4rem;
  width: 100%;
  padding: 0.6rem 0.8rem;
  transition: all ease 300ms;
  
  
  &:hover {
    background-color: orangered;
    color: black;
  }
}
</style>