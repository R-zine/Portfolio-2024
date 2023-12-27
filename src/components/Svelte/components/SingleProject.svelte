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

const openLink = (link: string) => window.open(link, "_blank")
</script>

<div class="single-project" data-id={index} use:inview={{ unobserveOnEnter: false, rootMargin: '-20%' }}
    on:inview_change={({ detail }) => {
    if(detail.inView) currentIndex = index;
    }}>

    <div class="project-img" style="background: url({preview}); " />
    <div >
        <div class="title">
            Description:
        </div>

        <div class="body">
            {description}
        </div>
        <hr />
    </div>

    <div>
        <div class="title">Tech used:</div>
        <div class="body-tech">
            {#each tech as t}
            <div class="tech">
                {t}
            </div>
            {/each}
        </div>
        <hr />
    </div>
    <div>
        <div class="title">Links:</div>
        <div class="links">
            <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
            <div class="button" on:click={() => openLink(source)}>Source</div>
            <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
            <div class="button" on:click={() => openLink(site)}>Website</div>
        </div>
        <hr />
    </div>

    <div class="bottom-pad" />
</div>

<style lang="scss">
.single-project {
    min-height: 100vh;
    text-align: center;
    position: relative !important;

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

    }

}

.bottom-pad {
    min-height: 100vh;
    min-width: 100%;
    box-shadow: 0 0 50px 50px black;
    background-color: black;
}
</style>
