import { GameState, Position } from './types';

export const handleInput = (gameState: GameState, keys: Set<string>): GameState => {
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  
  const moveSpeed = 5;
  
  if (keys.has('w') || keys.has('ArrowUp')) {
    newState.player.position.y = Math.max(
      newState.player.size / 2,
      newState.player.position.y - moveSpeed
    );
  }
  
  if (keys.has('s') || keys.has('ArrowDown')) {
    newState.player.position.y = Math.min(
      newState.currentRoom.height - newState.player.size / 2,
      newState.player.position.y + moveSpeed
    );
  }
  
  if (keys.has('a') || keys.has('ArrowLeft')) {
    newState.player.position.x = Math.max(
      newState.player.size / 2,
      newState.player.position.x - moveSpeed
    );
  }
  
  if (keys.has('d') || keys.has('ArrowRight')) {
    newState.player.position.x = Math.min(
      newState.currentRoom.width - newState.player.size / 2,
      newState.player.position.x + moveSpeed
    );
  }
  
  if (keys.has(' ')) {
    const attackRange = 60; // Attack radius
    
    newState.currentRoom.enemies = newState.currentRoom.enemies.map(enemy => {
      const dx = enemy.position.x - newState.player.position.x;
      const dy = enemy.position.y - newState.player.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < attackRange) {
        enemy.health -= newState.player.damage;
        
        if (enemy.health <= 0) {
          newState.score += 10;
          newState.player.score += 10;
          
        }
      }
      
      return enemy;
    }).filter(enemy => enemy.health > 0);
    
    if (newState.currentRoom.enemies.length === 0) {
      newState.level += 1;
      
      const { generateLevel } = require('./levelGenerator');
      newState.currentRoom = generateLevel(
        newState.currentRoom.width,
        newState.currentRoom.height,
        newState.level
      );
    }
  }
  
  return newState;
};

export const handleTouchInput = (
  gameState: GameState,
  touchPosition: Position,
  isAttack: boolean
): GameState => {
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  
  if (isAttack) {
    const attackRange = 60;
    
    newState.currentRoom.enemies = newState.currentRoom.enemies.map(enemy => {
      const dx = enemy.position.x - touchPosition.x;
      const dy = enemy.position.y - touchPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < attackRange) {
        enemy.health -= newState.player.damage;
        
        if (enemy.health <= 0) {
          newState.score += 10;
          newState.player.score += 10;
        }
      }
      
      return enemy;
    }).filter(enemy => enemy.health > 0);
    
    if (newState.currentRoom.enemies.length === 0) {
      newState.level += 1;
      const { generateLevel } = require('./levelGenerator');
      newState.currentRoom = generateLevel(
        newState.currentRoom.width,
        newState.currentRoom.height,
        newState.level
      );
    }
  } else {
    const dx = touchPosition.x - newState.player.position.x;
    const dy = touchPosition.y - newState.player.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      const moveSpeed = 5;
      const moveX = (dx / distance) * moveSpeed;
      const moveY = (dy / distance) * moveSpeed;
      
      newState.player.position.x = Math.max(
        newState.player.size / 2,
        Math.min(
          newState.currentRoom.width - newState.player.size / 2,
          newState.player.position.x + moveX
        )
      );
      
      newState.player.position.y = Math.max(
        newState.player.size / 2,
        Math.min(
          newState.currentRoom.height - newState.player.size / 2,
          newState.player.position.y + moveY
        )
      );
    }
  }
  
  return newState;
};
