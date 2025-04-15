import { Enemy, Position } from '../types';

export type EnemyType = 'minion' | 'archer' | 'mage' | 'brute' | 'boss';

export interface EnemyTemplate {
  type: EnemyType;
  health: number;
  maxHealth: number;
  damage: number;
  moveSpeed: number;
  size: number;
  sprite: string;
  attackRange: number;
  attackCooldown: number;
  experienceValue: number;
  description: string;
  behavior: 'melee' | 'ranged' | 'area' | 'stationary';
}

export const ENEMY_TEMPLATES: Record<EnemyType, EnemyTemplate> = {
  minion: {
    type: 'minion',
    health: 30,
    maxHealth: 30,
    damage: 5,
    moveSpeed: 1.5,
    size: 20,
    sprite: '👾',
    attackRange: 50,
    attackCooldown: 2000,
    experienceValue: 10,
    description: 'Basic enemy that follows the player and attacks at close range',
    behavior: 'melee'
  },
  archer: {
    type: 'archer',
    health: 25,
    maxHealth: 25,
    damage: 8,
    moveSpeed: 1.2,
    size: 22,
    sprite: '🏹',
    attackRange: 300,
    attackCooldown: 3000,
    experienceValue: 15,
    description: 'Ranged enemy that keeps distance and shoots projectiles',
    behavior: 'ranged'
  },
  mage: {
    type: 'mage',
    health: 20,
    maxHealth: 20,
    damage: 12,
    moveSpeed: 1.0,
    size: 24,
    sprite: '🧙',
    attackRange: 250,
    attackCooldown: 4000,
    experienceValue: 20,
    description: 'Powerful spellcaster that can attack from a distance with area effects',
    behavior: 'ranged'
  },
  brute: {
    type: 'brute',
    health: 80,
    maxHealth: 80,
    damage: 15,
    moveSpeed: 0.8,
    size: 30,
    sprite: '👹',
    attackRange: 70,
    attackCooldown: 3500,
    experienceValue: 25,
    description: 'Tough enemy with high health and damage but slow movement',
    behavior: 'melee'
  },
  boss: {
    type: 'boss',
    health: 200,
    maxHealth: 200,
    damage: 20,
    moveSpeed: 0.7,
    size: 40,
    sprite: '👿',
    attackRange: 150,
    attackCooldown: 5000,
    experienceValue: 100,
    description: 'Chapter boss with high health, damage, and area attacks',
    behavior: 'area'
  }
};

export const createEnemy = (
  type: EnemyType, 
  position: Position, 
  id: string,
  difficultyMultiplier: number = 1
): Enemy => {
  const template = ENEMY_TEMPLATES[type];
  
  return {
    id,
    type,
    position: { ...position },
    health: Math.round(template.health * difficultyMultiplier),
    maxHealth: Math.round(template.maxHealth * difficultyMultiplier),
    damage: Math.round(template.damage * difficultyMultiplier),
    moveSpeed: template.moveSpeed,
    sprite: template.sprite,
    size: template.size,
    attackRange: template.attackRange,
    attackCooldown: template.attackCooldown,
    experienceValue: Math.round(template.experienceValue * difficultyMultiplier)
  };
};

export const getEnemyBehavior = (enemy: Enemy): 'melee' | 'ranged' | 'area' | 'stationary' => {
  const template = ENEMY_TEMPLATES[enemy.type as EnemyType];
  return template ? template.behavior : 'melee';
};

export const getEnemyExperienceValue = (enemy: Enemy): number => {
  const template = ENEMY_TEMPLATES[enemy.type as EnemyType];
  return template ? enemy.experienceValue || template.experienceValue : 10;
};
