import { v4 as uuidv4 } from 'uuid';
import { Character, CharacterType, CharacterAppearance } from './types';

export const createCharacter = (
  type: CharacterType, 
  position: { x: number; y: number },
  appearance?: Partial<CharacterAppearance>
): Character => {
  const baseAppearance: CharacterAppearance = {
    color: '#ffffff',
    size: 30,
    sprite: type
  };
  
  switch (type) {
    case 'warrior':
      return {
        id: uuidv4(),
        type: 'warrior',
        stats: {
          health: 150,
          damage: 30,
          speed: 3,
          range: 1,
          specialAbility: 'berserk'
        },
        appearance: {
          ...baseAppearance,
          color: '#ff4444',
          ...appearance
        },
        position,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100
      };
      
    case 'mage':
      return {
        id: uuidv4(),
        type: 'mage',
        stats: {
          health: 80,
          damage: 40,
          speed: 4,
          range: 5,
          specialAbility: 'arcaneBlast'
        },
        appearance: {
          ...baseAppearance,
          color: '#4444ff',
          ...appearance
        },
        position,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100
      };
      
    case 'archer':
      return {
        id: uuidv4(),
        type: 'archer',
        stats: {
          health: 100,
          damage: 25,
          speed: 5,
          range: 6,
          specialAbility: 'multishot'
        },
        appearance: {
          ...baseAppearance,
          color: '#44ff44',
          ...appearance
        },
        position,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100
      };
      
    default:
      return {
        id: uuidv4(),
        type: 'warrior',
        stats: {
          health: 150,
          damage: 30,
          speed: 3,
          range: 1,
          specialAbility: 'berserk'
        },
        appearance: {
          ...baseAppearance,
          color: '#ff4444',
          ...appearance
        },
        position,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100
      };
  }
};

export const getCharacterDescription = (type: CharacterType): string => {
  switch (type) {
    case 'warrior':
      return 'A powerful melee fighter with high health and damage. Special ability: Berserk mode.';
    case 'mage':
      return 'A powerful spellcaster with high damage and range. Special ability: Arcane Blast.';
    case 'archer':
      return 'An agile ranged fighter with high speed and range. Special ability: Multishot.';
    default:
      return 'Unknown character type';
  }
};
