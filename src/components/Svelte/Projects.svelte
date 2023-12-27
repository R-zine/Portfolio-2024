<script lang="ts">
import {
    onMount
} from "svelte";
import {
    projects
} from "./utils/projects"
import SingleProject from "./components/SingleProject.svelte";
import {
    inview
} from 'svelte-inview';
import { fade } from 'svelte/transition';

let container: HTMLDivElement, percentage: number, currentIndex: number = -3;

onMount(() => {
    const spinner = document.querySelector(".spinner");
    if (spinner)(spinner as HTMLElement).style.display = "none";

    setTimeout(() => {
        currentIndex = -1
    }, 600);
})


</script>

<div class="projects" style="--percent: {percentage}">
    <div class="scroll-cont" bind:this={container} on:scroll={()=> percentage = (100 * (container.scrollTop / (container.scrollHeight - container.clientHeight)))} >

        <div data-id="-1" class="intro"
            use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
            on:inview_change={({ detail }) => {
            if(detail.inView) currentIndex = -1;
            }}>
            {#if currentIndex === -1}
            <div transition:fade>
                Scroll down for more
            </div>
            <div class="svg-cont"  transition:fade={{delay: 600}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                    <path d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"/>
                        </svg>
                        </div>
                        {/if}
                        </div>

                        {#each projects as project, i}
                        <SingleProject {...project} index={i} bind:currentIndex />
                        {/each}
                        <div data-id="-2" style="display: flex; align-items: center; justify-content: center;" use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
                            on:inview_change={({ detail }) => {
                            if(detail.inView) currentIndex = -2;
                            }}>

                            <div class="question">?</div>
                        </div>
                        <div style="min-height: 35vh;" />
                        <div class="bottom-curtain" />
                        </div>
                        <div class="navigation">
                            <div>
                                <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
                                <div class="button"  class:navigation-active={currentIndex === -1} on:click={() => {currentIndex = -1
                                    document.querySelector(`[data-id="${-1}"]`)?.scrollIntoView({ behavior: "smooth" })
                                    }} />
                                {#each projects as _project, i}
                                <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
                                <div class="button"  class:navigation-active={currentIndex === i} on:click={() => {currentIndex = i
                                    document.querySelector(`[data-id="${i}"]`)?.scrollIntoView({ behavior: "smooth" })
                                    }} />
                                {/each}
                                <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
                                <div class="button"  class:navigation-active={currentIndex === -2} on:click={() => {currentIndex = -2
                                    document.querySelector(`[data-id="${-2}"]`)?.scrollIntoView({ behavior: "smooth" })
                                    }} />
                            </div>
                        </div>
                        </div>

<style lang="scss">
.projects {
    width: 82%;
    height: 82%;
    border-radius: 50%;
    border: 2px solid grey;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background:
        radial-gradient(closest-side, white 79%, transparent 80% 100%),
        conic-gradient(white calc(var(--percent) * 1%), black 0);

    &>.scroll-cont {
        -ms-overflow-style: none;
        scrollbar-width: none;
        position: relative;
        height: 97%;
        width: 97%;
        border-radius: 50%;
        background-color: black;
        overflow-y: scroll;
        border: 1vh solid black;
        outline: 2px solid grey;

        &>.bottom-curtain {
            position: sticky;
            bottom: 0;
            left: 0;
            background-color: black;
            box-shadow: 0 0 50px 50px black;
            min-height: 15vh;
            min-width: 100%;
            z-index: 3002;
        }
    }

    &>.scroll-cont::-webkit-scrollbar {
        display: none;
    }

    .intro {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 1.5vh;
        font-size: larger;
        font-weight: bolder;

        .svg-cont {
            border: 1.5px solid white;
            border-radius: 50%;
            width: 3vh;
            height: 3vh;
            display: flex;
            align-items: center;
            justify-content: center;

            &>svg {
                filter: invert(100%);
            }
        }
    }

    .question {
        min-width: 30vh;
        min-height: 30vh;
        max-height: 30vh;
        max-width: 30vh;
        font-size: 20vh;
        font-weight: bolder;
        border: 5px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-self: center;
        z-index: 3000;
        position: relative !important;

    }

    .navigation {
        position: absolute;
        top: 90vh;
        min-height: 5vh;
        left: 0;
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: space-evenly;
        z-index: 4000;

        &>div {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: space-evenly;

            &>div {
                border: 1.5px solid white;
                border-radius: 50%;
                min-width: 1vh;
                min-height: 1vh;
                transition: 700ms;

                &:hover {
                    background-color: white;
                    box-shadow: 0 0 10px 2px white;
                }

            }

            .navigation-active {
                background-color: white;
                box-shadow: 0 0 10px 2px white;
            }
        }
    }

}
</style>
