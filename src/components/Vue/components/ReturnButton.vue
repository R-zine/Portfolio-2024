<script setup>
import { onMounted, ref } from "vue";

const fadeIn = ref(true);

onMounted(() => {
  fadeIn.value = false;
});
</script>

<template>
  <div :class="{ 'return-btn-cont': true, button, hidden: fadeIn }">
    <div>Return</div>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      width="16"
      viewBox="0 0 512 512"
    >
      <path
        d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"
      />
    </svg>
  </div>
</template>

<style scoped>
.return-btn-cont {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  border-radius: 50%;
  width: 6vh;
  height: 6vh;
  max-width: 6vh;
  min-width: 6vh;
  gap: 6px !important;

  border: 2px solid black;

  transition: 1s background-color, 1.2s box-shadow, 0.8s color, 1.5s opacity;

  svg {
    transition: 800ms;
  }

  &:hover {
    background-color: black;
    box-shadow: 0 0 15px inset black, 0 0 15px black, 0 0 30px black;
    color: white;
    svg {
      filter: invert(100%);
    }
  }
}

.hidden {
  opacity: 0;
}
</style>
