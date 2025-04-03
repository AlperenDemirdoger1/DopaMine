import { useEffect, useRef, useState } from 'react';
import { generateLevel } from './levelGenerator';
import { GameState } from './types';
import { drawGame } from './renderer';
import { handleInput } from './inputHandler';
import { CharacterAppearance, CharacterType } from './characters/types';
import { createCharacter } from './characters/characterClasses';

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
  
  useEffect(() => {
    const playerCharacter = createCharacter(characterType, { x: width / 2, y: height / 2 });
    
    if (characterAppearance) {
      playerCharacter.appearance = characterAppearance;
    }
    
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
        experienceToNextLevel: playerCharacter.experienceToNextLevel
      },
      currentRoom: generateLevel(width, height, 1),
      rooms: [],
      gameOver: false,
      score: 0,
      level: 1,
      characterSelected: true,
      characterType: characterType,
      characterAppearance: characterAppearance
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
        }
      }
      
      return enemy;
    });
    
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
                  experienceToNextLevel: playerCharacter.experienceToNextLevel
                },
                currentRoom: generateLevel(width, height, 1),
                rooms: [],
                gameOver: false,
                score: 0,
                level: 1,
                characterSelected: true,
                characterType: characterType,
                characterAppearance: characterAppearance
              };
              
              setGameState(initialState);
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
      
      <div className="absolute top-4 right-4 text-white font-bold">
        Score: {gameState?.score || 0}
      </div>
    </div>
  );
};

export default GameCanvas;
