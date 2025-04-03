import { GameState } from './types';

export const drawGame = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  width: number,
  height: number
): void => {
  ctx.clearRect(0, 0, width, height);
  
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);
  
  drawGrid(ctx, width, height);
  
  if (gameState.collectibles && gameState.collectibles.length > 0) {
    const { drawCollectibles } = require('./powerups/powerupRenderer');
    drawCollectibles(ctx, gameState.collectibles);
  }
  
  if (gameState.powerUps && gameState.powerUps.length > 0) {
    const { drawPowerUps } = require('./powerups/powerupRenderer');
    drawPowerUps(ctx, gameState.powerUps);
  }
  
  drawPlayer(ctx, gameState.player);
  
  gameState.currentRoom.enemies.forEach(enemy => {
    drawEnemy(ctx, enemy);
  });
  
  if (gameState.player.activeEffects && gameState.player.activeEffects.length > 0) {
    const { drawActiveEffects } = require('./powerups/powerupRenderer');
    drawActiveEffects(ctx, gameState);
  }
};

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  ctx.strokeStyle = '#2a2a4e';
  ctx.lineWidth = 1;
  
  const gridSize = 50;
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: GameState['player']
): void => {
  const defaultColors = {
    warrior: { color: '#d63031', outfitColor: '#e17055' },
    mage: { color: '#0984e3', outfitColor: '#74b9ff' },
    archer: { color: '#00b894', outfitColor: '#55efc4' },
    player: { color: '#6a4dff', outfitColor: '#8c7ae6' }
  };
  
  const characterType = player.type || 'player';
  
  const color = player.type && player.type in defaultColors
                ? defaultColors[player.type as keyof typeof defaultColors].color
                : '#6a4dff';
                
  const outfitColor = player.type && player.type in defaultColors
                      ? defaultColors[player.type as keyof typeof defaultColors].outfitColor
                      : '#8c7ae6';
  
  ctx.fillStyle = color;
  
  if (characterType === 'warrior') {
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = outfitColor;
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.size / 2, 0, Math.PI);
    ctx.fill();
    
  } else if (characterType === 'mage') {
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = outfitColor;
    ctx.beginPath();
    ctx.moveTo(player.position.x - player.size / 2, player.position.y);
    ctx.lineTo(player.position.x, player.position.y - player.size);
    ctx.lineTo(player.position.x + player.size / 2, player.position.y);
    ctx.closePath();
    ctx.fill();
    
  } else if (characterType === 'archer') {
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = outfitColor;
    ctx.beginPath();
    ctx.arc(player.position.x + player.size / 2, player.position.y, player.size / 3, Math.PI * 1.5, Math.PI * 0.5, false);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(player.position.x, player.position.y);
    ctx.lineTo(player.position.x + player.size, player.position.y);
    ctx.stroke();
    
  } else {
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(player.position.x, player.position.y, player.size / 2, 0, Math.PI * 2);
  ctx.stroke();
  
  const healthBarWidth = player.size;
  const healthBarHeight = 5;
  const healthPercentage = player.health / player.maxHealth;
  
  ctx.fillStyle = '#333333';
  ctx.fillRect(
    player.position.x - healthBarWidth / 2,
    player.position.y - player.size / 2 - 10,
    healthBarWidth,
    healthBarHeight
  );
  
  ctx.fillStyle = healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffff00' : '#ff0000';
  ctx.fillRect(
    player.position.x - healthBarWidth / 2,
    player.position.y - player.size / 2 - 10,
    healthBarWidth * healthPercentage,
    healthBarHeight
  );
  
  if (player.level) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Lvl ${player.level}`, player.position.x, player.position.y - player.size / 2 - 15);
  }
};

const drawEnemy = (
  ctx: CanvasRenderingContext2D,
  enemy: GameState['currentRoom']['enemies'][0]
): void => {
  const colors = {
    basic: '#ff4d4d',
    fast: '#ffaa00'
  };
  
  const color = enemy.type in colors 
    ? colors[enemy.type as keyof typeof colors] 
    : '#ff0000';
  
  ctx.fillStyle = color;
  
  if (enemy.type === 'basic') {
    ctx.beginPath();
    ctx.arc(enemy.position.x, enemy.position.y, enemy.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (enemy.type === 'fast') {
    ctx.beginPath();
    ctx.moveTo(enemy.position.x, enemy.position.y - enemy.size / 2);
    ctx.lineTo(enemy.position.x + enemy.size / 2, enemy.position.y + enemy.size / 2);
    ctx.lineTo(enemy.position.x - enemy.size / 2, enemy.position.y + enemy.size / 2);
    ctx.closePath();
    ctx.fill();
  }
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  const healthBarWidth = enemy.size;
  const healthBarHeight = 3;
  const healthPercentage = enemy.health / enemy.maxHealth;
  
  ctx.fillStyle = '#333333';
  ctx.fillRect(
    enemy.position.x - healthBarWidth / 2,
    enemy.position.y - enemy.size / 2 - 8,
    healthBarWidth,
    healthBarHeight
  );
  
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(
    enemy.position.x - healthBarWidth / 2,
    enemy.position.y - enemy.size / 2 - 8,
    healthBarWidth * healthPercentage,
    healthBarHeight
  );
};
