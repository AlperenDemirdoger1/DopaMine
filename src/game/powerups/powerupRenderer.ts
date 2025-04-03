import { Collectible, PowerUp } from './types';
import { GameState } from '../types';

export const drawPowerUps = (
  ctx: CanvasRenderingContext2D,
  powerUps: PowerUp[]
): void => {
  powerUps.filter(p => !p.collected).forEach(powerUp => {
    switch (powerUp.type) {
      case 'health':
        ctx.fillStyle = '#ff4d4d';
        ctx.beginPath();
        
        ctx.fillRect(
          powerUp.position.x - powerUp.size / 10,
          powerUp.position.y - powerUp.size / 2,
          powerUp.size / 5,
          powerUp.size
        );
        
        ctx.fillRect(
          powerUp.position.x - powerUp.size / 2,
          powerUp.position.y - powerUp.size / 10,
          powerUp.size,
          powerUp.size / 5
        );
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(powerUp.position.x, powerUp.position.y, powerUp.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
      case 'speed':
        ctx.fillStyle = '#4d79ff';
        ctx.beginPath();
        
        ctx.moveTo(powerUp.position.x, powerUp.position.y - powerUp.size / 2);
        ctx.lineTo(powerUp.position.x + powerUp.size / 4, powerUp.position.y - powerUp.size / 6);
        ctx.lineTo(powerUp.position.x - powerUp.size / 6, powerUp.position.y + powerUp.size / 6);
        ctx.lineTo(powerUp.position.x, powerUp.position.y + powerUp.size / 2);
        ctx.lineTo(powerUp.position.x - powerUp.size / 4, powerUp.position.y + powerUp.size / 6);
        ctx.lineTo(powerUp.position.x + powerUp.size / 6, powerUp.position.y - powerUp.size / 6);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(powerUp.position.x, powerUp.position.y, powerUp.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
      case 'invincibility':
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(powerUp.position.x, powerUp.position.y, powerUp.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(powerUp.position.x, powerUp.position.y - powerUp.size / 3);
        ctx.lineTo(powerUp.position.x + powerUp.size / 3, powerUp.position.y);
        ctx.lineTo(powerUp.position.x, powerUp.position.y + powerUp.size / 3);
        ctx.lineTo(powerUp.position.x - powerUp.size / 3, powerUp.position.y);
        ctx.closePath();
        ctx.stroke();
        break;
        
      case 'damage':
        ctx.fillStyle = '#9966ff';
        ctx.beginPath();
        ctx.arc(powerUp.position.x, powerUp.position.y, powerUp.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(powerUp.position.x, powerUp.position.y - powerUp.size / 3);
        ctx.lineTo(powerUp.position.x, powerUp.position.y + powerUp.size / 3);
        ctx.moveTo(powerUp.position.x - powerUp.size / 4, powerUp.position.y - powerUp.size / 6);
        ctx.lineTo(powerUp.position.x + powerUp.size / 4, powerUp.position.y - powerUp.size / 6);
        ctx.stroke();
        break;
    }
    
    const pulseSize = Math.sin(Date.now() / 200) * 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(
      powerUp.position.x, 
      powerUp.position.y, 
      powerUp.size / 2 + pulseSize, 
      0, 
      Math.PI * 2
    );
    ctx.stroke();
  });
};

export const drawCollectibles = (
  ctx: CanvasRenderingContext2D,
  collectibles: Collectible[]
): void => {
  collectibles.filter(c => !c.collected).forEach(collectible => {
    switch (collectible.type) {
      case 'coin':
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(collectible.position.x, collectible.position.y, collectible.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(collectible.position.x, collectible.position.y, collectible.size / 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(collectible.position.x, collectible.position.y, collectible.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
      case 'gem':
        ctx.fillStyle = '#00ccff';
        ctx.beginPath();
        ctx.moveTo(collectible.position.x, collectible.position.y - collectible.size / 2);
        ctx.lineTo(collectible.position.x + collectible.size / 2, collectible.position.y);
        ctx.lineTo(collectible.position.x, collectible.position.y + collectible.size / 2);
        ctx.lineTo(collectible.position.x - collectible.size / 2, collectible.position.y);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.moveTo(collectible.position.x - collectible.size / 6, collectible.position.y - collectible.size / 6);
        ctx.lineTo(collectible.position.x, collectible.position.y - collectible.size / 3);
        ctx.lineTo(collectible.position.x + collectible.size / 6, collectible.position.y - collectible.size / 6);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(collectible.position.x, collectible.position.y - collectible.size / 2);
        ctx.lineTo(collectible.position.x + collectible.size / 2, collectible.position.y);
        ctx.lineTo(collectible.position.x, collectible.position.y + collectible.size / 2);
        ctx.lineTo(collectible.position.x - collectible.size / 2, collectible.position.y);
        ctx.closePath();
        ctx.stroke();
        break;
        
      case 'key':
        ctx.fillStyle = '#ffcc00';
        
        ctx.beginPath();
        ctx.arc(
          collectible.position.x, 
          collectible.position.y - collectible.size / 4, 
          collectible.size / 4, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillRect(
          collectible.position.x - collectible.size / 10,
          collectible.position.y - collectible.size / 4,
          collectible.size / 5,
          collectible.size / 2
        );
        
        ctx.fillRect(
          collectible.position.x - collectible.size / 5,
          collectible.position.y + collectible.size / 6,
          collectible.size / 2.5,
          collectible.size / 10
        );
        
        ctx.fillRect(
          collectible.position.x,
          collectible.position.y + collectible.size / 4,
          collectible.size / 5,
          collectible.size / 10
        );
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(collectible.position.x, collectible.position.y, collectible.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }
    
    const floatOffset = Math.sin(Date.now() / 300) * 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(
      collectible.position.x,
      collectible.position.y + collectible.size / 2 + 3 + floatOffset,
      collectible.size / 2,
      collectible.size / 6,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
};

export const drawActiveEffects = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState
): void => {
  const player = gameState.player;
  
  if (player.activeEffects && player.activeEffects.length > 0) {
    player.activeEffects.forEach((effect, index) => {
      const timeRemaining = effect.endTime - Date.now();
      if (timeRemaining <= 0) return;
      
      const percentRemaining = timeRemaining / (effect.duration * 1000);
      
      let color = '';
      let icon = '';
      
      switch (effect.type) {
        case 'speed':
          color = '#4d79ff';
          icon = '⚡';
          break;
        case 'invincibility':
          color = '#ffcc00';
          icon = '🛡️';
          break;
        case 'damage':
          color = '#9966ff';
          icon = '⚔️';
          break;
      }
      
      const x = 70 + (index * 40);
      const y = 30;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 15, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * percentRemaining));
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, x, y);
    });
  }
};
