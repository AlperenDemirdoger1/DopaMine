import React, { useState, useEffect } from 'react';

export interface Skill {
  id: string;
  name: string;
  icon: string;
  cooldown: number; // in seconds
  lastUsed: number | null;
  keyBinding: string;
  description: string;
}

interface SkillBarProps {
  skills: Skill[];
  onUseSkill: (skillId: string) => void;
}

const SkillBar: React.FC<SkillBarProps> = ({ skills, onUseSkill }) => {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newCooldowns: Record<string, number> = {};
      
      skills.forEach(skill => {
        if (skill.lastUsed) {
          const elapsedSeconds = (now - skill.lastUsed) / 1000;
          const remainingCooldown = Math.max(0, skill.cooldown - elapsedSeconds);
          
          if (remainingCooldown > 0) {
            newCooldowns[skill.id] = remainingCooldown;
          }
        }
      });
      
      setCooldowns(newCooldowns);
    }, 100);
    
    return () => clearInterval(interval);
  }, [skills]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      const skill = skills.find(s => s.keyBinding === key);
      
      if (skill && !cooldowns[skill.id]) {
        onUseSkill(skill.id);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skills, cooldowns, onUseSkill]);
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-gray-800 bg-opacity-70 p-2 rounded-lg border border-gray-700">
      {skills.map(skill => {
        const isOnCooldown = Boolean(cooldowns[skill.id]);
        const cooldownPercent = isOnCooldown 
          ? (cooldowns[skill.id] / skill.cooldown) * 100 
          : 0;
        
        return (
          <div 
            key={skill.id}
            className="relative w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors duration-200"
            onClick={() => !isOnCooldown && onUseSkill(skill.id)}
            title={`${skill.name}: ${skill.description}`}
          >
            {/* Skill Icon */}
            <div className={`text-2xl ${isOnCooldown ? 'opacity-50' : 'opacity-100'}`}>
              {skill.icon}
            </div>
            
            {/* Cooldown Overlay */}
            {isOnCooldown && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-60 rounded-md"
                style={{ 
                  clipPath: `polygon(0 0, 100% 0, 100% ${cooldownPercent}%, 0 ${cooldownPercent}%)` 
                }}
              />
            )}
            
            {/* Key Binding */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
              {skill.keyBinding}
            </div>
            
            {/* Cooldown Text */}
            {isOnCooldown && (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {Math.ceil(cooldowns[skill.id])}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SkillBar;
