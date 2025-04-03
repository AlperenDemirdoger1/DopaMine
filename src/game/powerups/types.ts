import { Position } from '../types';

export type PowerUpType = 'health' | 'invincibility' | 'speed' | 'damage';
export type CollectibleType = 'coin' | 'gem' | 'key';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Position;
  duration: number; // Duration in seconds, 0 for instant effects
  value: number; // Amount to heal, speed multiplier, etc.
  size: number;
  collected: boolean;
  active: boolean;
  activatedAt: number | null;
  expiresAt: number | null;
}

export interface Collectible {
  id: string;
  type: CollectibleType;
  position: Position;
  value: number;
  size: number;
  collected: boolean;
}

export interface PowerUpEffect {
  type: PowerUpType;
  value: number;
  duration: number;
  startTime: number;
  endTime: number;
}
