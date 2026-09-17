<script setup>
const props = defineProps({
  url: String,
  name: String,
});
</script>

<template>
  <button type="button" class="icon-btn-cont button" :aria-label="`View details for ${name}`">
    <img :src="url" alt="" />
  </button>
</template>

<style scoped>
.icon-btn-cont {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  border-radius: 50%;
  width: 6vh;
  height: 6vh;
  padding: 0;
  color: white;
  background: black;

  transition: 1s background-color, 1.2s box-shadow;

  & > img {
    filter: invert(100%);
    width: 50%;
    height: 50%;
    max-width: 50%;
    max-height: 50%;

    transition: 0.8s;
  }

  &:hover {
    background-color: white;
    box-shadow: 0 0 15px inset white, 0 0 15px white, 0 0 30px white;

    & > img {
      filter: invert(0);
    }
  }
}
</style>
