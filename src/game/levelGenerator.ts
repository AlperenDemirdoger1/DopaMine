import { v4 as uuidv4 } from 'uuid';
import { Room, PowerUp, Collectible, Position, Obstacle } from './types';
import { createEnemy, EnemyType } from './enemies/EnemyTypes';

export const generateLevelWithPowerUps = (
  width: number,
  height: number,
  level: number,
  difficulty: number,
  playerPosition: Position
): { room: Room; powerUps: PowerUp[]; collectibles: Collectible[]; obstacles: Obstacle[] } => {
  const room: Room = {
    id: uuidv4(),
    width,
    height,
    enemies: generateEnemies(width, height, level, difficulty, playerPosition),
    exits: []
  };
  
  const powerUps: PowerUp[] = generatePowerUps(width, height, level, difficulty, playerPosition);
  
  const collectibles: Collectible[] = generateCollectibles(width, height, level, difficulty, playerPosition);
  
  const obstacles: Obstacle[] = generateObstacles(width, height, level, difficulty, playerPosition);
  
  return { room, powerUps, collectibles, obstacles };
};

const generateEnemies = (
  width: number,
  height: number,
  level: number,
  difficulty: number,
  playerPosition: Position
): any[] => {
  const enemies = [];
  const enemyCount = Math.min(3 + level * 2 + difficulty * 2, 25); 
  
  const availableEnemyTypes: EnemyType[] = ['minion'];
  
  if (level >= 2 || difficulty >= 2) {
    availableEnemyTypes.push('archer');
  }
  
  if (level >= 3 || difficulty >= 3) {
    availableEnemyTypes.push('mage');
  }
  
  if (level >= 4 || difficulty >= 4) {
    availableEnemyTypes.push('brute');
  }
  
  const safeRadius = 150; // Safe zone around player
  
  for (let i = 0; i < enemyCount; i++) {
    let position: Position = {
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50
    };
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
    
    const randomTypeIndex = Math.floor(Math.random() * availableEnemyTypes.length);
    const enemyType = availableEnemyTypes[randomTypeIndex];
    
    const difficultyMultiplier = 1 + (level * 0.2) + (difficulty * 0.3);
    const enemy = createEnemy(
      enemyType,
      position,
      uuidv4(),
      difficultyMultiplier
    );
    
    enemies.push(enemy);
  }
  
  if (level >= 5 || difficulty >= 4) {
    let bossPosition: Position = {
      x: width / 2,
      y: height / 2
    };
    
    const dx = bossPosition.x - playerPosition.x;
    const dy = bossPosition.y - playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < safeRadius * 1.5) {
      bossPosition = {
        x: playerPosition.x > width / 2 ? width / 4 : width * 3 / 4,
        y: playerPosition.y > height / 2 ? height / 4 : height * 3 / 4
      };
    }
    
    const bossMultiplier = 1 + (level * 0.3) + (difficulty * 0.4);
    const boss = createEnemy(
      'boss',
      bossPosition,
      `boss-${uuidv4()}`,
      bossMultiplier
    );
    
    enemies.push(boss);
  }
  
  return enemies;
};

const generatePowerUps = (
  width: number,
  height: number,
  level: number,
  difficulty: number,
  playerPosition: Position
): PowerUp[] => {
  const powerUps: PowerUp[] = [];
  const powerUpCount = Math.min(3 + Math.floor(level / 2) - Math.floor(difficulty / 2), 6); 
  
  const powerUpTypes = ['health', 'speed', 'invincibility', 'damage'];
  const safeRadius = 100; // Safe zone around player
  
  for (let i = 0; i < powerUpCount; i++) {
    let position: Position = {
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50
    };
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
        value = 30 + level * 5 - difficulty * 3;
        duration = 0; // Instant effect
        break;
        
      case 'speed':
        value = 25 + level * 5;
        duration = 8 + level - difficulty; // Shorter duration at higher difficulties
        break;
        
      case 'invincibility':
        value = 100;
        duration = 6 + level - difficulty; // Shorter duration at higher difficulties
        break;
        
      case 'damage':
        value = 25 + level * 5;
        duration = 8 + level - difficulty; // Shorter duration at higher difficulties
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
  difficulty: number,
  playerPosition: Position
): Collectible[] => {
  const collectibles: Collectible[] = [];
  const coinCount = Math.max(5, 10 + level * 5 - difficulty * 2); 
  const gemCount = Math.max(1, Math.floor(level / 2) + 1 - Math.floor(difficulty / 3));
  
  const safeRadius = 100;
  
  for (let i = 0; i < coinCount; i++) {
    let position: Position;
    let tooClose = true;
    
    do {
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
    } while (tooClose);
    
    collectibles.push({
      id: uuidv4(),
      type: 'coin',
      position,
      value: 1,
      size: 15,
      collected: false
    });
  }
  
  for (let i = 0; i < gemCount; i++) {
    let position: Position;
    let tooClose = true;
    
    do {
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
    } while (tooClose);
    
    collectibles.push({
      id: uuidv4(),
      type: 'gem',
      position,
      value: 5,
      size: 20,
      collected: false
    });
  }
  
  return collectibles;
};

const generateObstacles = (
  width: number,
  height: number,
  level: number,
  difficulty: number,
  playerPosition: Position
): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const obstacleCount = Math.min(2 + Math.floor(level / 2) + difficulty, 10);
  
  const obstacleTypes: Array<'spike' | 'laser' | 'turret' | 'wall'> = ['spike', 'laser', 'turret', 'wall'];
  const safeRadius = 150; // Safe zone around player
  
  for (let i = 0; i < obstacleCount; i++) {
    let position: Position = {
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50
    };
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
    
    let obstaclePool = obstacleTypes;
    if (difficulty <= 2) {
      obstaclePool = ['spike', 'wall']; // Easier obstacles at lower difficulties
    } else if (difficulty <= 4) {
      obstaclePool = ['spike', 'laser', 'wall']; // Medium difficulty
    }
    
    const obstacleType = obstaclePool[Math.floor(Math.random() * obstaclePool.length)];
    
    let damage = 0;
    let size = 30;
    let attackRange = 0;
    let attackCooldown = 0;
    let isActive = true;
    let activationInterval = 0;
    
    switch (obstacleType) {
      case 'spike':
        damage = 5 + level + difficulty * 2;
        size = 25;
        isActive = false;
        activationInterval = 3000 - difficulty * 300; // Faster activation at higher difficulties
        break;
        
      case 'laser':
        damage = 8 + level + difficulty * 3;
        size = 20;
        attackRange = 150 + difficulty * 20;
        attackCooldown = 2000 - difficulty * 200; // Faster attacks at higher difficulties
        break;
        
      case 'turret':
        damage = 10 + level * 2 + difficulty * 3;
        size = 35;
        attackRange = 200 + difficulty * 30;
        attackCooldown = 3000 - difficulty * 300; // Faster attacks at higher difficulties
        break;
        
      case 'wall':
        damage = 0; // Walls don't deal damage, they just block
        size = 40;
        break;
    }
    
    obstacles.push({
      id: uuidv4(),
      type: obstacleType,
      position,
      size,
      damage,
      attackRange,
      attackCooldown,
      lastAttackTime: 0,
      isActive,
      activationInterval,
      lastActivationTime: 0
    });
  }
  
  return obstacles;
};
