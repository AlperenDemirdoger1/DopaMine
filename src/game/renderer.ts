import { GameState } from './types';

export const drawGame = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  width: number,
  height: number
): void => {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);
  
  drawGrid(ctx, width, height);
  
  drawRoomBoundaries(ctx, gameState.currentRoom.width, gameState.currentRoom.height);
  
  gameState.collectibles.forEach(collectible => {
    if (!collectible.collected) {
      drawCollectible(ctx, collectible);
    }
  });
  
  gameState.powerUps.forEach(powerUp => {
    if (!powerUp.collected) {
      drawPowerUp(ctx, powerUp);
    }
  });
  
  gameState.currentRoom.enemies.forEach(enemy => {
    drawEnemy(ctx, enemy);
    
    const healthPercentage = enemy.health / enemy.maxHealth;
    const barWidth = enemy.size * 1.2;
    const barHeight = 4;
    const barX = enemy.position.x - barWidth / 2;
    const barY = enemy.position.y - enemy.size / 2 - 10;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = healthPercentage > 0.5 ? '#4CAF50' : healthPercentage > 0.2 ? '#FFC107' : '#F44336';
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
  });
  
  drawPlayer(ctx, gameState.player);
  
  if (gameState.player.activeEffects && gameState.player.activeEffects.length > 0) {
    gameState.player.activeEffects.forEach(effect => {
      drawPlayerEffect(ctx, gameState.player, effect);
    });
  }
}

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  
  for (let x = 0; x < width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y < height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

const drawRoomBoundaries = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);
}

const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: any
): void => {
  ctx.fillStyle = getPlayerColor(player.type);
  
  ctx.beginPath();
  ctx.arc(player.position.x, player.position.y, player.size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  switch (player.type) {
    case 'warrior':
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(player.position.x, player.position.y);
      ctx.lineTo(
        player.position.x + Math.cos(Date.now() * 0.005) * player.size,
        player.position.y + Math.sin(Date.now() * 0.005) * player.size
      );
      ctx.stroke();
      break;
      
    case 'mage':
      ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, player.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'archer':
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      const angle = Math.PI / 4;
      ctx.beginPath();
      ctx.arc(
        player.position.x, 
        player.position.y, 
        player.size * 0.7, 
        Math.PI / 2 - angle, 
        Math.PI / 2 + angle
      );
      ctx.stroke();
      break;
  }
  
  const healthPercentage = player.health / player.maxHealth;
  const barWidth = player.size * 1.5;
  const barHeight = 6;
  const barX = player.position.x - barWidth / 2;
  const barY = player.position.y - player.size - 15;
  
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  ctx.fillStyle = healthPercentage > 0.5 ? '#4CAF50' : healthPercentage > 0.2 ? '#FFC107' : '#F44336';
  ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
  
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barWidth, barHeight);
}

const drawEnemy = (
  ctx: CanvasRenderingContext2D,
  enemy: any
): void => {
  switch (enemy.type) {
    case 'slime':
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(enemy.position.x, enemy.position.y, enemy.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(
        enemy.position.x - enemy.size / 5, 
        enemy.position.y - enemy.size / 6, 
        enemy.size / 10, 
        0, 
        Math.PI * 2
      );
      ctx.arc(
        enemy.position.x + enemy.size / 5, 
        enemy.position.y - enemy.size / 6, 
        enemy.size / 10, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      break;
      
    case 'skeleton':
      ctx.fillStyle = '#E0E0E0';
      ctx.beginPath();
      ctx.arc(enemy.position.x, enemy.position.y, enemy.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(
        enemy.position.x - enemy.size / 5, 
        enemy.position.y - enemy.size / 6, 
        enemy.size / 10, 
        0, 
        Math.PI * 2
      );
      ctx.arc(
        enemy.position.x + enemy.size / 5, 
        enemy.position.y - enemy.size / 6, 
        enemy.size / 10, 
        0, 
        Math.PI * 2
      );
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(
        enemy.position.x, 
        enemy.position.y + enemy.size / 6, 
        enemy.size / 6, 
        0, 
        Math.PI
      );
      ctx.stroke();
      break;
      
    case 'ghost':
      ctx.fillStyle = 'rgba(200, 200, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(enemy.position.x, enemy.position.y, enemy.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(
        enemy.position.x - enemy.size / 5, 
        enemy.position.y - enemy.size / 6, 
        enemy.size / 10, 
        0, 
        Math.PI * 2
      );
      ctx.arc(
        enemy.position.x + enemy.size / 5, 
        enemy.position.y - enemy.size / 6, 
        enemy.size / 10, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      break;
      
    default:
      ctx.fillStyle = '#F44336';
      ctx.beginPath();
      ctx.arc(enemy.position.x, enemy.position.y, enemy.size / 2, 0, Math.PI * 2);
      ctx.fill();
  }
}

const drawCollectible = (
  ctx: CanvasRenderingContext2D,
  collectible: any
): void => {
  switch (collectible.type) {
    case 'coin':
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(collectible.position.x, collectible.position.y, collectible.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FFF9C4';
      ctx.beginPath();
      ctx.arc(
        collectible.position.x - collectible.size / 4, 
        collectible.position.y - collectible.size / 4, 
        collectible.size / 6, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      break;
      
    case 'gem':
      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.moveTo(collectible.position.x, collectible.position.y - collectible.size / 2);
      ctx.lineTo(collectible.position.x + collectible.size / 2, collectible.position.y);
      ctx.lineTo(collectible.position.x, collectible.position.y + collectible.size / 2);
      ctx.lineTo(collectible.position.x - collectible.size / 2, collectible.position.y);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#90CAF9';
      ctx.beginPath();
      ctx.arc(
        collectible.position.x - collectible.size / 5, 
        collectible.position.y - collectible.size / 5, 
        collectible.size / 8, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      break;
      
    case 'key':
      ctx.fillStyle = '#FFC107';
      
      ctx.beginPath();
      ctx.arc(
        collectible.position.x - collectible.size / 4, 
        collectible.position.y, 
        collectible.size / 3, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.fillRect(
        collectible.position.x - collectible.size / 4, 
        collectible.position.y - collectible.size / 8, 
        collectible.size / 2 + collectible.size / 4, 
        collectible.size / 4
      );
      
      ctx.fillRect(
        collectible.position.x + collectible.size / 4, 
        collectible.position.y - collectible.size / 4, 
        collectible.size / 6, 
        collectible.size / 2
      );
      break;
      
    default:
      ctx.fillStyle = '#9C27B0';
      ctx.beginPath();
      ctx.arc(collectible.position.x, collectible.position.y, collectible.size / 2, 0, Math.PI * 2);
      ctx.fill();
  }
  
  const pulseSize = Math.sin(Date.now() * 0.01) * 2 + 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(
    collectible.position.x, 
    collectible.position.y, 
    collectible.size / 2 + pulseSize, 
    0, 
    Math.PI * 2
  );
  ctx.stroke();
}

const drawPowerUp = (
  ctx: CanvasRenderingContext2D,
  powerUp: any
): void => {
  ctx.fillStyle = getPowerUpColor(powerUp.type);
  ctx.beginPath();
  ctx.arc(powerUp.position.x, powerUp.position.y, powerUp.size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = `${powerUp.size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(getPowerUpIcon(powerUp.type), powerUp.position.x, powerUp.position.y);
  
  const pulseSize = Math.sin(Date.now() * 0.01) * 3 + 3;
  ctx.strokeStyle = getPowerUpColor(powerUp.type);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    powerUp.position.x, 
    powerUp.position.y, 
    powerUp.size / 2 + pulseSize, 
    0, 
    Math.PI * 2
  );
  ctx.stroke();
}

const drawPlayerEffect = (
  ctx: CanvasRenderingContext2D,
  player: any,
  effect: any
): void => {
  switch (effect.type) {
    case 'speed':
      ctx.strokeStyle = '#FFC107';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = player.position.x + Math.cos(angle) * (player.size / 2);
        const y1 = player.position.y + Math.sin(angle) * (player.size / 2);
        const x2 = player.position.x + Math.cos(angle) * (player.size / 2 + 10);
        const y2 = player.position.y + Math.sin(angle) * (player.size / 2 + 10);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      break;
      
    case 'invincibility':
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, player.size / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();
      
      const pulseSize = Math.sin(Date.now() * 0.01) * 2 + 2;
      ctx.strokeStyle = 'rgba(33, 150, 243, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        player.position.x, 
        player.position.y, 
        player.size / 2 + 10 + pulseSize, 
        0, 
        Math.PI * 2
      );
      ctx.stroke();
      break;
      
    case 'damage':
      ctx.fillStyle = 'rgba(244, 67, 54, 0.2)';
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, player.size / 2 + 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#F44336';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(player.position.x, player.position.y);
      ctx.lineTo(
        player.position.x + Math.cos(Date.now() * 0.005) * (player.size + 5),
        player.position.y + Math.sin(Date.now() * 0.005) * (player.size + 5)
      );
      ctx.stroke();
      break;
  }
}

const getPlayerColor = (type: string): string => {
  switch (type) {
    case 'warrior':
      return '#F44336'; // Red
    case 'mage':
      return '#2196F3'; // Blue
    case 'archer':
      return '#4CAF50'; // Green
    default:
      return '#9C27B0'; // Purple
  }
};

const getPowerUpColor = (type: string): string => {
  switch (type) {
    case 'health':
      return '#4CAF50'; // Green
    case 'speed':
      return '#FFC107'; // Yellow
    case 'invincibility':
      return '#2196F3'; // Blue
    case 'damage':
      return '#F44336'; // Red
    default:
      return '#9C27B0'; // Purple
  }
};

const getPowerUpIcon = (type: string): string => {
  switch (type) {
    case 'health':
      return '❤';
    case 'speed':
      return '⚡';
    case 'invincibility':
      return '🛡️';
    case 'damage':
      return '⚔️';
    default:
      return '✨';
  }
};
