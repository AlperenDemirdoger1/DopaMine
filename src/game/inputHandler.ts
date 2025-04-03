import { GameState } from './types';

export const handleInput = (
  gameState: GameState,
  keys: Set<string>
): GameState => {
  if (gameState.gameOver) return gameState;
  
  const newState = { ...gameState };
  const player = { ...newState.player };
  const moveSpeed = player.activeEffects?.some(effect => effect.type === 'speed') 
    ? 5 * (1 + player.activeEffects.find(effect => effect.type === 'speed')?.value / 100 || 0)
    : 5;
  
  if (keys.has('w') || keys.has('ArrowUp')) {
    player.position.y = Math.max(player.size / 2, player.position.y - moveSpeed);
  }
  
  if (keys.has('s') || keys.has('ArrowDown')) {
    player.position.y = Math.min(
      newState.currentRoom.height - player.size / 2,
      player.position.y + moveSpeed
    );
  }
  
  if (keys.has('a') || keys.has('ArrowLeft')) {
    player.position.x = Math.max(player.size / 2, player.position.x - moveSpeed);
  }
  
  if (keys.has('d') || keys.has('ArrowRight')) {
    player.position.x = Math.min(
      newState.currentRoom.width - player.size / 2,
      player.position.x + moveSpeed
    );
  }
  
  if (keys.has(' ')) {
    const attackRange = player.type === 'warrior' ? 50 : 
                        player.type === 'archer' ? 150 : 
                        player.type === 'mage' ? 120 : 50;
    
    const damageMultiplier = player.activeEffects?.some(effect => effect.type === 'damage')
      ? 1 + (player.activeEffects.find(effect => effect.type === 'damage')?.value / 100 || 0)
      : 1;
    
    newState.currentRoom.enemies = newState.currentRoom.enemies.filter(enemy => {
      const dx = enemy.position.x - player.position.x;
      const dy = enemy.position.y - player.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < attackRange + enemy.size / 2) {
        enemy.health -= player.damage * damageMultiplier;
        
        if (enemy.health <= 0) {
          newState.score += 10 * newState.level;
          
          if (player.experience !== undefined && player.experienceToNextLevel !== undefined) {
            player.experience += 10 * newState.level;
            
            if (player.experience >= player.experienceToNextLevel) {
              player.level = (player.level || 1) + 1;
              player.experience -= player.experienceToNextLevel;
              player.experienceToNextLevel = Math.floor(player.experienceToNextLevel * 1.5);
              
              player.maxHealth += 10;
              player.health = player.maxHealth;
              player.damage += 5;
            }
          }
          
          return false; // Remove enemy
        }
        
        return true; // Keep enemy
      }
      
      return true; // Keep enemy
    });
  }
  
  newState.player = player;
  return newState;
};
