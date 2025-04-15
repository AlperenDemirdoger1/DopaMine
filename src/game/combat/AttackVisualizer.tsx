import React, { useEffect, useState } from 'react';
import { Position } from '../types';

export interface AttackVisualizerProps {
  attackType: 'melee' | 'ranged' | 'area';
  sourcePosition: Position;
  targetPosition?: Position;
  direction?: { x: number; y: number };
  range?: number;
  duration?: number;
  onComplete?: () => void;
}

const AttackVisualizer: React.FC<AttackVisualizerProps> = ({
  attackType,
  sourcePosition,
  targetPosition,
  direction = { x: 0, y: 1 }, // Default: down
  range = 100,
  duration = 300,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
      if (onComplete) onComplete();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onComplete]);
  
  if (!isActive) return null;
  
  const getRotationStyle = () => {
    if (!direction) return {};
    
    const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
    return {
      transform: `rotate(${angle}deg)`
    };
  };
  
  const getProjectileStyle = () => {
    if (!targetPosition || !sourcePosition) return {};
    
    const dx = targetPosition.x - sourcePosition.x;
    const dy = targetPosition.y - sourcePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return {
      left: `${sourcePosition.x}px`,
      top: `${sourcePosition.y}px`,
      width: `${distance}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'left center'
    };
  };
  
  switch (attackType) {
    case 'melee':
      return (
        <div 
          className="absolute pointer-events-none"
          style={{
            left: `${sourcePosition.x - 30}px`,
            top: `${sourcePosition.y - 30}px`,
            width: '60px',
            height: '60px',
            zIndex: 50
          }}
        >
          <div 
            className="w-full h-full"
            style={{
              ...getRotationStyle(),
              animation: `swing-attack ${duration / 1000}s ease-out forwards`
            }}
          >
            <div className="absolute w-full h-1/2 border-t-4 border-l-4 border-r-4 rounded-t-full border-white opacity-70" />
          </div>
          
          <style>
            {`
              @keyframes swing-attack {
                0% { transform: rotate(${getRotationStyle().transform?.replace('rotate(', '').replace('deg)', '') || 0}deg) scale(0.2); }
                50% { transform: rotate(${getRotationStyle().transform?.replace('rotate(', '').replace('deg)', '') || 0}deg) scale(1.2); }
                100% { transform: rotate(${getRotationStyle().transform?.replace('rotate(', '').replace('deg)', '') || 0}deg) scale(1); opacity: 0; }
              }
            `}
          </style>
        </div>
      );
      
    case 'ranged':
      return (
        <div 
          className="absolute pointer-events-none"
          style={{
            ...getProjectileStyle(),
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 50,
            animation: `projectile-attack ${duration / 1000}s linear forwards`
          }}
        >
          <div className="absolute right-0 w-3 h-3 bg-white rounded-full transform -translate-y-1/2" />
          
          <style>
            {`
              @keyframes projectile-attack {
                0% { transform: scaleX(0) rotate(${getProjectileStyle().transform?.replace('rotate(', '').replace('deg)', '') || 0}deg); opacity: 0.8; }
                10% { transform: scaleX(0.1) rotate(${getProjectileStyle().transform?.replace('rotate(', '').replace('deg)', '') || 0}deg); opacity: 1; }
                90% { transform: scaleX(0.9) rotate(${getProjectileStyle().transform?.replace('rotate(', '').replace('deg)', '') || 0}deg); opacity: 1; }
                100% { transform: scaleX(1) rotate(${getProjectileStyle().transform?.replace('rotate(', '').replace('deg)', '') || 0}deg); opacity: 0; }
              }
            `}
          </style>
        </div>
      );
      
    case 'area':
      return (
        <div 
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${sourcePosition.x - range}px`,
            top: `${sourcePosition.y - range}px`,
            width: `${range * 2}px`,
            height: `${range * 2}px`,
            border: '2px solid rgba(255, 255, 255, 0.7)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            zIndex: 50,
            animation: `area-attack ${duration / 1000}s ease-out forwards`
          }}
        >
          <style>
            {`
              @keyframes area-attack {
                0% { transform: scale(0.2); opacity: 0.2; }
                50% { transform: scale(0.8); opacity: 0.7; }
                100% { transform: scale(1); opacity: 0; }
              }
            `}
          </style>
        </div>
      );
      
    default:
      return null;
  }
};

export default AttackVisualizer;
