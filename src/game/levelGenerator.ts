import { v4 as uuidv4 } from 'uuid';
import { Room, PowerUp, Collectible, Position } from './types';

export const generateLevelWithPowerUps = (
  width: number,
  height: number,
  level: number,
  playerPosition: Position
): { room: Room; powerUps: PowerUp[]; collectibles: Collectible[] } => {
  const room: Room = {
    id: uuidv4(),
    width,
    height,
    enemies: generateEnemies(width, height, level, playerPosition),
    exits: []
  };
  
  const powerUps: PowerUp[] = generatePowerUps(width, height, level, playerPosition);
  
  const collectibles: Collectible[] = generateCollectibles(width, height, level, playerPosition);
  
  return { room, powerUps, collectibles };
};

const generateEnemies = (
  width: number,
  height: number,
  level: number,
  playerPosition: Position
): any[] => {
  const enemies = [];
  const enemyCount = Math.min(5 + level * 2, 20); // Increase enemies with level, max 20
  
  const enemyTypes = ['slime', 'skeleton', 'ghost'];
  const safeRadius = 150; // Safe zone around player
  
  for (let i = 0; i < enemyCount; i++) {
    let position: Position;
    let tooClose = true;
    
    while (tooClose) {
      position = {
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50
      };
      
      const dx = position.x - playerPosition.x;
      const dy = position.y - playerPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > safeRadius) {
        tooClose = false;
      }
    }
    
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    enemies.push({
      id: uuidv4(),
      position,
      health: 30 + level * 10,
      maxHealth: 30 + level * 10,
      damage: 5 + level * 2,
      moveSpeed: 1 + level * 0.5,
      type: enemyType,
      sprite: enemyType,
      size: 30
    });
  }
  
  return enemies;
};

const generatePowerUps = (
  width: number,
  height: number,
  level: number,
  playerPosition: Position
): PowerUp[] => {
  const powerUps: PowerUp[] = [];
  const powerUpCount = Math.min(2 + Math.floor(level / 2), 5); // Increase power-ups with level, max 5
  
  const powerUpTypes = ['health', 'speed', 'invincibility', 'damage'];
  const safeRadius = 100; // Safe zone around player
  
  for (let i = 0; i < powerUpCount; i++) {
    let position: Position;
    let tooClose = true;
    
    while (tooClose) {
      position = {
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50
      };
      
      const dx = position.x - playerPosition.x;
      const dy = position.y - playerPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > safeRadius) {
        tooClose = false;
      }
    }
    
    const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    let value = 0;
    let duration = 0;
    
    switch (powerUpType) {
      case 'health':
        value = 20 + level * 5;
        duration = 0; // Instant effect
        break;
        
      case 'speed':
        value = 30 + level * 5;
        duration = 10 + level * 2;
        break;
        
      case 'invincibility':
        value = 100;
        duration = 5 + level;
        break;
        
      case 'damage':
        value = 30 + level * 5;
        duration = 10 + level * 2;
        break;
    }
    
    powerUps.push({
      id: uuidv4(),
      type: powerUpType,
      position,
      duration,
      value,
      size: 20,
      collected: false,
      active: false,
      activatedAt: null,
      expiresAt: null
    });
  }
  
  return powerUps;
};

const generateCollectibles = (
  width: number,
  height: number,
  level: number,
  playerPosition: Position
): Collectible[] => {
  const collectibles: Collectible[] = [];
  const coinCount = 10 + level * 5; // Increase coins with level
  const gemCount = Math.floor(level / 2) + 1; // Increase gems with level
  
  for (let i = 0; i < coinCount; i++) {
    collectibles.push({
      id: uuidv4(),
      type: 'coin',
      position: {
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50
      },
      value: 1,
      size: 15,
      collected: false
    });
  }
  
  for (let i = 0; i < gemCount; i++) {
    collectibles.push({
      id: uuidv4(),
      type: 'gem',
      position: {
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50
      },
      value: 5,
      size: 20,
      collected: false
    });
  }
  
  return collectibles;
};
