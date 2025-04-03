import { CharacterClass, CharacterType } from './types';
import { Position } from '../types';

export const warriorClass: CharacterClass = {
  type: 'warrior',
  name: 'Warrior',
  description: 'A strong melee fighter with high health and damage but slower movement.',
  baseStats: {
    health: 150,
    damage: 25,
    speed: 4,
    attackRange: 50,
    attackSpeed: 1,
    specialAbilityCooldown: 10
  },
  defaultAppearance: {
    color: '#d63031',
    outfitColor: '#e17055',
    size: 35
  },
  specialAbility: {
    name: 'Whirlwind Strike',
    description: 'Performs a powerful spinning attack that damages all nearby enemies.',
    cooldown: 10,
    currentCooldown: 0,
    execute: (character, position) => {
      return {
        type: 'AREA_ATTACK',
        range: 100,
        damage: character.stats.damage * 1.5,
        position
      };
    }
  }
};

export const mageClass: CharacterClass = {
  type: 'mage',
  name: 'Mage',
  description: 'A powerful spellcaster with ranged attacks and area damage but lower health.',
  baseStats: {
    health: 80,
    damage: 30,
    speed: 3.5,
    attackRange: 150,
    attackSpeed: 0.8,
    specialAbilityCooldown: 12
  },
  defaultAppearance: {
    color: '#0984e3',
    outfitColor: '#74b9ff',
    size: 30
  },
  specialAbility: {
    name: 'Arcane Blast',
    description: 'Unleashes a powerful magical explosion that damages enemies in a large area.',
    cooldown: 12,
    currentCooldown: 0,
    execute: (character, position) => {
      return {
        type: 'AREA_ATTACK',
        range: 200,
        damage: character.stats.damage * 2,
        position
      };
    }
  }
};

export const archerClass: CharacterClass = {
  type: 'archer',
  name: 'Archer',
  description: 'A nimble ranged fighter with high speed and precision but moderate health.',
  baseStats: {
    health: 100,
    damage: 20,
    speed: 5,
    attackRange: 200,
    attackSpeed: 1.2,
    specialAbilityCooldown: 8
  },
  defaultAppearance: {
    color: '#00b894',
    outfitColor: '#55efc4',
    size: 28
  },
  specialAbility: {
    name: 'Rapid Shot',
    description: 'Fires a rapid volley of arrows in quick succession.',
    cooldown: 8,
    currentCooldown: 0,
    execute: (character, position) => {
      return {
        type: 'MULTI_ATTACK',
        count: 5,
        damage: character.stats.damage * 0.6,
        position
      };
    }
  }
};

export const getCharacterClass = (type: CharacterType): CharacterClass => {
  switch (type) {
    case 'warrior':
      return warriorClass;
    case 'mage':
      return mageClass;
    case 'archer':
      return archerClass;
    default:
      return warriorClass; // Default to warrior if type is invalid
  }
};

export const createCharacter = (type: CharacterType, position: Position) => {
  const characterClass = getCharacterClass(type);
  
  return {
    id: `player-${Date.now()}`,
    type: characterClass.type,
    position: { ...position },
    health: characterClass.baseStats.health,
    maxHealth: characterClass.baseStats.health,
    damage: characterClass.baseStats.damage,
    sprite: characterClass.type,
    size: characterClass.defaultAppearance.size,
    stats: { ...characterClass.baseStats },
    appearance: { ...characterClass.defaultAppearance },
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    score: 0
  };
};
