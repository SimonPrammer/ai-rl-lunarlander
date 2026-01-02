<script lang="ts">
	import { LunarLander } from '$lib';
</script>

<svelte:head>
	<title>Lunar Lander - RL Training Environment</title>
</svelte:head>

<main>
	<h1>Lunar Lander</h1>
	<p class="subtitle">Reinforcement Learning Training Environment</p>
	<LunarLander />
	<div class="instructions">
		<h2>Controls</h2>
		<ul>
			<li><kbd>↑</kbd> or <kbd>W</kbd> - Main thruster</li>
			<li><kbd>←</kbd> or <kbd>A</kbd> - Rotate left</li>
			<li><kbd>→</kbd> or <kbd>D</kbd> - Rotate right</li>
			<li><kbd>Space</kbd> - Restart after landing/crash</li>
		</ul>
		<h2>Objective</h2>
		<p>Land safely on the green landing pads. Keep your velocity low and stay upright!</p>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #111122;
		color: #ffffff;
		font-family: system-ui, -apple-system, sans-serif;
	}

	main {
		max-width: 900px;
		margin: 0 auto;
		padding: 20px;
		text-align: center;
	}

	h1 {
		margin: 0;
		font-size: 2.5rem;
		color: #4488ff;
	}

	.subtitle {
		margin: 5px 0 20px;
		color: #888;
		font-size: 1.1rem;
	}

	.instructions {
		margin-top: 30px;
		text-align: left;
		background: rgba(255, 255, 255, 0.05);
		padding: 20px 30px;
		border-radius: 8px;
	}

	.instructions h2 {
		color: #4488ff;
		font-size: 1.2rem;
		margin: 15px 0 10px;
	}

	.instructions h2:first-child {
		margin-top: 0;
	}

	.instructions ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.instructions li {
		padding: 5px 0;
	}

	kbd {
		background: #333;
		padding: 3px 8px;
		border-radius: 4px;
		border: 1px solid #555;
		font-family: monospace;
	}

	.instructions p {
		margin: 5px 0;
		color: #aaa;
	}
</style>
