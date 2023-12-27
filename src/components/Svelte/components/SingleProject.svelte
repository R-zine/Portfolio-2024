<script lang="ts">
import {
    inview
} from 'svelte-inview';
import {
    fade
} from 'svelte/transition';

export let description: string;
export let tech: string[];
export let preview: string;
export let source: string;
export let site: string;
export let index: number;
export let currentIndex: number;

let stage1 = false,
    stage2 = false,
    stage3 = false

const openLink = (link: string) => window.open(link, "_blank")
</script>

<div class="single-project" data-id={index} use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
    on:inview_change={({ detail }) => {
    if(detail.inView) currentIndex = index;
    }}>

    <div class="project-img" class:grayscale={stage2 || stage3} style="background: url({preview}); " />
    <div use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
    on:inview_change={({ detail }) => {
    stage1 = detail.inView;
    }}>
    
        <div class="title" class:hidden={!stage1}>
            Description:
        </div>

        <div class="body" class:hidden={!stage1}>
            {description}
        </div>
        <hr  class:hidden={!stage1} />
    </div>

    <div use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
    on:inview_change={({ detail }) => {
    stage2 = detail.inView;
    }}>
        <div class="title"  class:hidden={!stage2}>Tech used:</div>
        <div class="body-tech" class:hidden={!stage2}>
            {#each tech as t}
            <div class="tech">
                {t}
            </div>
            {/each}
        </div>
        <hr class:hidden={!stage2} />
    </div>
    <div use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
    on:inview_change={({ detail }) => {
    stage3 = detail.inView;
    }}>
        <div class="title" class:hidden={!stage3}>Links:</div>
        <div class="links" class:hidden={!stage3}>
            <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
            <div class="button" on:click={() => openLink(source)}>Source</div>
            <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
            <div class="button" on:click={() => openLink(site)}>Website</div>
        </div>
        <hr class:hidden={!stage3} />
    </div>

    <div class="bottom-pad" />
</div>

<style lang="scss">
.single-project {
    min-height: 100vh;
    text-align: center;
    position: relative !important;

    .hidden {
        opacity: 0;
    }

    .grayscale {
        filter: grayscale(100%) opacity(0.5);
    }

    &>div {
        z-index: 2001 !important;
        position: relative !important;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &>.title {
            padding: 1vh;
            background-color: white;
            color: black;
            margin-bottom: 2vh;
            font-weight: bolder;
            transition: 300ms;
        }

        &>.body {
            padding: 1vh 15%;
            background-color: black;
            transition: 600ms;

        }

        .body-tech {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2vh;
            margin-bottom: 5vh;
            transition: 600ms;

            &>.tech {
                border: 2px solid white;
                height: 2vh;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1vh;
                background-color: black;
            }
        }

        .links {
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            transition: 600ms;

            &>div {
                width: 25%;
                font-weight: bold;
                padding: 1vh;
                border: 2px solid white;
                transition: 600ms;
                margin-bottom: 5vh;
                background-color: black;

                &:hover {
                    background-color: white;
                    color: black;
                    box-shadow: 0 0 20px 5px white;
                }
            }
        }

        &>hr {
            width: 50%;
            margin-bottom: 5vh;
            transition: 900ms;
        }
    }

    &>.project-img {
        position: sticky !important;
        top: 0;
        left: 0;
        min-width: 100%;
        min-height: 100vh;
        background-repeat: no-repeat !important;
        background-size: contain !important;
        background-position: center !important;
        z-index: 1 !important;
        transition: 900ms ease-out;

    }

}

.bottom-pad {
    min-height: 100vh;
    min-width: 100%;
    box-shadow: 0 0 50px 50px black;
    background-color: black;
}
</style>
