import { Entity, Position } from '../types';

export interface CharacterStats {
  health: number;
  damage: number;
  speed: number;
  attackRange: number;
  attackSpeed: number;
  specialAbilityCooldown: number;
}

export interface CharacterAppearance {
  color: string;
  outfitColor: string;
  size: number;
}

export interface Character extends Entity {
  type: CharacterType;
  stats: CharacterStats;
  appearance: CharacterAppearance;
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

export type CharacterType = 'warrior' | 'mage' | 'archer';

export interface SpecialAbility {
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  execute: (character: Character, position: Position) => any;
}

export interface CharacterClass {
  type: CharacterType;
  name: string;
  description: string;
  baseStats: CharacterStats;
  defaultAppearance: CharacterAppearance;
  specialAbility: SpecialAbility;
}

export interface CharacterSelectionState {
  selectedCharacter: CharacterType;
  customAppearance: CharacterAppearance;
}
