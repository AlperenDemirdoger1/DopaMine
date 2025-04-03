import { 
  Achievement, 
  Mission, 
  PlayerLevel, 
  PlayerProgression, 
  PlayerStats, 
  LevelUpReward 
} from './types';
import { GameState, Player } from '../types';

const levelRequirements: PlayerLevel[] = [
  { level: 1, xpRequired: 0, rewards: {} },
  { level: 2, xpRequired: 100, rewards: { healthBoost: 10 } },
  { level: 3, xpRequired: 250, rewards: { damageBoost: 5 } },
  { level: 4, xpRequired: 450, rewards: { speedBoost: 0.2 } },
  { level: 5, xpRequired: 700, rewards: { healthBoost: 15, damageBoost: 5 } },
  { level: 6, xpRequired: 1000, rewards: { unlockAbility: 'secondaryAttack' } },
  { level: 7, xpRequired: 1400, rewards: { healthBoost: 20, speedBoost: 0.2 } },
  { level: 8, xpRequired: 1900, rewards: { damageBoost: 10 } },
  { level: 9, xpRequired: 2500, rewards: { healthBoost: 25 } },
  { level: 10, xpRequired: 3200, rewards: { unlockAbility: 'ultimateAbility' } },
];

const achievements: Achievement[] = [
  {
    id: 'first_kill',
    name: 'First Blood',
    description: 'Defeat your first enemy',
    icon: '🗡️',
    unlocked: false,
    progress: 0,
    target: 1,
    reward: { type: 'xp', value: 50 }
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Collect 50 coins',
    icon: '💰',
    unlocked: false,
    progress: 0,
    target: 50,
    reward: { type: 'gems', value: 5 }
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete 5 levels',
    icon: '🛡️',
    unlocked: false,
    progress: 0,
    target: 5,
    reward: { type: 'xp', value: 200 }
  },
  {
    id: 'treasure_hunter',
    name: 'Treasure Hunter',
    description: 'Collect 10 gems',
    icon: '💎',
    unlocked: false,
    progress: 0,
    target: 10,
    reward: { type: 'coins', value: 100 }
  },
  {
    id: 'power_up',
    name: 'Powered Up',
    description: 'Collect 20 power-ups',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    target: 20,
    reward: { type: 'xp', value: 150 }
  },
  {
    id: 'slayer',
    name: 'Slayer',
    description: 'Defeat 100 enemies',
    icon: '☠️',
    unlocked: false,
    progress: 0,
    target: 100,
    reward: { type: 'xp', value: 300 }
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Reach level 10',
    icon: '👑',
    unlocked: false,
    progress: 0,
    target: 10,
    reward: { type: 'gems', value: 20 }
  }
];

const generateDailyMissions = (): Mission[] => {
  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const tomorrow = now + oneDayInMs;
  
  return [
    {
      id: `daily_kills_${now}`,
      name: 'Daily Hunt',
      description: 'Defeat 15 enemies today',
      icon: '🏹',
      completed: false,
      progress: 0,
      target: 15,
      expiresAt: tomorrow,
      reward: { type: 'xp', value: 100 }
    },
    {
      id: `daily_coins_${now}`,
      name: 'Coin Collector',
      description: 'Collect 30 coins today',
      icon: '🪙',
      completed: false,
      progress: 0,
      target: 30,
      expiresAt: tomorrow,
      reward: { type: 'gems', value: 3 }
    },
    {
      id: `daily_powerups_${now}`,
      name: 'Power Surge',
      description: 'Collect 5 power-ups today',
      icon: '🔋',
      completed: false,
      progress: 0,
      target: 5,
      expiresAt: tomorrow,
      reward: { type: 'xp', value: 75 }
    }
  ];
};

export const initializeProgression = (): PlayerProgression => {
  return {
    level: 1,
    experience: 0,
    experienceToNextLevel: levelRequirements[1].xpRequired,
    totalExperience: 0,
    skillPoints: 0,
    attributes: {
      strength: 1,
      vitality: 1,
      agility: 1,
      intelligence: 1
    },
    achievements: [...achievements],
    dailyMissions: generateDailyMissions(),
    stats: {
      totalEnemiesDefeated: 0,
      totalCoinsCollected: 0,
      totalGemsCollected: 0,
      totalKeysCollected: 0,
      totalPowerUpsCollected: 0,
      totalLevelsCompleted: 0,
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
  player: Player, 
  progression: PlayerProgression, 
  amount: number
): { updatedProgression: PlayerProgression; levelUpRewards: LevelUpReward[] } => {
  const updatedProgression = { ...progression };
  updatedProgression.experience += amount;
  updatedProgression.totalExperience += amount;
  
  const levelUpRewards: LevelUpReward[] = [];
  
  while (
    updatedProgression.level < levelRequirements.length && 
    updatedProgression.experience >= updatedProgression.experienceToNextLevel
  ) {
    updatedProgression.level += 1;
    updatedProgression.experience -= updatedProgression.experienceToNextLevel;
    
    const levelData = levelRequirements[updatedProgression.level - 1];
    const rewards = levelData.rewards;
    
    updatedProgression.skillPoints += 1;
    
    const levelUpReward: LevelUpReward = {
      level: updatedProgression.level,
      message: `Level up! You are now level ${updatedProgression.level}`,
      rewards: {
        skillPoints: 1,
        ...rewards
      }
    };
    
    levelUpRewards.push(levelUpReward);
    
    if (updatedProgression.level < levelRequirements.length) {
      updatedProgression.experienceToNextLevel = 
        levelRequirements[updatedProgression.level].xpRequired - 
        levelRequirements[updatedProgression.level - 1].xpRequired;
    }
    
    if (updatedProgression.level > updatedProgression.stats.highestLevel) {
      updatedProgression.stats.highestLevel = updatedProgression.level;
    }
    
    updatedProgression.achievements = updatedProgression.achievements.map(achievement => {
      if (achievement.id === 'master' && !achievement.unlocked) {
        achievement.progress = updatedProgression.level;
        if (achievement.progress >= achievement.target) {
          achievement.unlocked = true;
          updatedProgression.stats.achievementsUnlocked += 1;
        }
      }
      return achievement;
    });
  }
  
  return { updatedProgression, levelUpRewards };
};

export const applyProgressionToPlayer = (
  player: Player, 
  progression: PlayerProgression
): Player => {
  const updatedPlayer = { ...player };
  
  const strengthBonus = (progression.attributes.strength - 1) * 5; // 5% damage per point
  const vitalityBonus = (progression.attributes.vitality - 1) * 10; // 10 health per point
  const agilityBonus = (progression.attributes.agility - 1) * 0.1; // 10% speed per point
  
  updatedPlayer.damage = player.damage * (1 + (strengthBonus / 100));
  updatedPlayer.maxHealth = player.maxHealth + vitalityBonus;
  
  if (updatedPlayer.health > updatedPlayer.maxHealth) {
    updatedPlayer.health = updatedPlayer.maxHealth;
  }
  
  return updatedPlayer;
};

export const updateAchievements = (
  gameState: GameState, 
  progression: PlayerProgression,
  event: {
    type: 'enemy_defeated' | 'coin_collected' | 'gem_collected' | 'level_completed' | 'powerup_collected';
    value?: number;
  }
): { updatedProgression: PlayerProgression; unlockedAchievements: Achievement[] } => {
  const updatedProgression = { ...progression };
  const unlockedAchievements: Achievement[] = [];
  
  switch (event.type) {
    case 'enemy_defeated':
      updatedProgression.stats.totalEnemiesDefeated += 1;
      break;
    case 'coin_collected':
      updatedProgression.stats.totalCoinsCollected += event.value || 1;
      break;
    case 'gem_collected':
      updatedProgression.stats.totalGemsCollected += event.value || 1;
      break;
    case 'level_completed':
      updatedProgression.stats.totalLevelsCompleted += 1;
      break;
    case 'powerup_collected':
      updatedProgression.stats.totalPowerUpsCollected += 1;
      break;
  }
  
  updatedProgression.achievements = updatedProgression.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;
    
    switch (achievement.id) {
      case 'first_kill':
        if (event.type === 'enemy_defeated') {
          achievement.progress = Math.min(achievement.target, achievement.progress + 1);
        }
        break;
      case 'collector':
        if (event.type === 'coin_collected') {
          achievement.progress = Math.min(achievement.target, achievement.progress + (event.value || 1));
        }
        break;
      case 'survivor':
        if (event.type === 'level_completed') {
          achievement.progress = Math.min(achievement.target, achievement.progress + 1);
        }
        break;
      case 'treasure_hunter':
        if (event.type === 'gem_collected') {
          achievement.progress = Math.min(achievement.target, achievement.progress + (event.value || 1));
        }
        break;
      case 'power_up':
        if (event.type === 'powerup_collected') {
          achievement.progress = Math.min(achievement.target, achievement.progress + 1);
        }
        break;
      case 'slayer':
        if (event.type === 'enemy_defeated') {
          achievement.progress = Math.min(achievement.target, achievement.progress + 1);
        }
        break;
    }
    
    if (achievement.progress >= achievement.target && !achievement.unlocked) {
      achievement.unlocked = true;
      updatedProgression.stats.achievementsUnlocked += 1;
      unlockedAchievements.push(achievement);
    }
    
    return achievement;
  });
  
  return { updatedProgression, unlockedAchievements };
};

export const updateDailyMissions = (
  progression: PlayerProgression,
  event: {
    type: 'enemy_defeated' | 'coin_collected' | 'powerup_collected';
    value?: number;
  }
): { updatedProgression: PlayerProgression; completedMissions: Mission[] } => {
  const updatedProgression = { ...progression };
  const completedMissions: Mission[] = [];
  const now = Date.now();
  
  updatedProgression.dailyMissions = updatedProgression.dailyMissions.filter(
    mission => mission.expiresAt > now
  );
  
  if (
    updatedProgression.dailyMissions.length === 0 ||
    updatedProgression.dailyMissions.every(mission => mission.completed)
  ) {
    updatedProgression.dailyMissions = generateDailyMissions();
  }
  
  updatedProgression.dailyMissions = updatedProgression.dailyMissions.map(mission => {
    if (mission.completed) return mission;
    
    if (mission.expiresAt < now) return mission;
    
    if (
      (mission.id.includes('daily_kills') && event.type === 'enemy_defeated') ||
      (mission.id.includes('daily_coins') && event.type === 'coin_collected') ||
      (mission.id.includes('daily_powerups') && event.type === 'powerup_collected')
    ) {
      mission.progress = Math.min(mission.target, mission.progress + (event.value || 1));
      
      if (mission.progress >= mission.target && !mission.completed) {
        mission.completed = true;
        updatedProgression.stats.missionsCompleted += 1;
        completedMissions.push(mission);
      }
    }
    
    return mission;
  });
  
  return { updatedProgression, completedMissions };
};

export const applyAttributePoint = (
  progression: PlayerProgression,
  attribute: 'strength' | 'vitality' | 'agility' | 'intelligence'
): PlayerProgression => {
  if (progression.skillPoints <= 0) return progression;
  
  const updatedProgression = { ...progression };
  updatedProgression.skillPoints -= 1;
  updatedProgression.attributes[attribute] += 1;
  
  return updatedProgression;
};

export const getMissionReward = (mission: Mission): { xp: number; coins: number; gems: number } => {
  const reward = { xp: 0, coins: 0, gems: 0 };
  
  if (mission.reward.type === 'xp') {
    reward.xp = mission.reward.value;
  } else if (mission.reward.type === 'coins') {
    reward.coins = mission.reward.value;
  } else if (mission.reward.type === 'gems') {
    reward.gems = mission.reward.value;
  }
  
  return reward;
};

export const getAchievementReward = (achievement: Achievement): { xp: number; coins: number; gems: number } => {
  const reward = { xp: 0, coins: 0, gems: 0 };
  
  if (achievement.reward?.type === 'xp') {
    reward.xp = achievement.reward.value;
  } else if (achievement.reward?.type === 'coins') {
    reward.coins = achievement.reward.value;
  } else if (achievement.reward?.type === 'gems') {
    reward.gems = achievement.reward.value;
  }
  
  return reward;
};
