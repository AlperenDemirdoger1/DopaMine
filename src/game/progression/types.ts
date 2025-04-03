import { PowerUpEffect } from '../types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  reward?: {
    type: 'xp' | 'coins' | 'gems' | 'item';
    value: number;
    itemId?: string;
  };
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
  progress: number;
  target: number;
  expiresAt: number; // Timestamp when mission expires
  reward: {
    type: 'xp' | 'coins' | 'gems' | 'item';
    value: number;
    itemId?: string;
  };
}

export interface PlayerLevel {
  level: number;
  xpRequired: number;
  rewards: {
    healthBoost?: number;
    damageBoost?: number;
    speedBoost?: number;
    unlockAbility?: string;
  };
}

export interface PlayerStats {
  totalEnemiesDefeated: number;
  totalCoinsCollected: number;
  totalGemsCollected: number;
  totalKeysCollected: number;
  totalPowerUpsCollected: number;
  totalLevelsCompleted: number;
  highestLevel: number;
  highestScore: number;
  totalDeaths: number;
  totalPlayTime: number; // In seconds
  achievementsUnlocked: number;
  missionsCompleted: number;
}

export interface PlayerProgression {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalExperience: number;
  skillPoints: number;
  attributes: {
    strength: number; // Increases damage
    vitality: number; // Increases health
    agility: number; // Increases speed
    intelligence: number; // Improves special abilities
  };
  achievements: Achievement[];
  dailyMissions: Mission[];
  stats: PlayerStats;
  unlockedAbilities: string[];
}

export interface LevelUpReward {
  level: number;
  message: string;
  rewards: {
    skillPoints?: number;
    healthBoost?: number;
    damageBoost?: number;
    speedBoost?: number;
    unlockAbility?: string;
    coins?: number;
    gems?: number;
  };
}

export interface MissionReward {
  mission: Mission;
  rewards: {
    experience?: number;
    coins?: number;
    gems?: number;
    item?: any;
  };
}

export interface AchievementReward {
  achievement: Achievement;
  rewards: {
    experience?: number;
    coins?: number;
    gems?: number;
    item?: any;
  };
}
