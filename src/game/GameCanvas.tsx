import { useEffect, useRef, useState } from 'react';
import { generateLevelWithPowerUps } from './levelGenerator';
import { GameState } from './types';
import { drawGame } from './renderer';
import { handleInput } from './inputHandler';
import { CharacterAppearance, CharacterType } from './characters/types';
import { createCharacter } from './characters/characterClasses';
import { 
  initializeProgression, 
  addExperience, 
  updateAchievements, 
  updateDailyMissions,
  applyProgressionToPlayer,
  applyAttributePoint
} from './progression/progressionManager';
import ProgressionUI, { 
  LevelUpNotification,
  AchievementNotification,
  MissionNotification
} from './progression/ProgressionUI';
import { Achievement, Mission, PlayerProgression } from './progression/types';

interface GameCanvasProps {
  width: number;
  height: number;
  characterType?: CharacterType;
  characterAppearance?: CharacterAppearance;
}

const GameCanvas = ({ width, height, characterType = 'warrior', characterAppearance }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [progression, setProgression] = useState<PlayerProgression>(initializeProgression());
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [levelUpReward, setLevelUpReward] = useState<any>(null);
  const [showAchievement, setShowAchievement] = useState<boolean>(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [showMission, setShowMission] = useState<boolean>(false);
  const [completedMission, setCompletedMission] = useState<Mission | null>(null);
  const [showProgressionPanel, setShowProgressionPanel] = useState<boolean>(false);
  
  useEffect(() => {
    const playerCharacter = createCharacter(characterType, { x: width / 2, y: height / 2 });
    
    if (characterAppearance) {
      playerCharacter.appearance = characterAppearance;
    }
    
    const { room, powerUps, collectibles } = generateLevelWithPowerUps(
      width, 
      height, 
      1, 
      playerCharacter.position
    );
    
    const initialState: GameState = {
      player: {
        id: playerCharacter.id,
        position: playerCharacter.position,
        health: playerCharacter.stats.health,
        maxHealth: playerCharacter.stats.health,
        damage: playerCharacter.stats.damage,
        score: 0,
        sprite: playerCharacter.type,
        size: playerCharacter.appearance.size,
        type: playerCharacter.type,
        level: playerCharacter.level,
        experience: playerCharacter.experience,
        experienceToNextLevel: playerCharacter.experienceToNextLevel,
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
      characterType: characterType,
      characterAppearance: characterAppearance,
      powerUps: powerUps,
      collectibles: collectibles
    };
    
    setGameState(initialState);
  }, [width, height]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.add(e.key);
        return newKeys;
      });
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key);
        return newKeys;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useEffect(() => {
    if (!gameState || !canvasRef.current) return;
    
    let animationFrameId: number;
    let lastTime = 0;
    
    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      if (keys.size > 0 && !gameState.gameOver) {
        const newState = handleInput(gameState, keys);
        setGameState(newState);
      }
      
      const updatedState = updateGame(gameState, deltaTime);
      setGameState(updatedState);
      
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        drawGame(ctx, updatedState, width, height);
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, keys, width, height]);
  
  const updateGame = (state: GameState, deltaTime: number): GameState => {
    if (state.gameOver) return state;
    
    const newState = JSON.parse(JSON.stringify(state)) as GameState;
    let updatedProgression = { ...progression };
    let progressionEvents = {
      enemyDefeated: false,
      powerUpCollected: false,
      coinCollected: false,
      gemCollected: false,
      levelCompleted: false
    };
    
    newState.currentRoom.enemies = newState.currentRoom.enemies.map(enemy => {
      const dx = newState.player.position.x - enemy.position.x;
      const dy = newState.player.position.y - enemy.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const moveX = (dx / distance) * enemy.moveSpeed * (deltaTime / 1000);
        const moveY = (dy / distance) * enemy.moveSpeed * (deltaTime / 1000);
        
        enemy.position.x += moveX;
        enemy.position.y += moveY;
      }
      
      if (distance < (enemy.size + newState.player.size) / 2) {
        newState.player.health -= enemy.damage;
        
        if (newState.player.health <= 0) {
          newState.gameOver = true;
          
          updatedProgression.stats.totalDeaths += 1;
          
          if (newState.score > updatedProgression.stats.highestScore) {
            updatedProgression.stats.highestScore = newState.score;
          }
        }
      }
      
      return enemy;
    });
    
    if (newState.powerUps && newState.powerUps.length > 0) {
      newState.powerUps = newState.powerUps.map(powerUp => {
        if (powerUp.collected) return powerUp;
        
        const dx = newState.player.position.x - powerUp.position.x;
        const dy = newState.player.position.y - powerUp.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (powerUp.size + newState.player.size) / 2) {
          powerUp.collected = true;
          progressionEvents.powerUpCollected = true;
          
          switch (powerUp.type) {
            case 'health':
              newState.player.health = Math.min(
                newState.player.maxHealth,
                newState.player.health + powerUp.value
              );
              break;
              
            case 'speed':
            case 'invincibility':
            case 'damage':
              const now = Date.now();
              powerUp.active = true;
              powerUp.activatedAt = now;
              powerUp.expiresAt = now + (powerUp.duration * 1000);
              
              if (!newState.player.activeEffects) {
                newState.player.activeEffects = [];
              }
              
              newState.player.activeEffects.push({
                type: powerUp.type,
                value: powerUp.value,
                duration: powerUp.duration,
                startTime: now,
                endTime: now + (powerUp.duration * 1000)
              });
              break;
          }
        }
        
        return powerUp;
      });
    }
    
    if (newState.collectibles && newState.collectibles.length > 0) {
      newState.collectibles = newState.collectibles.map(collectible => {
        if (collectible.collected) return collectible;
        
        const dx = newState.player.position.x - collectible.position.x;
        const dy = newState.player.position.y - collectible.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (collectible.size + newState.player.size) / 2) {
          collectible.collected = true;
          
          switch (collectible.type) {
            case 'coin':
              if (!newState.player.coins) newState.player.coins = 0;
              newState.player.coins += collectible.value;
              newState.score += collectible.value;
              progressionEvents.coinCollected = true;
              break;
              
            case 'gem':
              if (!newState.player.gems) newState.player.gems = 0;
              newState.player.gems += collectible.value;
              newState.score += collectible.value * 5;
              progressionEvents.gemCollected = true;
              break;
              
            case 'key':
              if (!newState.player.keys) newState.player.keys = 0;
              newState.player.keys += collectible.value;
              break;
          }
        }
        
        return collectible;
      });
    }
    
    if (newState.player.activeEffects && newState.player.activeEffects.length > 0) {
      const now = Date.now();
      newState.player.activeEffects = newState.player.activeEffects.filter(effect => {
        return effect.endTime > now;
      });
    }
    
    if (progressionEvents.enemyDefeated) {
      const xpGained = 10 * newState.level;
      const { updatedProgression: newProgression, levelUpRewards } = addExperience(
        newState.player,
        updatedProgression,
        xpGained
      );
      
      updatedProgression = newProgression;
      
      if (levelUpRewards.length > 0) {
        setLevelUpReward(levelUpRewards[0]);
        setShowLevelUp(true);
      }
      
      const { updatedProgression: achievementProgression, unlockedAchievements } = updateAchievements(
        newState,
        updatedProgression,
        { type: 'enemy_defeated' }
      );
      
      updatedProgression = achievementProgression;
      
      if (unlockedAchievements.length > 0) {
        setUnlockedAchievement(unlockedAchievements[0]);
        setShowAchievement(true);
      }
      
      const { updatedProgression: missionProgression, completedMissions } = updateDailyMissions(
        updatedProgression,
        { type: 'enemy_defeated' }
      );
      
      updatedProgression = missionProgression;
      
      if (completedMissions.length > 0) {
        setCompletedMission(completedMissions[0]);
        setShowMission(true);
      }
    }
    
    if (progressionEvents.powerUpCollected) {
      const { updatedProgression: achievementProgression, unlockedAchievements } = updateAchievements(
        newState,
        updatedProgression,
        { type: 'powerup_collected' }
      );
      
      updatedProgression = achievementProgression;
      
      if (unlockedAchievements.length > 0) {
        setUnlockedAchievement(unlockedAchievements[0]);
        setShowAchievement(true);
      }
      
      const { updatedProgression: missionProgression, completedMissions } = updateDailyMissions(
        updatedProgression,
        { type: 'powerup_collected' }
      );
      
      updatedProgression = missionProgression;
      
      if (completedMissions.length > 0) {
        setCompletedMission(completedMissions[0]);
        setShowMission(true);
      }
    }
    
    if (progressionEvents.coinCollected) {
      const { updatedProgression: achievementProgression, unlockedAchievements } = updateAchievements(
        newState,
        updatedProgression,
        { type: 'coin_collected', value: 1 }
      );
      
      updatedProgression = achievementProgression;
      
      if (unlockedAchievements.length > 0) {
        setUnlockedAchievement(unlockedAchievements[0]);
        setShowAchievement(true);
      }
      
      const { updatedProgression: missionProgression, completedMissions } = updateDailyMissions(
        updatedProgression,
        { type: 'coin_collected', value: 1 }
      );
      
      updatedProgression = missionProgression;
      
      if (completedMissions.length > 0) {
        setCompletedMission(completedMissions[0]);
        setShowMission(true);
      }
    }
    
    if (progressionEvents.gemCollected) {
      const { updatedProgression: achievementProgression, unlockedAchievements } = updateAchievements(
        newState,
        updatedProgression,
        { type: 'gem_collected', value: 1 }
      );
      
      updatedProgression = achievementProgression;
      
      if (unlockedAchievements.length > 0) {
        setUnlockedAchievement(unlockedAchievements[0]);
        setShowAchievement(true);
      }
    }
    
    newState.player = applyProgressionToPlayer(newState.player, updatedProgression);
    
    setProgression(updatedProgression);
    
    return newState;
  };
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="bg-gray-800 rounded-lg shadow-lg"
      />
      
      {gameState?.gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
          <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Score: {gameState.score}</p>
          <button 
            className="px-6 py-3 bg-purple-600 text-white rounded-full text-xl hover:bg-purple-700 transition-colors"
            onClick={() => {
              const playerCharacter = createCharacter(characterType, { x: width / 2, y: height / 2 });
              
              if (characterAppearance) {
                playerCharacter.appearance = characterAppearance;
              }
              
              const { room, powerUps, collectibles } = generateLevelWithPowerUps(
                width, 
                height, 
                1, 
                { x: width / 2, y: height / 2 }
              );
              
              const initialState: GameState = {
                player: {
                  id: playerCharacter.id,
                  position: playerCharacter.position,
                  health: playerCharacter.stats.health,
                  maxHealth: playerCharacter.stats.health,
                  damage: playerCharacter.stats.damage,
                  score: 0,
                  sprite: playerCharacter.type,
                  size: playerCharacter.appearance.size,
                  type: playerCharacter.type,
                  level: playerCharacter.level,
                  experience: playerCharacter.experience,
                  experienceToNextLevel: playerCharacter.experienceToNextLevel,
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
                characterType: characterType,
                characterAppearance: characterAppearance,
                powerUps: powerUps,
                collectibles: collectibles
              };
              
              setGameState(initialState);
              setShowProgressionPanel(false);
            }}
          >
            Play Again
          </button>
        </div>
      )}
      
      {/* HUD */}
      <div className="absolute top-4 left-4 flex items-center">
        <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${gameState ? (gameState.player.health / gameState.player.maxHealth) * 100 : 0}%` }}
          />
        </div>
        <span className="ml-2 text-white font-bold">
          {gameState?.player.health}/{gameState?.player.maxHealth}
        </span>
      </div>
      
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400 text-lg">🪙</span>
          <span className="text-white font-bold">{gameState?.player.coins || 0}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 text-lg">💎</span>
          <span className="text-white font-bold">{gameState?.player.gems || 0}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold">Score: {gameState?.score || 0}</span>
        </div>
        <button 
          className="px-2 py-1 bg-purple-700 text-white rounded-md text-sm hover:bg-purple-600 transition-colors"
          onClick={() => setShowProgressionPanel(!showProgressionPanel)}
        >
          {showProgressionPanel ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>
      
      {/* Level and XP Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center">
        <span className="text-white font-bold mr-2">Lvl {gameState?.player.level || 1}</span>
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ 
              width: `${gameState && gameState.player.experience && gameState.player.experienceToNextLevel ? (gameState.player.experience / gameState.player.experienceToNextLevel) * 100 : 0}%` 
            }}
          />
        </div>
        <span className="text-white font-bold ml-2">
          {gameState?.player.experience || 0}/{gameState?.player.experienceToNextLevel || 100} XP
        </span>
      </div>
      
      {/* Active Effects */}
      {gameState?.player.activeEffects && gameState.player.activeEffects.length > 0 && (
        <div className="absolute top-12 left-4 flex space-x-2">
          {gameState.player.activeEffects.map((effect, index) => (
            <div 
              key={`${effect.type}-${index}`}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 border-2 border-purple-500"
              title={`${effect.type}: ${effect.value}`}
            >
              {effect.type === 'speed' && '⚡'}
              {effect.type === 'invincibility' && '🛡️'}
              {effect.type === 'damage' && '⚔️'}
            </div>
          ))}
        </div>
      )}
      
      {/* Progression Panel */}
      {showProgressionPanel && (
        <div className="absolute right-4 top-16 w-64">
          <ProgressionUI 
            progression={progression} 
            onApplySkillPoint={(attribute) => {
              const updatedProgression = applyAttributePoint(progression, attribute);
              setProgression(updatedProgression);
              
              if (gameState) {
                const updatedPlayer = applyProgressionToPlayer(gameState.player, updatedProgression);
                setGameState({
                  ...gameState,
                  player: updatedPlayer
                });
              }
            }}
          />
        </div>
      )}
      
      {/* Level Up Notification */}
      {showLevelUp && levelUpReward && (
        <LevelUpNotification 
          level={levelUpReward.level}
          rewards={levelUpReward.rewards}
          onClose={() => setShowLevelUp(false)}
        />
      )}
      
      {/* Achievement Notification */}
      {showAchievement && unlockedAchievement && (
        <AchievementNotification 
          achievement={unlockedAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}
      
      {/* Mission Notification */}
      {showMission && completedMission && (
        <MissionNotification 
          mission={completedMission}
          onClose={() => setShowMission(false)}
        />
      )}
    </div>
  );
};

export default GameCanvas;
