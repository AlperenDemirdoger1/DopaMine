import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCharacter } from '../game/characters/characterClasses';
import { handleInput } from '../game/inputHandler';
import { GameState } from '../game/types';
import { generateLevelWithPowerUps } from '../game/levelGenerator';

describe('Game Initialization Tests', () => {
  it('should create a warrior character with correct properties', () => {
    const warrior = createCharacter('warrior', { x: 100, y: 100 });
    
    expect(warrior).toBeDefined();
    expect(warrior.type).toBe('warrior');
    expect(warrior.stats.health).toBeGreaterThan(0);
    expect(warrior.stats.damage).toBeGreaterThan(0);
    expect(warrior.stats.speed).toBeGreaterThan(0);
    expect(warrior.position.x).toBe(100);
    expect(warrior.position.y).toBe(100);
  });
  
  it('should create a mage character with correct properties', () => {
    const mage = createCharacter('mage', { x: 100, y: 100 });
    
    expect(mage).toBeDefined();
    expect(mage.type).toBe('mage');
    expect(mage.stats.health).toBeGreaterThan(0);
    expect(mage.stats.damage).toBeGreaterThan(0);
    expect(mage.stats.speed).toBeGreaterThan(0);
    expect(mage.position.x).toBe(100);
    expect(mage.position.y).toBe(100);
  });
  
  it('should create an archer character with correct properties', () => {
    const archer = createCharacter('archer', { x: 100, y: 100 });
    
    expect(archer).toBeDefined();
    expect(archer.type).toBe('archer');
    expect(archer.stats.health).toBeGreaterThan(0);
    expect(archer.stats.damage).toBeGreaterThan(0);
    expect(archer.stats.speed).toBeGreaterThan(0);
    expect(archer.position.x).toBe(100);
    expect(archer.position.y).toBe(100);
  });
  
  it('should generate a level with enemies, powerups, and collectibles', () => {
    const { room, powerUps, collectibles } = generateLevelWithPowerUps(800, 600, 1, { x: 400, y: 300 });
    
    expect(room).toBeDefined();
    expect(room.enemies.length).toBeGreaterThan(0);
    expect(room.width).toBe(800);
    expect(room.height).toBe(600);
    expect(powerUps.length).toBeGreaterThan(0);
    expect(collectibles.length).toBeGreaterThan(0);
  });
});

describe('Player Movement Tests', () => {
  let gameState: GameState;
  
  beforeEach(() => {
    const warrior = createCharacter('warrior', { x: 400, y: 300 });
    const { room, powerUps, collectibles } = generateLevelWithPowerUps(800, 600, 1, warrior.position);
    
    gameState = {
      player: {
        id: warrior.id,
        position: warrior.position,
        health: warrior.stats.health,
        maxHealth: warrior.stats.health,
        damage: warrior.stats.damage,
        score: 0,
        sprite: warrior.type,
        size: warrior.appearance.size,
        type: warrior.type,
        level: warrior.level,
        experience: warrior.experience,
        experienceToNextLevel: warrior.experienceToNextLevel,
        activeEffects: [],
        coins: 0,
        gems: 0,
        keys: 0
      },
      currentRoom: room,
      rooms: [],
      gameOver: false,
      score: 0,
      level: 1,
      characterSelected: true,
      characterType: warrior.type,
      characterAppearance: warrior.appearance,
      powerUps: powerUps,
      collectibles: collectibles
    };
  });
  
  it('should move player up when W key is pressed', () => {
    const initialY = gameState.player.position.y;
    const keys = new Set(['w']);
    
    const newState = handleInput(gameState, keys);
    
    expect(newState.player.position.y).toBeLessThan(initialY);
  });
  
  it('should move player down when S key is pressed', () => {
    const initialY = gameState.player.position.y;
    const keys = new Set(['s']);
    
    const newState = handleInput(gameState, keys);
    
    expect(newState.player.position.y).toBeGreaterThan(initialY);
  });
  
  it('should move player left when A key is pressed', () => {
    const initialX = gameState.player.position.x;
    const keys = new Set(['a']);
    
    const newState = handleInput(gameState, keys);
    
    expect(newState.player.position.x).toBeLessThan(initialX);
  });
  
  it('should move player right when D key is pressed', () => {
    const initialX = gameState.player.position.x;
    const keys = new Set(['d']);
    
    const newState = handleInput(gameState, keys);
    
    expect(newState.player.position.x).toBeGreaterThan(initialX);
  });
  
  it('should move player with arrow keys', () => {
    const initialX = gameState.player.position.x;
    const initialY = gameState.player.position.y;
    
    let newState = handleInput(gameState, new Set(['ArrowUp']));
    expect(newState.player.position.y).toBeLessThan(initialY);
    
    newState = handleInput(gameState, new Set(['ArrowDown']));
    expect(newState.player.position.y).toBeGreaterThan(initialY);
    
    newState = handleInput(gameState, new Set(['ArrowLeft']));
    expect(newState.player.position.x).toBeLessThan(initialX);
    
    newState = handleInput(gameState, new Set(['ArrowRight']));
    expect(newState.player.position.x).toBeGreaterThan(initialX);
  });
});

describe('Combat Initiation Tests', () => {
  let gameState: GameState;
  
  beforeEach(() => {
    const warrior = createCharacter('warrior', { x: 400, y: 300 });
    const { room, powerUps, collectibles } = generateLevelWithPowerUps(800, 600, 1, warrior.position);
    
    if (room.enemies.length > 0) {
      room.enemies[0].position = { x: warrior.position.x + 50, y: warrior.position.y };
    }
    
    gameState = {
      player: {
        id: warrior.id,
        position: warrior.position,
        health: warrior.stats.health,
        maxHealth: warrior.stats.health,
        damage: warrior.stats.damage,
        score: 0,
        sprite: warrior.type,
        size: warrior.appearance.size,
        type: warrior.type,
        level: warrior.level,
        experience: warrior.experience,
        experienceToNextLevel: warrior.experienceToNextLevel,
        activeEffects: [],
        coins: 0,
        gems: 0,
        keys: 0
      },
      currentRoom: room,
      rooms: [],
      gameOver: false,
      score: 0,
      level: 1,
      characterSelected: true,
      characterType: warrior.type,
      characterAppearance: warrior.appearance,
      powerUps: powerUps,
      collectibles: collectibles
    };
  });
  
  it('should damage enemy when player attacks', () => {
    if (gameState.currentRoom.enemies.length === 0) {
      return;
    }
    
    const enemy = gameState.currentRoom.enemies[0];
    const initialEnemyHealth = enemy.health;
    
    const keys = new Set([' ']);
    const newState = handleInput(gameState, keys);
    
    const updatedEnemy = newState.currentRoom.enemies.find(e => e.id === enemy.id);
    expect(updatedEnemy).toBeDefined();
    if (updatedEnemy) {
      expect(updatedEnemy.health).toBeLessThan(initialEnemyHealth);
    }
  });
});
