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
  
  drawPlayer(ctx, gameState.player);
  
  gameState.currentRoom.enemies.forEach(enemy => {
    drawEnemy(ctx, enemy);
  });
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
  ctx.fillStyle = '#6a4dff';
  ctx.beginPath();
  ctx.arc(player.position.x, player.position.y, player.size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
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
