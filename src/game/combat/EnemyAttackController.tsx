import React, { useState, useEffect } from 'react';
import { Enemy, Position } from '../types';
import AttackVisualizer from './AttackVisualizer';

export interface EnemyAttackProps {
  enemy: Enemy;
  playerPosition: Position;
  onAttackComplete: (damage: number) => void;
}

export interface EnemyAttackVisualization {
  id: string;
  enemyId: string;
  attackType: 'melee' | 'ranged' | 'area';
  sourcePosition: Position;
  targetPosition: Position;
  telegraphDuration: number;
  attackDuration: number;
  damage: number;
  range: number;
  startTime: number;
  isAttacking: boolean;
  isTelegraphing: boolean;
}

const EnemyAttackController: React.FC<EnemyAttackProps> = ({
  enemy,
  playerPosition,
  onAttackComplete
}) => {
  const [attackState, setAttackState] = useState<EnemyAttackVisualization | null>(null);
  
  useEffect(() => {
    const getAttackTypeForEnemy = (): 'melee' | 'ranged' | 'area' => {
      switch (enemy.type) {
        case 'archer':
        case 'mage':
          return 'ranged';
        case 'brute':
        case 'boss':
          return 'area';
        default:
          return 'melee';
      }
    };
    
    const calculateDistance = (pos1: Position, pos2: Position): number => {
      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    const attackRange = enemy.type === 'archer' || enemy.type === 'mage' ? 300 : 100;
    const distance = calculateDistance(enemy.position, playerPosition);
    
    if (distance <= attackRange && !attackState && (!enemy.lastAttackTime || Date.now() - enemy.lastAttackTime > (enemy.attackCooldown || 2000))) {
      const attackType = getAttackTypeForEnemy();
      const telegraphDuration = enemy.type === 'boss' ? 1000 : 500;
      const attackDuration = 300;
      
      const newAttackState: EnemyAttackVisualization = {
        id: `enemy-attack-${enemy.id}-${Date.now()}`,
        enemyId: enemy.id,
        attackType,
        sourcePosition: enemy.position,
        targetPosition: playerPosition,
        telegraphDuration,
        attackDuration,
        damage: enemy.damage,
        range: attackRange,
        startTime: Date.now(),
        isAttacking: false,
        isTelegraphing: true
      };
      
      setAttackState(newAttackState);
      
      setTimeout(() => {
        setAttackState(prev => prev ? { ...prev, isTelegraphing: false, isAttacking: true } : null);
        
        setTimeout(() => {
          onAttackComplete(enemy.damage);
          setAttackState(null);
        }, attackDuration);
      }, telegraphDuration);
    }
  }, [enemy, playerPosition, attackState, onAttackComplete]);
  
  if (!attackState) return null;
  
  return (
    <>
      {/* Telegraph visualization */}
      {attackState.isTelegraphing && (
        <div 
          className="absolute pointer-events-none"
          style={{
            left: attackState.attackType === 'ranged' ? 
              `${attackState.sourcePosition.x}px` : 
              `${attackState.sourcePosition.x - attackState.range / 2}px`,
            top: attackState.attackType === 'ranged' ? 
              `${attackState.sourcePosition.y}px` : 
              `${attackState.sourcePosition.y - attackState.range / 2}px`,
            width: attackState.attackType === 'ranged' ? 
              '4px' : 
              `${attackState.range}px`,
            height: attackState.attackType === 'ranged' ? 
              '4px' : 
              `${attackState.range}px`,
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            borderRadius: attackState.attackType === 'area' ? '50%' : '0',
            transform: attackState.attackType === 'ranged' ? 
              `rotate(${Math.atan2(
                attackState.targetPosition.y - attackState.sourcePosition.y,
                attackState.targetPosition.x - attackState.sourcePosition.x
              ) * (180 / Math.PI)}deg)` : 
              'none',
            transformOrigin: 'left center',
            animation: `telegraph-pulse ${attackState.telegraphDuration / 1000}s ease-in-out infinite`
          }}
        />
      )}
      
      {/* Actual attack visualization */}
      {attackState.isAttacking && (
        <AttackVisualizer
          attackType={attackState.attackType}
          sourcePosition={attackState.sourcePosition}
          targetPosition={attackState.targetPosition}
          range={attackState.range}
          duration={attackState.attackDuration}
        />
      )}
      
      <style>
        {`
          @keyframes telegraph-pulse {
            0% { opacity: 0.2; }
            50% { opacity: 0.6; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </>
  );
};

export default EnemyAttackController;
