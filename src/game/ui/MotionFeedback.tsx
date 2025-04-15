import React, { useEffect, useState } from 'react';

export interface MotionFeedbackProps {
  isMoving: boolean;
  isAttacking: boolean;
  isTakingDamage: boolean;
}

export const MotionFeedback: React.FC<MotionFeedbackProps> = ({ 
  isMoving, 
  isAttacking, 
  isTakingDamage 
}) => {
  const [moveShake, setMoveShake] = useState<boolean>(false);
  const [attackFlash, setAttackFlash] = useState<boolean>(false);
  const [damageFlash, setDamageFlash] = useState<boolean>(false);

  useEffect(() => {
    if (isMoving) {
      setMoveShake(true);
      const timer = setTimeout(() => {
        setMoveShake(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isMoving]);

  useEffect(() => {
    if (isAttacking) {
      setAttackFlash(true);
      const timer = setTimeout(() => {
        setAttackFlash(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isAttacking]);

  useEffect(() => {
    if (isTakingDamage) {
      setDamageFlash(true);
      const timer = setTimeout(() => {
        setDamageFlash(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTakingDamage]);

  return (
    <div className="motion-feedback-container">
      {/* Movement feedback - slight screen shake */}
      {moveShake && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: 'shake 0.15s cubic-bezier(.36,.07,.19,.97) both',
          }}
        />
      )}
      
      {/* Attack feedback - quick zoom on hit */}
      {attackFlash && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: 'attack-flash 0.2s ease-out',
          }}
        />
      )}
      
      {/* Damage feedback - red border flash */}
      {damageFlash && (
        <div 
          className="absolute inset-0 pointer-events-none border-8 border-red-500 opacity-70"
          style={{
            animation: 'damage-flash 0.3s ease-out',
          }}
        />
      )}
      
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            50% { transform: translateX(2px); }
            75% { transform: translateX(-2px); }
          }
          
          @keyframes attack-flash {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
          
          @keyframes damage-flash {
            0% { opacity: 0.7; }
            50% { opacity: 0.5; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default MotionFeedback;
