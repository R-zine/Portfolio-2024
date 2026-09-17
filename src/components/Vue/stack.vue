<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import IconButton from "./components/IconButton.vue";
import ReturnButton from "./components/ReturnButton.vue";
import { Tech, TechArray } from "./utils/stack";
import gsap from "gsap";

defineOptions({ name: "TechnologyStack" });

// reactive state
const isLoaded = ref(false);
const hovered = ref("Hover an icon");
const selected = ref<Tech | null>(null);
const isDetails = ref(false);
const isBack = ref(false);

const imgRef = ref(null);
const titleRef = ref(null);
const yearRef = ref(null);
const descriptionRef = ref(null);
const returnRef = ref(null);
let detailsTimer: number | undefined;
let returnTimer: number | undefined;

// functions that mutate state and trigger updates

const iconNumber = TechArray?.length ?? 0;
const isMid = 0; /* 0 if there's no item in the middle, 1 otherwise */
const outerIconNumber = iconNumber - isMid; /* how many are ON the circle */
let tan = Math.tan(
  Math.PI / outerIconNumber
); /* tangent of half the base angle */

// lifecycle hooks
onMounted(() => {
  const spinner = document.querySelector(".spinner");
  if (spinner) (spinner as HTMLElement).style.display = "none";
  isLoaded.value = true;
});

onBeforeUnmount(() => {
  window.clearTimeout(detailsTimer);
  window.clearTimeout(returnTimer);
  document.querySelector("#lightring")?.classList.remove("lightring");
});

watch(hovered, async (newHovered) => {
  if (newHovered)
    document.querySelector("#lightring")?.classList.add("lightring");
  else document.querySelector("#lightring")?.classList.remove("lightring");
});

watch(selected, async (newSelected) => {
  window.clearTimeout(detailsTimer);
  if (newSelected)
    detailsTimer = window.setTimeout(() => (isDetails.value = true), 1500);
});

watch(isBack, async (newValue) => {
  if (newValue) {
    window.clearTimeout(returnTimer);
    returnTimer = window.setTimeout(() => {
      isDetails.value = false;
      selected.value = null;
      isBack.value = false;
    }, 800);
  }
});

watch(titleRef, async (ref) => {
  if (ref) {
    const tl = gsap.timeline();

    tl.from(imgRef.value, { opacity: 0 })
      .from(titleRef.value, { opacity: 0 })
      .from(yearRef.value, { opacity: 0 })
      .from(descriptionRef.value, { opacity: 0 });
  }
});
</script>

<template>
  <div
    :style="`opacity: ${isLoaded ? 1 : 0}`"
    class="container"
  >
    <div
      v-if="!isDetails"
      class="grid"
      :style="`--outer-icon-number: ${outerIconNumber}; --tan: ${+tan.toFixed(
        2
      )}`"
    >
      <IconButton
        v-for="(tech, index) in TechArray"
        :key="tech.name"
        :url="tech.url"
        :name="tech.name"
        :style="index - isMid >= 0 ? `--i: ${index}` : null"
        @mouseover="hovered = tech.name"
        @mouseleave="hovered = ''"
        @focus="hovered = tech.name"
        @blur="hovered = ''"
        @click="selected = tech"
      />
    </div>
    <div :class="{ eye: true, white: selected?.name }">
      {{ hovered }}
    </div>
  </div>
  <div
    v-if="isDetails"
    :class="{ 'details-cont': true, fade: isBack }"
  >
    <div class="header-cont">
      <div
        ref="imgRef"
        class="img-cont"
      >
        <img
          :src="selected?.url"
          :alt="`${selected?.name} logo`"
        >
      </div>
      <div class="header">
        <div
          ref="titleRef"
          class="title"
        >
          {{ selected?.name }}
        </div>
        <div
          ref="yearRef"
          class="year"
        >
          Experience since:
          <span>
            {{ selected?.year }}
          </span>
        </div>
      </div>
    </div>
    <div
      ref="descriptionRef"
      class="description"
    >
      {{ selected?.description }}
    </div>
    <ReturnButton
      ref="returnRef"
      @click="isBack = true"
    />
  </div>
</template>

<style scoped>
.container {
  transition: 600ms opacity;
}
.grid {
  --img-size: 6vh;
  --spacing: 0.5; /* space between images in image sizes */
  --radius: calc(0.5 * (1 + var(--spacing)) * var(--img-size) / var(--tan));
  --cont-size: calc(2 * var(--radius) + var(--img-size));
  position: relative;
  width: var(--cont-size);
  height: var(--cont-size);
  & > .icon-btn-cont {
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

.eye {
  min-width: 15vh;
  min-height: 15vh;
  max-width: 15vh;
  max-height: 15vh;
  border-radius: 50%;
  border: 4px solid white;
  position: absolute;
  top: 59.4vh;
  left: 59vh;
  box-shadow: 0 0 150px 0 white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  transition: background-color 0.5s, box-shadow 1.5s;
}

.white {
  background-color: white;
  box-shadow: 0 0 150px 1000px white;
}

.details-cont {
  z-index: 2000;
  color: black;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  transition: 800ms opacity;

  & > div {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 2vh;
  }

  .img-cont {
    width: 12vh;
    height: 12vh;
    border: 2px solid black;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & > img {
      width: 60%;
      height: 60%;
    }
  }

  .header-cont {
    padding-bottom: 2vh;
    border-bottom: 1px dotted black;
  }

  .header {
    display: flex;
    flex-direction: column;
    padding-bottom: 1vh;
    border-bottom: 2px solid black;
  }

  .year {
    font-size: 2vh;
    & > span {
      font-weight: bold;
    }
  }

  .title {
    font-size: 4vh;
    font-weight: bolder;
  }

  .description {
    margin: 2vh 0;
    min-height: 20vh;
    width: 55%;
    font-weight: bold;
    font-size: 20px;
  }
}

.fade {
  opacity: 0;
}
</style>
