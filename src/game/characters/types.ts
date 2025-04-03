
export type CharacterType = 'warrior' | 'mage' | 'archer';

export interface CharacterStats {
  health: number;
  damage: number;
  speed: number;
  range: number;
  specialAbility: string;
}

export interface CharacterAppearance {
  color: string;
  size: number;
  sprite: string;
}

export interface Character {
  id: string;
  type: CharacterType;
  stats: CharacterStats;
  appearance: CharacterAppearance;
  position: { x: number; y: number };
  level: number;
  experience: number;
  experienceToNextLevel: number;
}
