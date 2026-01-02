import type { GameState, GameConfig, LanderState, Terrain, Vector2D, LandingPad } from './types';

export const DEFAULT_CONFIG: GameConfig = {
	gravity: 0.1,
	thrustPower: 0.2,
	rotationSpeed: 0.05,
	maxLandingSpeed: 2.0,
	maxLandingAngle: Math.PI / 6, // 30 degrees
	fuelConsumptionRate: 0.5,
	initialFuel: 100
};

export function createInitialLanderState(config: GameConfig): LanderState {
	return {
		position: { x: 400, y: 50 },
		velocity: { x: (Math.random() - 0.5) * 2, y: 0 },
		angle: 0,
		angularVelocity: 0,
		fuel: config.initialFuel,
		isThrusting: false,
		isRotatingLeft: false,
		isRotatingRight: false
	};
}

export function generateTerrain(width: number, height: number): Terrain {
	const points: Vector2D[] = [];
	const landingPads: LandingPad[] = [];

	// Generate random terrain with flat landing pads
	const numSegments = 20;
	const segmentWidth = width / numSegments;

	// Decide landing pad positions (2-3 pads)
	const numPads = 2 + Math.floor(Math.random() * 2);
	const padPositions = new Set<number>();
	while (padPositions.size < numPads) {
		padPositions.add(2 + Math.floor(Math.random() * (numSegments - 4)));
	}

	let currentY = height * 0.7 + Math.random() * 50;

	for (let i = 0; i <= numSegments; i++) {
		const x = i * segmentWidth;

		if (padPositions.has(i)) {
			// Create flat landing pad
			const padWidth = segmentWidth * 1.5;
			landingPads.push({ x: x - segmentWidth * 0.25, width: padWidth, y: currentY });
			points.push({ x, y: currentY });
		} else if (padPositions.has(i - 1)) {
			// Continue flat after pad
			points.push({ x, y: currentY });
		} else {
			// Random terrain
			currentY = Math.max(height * 0.5, Math.min(height * 0.9, currentY + (Math.random() - 0.5) * 60));
			points.push({ x, y: currentY });
		}
	}

	return { points, landingPads };
}

export function createInitialGameState(config: GameConfig, canvasWidth: number, canvasHeight: number): GameState {
	return {
		lander: createInitialLanderState(config),
		terrain: generateTerrain(canvasWidth, canvasHeight),
		status: 'playing',
		score: 0,
		time: 0
	};
}

export function updateGameState(state: GameState, config: GameConfig, deltaTime: number): GameState {
	if (state.status !== 'playing') {
		return state;
	}

	const dt = deltaTime / 16.67; // Normalize to ~60fps
	let { lander, terrain, status, score, time } = state;

	// Create new lander state
	let newLander = { ...lander };

	// Apply rotation
        if (lander.isRotatingLeft) {
                newLander.angularVelocity = config.rotationSpeed;
        } else if (lander.isRotatingRight) {
                newLander.angularVelocity = -config.rotationSpeed;
        } else {
                newLander.angularVelocity = 0;
        }

	newLander.angle += newLander.angularVelocity * dt;

	// Apply gravity
	newLander.velocity = {
		x: lander.velocity.x,
		y: lander.velocity.y + config.gravity * dt
	};

	// Apply thrust
	if (lander.isThrusting && lander.fuel > 0) {
		const thrustX = Math.sin(newLander.angle) * config.thrustPower * dt;
		const thrustY = -Math.cos(newLander.angle) * config.thrustPower * dt;
		newLander.velocity.x -= thrustX;
		newLander.velocity.y += thrustY;
		newLander.fuel = Math.max(0, lander.fuel - config.fuelConsumptionRate * dt);
	}

	// Update position
	newLander.position = {
		x: lander.position.x + newLander.velocity.x * dt,
		y: lander.position.y + newLander.velocity.y * dt
	};

	// Check collision with terrain
	const collision = checkTerrainCollision(newLander, terrain, config);
	if (collision.collided) {
		status = collision.landed ? 'landed' : 'crashed';
		if (collision.landed) {
			score = calculateScore(newLander, time);
		}
		newLander.velocity = { x: 0, y: 0 };
		newLander.angularVelocity = 0;
	}

	// Check out of bounds
	if (newLander.position.x < 0 || newLander.position.x > 800 || newLander.position.y < 0) {
		status = 'crashed';
	}

	// Check out of fuel while in air
	if (newLander.fuel <= 0 && status === 'playing') {
		// Continue playing but can't thrust
	}

	return {
		lander: newLander,
		terrain,
		status,
		score,
		time: time + deltaTime
	};
}

interface CollisionResult {
	collided: boolean;
	landed: boolean;
}

function checkTerrainCollision(lander: LanderState, terrain: Terrain, config: GameConfig): CollisionResult {
	const landerBottom = lander.position.y + 15; // Lander height offset

	// Find terrain height at lander position
	for (let i = 0; i < terrain.points.length - 1; i++) {
		const p1 = terrain.points[i];
		const p2 = terrain.points[i + 1];

		if (lander.position.x >= p1.x && lander.position.x <= p2.x) {
			// Interpolate terrain height
			const t = (lander.position.x - p1.x) / (p2.x - p1.x);
			const terrainY = p1.y + t * (p2.y - p1.y);

			if (landerBottom >= terrainY) {
				// Check if on landing pad
				const onPad = terrain.landingPads.some(
					pad => lander.position.x >= pad.x && lander.position.x <= pad.x + pad.width
				);

				// Check landing conditions
				const speed = Math.sqrt(lander.velocity.x ** 2 + lander.velocity.y ** 2);
				const angleOk = Math.abs(lander.angle) <= config.maxLandingAngle;
				const speedOk = speed <= config.maxLandingSpeed;

				const landed = onPad && angleOk && speedOk;

				return { collided: true, landed };
			}
		}
	}

	return { collided: false, landed: false };
}

function calculateScore(lander: LanderState, time: number): number {
	const fuelBonus = lander.fuel * 10;
	const timeBonus = Math.max(0, 1000 - time / 100);
	return Math.round(fuelBonus + timeBonus);
}
