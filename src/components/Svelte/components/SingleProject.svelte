<script lang="ts">
import {
    inview
} from 'svelte-inview';
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
    
        <div class="title reveal-content" class:hidden={!stage1}>
            Description:
        </div>

        <div class="body reveal-content reveal-body" class:hidden={!stage1}>
            {description}
        </div>
        <hr class="reveal-content reveal-divider" class:hidden={!stage1} />
    </div>

    <div use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
    on:inview_change={({ detail }) => {
    stage2 = detail.inView;
    }}>
        <div class="title reveal-content" class:hidden={!stage2}>Tech used:</div>
        <div class="body-tech reveal-content reveal-body" class:hidden={!stage2}>
            {#each tech as t (t)}
            <div class="tech">
                {t}
            </div>
            {/each}
        </div>
        <hr class="reveal-content reveal-divider" class:hidden={!stage2} />
    </div>
    <div use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
    on:inview_change={({ detail }) => {
    stage3 = detail.inView;
    }}>
        <div class="title reveal-content" class:hidden={!stage3}>Links:</div>
        <div class="links reveal-content reveal-body" class:hidden={!stage3}>
            <a class="button" href={source} target="_blank" rel="noopener noreferrer">Source</a>
            <a class="button" href={site} target="_blank" rel="noopener noreferrer">Website</a>
        </div>
        <hr class="reveal-content reveal-divider" class:hidden={!stage3} />
    </div>

    <div class="bottom-pad" />
</div>

<style lang="scss">
.single-project {
    min-height: 100vh;
    text-align: center;
    position: relative !important;

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
        }

        &>.body {
            padding: 1vh 15%;
            background-color: black;

        }

        .body-tech {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2vh;
            margin-bottom: 5vh;

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

            &>a {
                width: 25%;
                font-weight: bold;
                padding: 1vh;
                border: 2px solid white;
                transition: 600ms;
                margin-bottom: 5vh;
                background-color: black;
                color: white;
                text-decoration: none;

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

    .reveal-content {
        --reveal-delay: 0ms;
        --reveal-duration: 550ms;

        opacity: 1;
        visibility: visible;
        transition:
            opacity var(--reveal-duration) ease-out var(--reveal-delay),
            visibility 0s linear 0s;
    }

    .reveal-body {
        --reveal-delay: 100ms;
        --reveal-duration: 750ms;
    }

    .reveal-divider {
        --reveal-delay: 180ms;
        --reveal-duration: 650ms;
    }

    .reveal-content.hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
            opacity 350ms ease,
            visibility 0s linear 350ms;
    }

}

.bottom-pad {
    min-height: 100vh;
    min-width: 100%;
    box-shadow: 0 0 50px 50px black;
    background-color: black;
}
</style>
