import React, { useState } from 'react';
import { CharacterType } from './types';

interface CharacterSelectionProps {
  onSelectCharacter: (characterType: CharacterType) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelectCharacter }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('warrior');
  
  const handleCharacterSelect = (characterType: CharacterType) => {
    setSelectedCharacter(characterType);
  };
  
  const handleStartGame = () => {
    onSelectCharacter(selectedCharacter);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        {/* Warrior */}
        <div 
          className={`bg-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            selectedCharacter === 'warrior' ? 'ring-4 ring-red-500 scale-105' : ''
          }`}
          onClick={() => handleCharacterSelect('warrior')}
        >
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-4xl">
              ⚔️
            </div>
          </div>
          <h3 className="text-xl font-bold text-center mb-2 text-red-400">Warrior</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Health:</span>
              <span className="text-red-400">●●●●●</span>
            </div>
            <div className="flex justify-between">
              <span>Damage:</span>
              <span className="text-red-400">●●●●○</span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="text-red-400">●●○○○</span>
            </div>
            <div className="flex justify-between">
              <span>Range:</span>
              <span className="text-red-400">●○○○○</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Powerful melee fighter with high health and damage. Special ability: Berserk mode.
          </p>
        </div>
        
        {/* Mage */}
        <div 
          className={`bg-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            selectedCharacter === 'mage' ? 'ring-4 ring-blue-500 scale-105' : ''
          }`}
          onClick={() => handleCharacterSelect('mage')}
        >
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl">
              🔮
            </div>
          </div>
          <h3 className="text-xl font-bold text-center mb-2 text-blue-400">Mage</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Health:</span>
              <span className="text-blue-400">●●○○○</span>
            </div>
            <div className="flex justify-between">
              <span>Damage:</span>
              <span className="text-blue-400">●●●●●</span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="text-blue-400">●●●○○</span>
            </div>
            <div className="flex justify-between">
              <span>Range:</span>
              <span className="text-blue-400">●●●●○</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Powerful spellcaster with high damage and range. Special ability: Arcane Blast.
          </p>
        </div>
        
        {/* Archer */}
        <div 
          className={`bg-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            selectedCharacter === 'archer' ? 'ring-4 ring-green-500 scale-105' : ''
          }`}
          onClick={() => handleCharacterSelect('archer')}
        >
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-4xl">
              🏹
            </div>
          </div>
          <h3 className="text-xl font-bold text-center mb-2 text-green-400">Archer</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Health:</span>
              <span className="text-green-400">●●●○○</span>
            </div>
            <div className="flex justify-between">
              <span>Damage:</span>
              <span className="text-green-400">●●●○○</span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="text-green-400">●●●●●</span>
            </div>
            <div className="flex justify-between">
              <span>Range:</span>
              <span className="text-green-400">●●●●●</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Agile ranged fighter with high speed and range. Special ability: Multishot.
          </p>
        </div>
      </div>
      
      <button
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-200 animate-pulse"
        onClick={handleStartGame}
      >
        Start Adventure
      </button>
    </div>
  );
};

export default CharacterSelection;
