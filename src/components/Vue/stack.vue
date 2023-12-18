<script setup lang="ts">
import { ref, onMounted } from "vue";
import IconButton from "./components/IconButton.vue";
import { TechArray } from "./utils/stack";

// reactive state
const count = ref(0);

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

const iconNumber = TechArray.length;
const isMid = 0; /* 0 if there's no item in the middle, 1 otherwise */
const outerIconNumber = iconNumber - isMid; /* how many are ON the circle */
let tan = Math.tan(
  Math.PI / outerIconNumber
); /* tangent of half the base angle */

// lifecycle hooks
onMounted(() => {
  const spinner = document.querySelector(".spinner");
  if (spinner) (spinner as HTMLElement).style.display = "none";
});
</script>

<template>
  <div
    class="grid"
    :style="`--outer-icon-number: ${outerIconNumber}; --tan: ${+tan.toFixed(
      2
    )}`"
  >
    <IconButton
      v-for="(tech, index) in TechArray"
      :url="tech.url"
      :style="index - isMid >= 0 ? `--i: ${index}` : null"
    />
  </div>
</template>

<style scoped>
.grid {
  --img-size: 6vh;
  --spacing: 0.5; /* space between images in image sizes */
  --radius: calc(0.5 * (1 + var(--spacing)) * var(--img-size) / var(--tan));
  --cont-size: calc(2 * var(--radius) + var(--img-size));
  position: relative;
  width: var(--cont-size);
  height: var(--cont-size);
  & > div {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: calc(-0.5 * var(--img-size));
    width: var(--img-size);
    height: var(--img-size);
    --az: calc(var(--i) * 1turn / var(--outer-icon-number));
    transform: rotate(var(--az)) translate(var(--radius))
      rotate(calc(-1 * var(--az)));
  }
}
</style>
