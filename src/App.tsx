import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Brain, Gamepad2, Play } from 'lucide-react'
import Game from './pages/Game'

function App() {
  const [showGame, setShowGame] = useState(false)

  const handleStartGame = () => {
    setShowGame(true)
  }

  const handleReturnToHome = () => {
    setShowGame(false)
  }

  if (showGame) {
    return (
      <div>
        <Game />
        <div className="fixed bottom-4 left-4">
          <Button 
            variant="outline" 
            onClick={handleReturnToHome}
            className="bg-gray-800 bg-opacity-70 text-white border-gray-600"
          >
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-4 mb-6">
        <Brain size={48} className="text-purple-400" />
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          DopaMine
        </h1>
        <Gamepad2 size={48} className="text-pink-400" />
      </div>
      
      <h2 className="text-2xl mb-8 text-center">
        An exciting browser game that stimulates your brain!
      </h2>
      
      <div className="max-w-2xl text-center mb-10">
        <p className="mb-4">
          Welcome to DopaMine - where fun meets cognitive challenge. 
          Our game is designed to boost your dopamine levels while exercising your mind.
        </p>
        <p>
          Coming soon with exciting puzzles, challenges, and rewards!
        </p>
      </div>
      
      <Button 
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-xl rounded-full flex items-center gap-2"
        onClick={handleStartGame}
      >
        <Play />
        Get Ready to Play
      </Button>
      
      <div className="mt-16 text-gray-300 text-sm">
        © 2025 DopaMine - A Brain-Stimulating Browser Game
      </div>
    </div>
  )
}

export default App
