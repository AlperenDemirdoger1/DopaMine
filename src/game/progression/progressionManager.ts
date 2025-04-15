// import { v4 as uuidv4 } from 'uuid';
import { 
  PlayerProgression, 
  Achievement, 
  Mission, 
  LevelUpReward,
  MissionReward,
  AchievementReward
} from './types';

export const initializeProgression = (_characterType: string): PlayerProgression => {
  return {
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    totalExperience: 0,
    skillPoints: 0,
    attributes: {
      strength: 1,
      vitality: 1,
      agility: 1,
      intelligence: 1
    },
    achievements: generateAchievements(),
    dailyMissions: generateDailyMissions(),
    stats: {
      totalEnemiesDefeated: 0,
      totalCoinsCollected: 0,
      totalGemsCollected: 0,
      totalKeysCollected: 0,
      totalPowerUpsCollected: 0,
      totalLevelsCompleted: 0,
      chaptersCompleted: 0,
      highestLevel: 1,
      highestScore: 0,
      totalDeaths: 0,
      totalPlayTime: 0,
      achievementsUnlocked: 0,
      missionsCompleted: 0
    },
    unlockedAbilities: []
  };
};

export const addExperience = (
  progression: PlayerProgression,
  amount: number
): { updatedProgression: PlayerProgression; leveledUp: boolean } => {
  const updatedProgression = { ...progression };
  updatedProgression.experience += amount;
  updatedProgression.totalExperience += amount;
  
  let leveledUp = false;
  
  while (updatedProgression.experience >= updatedProgression.experienceToNextLevel) {
    updatedProgression.experience -= updatedProgression.experienceToNextLevel;
    updatedProgression.level += 1;
    updatedProgression.skillPoints += 1;
    updatedProgression.experienceToNextLevel = Math.floor(updatedProgression.experienceToNextLevel * 1.2);
    
    if (updatedProgression.level > updatedProgression.stats.highestLevel) {
      updatedProgression.stats.highestLevel = updatedProgression.level;
    }
    
    leveledUp = true;
  }
  
  return { updatedProgression, leveledUp };
};

export const updateAchievements = (
  progression: PlayerProgression,
  actions: {
    enemiesDefeated: number;
    powerUpsCollected: number;
    collectiblesCollected: number;
    levelsCompleted: number;
    damageDealt: number;
    damageTaken: number;
  }
): { updatedProgression: PlayerProgression; newAchievement: Achievement | null } => {
  const updatedProgression = { ...progression };
  let newAchievement: Achievement | null = null;
  
  updatedProgression.stats.totalEnemiesDefeated += actions.enemiesDefeated;
  updatedProgression.stats.totalPowerUpsCollected += actions.powerUpsCollected;
  updatedProgression.stats.totalCoinsCollected += actions.collectiblesCollected;
  updatedProgression.stats.totalLevelsCompleted += actions.levelsCompleted;
  
  updatedProgression.achievements = updatedProgression.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;
    
    let progress = achievement.progress;
    
    switch (achievement.id) {
      case 'enemies_defeated_10':
      case 'enemies_defeated_50':
      case 'enemies_defeated_100':
        progress += actions.enemiesDefeated;
        break;
        
      case 'powerups_collected_10':
      case 'powerups_collected_50':
        progress += actions.powerUpsCollected;
        break;
        
      case 'coins_collected_100':
      case 'coins_collected_500':
        progress += actions.collectiblesCollected;
        break;
        
      case 'levels_completed_5':
      case 'levels_completed_10':
        progress += actions.levelsCompleted;
        break;
    }
    
    if (progress >= achievement.target && !achievement.unlocked) {
      newAchievement = {
        ...achievement,
        unlocked: true,
        progress: achievement.target
      };
      
      updatedProgression.stats.achievementsUnlocked += 1;
      
      return newAchievement;
    }
    
    return {
      ...achievement,
      progress
    };
  });
  
  return { updatedProgression, newAchievement };
};

export const updateDailyMissions = (
  progression: PlayerProgression,
  actions: {
    enemiesDefeated: number;
    powerUpsCollected: number;
    collectiblesCollected: number;
    levelsCompleted: number;
    damageDealt: number;
    damageTaken: number;
  }
): { updatedProgression: PlayerProgression; completedMission: Mission | null } => {
  const updatedProgression = { ...progression };
  let completedMission: Mission | null = null;
  
  const now = Date.now();
  const expiredMissions = updatedProgression.dailyMissions.filter(
    mission => mission.expiresAt < now
  );
  
  if (expiredMissions.length > 0) {
    updatedProgression.dailyMissions = updatedProgression.dailyMissions.filter(
      mission => mission.expiresAt >= now
    );
    
    const newMissions = generateDailyMissions(expiredMissions.length);
    updatedProgression.dailyMissions = [...updatedProgression.dailyMissions, ...newMissions];
  }
  
  updatedProgression.dailyMissions = updatedProgression.dailyMissions.map(mission => {
    if (mission.completed) return mission;
    
    let progress = mission.progress;
    
    switch (mission.id.split('_')[0]) {
      case 'defeat':
        progress += actions.enemiesDefeated;
        break;
        
      case 'collect':
        if (mission.id.includes('powerup')) {
          progress += actions.powerUpsCollected;
        } else if (mission.id.includes('coin')) {
          progress += actions.collectiblesCollected;
        }
        break;
        
      case 'complete':
        progress += actions.levelsCompleted;
        break;
        
      case 'deal':
        progress += actions.damageDealt;
        break;
        
      case 'survive':
        progress += actions.levelsCompleted;
        break;
    }
    
    if (progress >= mission.target && !mission.completed) {
      completedMission = {
        ...mission,
        completed: true,
        progress: mission.target
      };
      
      updatedProgression.stats.missionsCompleted += 1;
      
      return completedMission;
    }
    
    return {
      ...mission,
      progress
    };
  });
  
  return { updatedProgression, completedMission };
};

export const applyProgressionToPlayer = (player: any, progression: PlayerProgression): any => {
  const updatedPlayer = { ...player };
  
  updatedPlayer.maxHealth += progression.attributes.vitality * 10;
  updatedPlayer.health = updatedPlayer.maxHealth;
  updatedPlayer.damage += progression.attributes.strength * 5;
  
  updatedPlayer.level = progression.level;
  updatedPlayer.experience = progression.experience;
  updatedPlayer.experienceToNextLevel = progression.experienceToNextLevel;
  
  return updatedPlayer;
};

export const applyAttributePoint = (
  progression: PlayerProgression,
  player: any,
  attribute: string
): { updatedProgression: PlayerProgression; updatedPlayer: any } => {
  if (progression.skillPoints <= 0) {
    return { updatedProgression: progression, updatedPlayer: player };
  }
  
  const updatedProgression = { ...progression };
  const updatedPlayer = { ...player };
  
  updatedProgression.skillPoints -= 1;
  
  switch (attribute) {
    case 'strength':
      updatedProgression.attributes.strength += 1;
      updatedPlayer.damage += 5;
      break;
      
    case 'vitality':
      updatedProgression.attributes.vitality += 1;
      updatedPlayer.maxHealth += 10;
      updatedPlayer.health += 10;
      break;
      
    case 'agility':
      updatedProgression.attributes.agility += 1;
      break;
      
    case 'intelligence':
      updatedProgression.attributes.intelligence += 1;
      break;
  }
  
  return { updatedProgression, updatedPlayer };
};

const generateAchievements = (): Achievement[] => {
  return [
    {
      id: 'enemies_defeated_10',
      name: 'Novice Slayer',
      description: 'Defeat 10 enemies',
      icon: '⚔️',
      unlocked: false,
      progress: 0,
      target: 10,
      reward: {
        type: 'xp',
        value: 50
      }
    },
    {
      id: 'enemies_defeated_50',
      name: 'Veteran Slayer',
      description: 'Defeat 50 enemies',
      icon: '⚔️',
      unlocked: false,
      progress: 0,
      target: 50,
      reward: {
        type: 'xp',
        value: 200
      }
    },
    {
      id: 'enemies_defeated_100',
      name: 'Master Slayer',
      description: 'Defeat 100 enemies',
      icon: '⚔️',
      unlocked: false,
      progress: 0,
      target: 100,
      reward: {
        type: 'xp',
        value: 500
      }
    },
    {
      id: 'powerups_collected_10',
      name: 'Power Collector',
      description: 'Collect 10 power-ups',
      icon: '✨',
      unlocked: false,
      progress: 0,
      target: 10,
      reward: {
        type: 'xp',
        value: 100
      }
    },
    {
      id: 'powerups_collected_50',
      name: 'Power Hoarder',
      description: 'Collect 50 power-ups',
      icon: '✨',
      unlocked: false,
      progress: 0,
      target: 50,
      reward: {
        type: 'xp',
        value: 300
      }
    },
    {
      id: 'coins_collected_100',
      name: 'Treasure Hunter',
      description: 'Collect 100 coins',
      icon: '🪙',
      unlocked: false,
      progress: 0,
      target: 100,
      reward: {
        type: 'coins',
        value: 50
      }
    },
    {
      id: 'coins_collected_500',
      name: 'Treasure Master',
      description: 'Collect 500 coins',
      icon: '🪙',
      unlocked: false,
      progress: 0,
      target: 500,
      reward: {
        type: 'coins',
        value: 200
      }
    },
    {
      id: 'levels_completed_5',
      name: 'Explorer',
      description: 'Complete 5 levels',
      icon: '🗺️',
      unlocked: false,
      progress: 0,
      target: 5,
      reward: {
        type: 'xp',
        value: 150
      }
    },
    {
      id: 'levels_completed_10',
      name: 'Adventurer',
      description: 'Complete 10 levels',
      icon: '🗺️',
      unlocked: false,
      progress: 0,
      target: 10,
      reward: {
        type: 'gems',
        value: 5
      }
    }
  ];
};

const generateDailyMissions = (count: number = 3): Mission[] => {
  const missionTypes = [
    {
      id: 'defeat_enemies',
      name: 'Enemy Slayer',
      description: 'Defeat {target} enemies',
      icon: '⚔️',
      targetRange: [5, 15],
      reward: {
        type: 'xp',
        value: 100
      }
    },
    {
      id: 'collect_powerups',
      name: 'Power Collector',
      description: 'Collect {target} power-ups',
      icon: '✨',
      targetRange: [3, 8],
      reward: {
        type: 'xp',
        value: 75
      }
    },
    {
      id: 'collect_coins',
      name: 'Coin Collector',
      description: 'Collect {target} coins',
      icon: '🪙',
      targetRange: [20, 50],
      reward: {
        type: 'coins',
        value: 25
      }
    },
    {
      id: 'complete_levels',
      name: 'Level Explorer',
      description: 'Complete {target} levels',
      icon: '🗺️',
      targetRange: [2, 5],
      reward: {
        type: 'xp',
        value: 150
      }
    },
    {
      id: 'deal_damage',
      name: 'Damage Dealer',
      description: 'Deal {target} damage to enemies',
      icon: '💥',
      targetRange: [100, 300],
      reward: {
        type: 'xp',
        value: 120
      }
    },
    {
      id: 'survive_levels',
      name: 'Survivor',
      description: 'Complete {target} levels without dying',
      icon: '❤️',
      targetRange: [1, 3],
      reward: {
        type: 'gems',
        value: 2
      }
    }
  ];
  
  const missions: Mission[] = [];
  const usedTypes = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let missionType;
    
    do {
      missionType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    } while (usedTypes.has(missionType.id) && usedTypes.size < missionTypes.length);
    
    usedTypes.add(missionType.id);
    
    const target = Math.floor(
      Math.random() * (missionType.targetRange[1] - missionType.targetRange[0] + 1) + 
      missionType.targetRange[0]
    );
    
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    
    missions.push({
      id: `${missionType.id}_${Date.now()}_${i}`,
      name: missionType.name,
      description: missionType.description.replace('{target}', target.toString()),
      icon: missionType.icon,
      completed: false,
      progress: 0,
      target,
      expiresAt,
      reward: {
        type: missionType.reward.type as "xp" | "coins" | "gems" | "item",
        value: missionType.reward.value,
        itemId: undefined // Set default value since itemId might not exist in the original reward
      }
    });
  }
  
  return missions;
};

export const getLevelUpReward = (level: number): LevelUpReward => {
  return {
    level,
    message: `Congratulations! You've reached level ${level}!`,
    rewards: {
      skillPoints: 1,
      healthBoost: 10,
      damageBoost: 5
    }
  };
};

export const getMissionReward = (mission: Mission): MissionReward => {
  return {
    mission,
    rewards: {
      experience: mission.reward.type === 'xp' ? mission.reward.value : 0,
      coins: mission.reward.type === 'coins' ? mission.reward.value : 0,
      gems: mission.reward.type === 'gems' ? mission.reward.value : 0,
      item: mission.reward.type === 'item' ? { id: mission.reward.itemId } : undefined
    }
  };
};

export const getAchievementReward = (achievement: Achievement): AchievementReward => {
  return {
    achievement,
    rewards: {
      experience: achievement.reward?.type === 'xp' ? achievement.reward.value : 0,
      coins: achievement.reward?.type === 'coins' ? achievement.reward.value : 0,
      gems: achievement.reward?.type === 'gems' ? achievement.reward.value : 0,
      item: achievement.reward?.type === 'item' ? { id: achievement.reward.itemId } : undefined
    }
  };
};
