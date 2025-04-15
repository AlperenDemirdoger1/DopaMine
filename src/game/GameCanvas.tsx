import { useEffect, useRef, useState } from 'react';
import { generateLevelWithPowerUps } from './levelGenerator';
import { GameState, Position } from './types';
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
import { ADHDFriendlyHUD, FeedbackIndicator } from './ui/ADHDFriendlyHUD';
import { 
  initAudio, 
  playSound, 
  preloadGameSounds 
} from './audio/audioManager';
import MotionFeedback from './ui/MotionFeedback';

import { CountryCode } from './characters/CountryFlagSelector';

interface GameCanvasProps {
  width: number;
  height: number;
  characterType: CharacterType;
  characterAppearance?: CharacterAppearance;
  countryFlag: CountryCode;
}

const GameCanvas = ({ width, height, characterType, characterAppearance, countryFlag }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [progression, setProgression] = useState<PlayerProgression | null>(null);
  const [showProgressionPanel, setShowProgressionPanel] = useState<boolean>(false);
  const [feedbackIndicators, setFeedbackIndicators] = useState<Array<{
    id: string;
    type: 'damage' | 'heal' | 'xp' | 'coin' | 'gem';
    value: number;
    position: Position;
  }>>([]);
  
  const [notifications, setNotifications] = useState<{
    levelUp: boolean;
    achievement: Achievement | null;
    mission: Mission | null;
  }>({
    levelUp: false,
    achievement: null,
    mission: null
  });
  
  const [motionState, setMotionState] = useState<{
    isMoving: boolean;
    isAttacking: boolean;
    isTakingDamage: boolean;
  }>({
    isMoving: false,
    isAttacking: false,
    isTakingDamage: false
  });
  
  useEffect(() => {
    preloadGameSounds();
    
    const playerCharacter = createCharacter(characterType, { x: width / 2, y: height / 2 }, {
      countryFlag: countryFlag
    });
    
    if (characterAppearance) {
      playerCharacter.appearance = {
        ...characterAppearance,
        countryFlag: countryFlag
      };
    }
    
    const initialDifficulty = 1;
    
    const { room, powerUps, collectibles, obstacles } = generateLevelWithPowerUps(
      width, 
      height, 
      1, 
      initialDifficulty,
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
      difficulty: initialDifficulty,
      characterSelected: true,
      characterType: characterType,
      characterAppearance: characterAppearance,
      powerUps: powerUps,
      collectibles: collectibles,
      obstacles: obstacles,
      skillsAvailable: true
    };
    
    setGameState(initialState);
    
    const initialProgression = initializeProgression(playerCharacter.type);
    setProgression(initialProgression);
    
    initAudio(); // Must be called after user interaction
    playSound('menuSelect');
  }, [width, height, characterType, characterAppearance, countryFlag]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prevKeys => {
        const newKeys = new Set(prevKeys);
        newKeys.add(e.key);
        return newKeys;
      });
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prevKeys => {
        const newKeys = new Set(prevKeys);
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
    if (!gameState || !progression) return;
    
    const gameLoop = setInterval(() => {
      if (keys.size > 0 && !gameState.gameOver) {
        const prevPosition = { ...gameState.player.position };
        const newState = handleInput(gameState, keys);
        
        if (
          prevPosition.x !== newState.player.position.x || 
          prevPosition.y !== newState.player.position.y
        ) {
          playSound('playerMove', { volume: 0.3 });
          setMotionState(prev => ({ ...prev, isMoving: true }));
          
          setTimeout(() => {
            setMotionState(prev => ({ ...prev, isMoving: false }));
          }, 150);
        }
        
        if (keys.has(' ')) {
          playSound('playerAttack');
          setMotionState(prev => ({ ...prev, isAttacking: true }));
          
          setTimeout(() => {
            setMotionState(prev => ({ ...prev, isAttacking: false }));
          }, 200);
          
          const prevEnemies = gameState.currentRoom.enemies;
          const newEnemies = newState.currentRoom.enemies;
          
          if (prevEnemies.length > newEnemies.length) {
            playSound('enemyDefeat');
            
            setFeedbackIndicators(prev => [
              ...prev,
              {
                id: `defeat-${Date.now()}`,
                type: 'xp',
                value: 10 * newState.level,
                position: { 
                  x: newState.player.position.x + 20, 
                  y: newState.player.position.y - 30 
                }
              }
            ]);
          } else if (prevEnemies.some(prevEnemy => {
            const newEnemy = newState.currentRoom.enemies.find(e => e.id === prevEnemy.id);
            return newEnemy && newEnemy.health < prevEnemy.health;
          })) {
            playSound('enemyHit');
          }
        }
        
        setGameState(newState);
      }
      
      if (gameState && !gameState.gameOver) {
        const newState = { ...gameState };
        let updatedProgression = { ...progression };
        
        const progressionEvents = {
          enemyDefeated: false,
          powerUpCollected: false,
          collectibleCollected: false,
          levelCompleted: false,
          damageDealt: 0,
          damageTaken: 0
        };
        
        newState.obstacles.forEach(obstacle => {
          const now = Date.now();
          
          switch (obstacle.type) {
            case 'spike':
              if (!obstacle.isActive && now - (obstacle.lastActivationTime || 0) > (obstacle.activationInterval || 3000)) {
                obstacle.isActive = true;
                obstacle.lastActivationTime = now;
                
                setTimeout(() => {
                  if (newState.obstacles.find(o => o.id === obstacle.id)) {
                    obstacle.isActive = false;
                  }
                }, 1000);
              }
              break;
              
            case 'laser':
            case 'turret':
              const dx = newState.player.position.x - obstacle.position.x;
              const dy = newState.player.position.y - obstacle.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < (obstacle.attackRange || 150) && 
                  now - (obstacle.lastAttackTime || 0) > (obstacle.attackCooldown || 2000)) {
                obstacle.lastAttackTime = now;
                
                newState.player.health -= obstacle.damage;
                progressionEvents.damageTaken += obstacle.damage;
                
                playSound('playerDamage');
                setFeedbackIndicators(prev => [
                  ...prev,
                  {
                    id: `obstacle-damage-${Date.now()}`,
                    type: 'damage',
                    value: obstacle.damage,
                    position: { 
                      x: newState.player.position.x, 
                      y: newState.player.position.y - 20 
                    }
                  }
                ]);
                
                if (newState.player.health <= 0) {
                  newState.gameOver = true;
                  playSound('gameOver');
                  
                  updatedProgression.stats.totalDeaths += 1;
                  
                  if (newState.score > updatedProgression.stats.highestScore) {
                    updatedProgression.stats.highestScore = newState.score;
                  }
                }
              }
              break;
          }
          
          if (obstacle.type === 'wall' || (obstacle.isActive && obstacle.type === 'spike')) {
            const dx = newState.player.position.x - obstacle.position.x;
            const dy = newState.player.position.y - obstacle.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (obstacle.size + newState.player.size) / 2) {
              const pushDistance = (obstacle.size + newState.player.size) / 2 - distance;
              const pushX = (dx / distance) * pushDistance;
              const pushY = (dy / distance) * pushDistance;
              
              newState.player.position.x += pushX;
              newState.player.position.y += pushY;
              
              if (obstacle.type === 'spike' && obstacle.isActive) {
                newState.player.health -= obstacle.damage;
                progressionEvents.damageTaken += obstacle.damage;
                
                playSound('playerDamage');
                setFeedbackIndicators(prev => [
                  ...prev,
                  {
                    id: `spike-damage-${Date.now()}`,
                    type: 'damage',
                    value: obstacle.damage,
                    position: { 
                      x: newState.player.position.x, 
                      y: newState.player.position.y - 20 
                    }
                  }
                ]);
                
                if (newState.player.health <= 0) {
                  newState.gameOver = true;
                  playSound('gameOver');
                  
                  updatedProgression.stats.totalDeaths += 1;
                  
                  if (newState.score > updatedProgression.stats.highestScore) {
                    updatedProgression.stats.highestScore = newState.score;
                  }
                }
              }
            }
          }
        });
        
        newState.currentRoom.enemies.forEach(enemy => {
          const dx = newState.player.position.x - enemy.position.x;
          const dy = newState.player.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const moveX = (dx / distance) * enemy.moveSpeed * 0.05;
            const moveY = (dy / distance) * enemy.moveSpeed * 0.05;
            
            enemy.position.x += moveX;
            enemy.position.y += moveY;
          }
          
          if (distance < (enemy.size + newState.player.size) / 2) {
            newState.player.health -= enemy.damage;
            
            playSound('playerDamage');
            setMotionState(prev => ({ ...prev, isTakingDamage: true }));
            
            setTimeout(() => {
              setMotionState(prev => ({ ...prev, isTakingDamage: false }));
            }, 300);
            
            setFeedbackIndicators(prev => [
              ...prev,
              {
                id: `damage-${Date.now()}`,
                type: 'damage',
                value: enemy.damage,
                position: { 
                  x: newState.player.position.x, 
                  y: newState.player.position.y - 20 
                }
              }
            ]);
            
            if (newState.player.health <= 0) {
              newState.gameOver = true;
              playSound('gameOver');
              
              updatedProgression.stats.totalDeaths += 1;
              
              if (newState.score > updatedProgression.stats.highestScore) {
                updatedProgression.stats.highestScore = newState.score;
              }
            }
          }
        });
        
        newState.powerUps.forEach(powerUp => {
          if (powerUp.collected) return;
          
          const dx = newState.player.position.x - powerUp.position.x;
          const dy = newState.player.position.y - powerUp.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < (powerUp.size + newState.player.size) / 2) {
            powerUp.collected = true;
            progressionEvents.powerUpCollected = true;
            
            playSound('powerUpCollect');
            
            setFeedbackIndicators(prev => [
              ...prev,
              {
                id: `powerup-${Date.now()}`,
                type: powerUp.type === 'health' ? 'heal' : 'xp',
                value: powerUp.value,
                position: { 
                  x: powerUp.position.x, 
                  y: powerUp.position.y - 20 
                }
              }
            ]);
            
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
        });
        
        newState.collectibles.forEach(collectible => {
          if (collectible.collected) return;
          
          const dx = newState.player.position.x - collectible.position.x;
          const dy = newState.player.position.y - collectible.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < (collectible.size + newState.player.size) / 2) {
            collectible.collected = true;
            progressionEvents.collectibleCollected = true;
            
            if (collectible.type === 'coin') {
              playSound('coinCollect');
              newState.player.coins += collectible.value;
              
              setFeedbackIndicators(prev => [
                ...prev,
                {
                  id: `coin-${Date.now()}`,
                  type: 'coin',
                  value: collectible.value,
                  position: { 
                    x: collectible.position.x, 
                    y: collectible.position.y - 20 
                  }
                }
              ]);
            } else if (collectible.type === 'gem') {
              playSound('gemCollect');
              newState.player.gems += collectible.value;
              
              setFeedbackIndicators(prev => [
                ...prev,
                {
                  id: `gem-${Date.now()}`,
                  type: 'gem',
                  value: collectible.value,
                  position: { 
                    x: collectible.position.x, 
                    y: collectible.position.y - 20 
                  }
                }
              ]);
            }
            
            if (newState.player.experience !== undefined && 
                newState.player.experienceToNextLevel !== undefined) {
              const xpGained = collectible.value * 5;
              newState.player.experience += xpGained;
              
              if (newState.player.experience >= newState.player.experienceToNextLevel) {
                newState.player.level = (newState.player.level || 1) + 1;
                newState.player.experience -= newState.player.experienceToNextLevel;
                newState.player.experienceToNextLevel = Math.floor(
                  newState.player.experienceToNextLevel * 1.5
                );
                
                newState.player.maxHealth += 10;
                newState.player.health = newState.player.maxHealth;
                newState.player.damage += 5;
                
                setNotifications(prev => ({
                  ...prev,
                  levelUp: true
                }));
                
                playSound('levelUp');
              }
            }
            
            newState.score += collectible.value;
          }
        });
        
        if (newState.player.activeEffects && newState.player.activeEffects.length > 0) {
          const now = Date.now();
          newState.player.activeEffects = newState.player.activeEffects.filter(effect => {
            return effect.endTime > now;
          });
        }
        
        if (progressionEvents.enemyDefeated || 
            progressionEvents.powerUpCollected || 
            progressionEvents.collectibleCollected || 
            progressionEvents.levelCompleted) {
          
          if (newState.player.experience !== undefined && 
              newState.player.experienceToNextLevel !== undefined) {
            const xpGained = 
              (progressionEvents.enemyDefeated ? 10 : 0) + 
              (progressionEvents.powerUpCollected ? 5 : 0) + 
              (progressionEvents.collectibleCollected ? 2 : 0) + 
              (progressionEvents.levelCompleted ? 50 : 0);
            
            const { updatedProgression: newProgression, leveledUp } = addExperience(
              updatedProgression, 
              xpGained
            );
            
            updatedProgression = newProgression;
            
            if (leveledUp) {
              newState.player = applyProgressionToPlayer(newState.player, updatedProgression);
              
              setNotifications(prev => ({
                ...prev,
                levelUp: true
              }));
              
              playSound('levelUp');
            }
          }
          
          const { updatedProgression: progressionWithAchievements, newAchievement } = 
            updateAchievements(updatedProgression, {
              enemiesDefeated: progressionEvents.enemyDefeated ? 1 : 0,
              powerUpsCollected: progressionEvents.powerUpCollected ? 1 : 0,
              collectiblesCollected: progressionEvents.collectibleCollected ? 1 : 0,
              levelsCompleted: progressionEvents.levelCompleted ? 1 : 0,
              damageDealt: progressionEvents.damageDealt,
              damageTaken: progressionEvents.damageTaken
            });
          
          updatedProgression = progressionWithAchievements;
          
          if (newAchievement) {
            setNotifications(prev => ({
              ...prev,
              achievement: newAchievement
            }));
            
            playSound('achievementUnlock');
          }
          
          const { updatedProgression: progressionWithMissions, completedMission } = 
            updateDailyMissions(updatedProgression, {
              enemiesDefeated: progressionEvents.enemyDefeated ? 1 : 0,
              powerUpsCollected: progressionEvents.powerUpCollected ? 1 : 0,
              collectiblesCollected: progressionEvents.collectibleCollected ? 1 : 0,
              levelsCompleted: progressionEvents.levelCompleted ? 1 : 0,
              damageDealt: progressionEvents.damageDealt,
              damageTaken: progressionEvents.damageTaken
            });
          
          updatedProgression = progressionWithMissions;
          
          if (completedMission) {
            setNotifications(prev => ({
              ...prev,
              mission: completedMission
            }));
            
            playSound('missionComplete');
          }
          
          setProgression(updatedProgression);
        }
        
        setFeedbackIndicators(prev => 
          prev.filter((_unused, index) => index >= prev.length - 10)
        );
        
        setGameState(newState);
      }
    }, 1000 / 60); // 60 FPS
    
    return () => clearInterval(gameLoop);
  }, [gameState, keys, progression]);
  
  useEffect(() => {
    if (!canvasRef.current || !gameState) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    drawGame(ctx, gameState, width, height);
  }, [gameState, width, height]);
  
  useEffect(() => {
    if (notifications.levelUp) {
      const timeout = setTimeout(() => {
        setNotifications(prev => ({ ...prev, levelUp: false }));
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [notifications.levelUp]);
  
  useEffect(() => {
    if (notifications.achievement) {
      const timeout = setTimeout(() => {
        setNotifications(prev => ({ ...prev, achievement: null }));
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [notifications.achievement]);
  
  useEffect(() => {
    if (notifications.mission) {
      const timeout = setTimeout(() => {
        setNotifications(prev => ({ ...prev, mission: null }));
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [notifications.mission]);
  
  const toggleProgressionPanel = () => {
    setShowProgressionPanel(!showProgressionPanel);
    playSound('buttonClick');
  };
  
  const handleApplyAttributePoint = (attribute: string) => {
    if (!progression || !gameState) return;
    
    const { updatedProgression, updatedPlayer } = applyAttributePoint(
      progression,
      gameState.player,
      attribute
    );
    
    setProgression(updatedProgression);
    setGameState({
      ...gameState,
      player: updatedPlayer
    });
    
    playSound('buttonClick');
  };
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="bg-gray-900"
      />
      
      {/* ADHD-Friendly HUD */}
      <ADHDFriendlyHUD 
        gameState={gameState}
        width={width}
        height={height}
      />
      
      {/* Visual Feedback Indicators */}
      {feedbackIndicators.map(indicator => (
        <FeedbackIndicator
          key={indicator.id}
          type={indicator.type}
          value={indicator.value}
          position={indicator.position}
        />
      ))}
      
      {/* Progression Button */}
      <button
        className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-200"
        onClick={toggleProgressionPanel}
      >
        Stats
      </button>
      
      {/* Progression Panel */}
      {showProgressionPanel && progression && (
        <ProgressionUI
          progression={progression}
          onClose={toggleProgressionPanel}
          onApplyAttributePoint={handleApplyAttributePoint}
        />
      )}
      
      {/* Notifications */}
      {notifications.levelUp && (
        <LevelUpNotification
          level={gameState?.player.level || 1}
          onClose={() => setNotifications(prev => ({ ...prev, levelUp: false }))}
        />
      )}
      
      {notifications.achievement && (
        <AchievementNotification
          achievement={notifications.achievement}
          onClose={() => setNotifications(prev => ({ ...prev, achievement: null }))}
        />
      )}
      
      {notifications.mission && (
        <MissionNotification
          mission={notifications.mission}
          onClose={() => setNotifications(prev => ({ ...prev, mission: null }))}
        />
      )}
      
      {/* Difficulty Selection UI */}
      {gameState && !gameState.gameOver && (
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="text-white font-bold mb-1">Difficulty: {gameState.difficulty}</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                className={`w-8 h-8 rounded-full font-bold ${
                  gameState.difficulty === level 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => {
                  playSound('buttonClick');
                  
                  const { room, powerUps, collectibles, obstacles } = generateLevelWithPowerUps(
                    width,
                    height,
                    gameState.level,
                    level as 1 | 2 | 3 | 4 | 5,
                    gameState.player.position
                  );
                  
                  setGameState({
                    ...gameState,
                    difficulty: level as 1 | 2 | 3 | 4 | 5,
                    currentRoom: room,
                    powerUps,
                    collectibles,
                    obstacles
                  });
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills UI */}
      {gameState && !gameState.gameOver && gameState.skillsAvailable && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            onClick={() => {
              if (!gameState) return;
              
              playSound('skillActivate');
              
              const healAmount = 20 + (gameState.player.level || 1) * 5;
              
              setGameState({
                ...gameState,
                player: {
                  ...gameState.player,
                  health: Math.min(gameState.player.maxHealth, gameState.player.health + healAmount)
                }
              });
              
              setFeedbackIndicators(prev => [
                ...prev,
                {
                  id: `skill-heal-${Date.now()}`,
                  type: 'heal',
                  value: healAmount,
                  position: { 
                    x: gameState.player.position.x, 
                    y: gameState.player.position.y - 20 
                  }
                }
              ]);
            }}
          >
            Heal
          </button>
          
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            onClick={() => {
              if (!gameState) return;
              
              playSound('skillActivate');
              
              const attackRange = 150;
              const damageAmount = 15 + (gameState.player.level || 1) * 3;
              
              const newState = { ...gameState };
              
              newState.currentRoom.enemies = newState.currentRoom.enemies.map(enemy => {
                const dx = enemy.position.x - gameState.player.position.x;
                const dy = enemy.position.y - gameState.player.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < attackRange) {
                  enemy.health -= damageAmount;
                  
                  setFeedbackIndicators(prev => [
                    ...prev,
                    {
                      id: `skill-damage-${Date.now()}-${enemy.id}`,
                      type: 'damage',
                      value: damageAmount,
                      position: { 
                        x: enemy.position.x, 
                        y: enemy.position.y - 20 
                      }
                    }
                  ]);
                }
                
                return enemy;
              }).filter(enemy => enemy.health > 0);
              
              setGameState(newState);
            }}
          >
            Attack
          </button>
          
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            onClick={() => {
              if (!gameState) return;
              
              playSound('skillActivate');
              
              const now = Date.now();
              const duration = 5; // 5 seconds
              
              setGameState({
                ...gameState,
                player: {
                  ...gameState.player,
                  activeEffects: [
                    ...(gameState.player.activeEffects || []),
                    {
                      type: 'speed',
                      value: 50,
                      duration,
                      startTime: now,
                      endTime: now + (duration * 1000)
                    }
                  ]
                }
              });
              
              setFeedbackIndicators(prev => [
                ...prev,
                {
                  id: `skill-speed-${Date.now()}`,
                  type: 'xp',
                  value: 50,
                  position: { 
                    x: gameState.player.position.x, 
                    y: gameState.player.position.y - 20 
                  }
                }
              ]);
            }}
          >
            Speed
          </button>
        </div>
      )}
      
      {/* Motion Feedback Effects */}
      {gameState && (
        <MotionFeedback
          isMoving={motionState.isMoving}
          isAttacking={motionState.isAttacking}
          isTakingDamage={motionState.isTakingDamage}
        />
      )}
      
      {/* Game Over Screen */}
      {gameState?.gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over</h2>
          <p className="text-2xl text-white mb-8">Final Score: {gameState.score}</p>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors duration-200"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
