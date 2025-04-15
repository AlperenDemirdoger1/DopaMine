
export interface Position {
  x: number;
  y: number;
}

export interface PowerUpEffect {
  type: string;
  value: number;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface Player {
  id: string;
  position: Position;
  health: number;
  maxHealth: number;
  damage: number;
  score: number;
  sprite: string;
  size: number;
  type: string;
  level?: number;
  experience?: number;
  experienceToNextLevel?: number;
  activeEffects: PowerUpEffect[];
  coins: number;
  gems: number;
  keys: number;
  lastMoveDirection?: Position;
}

export interface Enemy {
  id: string;
  position: Position;
  health: number;
  maxHealth: number;
  damage: number;
  moveSpeed: number;
  type: string;
  sprite: string;
  size: number;
  lastAttackTime?: number;
  attackCooldown?: number;
  attackRange?: number;
  experienceValue?: number;
}

export interface Room {
  id: string;
  width: number;
  height: number;
  enemies: Enemy[];
  exits: {
    position: Position;
    targetRoomId: string;
  }[];
}

export interface PowerUp {
  id: string;
  type: string;
  position: Position;
  duration: number;
  value: number;
  size: number;
  collected: boolean;
  active: boolean;
  activatedAt: number | null;
  expiresAt: number | null;
}

export interface Collectible {
  id: string;
  type: string;
  position: Position;
  value: number;
  size: number;
  collected: boolean;
}

export interface Obstacle {
  id: string;
  type: 'spike' | 'laser' | 'turret' | 'wall';
  position: Position;
  size: number;
  damage: number;
  attackRange?: number;
  attackCooldown?: number;
  lastAttackTime?: number;
  isActive: boolean;
  activationInterval?: number;
  lastActivationTime?: number;
}

export interface GameState {
  player: Player;
  currentRoom: Room;
  rooms: Room[];
  gameOver: boolean;
  score: number;
  level: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  characterSelected: boolean;
  characterType: string;
  characterAppearance: any;
  powerUps: PowerUp[];
  collectibles: Collectible[];
  obstacles: Obstacle[];
  skillsAvailable: boolean;
}
