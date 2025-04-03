import { useState } from 'react';
import GameCanvas from '../game/GameCanvas';

const Game = () => {
  const [dimensions] = useState({
    width: Math.min(800, window.innerWidth - 40),
    height: Math.min(600, window.innerHeight - 100)
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
        DopaMine
      </h1>
      
      <div className="mb-6">
        <GameCanvas width={dimensions.width} height={dimensions.height} />
      </div>
      
      <div className="max-w-md text-center text-sm text-gray-300 mt-4">
        <p className="mb-2">Controls: WASD or Arrow Keys to move, Space to attack</p>
        <p>Defeat all enemies to advance to the next level!</p>
      </div>
    </div>
  );
};

export default Game;
