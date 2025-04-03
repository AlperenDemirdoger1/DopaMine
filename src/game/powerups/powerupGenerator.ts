import { Collectible, CollectibleType, PowerUp, PowerUpType } from './types';
import { Position } from '../types';

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateSafePosition = (
  roomWidth: number, 
  roomHeight: number, 
  playerPosition: Position,
  enemyPositions: Position[],
  safeRadius: number = 80
): Position => {
  let x, y;
  let isSafe = false;
  
  while (!isSafe) {
    x = randomInt(50, roomWidth - 50);
    y = randomInt(50, roomHeight - 50);
    
    const playerDistance = Math.sqrt(
      Math.pow(x - playerPosition.x, 2) + 
      Math.pow(y - playerPosition.y, 2)
    );
    
    if (playerDistance < safeRadius) continue;
    
    isSafe = true;
    for (const enemyPos of enemyPositions) {
      const enemyDistance = Math.sqrt(
        Math.pow(x - enemyPos.x, 2) + 
        Math.pow(y - enemyPos.y, 2)
      );
      
      if (enemyDistance < safeRadius) {
        isSafe = false;
        break;
      }
    }
  }
  
  return { x: x!, y: y! };
};

export const generatePowerUp = (
  roomWidth: number,
  roomHeight: number,
  playerPosition: Position,
  enemyPositions: Position[],
  level: number
): PowerUp => {
  const position = generateSafePosition(roomWidth, roomHeight, playerPosition, enemyPositions);
  
  const powerUpTypes: PowerUpType[] = ['health', 'speed', 'invincibility', 'damage'];
  const probabilities = [
    0.5 - (level * 0.03), // Health becomes less common at higher levels
    0.3,                  // Speed stays consistent
    0.1 + (level * 0.01), // Invincibility becomes more common
    0.1 + (level * 0.02)  // Damage boost becomes more common
  ];
  
  const totalProb = probabilities.reduce((sum, prob) => sum + prob, 0);
  const normalizedProbs = probabilities.map(prob => prob / totalProb);
  
  const rand = Math.random();
  let cumulativeProb = 0;
  let selectedType: PowerUpType = 'health'; // Default
  
  for (let i = 0; i < normalizedProbs.length; i++) {
    cumulativeProb += normalizedProbs[i];
    if (rand <= cumulativeProb) {
      selectedType = powerUpTypes[i];
      break;
    }
  }
  
  let duration = 0;
  let value = 0;
  
  switch (selectedType) {
    case 'health':
      value = 20 + (level * 5); // Health restored
      duration = 0; // Instant effect
      break;
    case 'speed':
      value = 1.5; // Speed multiplier
      duration = 10; // Duration in seconds
      break;
    case 'invincibility':
      value = 1; // Boolean flag
      duration = 5 + Math.floor(level / 3); // Duration increases with level
      break;
    case 'damage':
      value = 1.5 + (level * 0.1); // Damage multiplier
      duration = 15; // Duration in seconds
      break;
  }
  
  return {
    id: `powerup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: selectedType,
    position,
    duration,
    value,
    size: 25,
    collected: false,
    active: false,
    activatedAt: null,
    expiresAt: null
  };
};

export const generateCollectible = (
  roomWidth: number,
  roomHeight: number,
  playerPosition: Position,
  enemyPositions: Position[],
  level: number
): Collectible => {
  const position = generateSafePosition(roomWidth, roomHeight, playerPosition, enemyPositions);
  
  const collectibleTypes: CollectibleType[] = ['coin', 'gem', 'key'];
  const probabilities = [
    0.7,                  // Coins are common
    0.25 + (level * 0.01), // Gems become more common at higher levels
    0.05                  // Keys are rare
  ];
  
  const totalProb = probabilities.reduce((sum, prob) => sum + prob, 0);
  const normalizedProbs = probabilities.map(prob => prob / totalProb);
  
  const rand = Math.random();
  let cumulativeProb = 0;
  let selectedType: CollectibleType = 'coin'; // Default
  
  for (let i = 0; i < normalizedProbs.length; i++) {
    cumulativeProb += normalizedProbs[i];
    if (rand <= cumulativeProb) {
      selectedType = collectibleTypes[i];
      break;
    }
  }
  
  let value = 0;
  
  switch (selectedType) {
    case 'coin':
      value = 1;
      break;
    case 'gem':
      value = 5 + level;
      break;
    case 'key':
      value = 1;
      break;
  }
  
  return {
    id: `collectible-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: selectedType,
    position,
    value,
    size: 20,
    collected: false
  };
};

export const generatePowerUpsAndCollectibles = (
  roomWidth: number,
  roomHeight: number,
  playerPosition: Position,
  enemyPositions: Position[],
  level: number
): { powerUps: PowerUp[], collectibles: Collectible[] } => {
  const numPowerUps = Math.max(1, Math.floor(level / 3)); // More power-ups at higher levels
  const numCollectibles = 3 + Math.floor(level / 2); // More collectibles at higher levels
  
  const powerUps: PowerUp[] = [];
  const collectibles: Collectible[] = [];
  
  for (let i = 0; i < numPowerUps; i++) {
    powerUps.push(generatePowerUp(roomWidth, roomHeight, playerPosition, enemyPositions, level));
  }
  
  for (let i = 0; i < numCollectibles; i++) {
    collectibles.push(generateCollectible(roomWidth, roomHeight, playerPosition, enemyPositions, level));
  }
  
  return { powerUps, collectibles };
};
