import React from 'react';
import { PlayerProgression, Achievement, Mission } from './types';

interface ProgressionUIProps {
  progression: PlayerProgression;
  onApplySkillPoint: (attribute: 'strength' | 'vitality' | 'agility' | 'intelligence') => void;
}

const ProgressionUI: React.FC<ProgressionUIProps> = ({ progression, onApplySkillPoint }) => {
  return (
    <div className="bg-gray-800 bg-opacity-90 rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Character Progression
      </h2>
      
      {/* Level and XP */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Level {progression.level}</span>
          <span className="text-sm">{progression.experience} / {progression.experienceToNextLevel} XP</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${(progression.experience / progression.experienceToNextLevel) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Attributes */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Attributes</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Strength: {progression.attributes.strength}</span>
            {progression.skillPoints > 0 && (
              <button 
                className="px-2 py-1 bg-purple-700 rounded-full text-xs hover:bg-purple-600 transition-colors"
                onClick={() => onApplySkillPoint('strength')}
              >
                +
              </button>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Vitality: {progression.attributes.vitality}</span>
            {progression.skillPoints > 0 && (
              <button 
                className="px-2 py-1 bg-purple-700 rounded-full text-xs hover:bg-purple-600 transition-colors"
                onClick={() => onApplySkillPoint('vitality')}
              >
                +
              </button>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Agility: {progression.attributes.agility}</span>
            {progression.skillPoints > 0 && (
              <button 
                className="px-2 py-1 bg-purple-700 rounded-full text-xs hover:bg-purple-600 transition-colors"
                onClick={() => onApplySkillPoint('agility')}
              >
                +
              </button>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Intelligence: {progression.attributes.intelligence}</span>
            {progression.skillPoints > 0 && (
              <button 
                className="px-2 py-1 bg-purple-700 rounded-full text-xs hover:bg-purple-600 transition-colors"
                onClick={() => onApplySkillPoint('intelligence')}
              >
                +
              </button>
            )}
          </div>
        </div>
        {progression.skillPoints > 0 && (
          <div className="text-xs text-center mt-2 text-purple-300">
            You have {progression.skillPoints} skill points to spend
          </div>
        )}
      </div>
      
      {/* Stats */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Stats</h3>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div>Enemies Defeated: {progression.stats.totalEnemiesDefeated}</div>
          <div>Levels Completed: {progression.stats.totalLevelsCompleted}</div>
          <div>Coins Collected: {progression.stats.totalCoinsCollected}</div>
          <div>Gems Collected: {progression.stats.totalGemsCollected}</div>
          <div>Power-ups Collected: {progression.stats.totalPowerUpsCollected}</div>
          <div>Highest Score: {progression.stats.highestScore}</div>
        </div>
      </div>
    </div>
  );
};

export const AchievementsUI: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  return (
    <div className="bg-gray-800 bg-opacity-90 rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Achievements
      </h2>
      
      <div className="space-y-3">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-purple-900' : 'bg-gray-700'} transition-colors`}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-2">{achievement.icon}</div>
              <div>
                <div className="font-semibold">{achievement.name}</div>
                <div className="text-xs text-gray-300">{achievement.description}</div>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">{achievement.progress} / {achievement.target}</span>
                {achievement.unlocked && (
                  <span className="text-xs text-green-400">Completed!</span>
                )}
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${achievement.unlocked ? 'bg-green-500' : 'bg-purple-600'} transition-all duration-300`}
                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                />
              </div>
            </div>
            
            {achievement.unlocked && achievement.reward && (
              <div className="mt-1 text-xs text-yellow-300">
                Reward: {achievement.reward.value} {achievement.reward.type === 'xp' ? 'XP' : achievement.reward.type === 'coins' ? 'Coins' : 'Gems'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DailyMissionsUI: React.FC<{ missions: Mission[] }> = ({ missions }) => {
  return (
    <div className="bg-gray-800 bg-opacity-90 rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Daily Missions
      </h2>
      
      <div className="space-y-3">
        {missions.map(mission => (
          <div 
            key={mission.id} 
            className={`p-2 rounded-lg ${mission.completed ? 'bg-purple-900' : 'bg-gray-700'} transition-colors`}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-2">{mission.icon}</div>
              <div>
                <div className="font-semibold">{mission.name}</div>
                <div className="text-xs text-gray-300">{mission.description}</div>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">{mission.progress} / {mission.target}</span>
                {mission.completed ? (
                  <span className="text-xs text-green-400">Completed!</span>
                ) : (
                  <span className="text-xs text-gray-400">
                    Expires in {Math.floor((mission.expiresAt - Date.now()) / (1000 * 60 * 60))}h
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${mission.completed ? 'bg-green-500' : 'bg-purple-600'} transition-all duration-300`}
                  style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="mt-1 text-xs text-yellow-300">
              Reward: {mission.reward.value} {mission.reward.type === 'xp' ? 'XP' : mission.reward.type === 'coins' ? 'Coins' : 'Gems'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LevelUpNotification: React.FC<{ 
  level: number;
  rewards: any;
  onClose: () => void;
}> = ({ level, rewards, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full text-white text-center animate-bounce-in">
        <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Level Up!
        </h2>
        
        <div className="text-xl mb-6">You are now level {level}!</div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Rewards:</h3>
          <ul className="space-y-2">
            {rewards.skillPoints && (
              <li className="flex items-center justify-center">
                <span className="text-purple-300 mr-2">+{rewards.skillPoints}</span> Skill Points
              </li>
            )}
            {rewards.healthBoost && (
              <li className="flex items-center justify-center">
                <span className="text-red-400 mr-2">+{rewards.healthBoost}</span> Max Health
              </li>
            )}
            {rewards.damageBoost && (
              <li className="flex items-center justify-center">
                <span className="text-orange-400 mr-2">+{rewards.damageBoost}</span> Damage
              </li>
            )}
            {rewards.speedBoost && (
              <li className="flex items-center justify-center">
                <span className="text-blue-400 mr-2">+{rewards.speedBoost}</span> Speed
              </li>
            )}
            {rewards.unlockAbility && (
              <li className="flex items-center justify-center">
                <span className="text-green-400 mr-2">New Ability:</span> {rewards.unlockAbility}
              </li>
            )}
          </ul>
        </div>
        
        <button 
          className="px-6 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export const AchievementNotification: React.FC<{ 
  achievement: Achievement;
  onClose: () => void;
}> = ({ achievement, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-purple-900 rounded-lg p-4 max-w-xs w-full text-white shadow-lg border border-purple-700">
        <div className="flex items-center mb-2">
          <div className="text-2xl mr-2">{achievement.icon}</div>
          <div>
            <div className="font-semibold">Achievement Unlocked!</div>
            <div className="text-sm">{achievement.name}</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-300 mb-2">{achievement.description}</div>
        
        {achievement.reward && (
          <div className="text-xs text-yellow-300">
            Reward: {achievement.reward.value} {achievement.reward.type === 'xp' ? 'XP' : achievement.reward.type === 'coins' ? 'Coins' : 'Gems'}
          </div>
        )}
        
        <button 
          className="absolute top-1 right-1 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const MissionNotification: React.FC<{ 
  mission: Mission;
  onClose: () => void;
}> = ({ mission, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-blue-900 rounded-lg p-4 max-w-xs w-full text-white shadow-lg border border-blue-700">
        <div className="flex items-center mb-2">
          <div className="text-2xl mr-2">{mission.icon}</div>
          <div>
            <div className="font-semibold">Mission Complete!</div>
            <div className="text-sm">{mission.name}</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-300 mb-2">{mission.description}</div>
        
        <div className="text-xs text-yellow-300">
          Reward: {mission.reward.value} {mission.reward.type === 'xp' ? 'XP' : mission.reward.type === 'coins' ? 'Coins' : 'Gems'}
        </div>
        
        <button 
          className="absolute top-1 right-1 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ProgressionUI;
