<script lang="ts">
import { fade } from "svelte/transition";
import drPulumiImage from "$lib/images/dr-pulumi.png";
import { onMount } from "svelte";

let visible = false;
onMount(() => {
	visible = true;
});
</script>

{#if visible}
<header transition:fade={{ duration: 1000, delay: 0 }}>
	<h1>Dr Pulumi</h1>

		<p>Don't give up!</p>	

		<img src={drPulumiImage} alt="Drawing of Dr Pulumi" />
		<a href="/game">Try Again</a>
	</header>
{/if}
