import React from 'react';
import { GameState } from '../types';
import { PowerUpEffect } from '../types';

interface ADHDFriendlyHUDProps {
  gameState: GameState | null;
  width: number;
  height: number;
}


export const ADHDFriendlyHUD: React.FC<ADHDFriendlyHUDProps> = ({ gameState, width, height }) => {
  if (!gameState) return null;
  
  const healthPercentage = gameState.player.health / gameState.player.maxHealth;
  const xpPercentage = gameState.player.experience && gameState.player.experienceToNextLevel 
    ? gameState.player.experience / gameState.player.experienceToNextLevel 
    : 0;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Health Bar - Enhanced with animation and clear visual feedback */}
      <div className="absolute top-4 left-4 flex items-center">
        <div className="flex flex-col">
          <span className="text-white font-bold text-xs mb-1">HEALTH</span>
          <div className="w-40 h-6 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 relative">
            <div 
              className={`h-full transition-all duration-300 ${
                healthPercentage > 0.6 
                  ? 'bg-gradient-to-r from-green-500 to-green-400' 
                  : healthPercentage > 0.3 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 animate-pulse' 
                    : 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse'
              }`}
              style={{ width: `${healthPercentage * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold drop-shadow-lg">
              {Math.ceil(gameState.player.health)}/{gameState.player.maxHealth}
            </span>
          </div>
        </div>
      </div>
      
      {/* Score and Resources - High visibility with icons */}
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <div className="flex flex-col items-end">
          <span className="text-white font-bold text-xs mb-1">SCORE</span>
          <div className="bg-gray-900 px-3 py-1 rounded-lg border-2 border-purple-700">
            <span className="text-purple-400 font-bold text-lg">{gameState.score}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <div className="bg-gray-900 px-3 py-1 rounded-lg border-2 border-yellow-700 flex items-center">
            <span className="text-yellow-400 text-lg mr-1">🪙</span>
            <span className="text-yellow-300 font-bold">{gameState.player.coins || 0}</span>
          </div>
          
          <div className="bg-gray-900 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center">
            <span className="text-blue-400 text-lg mr-1">💎</span>
            <span className="text-blue-300 font-bold">{gameState.player.gems || 0}</span>
          </div>
        </div>
      </div>
      
      {/* Level and XP Bar - Enhanced with animation */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center">
        <div className="bg-gray-900 px-3 py-1 rounded-lg border-2 border-purple-700 mr-2">
          <span className="text-purple-300 font-bold">LVL {gameState.player.level || 1}</span>
        </div>
        
        <div className="flex-1 h-6 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 relative">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300"
            style={{ width: `${xpPercentage * 100}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold drop-shadow-lg">
            {gameState.player.experience || 0}/{gameState.player.experienceToNextLevel || 100} XP
          </span>
        </div>
      </div>
      
      {/* Active Effects - Enhanced with clear visual indicators */}
      {gameState.player.activeEffects && gameState.player.activeEffects.length > 0 && (
        <div className="absolute top-20 left-4 flex flex-col space-y-2">
          <span className="text-white font-bold text-xs mb-1">ACTIVE EFFECTS</span>
          <div className="flex space-x-2">
            {gameState.player.activeEffects.map((effect: PowerUpEffect, index: number) => {
              const now = Date.now();
              const remainingTime = Math.max(0, effect.endTime - now);
              const durationMs = effect.endTime - effect.startTime;
              const remainingPercentage = remainingTime / durationMs;
              
              return (
                <div 
                  key={`${effect.type}-${index}`}
                  className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-gray-900 border-2"
                  style={{ 
                    borderColor: getEffectColor(effect.type),
                    boxShadow: `0 0 8px ${getEffectColor(effect.type)}`
                  }}
                  title={`${effect.type}: ${effect.value}`}
                >
                  {/* Effect Icon */}
                  <span className="text-xl">{getEffectIcon(effect.type)}</span>
                  
                  {/* Circular timer */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
                    <circle 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      fill="none" 
                      stroke={getEffectColor(effect.type)} 
                      strokeWidth="2"
                      strokeDasharray="62.83" 
                      strokeDashoffset={62.83 * (1 - remainingPercentage)} 
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Effect value */}
                  <span className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-xs font-bold px-1 rounded-full border border-gray-700">
                    +{effect.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Current Level Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 px-4 py-1 rounded-lg border-2 border-indigo-700">
        <span className="text-white font-bold">Level {gameState.level}</span>
      </div>
      
      {/* Game Controls Reminder - Helpful for ADHD players who might forget controls */}
      <div className="absolute bottom-16 right-4 bg-gray-900 bg-opacity-70 p-2 rounded-lg border border-gray-700">
        <div className="text-white text-xs space-y-1">
          <div className="flex justify-between">
            <span>Move:</span>
            <span className="font-bold">WASD / Arrows</span>
          </div>
          <div className="flex justify-between">
            <span>Attack:</span>
            <span className="font-bold">Space</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getEffectColor = (type: string): string => {
  switch (type) {
    case 'speed':
      return '#fbbf24'; // yellow
    case 'invincibility':
      return '#60a5fa'; // blue
    case 'damage':
      return '#ef4444'; // red
    default:
      return '#8b5cf6'; // purple
  }
};

const getEffectIcon = (type: string): string => {
  switch (type) {
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

interface FeedbackIndicatorProps {
  type: 'damage' | 'heal' | 'xp' | 'coin' | 'gem';
  value: number;
  position: { x: number, y: number };
}

export const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({ type, value, position }) => {
  const getColor = () => {
    switch (type) {
      case 'damage': return 'text-red-500';
      case 'heal': return 'text-green-500';
      case 'xp': return 'text-purple-500';
      case 'coin': return 'text-yellow-500';
      case 'gem': return 'text-blue-500';
      default: return 'text-white';
    }
  };
  
  const getPrefix = () => {
    switch (type) {
      case 'damage': return '-';
      case 'heal': return '+';
      case 'xp': return '+';
      case 'coin': return '+';
      case 'gem': return '+';
      default: return '';
    }
  };
  
  return (
    <div 
      className={`absolute pointer-events-none font-bold text-lg ${getColor()} animate-feedback`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        textShadow: '0 0 3px rgba(0,0,0,0.8)'
      }}
    >
      {getPrefix()}{value}
    </div>
  );
};
