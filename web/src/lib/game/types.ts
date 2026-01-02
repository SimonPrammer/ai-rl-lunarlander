export interface Vector2D {
	x: number;
	y: number;
}

export interface LanderState {
	position: Vector2D;
	velocity: Vector2D;
	angle: number; // radians
	angularVelocity: number;
	fuel: number;
	isThrusting: boolean;
	isRotatingLeft: boolean;
	isRotatingRight: boolean;
}

export interface GameConfig {
	gravity: number;
	thrustPower: number;
	rotationSpeed: number;
	maxLandingSpeed: number;
	maxLandingAngle: number; // radians
	fuelConsumptionRate: number;
	initialFuel: number;
}

export interface Terrain {
	points: Vector2D[];
	landingPads: LandingPad[];
}

export interface LandingPad {
	x: number;
	width: number;
	y: number;
}

export type GameStatus = 'playing' | 'landed' | 'crashed' | 'out_of_fuel';

export interface GameState {
	lander: LanderState;
	terrain: Terrain;
	status: GameStatus;
	score: number;
	time: number;
}
