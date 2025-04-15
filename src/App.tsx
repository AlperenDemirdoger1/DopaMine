import { useState } from 'react';
import { CharacterType } from './game/characters/types';
import CharacterSelection from './game/characters/CharacterSelection';
import Game from './pages/Game';
import { CountryCode } from './game/characters/CountryFlagSelector';

function App() {
  const [_, setCharacterSelected] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('warrior');
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<CountryCode>('US');
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const handleCharacterSelect = (characterType: CharacterType, countryFlag: CountryCode) => {
    setSelectedCharacter(characterType);
    setSelectedCountryFlag(countryFlag);
    setCharacterSelected(true);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!gameStarted ? (
        <div className="container mx-auto px-4 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 text-purple-500">DopaMine</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              An ADHD-friendly roguelike game designed to stimulate dopamine release, 
              enhance focus, and provide quick, satisfying gameplay loops.
            </p>
          </header>

          <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
              Choose Your Character
            </h2>
            
            <CharacterSelection onSelectCharacter={handleCharacterSelect} />
            
            <div className="mt-12 bg-gray-700 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Game Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Dopamine Stimulation: Immediate rewards and feedback</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Focus Enhancement: Clear goals and engaging mechanics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Cognitive Training: Strategic decision making in fast-paced environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Stress Relief: Satisfying combat and progression systems</span>
                </li>
              </ul>
            </div>
          </div>
          
          <footer className="mt-12 text-center text-gray-500">
            <p>© 2025 DopaMine - ADHD-Friendly Gaming</p>
          </footer>
        </div>
      ) : (
        <Game 
          characterType={selectedCharacter}
          countryFlag={selectedCountryFlag}
          onBackToMenu={() => setGameStarted(false)}
        />
      )}
    </div>
  );
}

export default App;
