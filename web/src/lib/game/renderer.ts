import type { GameState, Terrain, LanderState } from './types';

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
	const { width, height } = ctx.canvas;

	// Clear canvas
	ctx.fillStyle = '#000011';
	ctx.fillRect(0, 0, width, height);

	// Draw stars
	drawStars(ctx, width, height);

	// Draw terrain
	drawTerrain(ctx, state.terrain, height);

	// Draw lander
	drawLander(ctx, state.lander);

	// Draw HUD
	drawHUD(ctx, state);
}

function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number): void {
	ctx.fillStyle = '#ffffff';
	// Use deterministic "random" stars based on position
	for (let i = 0; i < 100; i++) {
		const x = (i * 7919) % width;
		const y = (i * 7927) % (height * 0.6);
		const size = ((i * 13) % 3) + 1;
		ctx.beginPath();
		ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawTerrain(ctx: CanvasRenderingContext2D, terrain: Terrain, height: number): void {
	// Draw terrain fill
	ctx.fillStyle = '#333344';
	ctx.beginPath();
	ctx.moveTo(terrain.points[0].x, height);
	for (const point of terrain.points) {
		ctx.lineTo(point.x, point.y);
	}
	ctx.lineTo(terrain.points[terrain.points.length - 1].x, height);
	ctx.closePath();
	ctx.fill();

	// Draw terrain outline
	ctx.strokeStyle = '#666688';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(terrain.points[0].x, terrain.points[0].y);
	for (let i = 1; i < terrain.points.length; i++) {
		ctx.lineTo(terrain.points[i].x, terrain.points[i].y);
	}
	ctx.stroke();

	// Draw landing pads
	ctx.fillStyle = '#44ff44';
	ctx.strokeStyle = '#88ff88';
	ctx.lineWidth = 3;
	for (const pad of terrain.landingPads) {
		ctx.beginPath();
		ctx.moveTo(pad.x, pad.y);
		ctx.lineTo(pad.x + pad.width, pad.y);
		ctx.stroke();

		// Draw pad markers
		ctx.fillStyle = '#44ff44';
		ctx.fillRect(pad.x, pad.y - 5, 5, 5);
		ctx.fillRect(pad.x + pad.width - 5, pad.y - 5, 5, 5);
	}
}

function drawLander(ctx: CanvasRenderingContext2D, lander: LanderState): void {
	ctx.save();
	ctx.translate(lander.position.x, lander.position.y);
	ctx.rotate(lander.angle);

	// Draw thrust flame
	if (lander.isThrusting && lander.fuel > 0) {
		ctx.fillStyle = '#ff6600';
		ctx.beginPath();
		ctx.moveTo(-5, 15);
		ctx.lineTo(5, 15);
		ctx.lineTo(0, 15 + 10 + Math.random() * 10);
		ctx.closePath();
		ctx.fill();

		// Inner flame
		ctx.fillStyle = '#ffff00';
		ctx.beginPath();
		ctx.moveTo(-3, 15);
		ctx.lineTo(3, 15);
		ctx.lineTo(0, 15 + 5 + Math.random() * 5);
		ctx.closePath();
		ctx.fill();
	}

	// Draw lander body
	ctx.fillStyle = '#cccccc';
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 2;

	// Main body (rectangle)
	ctx.beginPath();
	ctx.rect(-10, -10, 20, 20);
	ctx.fill();
	ctx.stroke();

	// Cockpit
	ctx.fillStyle = '#4488ff';
	ctx.beginPath();
	ctx.arc(0, -5, 5, 0, Math.PI * 2);
	ctx.fill();

	// Legs
	ctx.strokeStyle = '#888888';
	ctx.lineWidth = 2;
	// Left leg
	ctx.beginPath();
	ctx.moveTo(-8, 10);
	ctx.lineTo(-12, 18);
	ctx.lineTo(-16, 18);
	ctx.stroke();
	// Right leg
	ctx.beginPath();
	ctx.moveTo(8, 10);
	ctx.lineTo(12, 18);
	ctx.lineTo(16, 18);
	ctx.stroke();

	ctx.restore();
}

function drawHUD(ctx: CanvasRenderingContext2D, state: GameState): void {
	ctx.fillStyle = '#ffffff';
	ctx.font = '14px monospace';

	// Fuel gauge
	const fuelPercent = state.lander.fuel / 100;
	ctx.fillText(`FUEL`, 10, 25);
	ctx.strokeStyle = '#ffffff';
	ctx.strokeRect(50, 12, 100, 16);
	ctx.fillStyle = fuelPercent > 0.25 ? '#44ff44' : '#ff4444';
	ctx.fillRect(52, 14, 96 * fuelPercent, 12);

	// Velocity
	ctx.fillStyle = '#ffffff';
	const vx = state.lander.velocity.x.toFixed(1);
	const vy = state.lander.velocity.y.toFixed(1);
	ctx.fillText(`VEL X: ${vx}  Y: ${vy}`, 10, 50);

	// Angle
	const angleDeg = ((state.lander.angle * 180) / Math.PI).toFixed(1);
	ctx.fillText(`ANGLE: ${angleDeg}°`, 10, 70);

	// Altitude (approximate)
	const altitude = Math.max(0, 500 - state.lander.position.y).toFixed(0);
	ctx.fillText(`ALT: ${altitude}`, 10, 90);

	// Status message
	if (state.status !== 'playing') {
		ctx.font = 'bold 32px monospace';
		ctx.textAlign = 'center';

		if (state.status === 'landed') {
			ctx.fillStyle = '#44ff44';
			ctx.fillText('LANDED!', 400, 200);
			ctx.font = '20px monospace';
			ctx.fillText(`Score: ${state.score}`, 400, 240);
		} else if (state.status === 'crashed') {
			ctx.fillStyle = '#ff4444';
			ctx.fillText('CRASHED!', 400, 200);
		}

		ctx.font = '16px monospace';
		ctx.fillStyle = '#ffffff';
		ctx.fillText('Press SPACE to restart', 400, 280);
		ctx.textAlign = 'left';
	}

	// Controls hint
	ctx.fillStyle = '#666666';
	ctx.font = '12px monospace';
	ctx.textAlign = 'right';
	ctx.fillText('← → Rotate | ↑ Thrust', 790, 590);
	ctx.textAlign = 'left';
}
