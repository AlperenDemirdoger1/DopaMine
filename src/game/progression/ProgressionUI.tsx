import React from 'react';
import { PlayerProgression, Achievement, Mission } from './types';

interface ProgressionUIProps {
  progression: PlayerProgression;
  onClose: () => void;
  onApplyAttributePoint: (attribute: string) => void;
}

const ProgressionUI: React.FC<ProgressionUIProps> = ({ 
  progression, 
  onClose,
  onApplyAttributePoint
}) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-10">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-400">Character Progression</h2>
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level and Experience */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold text-purple-300 mb-3">Level & Experience</h3>
            <div className="flex items-center mb-2">
              <span className="text-3xl font-bold text-purple-400 mr-2">Level {progression.level}</span>
              <span className="text-gray-400">({progression.experience} / {progression.experienceToNextLevel} XP)</span>
            </div>
            
            <div className="w-full h-4 bg-gray-600 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-purple-500"
                style={{ width: `${(progression.experience / progression.experienceToNextLevel) * 100}%` }}
              ></div>
            </div>
            
            <div className="text-gray-300">
              <p>Total Experience: {progression.totalExperience}</p>
              <p>Skill Points Available: <span className="text-yellow-400 font-bold">{progression.skillPoints}</span></p>
            </div>
          </div>
          
          {/* Attributes */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold text-purple-300 mb-3">Attributes</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-red-400 mr-2">⚔️</span>
                  <span>Strength: {progression.attributes.strength}</span>
                  <span className="text-gray-400 text-sm ml-2">(+{progression.attributes.strength * 5} damage)</span>
                </div>
                {progression.skillPoints > 0 && (
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                    onClick={() => onApplyAttributePoint('strength')}
                  >
                    +
                  </button>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-green-400 mr-2">❤️</span>
                  <span>Vitality: {progression.attributes.vitality}</span>
                  <span className="text-gray-400 text-sm ml-2">(+{progression.attributes.vitality * 10} health)</span>
                </div>
                {progression.skillPoints > 0 && (
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                    onClick={() => onApplyAttributePoint('vitality')}
                  >
                    +
                  </button>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-yellow-400 mr-2">⚡</span>
                  <span>Agility: {progression.attributes.agility}</span>
                  <span className="text-gray-400 text-sm ml-2">(+{progression.attributes.agility * 5}% speed)</span>
                </div>
                {progression.skillPoints > 0 && (
                  <button 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-sm"
                    onClick={() => onApplyAttributePoint('agility')}
                  >
                    +
                  </button>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-blue-400 mr-2">✨</span>
                  <span>Intelligence: {progression.attributes.intelligence}</span>
                  <span className="text-gray-400 text-sm ml-2">(+{progression.attributes.intelligence * 5}% ability power)</span>
                </div>
                {progression.skillPoints > 0 && (
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                    onClick={() => onApplyAttributePoint('intelligence')}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold text-purple-300 mb-3">Achievements</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {progression.achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-purple-900 bg-opacity-50' : 'bg-gray-800'}`}
                >
                  <div className="flex items-center mb-1">
                    <span className="text-xl mr-2">{achievement.icon}</span>
                    <span className={`font-bold ${achievement.unlocked ? 'text-purple-300' : 'text-gray-300'}`}>
                      {achievement.name}
                    </span>
                    {achievement.unlocked && (
                      <span className="ml-auto text-green-400 text-sm">✓ Completed</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${achievement.unlocked ? 'bg-purple-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{achievement.progress} / {achievement.target}</span>
                      {achievement.reward && (
                        <span className="text-yellow-400">
                          Reward: {achievement.reward.value} {achievement.reward.type === 'xp' ? 'XP' : 
                                  achievement.reward.type === 'coins' ? 'Coins' : 
                                  achievement.reward.type === 'gems' ? 'Gems' : 'Item'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Daily Missions */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold text-purple-300 mb-3">Daily Missions</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {progression.dailyMissions.map(mission => (
                <div 
                  key={mission.id}
                  className={`p-3 rounded-lg ${mission.completed ? 'bg-blue-900 bg-opacity-50' : 'bg-gray-800'}`}
                >
                  <div className="flex items-center mb-1">
                    <span className="text-xl mr-2">{mission.icon}</span>
                    <span className={`font-bold ${mission.completed ? 'text-blue-300' : 'text-gray-300'}`}>
                      {mission.name}
                    </span>
                    {mission.completed && (
                      <span className="ml-auto text-green-400 text-sm">✓ Completed</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{mission.description}</p>
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${mission.completed ? 'bg-blue-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (mission.progress / mission.target) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{mission.progress} / {mission.target}</span>
                      <span className="text-yellow-400">
                        Reward: {mission.reward.value} {mission.reward.type === 'xp' ? 'XP' : 
                                mission.reward.type === 'coins' ? 'Coins' : 
                                mission.reward.type === 'gems' ? 'Gems' : 'Item'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Expires in: {formatTimeRemaining(mission.expiresAt - Date.now())}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="bg-gray-700 rounded-lg p-4 md:col-span-2">
            <h3 className="text-xl font-bold text-purple-300 mb-3">Player Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Enemies Defeated</div>
                <div className="text-xl font-bold text-red-400">{progression.stats.totalEnemiesDefeated}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Coins Collected</div>
                <div className="text-xl font-bold text-yellow-400">{progression.stats.totalCoinsCollected}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Gems Collected</div>
                <div className="text-xl font-bold text-blue-400">{progression.stats.totalGemsCollected}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Power-Ups Collected</div>
                <div className="text-xl font-bold text-purple-400">{progression.stats.totalPowerUpsCollected}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Levels Completed</div>
                <div className="text-xl font-bold text-green-400">{progression.stats.totalLevelsCompleted}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Highest Level</div>
                <div className="text-xl font-bold text-blue-400">{progression.stats.highestLevel}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Highest Score</div>
                <div className="text-xl font-bold text-purple-400">{progression.stats.highestScore}</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Total Deaths</div>
                <div className="text-xl font-bold text-red-400">{progression.stats.totalDeaths}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'Expired';
  
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const LevelUpNotification: React.FC<{ level: number; onClose: () => void }> = ({ 
  level, 
  onClose 
}) => {
  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-purple-900 bg-opacity-90 p-4 rounded-lg shadow-lg animate-bounce-in z-20">
      <div className="flex items-center">
        <span className="text-3xl mr-3">🎉</span>
        <div>
          <h3 className="text-xl font-bold text-purple-300">Level Up!</h3>
          <p className="text-white">You've reached level {level}</p>
        </div>
        <button 
          className="ml-4 bg-purple-700 hover:bg-purple-600 text-white p-1 rounded-full"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const AchievementNotification: React.FC<{ 
  achievement: Achievement; 
  onClose: () => void 
}> = ({ 
  achievement, 
  onClose 
}) => {
  return (
    <div className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-blue-900 bg-opacity-90 p-4 rounded-lg shadow-lg animate-bounce-in z-20">
      <div className="flex items-center">
        <span className="text-3xl mr-3">{achievement.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-blue-300">Achievement Unlocked!</h3>
          <p className="text-white">{achievement.name}</p>
          <p className="text-sm text-gray-300">{achievement.description}</p>
        </div>
        <button 
          className="ml-4 bg-blue-700 hover:bg-blue-600 text-white p-1 rounded-full"
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
  onClose: () => void 
}> = ({ 
  mission, 
  onClose 
}) => {
  return (
    <div className="absolute top-60 left-1/2 transform -translate-x-1/2 bg-green-900 bg-opacity-90 p-4 rounded-lg shadow-lg animate-bounce-in z-20">
      <div className="flex items-center">
        <span className="text-3xl mr-3">{mission.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-green-300">Mission Complete!</h3>
          <p className="text-white">{mission.name}</p>
          <p className="text-sm text-gray-300">{mission.description}</p>
        </div>
        <button 
          className="ml-4 bg-green-700 hover:bg-green-600 text-white p-1 rounded-full"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ProgressionUI;
