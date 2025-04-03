import { Enemy, Room } from './types';
import { generatePowerUpsAndCollectibles } from './powerups/powerupGenerator';

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateEnemy = (roomWidth: number, roomHeight: number, level: number): Enemy => {
  const centerX = roomWidth / 2;
  const centerY = roomHeight / 2;
  const safeRadius = 100;
  
  let x, y;
  do {
    x = randomInt(50, roomWidth - 50);
    y = randomInt(50, roomHeight - 50);
  } while (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < safeRadius);
  
  const enemyTypes = ['basic', 'fast'];
  const type = enemyTypes[randomInt(0, enemyTypes.length - 1)];
  
  const baseHealth = 30 + (level * 10);
  const baseDamage = 5 + (level * 2);
  const baseSpeed = 50 + (level * 5);
  
  let health = baseHealth;
  let damage = baseDamage;
  let moveSpeed = baseSpeed;
  
  if (type === 'basic') {
    health *= 1.2;
    damage *= 1.2;
    moveSpeed *= 0.8;
  } else if (type === 'fast') {
    health *= 0.8;
    damage *= 0.8;
    moveSpeed *= 1.5;
  }
  
  return {
    id: `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position: { x, y },
    health,
    maxHealth: health,
    damage,
    moveSpeed,
    type,
    sprite: type,
    size: type === 'basic' ? 30 : 25
  };
};

export const generateLevel = (width: number, height: number, level: number): Room => {
  const numEnemies = 2 + Math.floor(level / 2);
  
  const enemies: Enemy[] = [];
  for (let i = 0; i < numEnemies; i++) {
    enemies.push(generateEnemy(width, height, level));
  }
  
  return {
    id: `room-${Date.now()}`,
    width,
    height,
    enemies,
    exits: [] // No exits in MVP version
  };
};

export const generateLevelWithPowerUps = (
  width: number, 
  height: number, 
  level: number, 
  playerPosition: { x: number, y: number }
) => {
  const room = generateLevel(width, height, level);
  
  const enemyPositions = room.enemies.map(enemy => enemy.position);
  
  const { powerUps, collectibles } = generatePowerUpsAndCollectibles(
    width,
    height,
    playerPosition,
    enemyPositions,
    level
  );
  
  return {
    room,
    powerUps,
    collectibles
  };
};
