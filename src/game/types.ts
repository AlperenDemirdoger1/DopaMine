
export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Position;
  health: number;
  maxHealth: number;
  sprite: string;
  size: number;
}

export interface Player extends Entity {
  damage: number;
  score: number;
  type?: string;
  level?: number;
  experience?: number;
  experienceToNextLevel?: number;
  specialAbility?: any;
}

export interface Enemy extends Entity {
  damage: number;
  moveSpeed: number;
  type: string;
}

export interface Room {
  id: string;
  width: number;
  height: number;
  enemies: Enemy[];
  exits: Position[];
}

export interface GameState {
  player: Player;
  currentRoom: Room;
  rooms: Room[];
  gameOver: boolean;
  score: number;
  level: number;
  characterSelected: boolean;
  characterType?: string;
  characterAppearance?: any;
}

export type GameAction = 
  | { type: 'MOVE_PLAYER'; payload: Position }
  | { type: 'PLAYER_ATTACK'; payload: Position }
  | { type: 'ENEMY_ATTACK'; payload: string }
  | { type: 'DAMAGE_PLAYER'; payload: number }
  | { type: 'DAMAGE_ENEMY'; payload: { id: string; damage: number } }
  | { type: 'CHANGE_ROOM'; payload: string }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART_GAME' };
