import { useState } from 'react';
import { CharacterAppearance, CharacterSelectionState, CharacterType } from './types';
import { archerClass, getCharacterClass, mageClass, warriorClass } from './characterClasses';

interface CharacterSelectionProps {
  onSelectCharacter: (selection: CharacterSelectionState) => void;
}

const CharacterSelection = ({ onSelectCharacter }: CharacterSelectionProps) => {
  const [selectedType, setSelectedType] = useState<CharacterType>('warrior');
  const [appearance, setAppearance] = useState<CharacterAppearance>(warriorClass.defaultAppearance);
  
  const handleSelectCharacter = (type: CharacterType) => {
    setSelectedType(type);
    setAppearance(getCharacterClass(type).defaultAppearance);
  };
  
  const handleColorChange = (colorType: 'color' | 'outfitColor', value: string) => {
    setAppearance(prev => ({
      ...prev,
      [colorType]: value
    }));
  };
  
  const handleConfirmSelection = () => {
    onSelectCharacter({
      selectedCharacter: selectedType,
      customAppearance: appearance
    });
  };
  
  return (
    <div className="bg-gray-800 bg-opacity-90 rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">Choose Your Character</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Warrior */}
        <div 
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            selectedType === 'warrior' ? 'bg-purple-900 ring-2 ring-purple-400' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => handleSelectCharacter('warrior')}
        >
          <div className="flex justify-center mb-3">
            <div 
              className="w-16 h-16 rounded-full" 
              style={{ backgroundColor: warriorClass.defaultAppearance.color }}
            />
          </div>
          <h3 className="text-xl font-bold text-center text-white mb-2">{warriorClass.name}</h3>
          <p className="text-sm text-gray-300 text-center">{warriorClass.description}</p>
          <div className="mt-3 grid grid-cols-3 gap-1 text-xs text-center">
            <div>
              <div className="font-bold text-red-400">HP</div>
              <div className="text-white">High</div>
            </div>
            <div>
              <div className="font-bold text-yellow-400">DMG</div>
              <div className="text-white">High</div>
            </div>
            <div>
              <div className="font-bold text-blue-400">SPD</div>
              <div className="text-white">Low</div>
            </div>
          </div>
        </div>
        
        {/* Mage */}
        <div 
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            selectedType === 'mage' ? 'bg-purple-900 ring-2 ring-purple-400' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => handleSelectCharacter('mage')}
        >
          <div className="flex justify-center mb-3">
            <div 
              className="w-16 h-16 rounded-full" 
              style={{ backgroundColor: mageClass.defaultAppearance.color }}
            />
          </div>
          <h3 className="text-xl font-bold text-center text-white mb-2">{mageClass.name}</h3>
          <p className="text-sm text-gray-300 text-center">{mageClass.description}</p>
          <div className="mt-3 grid grid-cols-3 gap-1 text-xs text-center">
            <div>
              <div className="font-bold text-red-400">HP</div>
              <div className="text-white">Low</div>
            </div>
            <div>
              <div className="font-bold text-yellow-400">DMG</div>
              <div className="text-white">High</div>
            </div>
            <div>
              <div className="font-bold text-blue-400">SPD</div>
              <div className="text-white">Med</div>
            </div>
          </div>
        </div>
        
        {/* Archer */}
        <div 
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            selectedType === 'archer' ? 'bg-purple-900 ring-2 ring-purple-400' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => handleSelectCharacter('archer')}
        >
          <div className="flex justify-center mb-3">
            <div 
              className="w-16 h-16 rounded-full" 
              style={{ backgroundColor: archerClass.defaultAppearance.color }}
            />
          </div>
          <h3 className="text-xl font-bold text-center text-white mb-2">{archerClass.name}</h3>
          <p className="text-sm text-gray-300 text-center">{archerClass.description}</p>
          <div className="mt-3 grid grid-cols-3 gap-1 text-xs text-center">
            <div>
              <div className="font-bold text-red-400">HP</div>
              <div className="text-white">Med</div>
            </div>
            <div>
              <div className="font-bold text-yellow-400">DMG</div>
              <div className="text-white">Med</div>
            </div>
            <div>
              <div className="font-bold text-blue-400">SPD</div>
              <div className="text-white">High</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customization */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Customize Appearance</h3>
        
        <div className="flex items-center justify-center mb-6">
          <div 
            className="w-24 h-24 rounded-full relative" 
            style={{ backgroundColor: appearance.color }}
          >
            <div 
              className="absolute inset-0 rounded-full" 
              style={{ 
                backgroundColor: appearance.outfitColor,
                clipPath: 'polygon(0 70%, 100% 70%, 100% 100%, 0 100%)'
              }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Character Color
            </label>
            <div className="flex space-x-2">
              {['#d63031', '#0984e3', '#00b894', '#6c5ce7', '#fdcb6e', '#e84393'].map(color => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${appearance.color === color ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange('color', color)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Outfit Color
            </label>
            <div className="flex space-x-2">
              {['#e17055', '#74b9ff', '#55efc4', '#a29bfe', '#ffeaa7', '#fd79a8'].map(color => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${appearance.outfitColor === color ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange('outfitColor', color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Special Ability */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Special Ability</h3>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl mr-4">
            ✨
          </div>
          <div>
            <h4 className="font-bold text-purple-300">{getCharacterClass(selectedType).specialAbility.name}</h4>
            <p className="text-sm text-gray-300">{getCharacterClass(selectedType).specialAbility.description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full text-lg font-bold transition-colors"
          onClick={handleConfirmSelection}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default CharacterSelection;
