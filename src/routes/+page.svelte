<script lang="ts">
import { preloadCode, preloadData } from "$app/navigation";
import { fade, fly } from "svelte/transition";
import drPulumiImage from "$lib/images/dr-pulumi.png";
import { onMount } from "svelte";

// const rank = localStorage.getItem("drpulumi-rank") || "Pulumi Noob";

let visible = false;
onMount(() => {
	visible = true;
});

// This loads the game on the home page
// preloadCode('/game');
</script>

{#if visible}
	<header>
		<h1 transition:fly={{ y: -40, duration: 2000 }}>Dr Pulumi</h1>
		<p transition:fade={{ duration: 1000, delay: 200 }}>
			A long time ago, in the age when every infrastructure change required frantic button-clicking,
			there emerged a man, a legend: Dr Pulumi. His brilliance and innovation would forever redefine
			the destiny of the Web Team.
		</p>
        <p transition:fade={{ duration: 1000, delay: 1000 }}>
            Use arrows to move and space to execute fixes.
        </p>
		<img
			transition:fly={{ x: -1000, duration: 1000, delay: 0 }}
			src={drPulumiImage}
			alt="Drawing of Dr Pulumi"
		/>
		<!-- <p class="rank">Current Rank: <span>{rank}</span></p> -->

		<a transition:fly={{ y: 100, duration: 2000 }} href="/game">Fix problems</a>
	</header>
{/if}

<style>
	/* .rank span {
		font-size: 1.5rem;
	} */
</style>
