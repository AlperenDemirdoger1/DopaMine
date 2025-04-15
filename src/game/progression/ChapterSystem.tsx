import React, { useState, useEffect } from 'react';
import { GameState } from '../types';

export interface ChapterInfo {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  backgroundImage?: string;
  completed: boolean;
}

export interface ChapterSystemProps {
  gameState: GameState;
  onChapterComplete: (chapterId: number) => void;
  onTransitionToNextChapter: () => void;
}

export const chapters: ChapterInfo[] = [
  {
    id: 1,
    name: "The Beginning",
    description: "Your journey begins in a mysterious dungeon.",
    difficulty: 1,
    backgroundImage: "dungeon-1.jpg",
    completed: false
  },
  {
    id: 2,
    name: "The Caverns",
    description: "Dark caverns filled with more dangerous enemies.",
    difficulty: 2,
    backgroundImage: "cavern-1.jpg",
    completed: false
  },
  {
    id: 3,
    name: "The Catacombs",
    description: "Ancient catacombs with powerful guardians.",
    difficulty: 3,
    backgroundImage: "catacombs-1.jpg",
    completed: false
  },
  {
    id: 4,
    name: "The Fortress",
    description: "A heavily guarded fortress with elite enemies.",
    difficulty: 4,
    backgroundImage: "fortress-1.jpg",
    completed: false
  },
  {
    id: 5,
    name: "The Final Challenge",
    description: "The final challenge awaits with the most powerful foes.",
    difficulty: 5,
    backgroundImage: "final-1.jpg",
    completed: false
  }
];

export const ChapterTransition: React.FC<{
  currentChapter: ChapterInfo;
  nextChapter: ChapterInfo;
  onTransitionComplete: () => void;
}> = ({ currentChapter, nextChapter, onTransitionComplete }) => {
  const [transitionState, setTransitionState] = useState<'start' | 'middle' | 'end'>('start');
  
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setTransitionState('middle');
      
      const endTimer = setTimeout(() => {
        setTransitionState('end');
        onTransitionComplete();
      }, 1500);
      
      return () => clearTimeout(endTimer);
    }, 1000);
    
    return () => clearTimeout(startTimer);
  }, [onTransitionComplete]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
          transitionState === 'start' ? 'opacity-0' : 
          transitionState === 'middle' ? 'opacity-100' : 
          'opacity-0'
        }`}
      />
      
      <div className={`relative z-10 text-center text-white transition-opacity duration-500 ${
        transitionState === 'middle' ? 'opacity-100' : 'opacity-0'
      }`}>
        <h2 className="text-3xl font-bold mb-2">Chapter {currentChapter.id} Complete!</h2>
        <p className="text-xl mb-6">{currentChapter.name}</p>
        
        <div className="my-8 border-t border-b border-white py-4">
          <h3 className="text-2xl font-bold mb-2">Next Chapter</h3>
          <p className="text-xl mb-2">{nextChapter.name}</p>
          <p className="text-lg opacity-80">{nextChapter.description}</p>
        </div>
      </div>
    </div>
  );
};

export const ChapterSystem: React.FC<ChapterSystemProps> = ({ 
  gameState, 
  onChapterComplete,
  onTransitionToNextChapter
}) => {
  const [showTransition, setShowTransition] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(chapters[gameState.level - 1] || chapters[0]);
  const [nextChapter, setNextChapter] = useState(chapters[gameState.level] || chapters[0]);
  
  useEffect(() => {
    setCurrentChapter(chapters[gameState.level - 1] || chapters[0]);
    setNextChapter(chapters[gameState.level] || chapters[0]);
  }, [gameState.level]);
  
  useEffect(() => {
    if (gameState.currentRoom && 
        gameState.currentRoom.enemies && 
        gameState.currentRoom.enemies.length === 0 && 
        !gameState.gameOver) {
      
      const timer = setTimeout(() => {
        onChapterComplete(currentChapter.id);
        setShowTransition(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentRoom?.enemies, gameState.gameOver, currentChapter.id, onChapterComplete]);
  
  const handleTransitionComplete = () => {
    setShowTransition(false);
    onTransitionToNextChapter();
  };
  
  return (
    <>
      {showTransition && (
        <ChapterTransition 
          currentChapter={currentChapter}
          nextChapter={nextChapter}
          onTransitionComplete={handleTransitionComplete}
        />
      )}
    </>
  );
};

export default ChapterSystem;
