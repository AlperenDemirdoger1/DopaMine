import React, { useState, useEffect, useRef } from 'react';
import { CharacterType } from '../game/characters/types';
import { createCharacter } from '../game/characters/characterClasses';
import GameCanvas from '../game/GameCanvas';

interface GameProps {
  characterType: CharacterType;
  onBackToMenu: () => void;
}

const Game: React.FC<GameProps> = ({ characterType, onBackToMenu }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
      setGameStarted(true);
    }, 1000);
    
    return () => clearTimeout(loadingTimer);
  }, []);
  
  const handleGameOver = (finalScore: number) => {
    setGameOver(true);
    setScore(finalScore);
  };
  
  const handleRestart = () => {
    setGameOver(false);
    setGameStarted(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Loading Game...</h2>
            <div className="w-32 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-purple-500 animate-pulse"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      ) : gameOver ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over</h2>
            <p className="text-xl mb-6">Your Score: <span className="text-yellow-400 font-bold">{score}</span></p>
            
            <div className="space-y-4">
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
                onClick={handleRestart}
              >
                Play Again
              </button>
              
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
                onClick={onBackToMenu}
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      ) : (
        <GameCanvas 
          width={window.innerWidth}
          height={window.innerHeight}
          characterType={characterType}
        />
      )}
    </div>
  );
};

export default Game;
