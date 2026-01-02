<script lang="ts">
	import { onMount } from 'svelte';
	import { createInitialGameState, updateGameState, DEFAULT_CONFIG } from './engine';
	import { render } from './renderer';
	import type { GameState, GameConfig } from './types';

	const CANVAS_WIDTH = 800;
	const CANVAS_HEIGHT = 600;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let gameState: GameState = $state(createInitialGameState(DEFAULT_CONFIG, CANVAS_WIDTH, CANVAS_HEIGHT));
	let config: GameConfig = DEFAULT_CONFIG;
	let animationId: number;
	let lastTime = 0;

	function handleKeyDown(e: KeyboardEvent) {
		if (gameState.status !== 'playing') {
			if (e.code === 'Space') {
				resetGame();
			}
			return;
		}

		switch (e.code) {
			case 'ArrowUp':
			case 'KeyW':
				gameState.lander.isThrusting = true;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				gameState.lander.isRotatingLeft = true;
				break;
			case 'ArrowRight':
			case 'KeyD':
				gameState.lander.isRotatingRight = true;
				break;
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		switch (e.code) {
			case 'ArrowUp':
			case 'KeyW':
				gameState.lander.isThrusting = false;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				gameState.lander.isRotatingLeft = false;
				break;
			case 'ArrowRight':
			case 'KeyD':
				gameState.lander.isRotatingRight = false;
				break;
		}
	}

	function resetGame() {
		gameState = createInitialGameState(config, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	function gameLoop(timestamp: number) {
		const deltaTime = lastTime ? timestamp - lastTime : 16.67;
		lastTime = timestamp;

		gameState = updateGameState(gameState, config, deltaTime);

		if (ctx) {
			render(ctx, gameState);
		}

		animationId = requestAnimationFrame(gameLoop);
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		if (ctx) {
			animationId = requestAnimationFrame(gameLoop);
		}

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<svelte:window onkeydown={handleKeyDown} onkeyup={handleKeyUp} />

<div class="game-container">
	<canvas
		bind:this={canvas}
		width={CANVAS_WIDTH}
		height={CANVAS_HEIGHT}
	></canvas>
</div>

<style>
	.game-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
	}

	canvas {
		border: 2px solid #333;
		border-radius: 4px;
		box-shadow: 0 0 20px rgba(0, 100, 255, 0.3);
	}
</style>
