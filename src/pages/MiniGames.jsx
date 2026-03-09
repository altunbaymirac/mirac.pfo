import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Trophy, RotateCcw, Zap } from 'lucide-react'

const GRID_SIZE = 20
const CELL_SIZE = 20

// Snake Game
const SnakeGame = ({ onScore }) => {
  const [snake, setSnake] = useState([[10, 10]])
  const [food, setFood] = useState([15, 15])
  const [direction, setDirection] = useState('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const moveSnake = useCallback(() => {
    if (gameOver) return

    const newSnake = [...snake]
    const head = [...newSnake[0]]

    switch (direction) {
      case 'UP': head[1]--; break
      case 'DOWN': head[1]++; break
      case 'LEFT': head[0]--; break
      case 'RIGHT': head[0]++; break
    }

    if (head[0] < 0 || head[0] >= GRID_SIZE || head[1] < 0 || head[1] >= GRID_SIZE) {
      setGameOver(true)
      onScore(score)
      return
    }

    if (newSnake.some(([x, y]) => x === head[0] && y === head[1])) {
      setGameOver(true)
      onScore(score)
      return
    }

    newSnake.unshift(head)

    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(s => s + 10)
      setFood([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)])
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, direction, food, gameOver, score, onScore])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      const key = e.key
      if (key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP')
      if (key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN')
      if (key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT')
      if (key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT')
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, gameOver])

  useEffect(() => {
    const interval = setInterval(moveSnake, 150)
    return () => clearInterval(interval)
  }, [moveSnake])

  const reset = () => {
    setSnake([[10, 10]])
    setFood([15, 15])
    setDirection('RIGHT')
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div className="text-terminal-accent font-mono">SCORE: {score}</div>
        <button onClick={reset} className="px-3 py-1 border border-terminal-text text-terminal-text text-xs hover:bg-terminal-text hover:text-terminal-bg">
          <RotateCcw size={12} />
        </button>
      </div>
      <div className="relative bg-terminal-bg border-2 border-terminal-accent" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
        {snake.map(([x, y], i) => (
          <div
            key={i}
            className={`absolute ${i === 0 ? 'bg-terminal-accent' : 'bg-terminal-secondary'}`}
            style={{
              left: x * CELL_SIZE,
              top: y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              boxShadow: i === 0 ? '0 0 10px #00d9ff' : 'none'
            }}
          />
        ))}
        <div
          className="absolute bg-red-500"
          style={{
            left: food[0] * CELL_SIZE,
            top: food[1] * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            boxShadow: '0 0 10px #ff0000'
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500 mb-2">GAME OVER</div>
              <div className="text-terminal-text mb-4">Score: {score}</div>
              <button onClick={reset} className="px-6 py-2 bg-terminal-accent text-white font-bold">
                RESTART
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">Use arrow keys to move</div>
    </div>
  )
}

// Pong Game
const PongGame = ({ onScore }) => {
  const [paddleY, setPaddleY] = useState(150)
  const [ballPos, setBallPos] = useState({ x: 200, y: 150 })
  const [ballVel, setBallVel] = useState({ x: 3, y: 3 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const handleMouse = (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setPaddleY(Math.max(0, Math.min(300, e.clientY - rect.top - 40)))
    }
    const canvas = document.getElementById('pong-canvas')
    if (canvas) canvas.addEventListener('mousemove', handleMouse)
    return () => canvas?.removeEventListener('mousemove', handleMouse)
  }, [])

  useEffect(() => {
    if (gameOver) return
    const interval = setInterval(() => {
      setBallPos(prev => {
        let newX = prev.x + ballVel.x
        let newY = prev.y + ballVel.y
        let newVelX = ballVel.x
        let newVelY = ballVel.y

        if (newY <= 0 || newY >= 300) newVelY *= -1
        if (newX >= 390) newVelX *= -1

        if (newX <= 10 && newY >= paddleY && newY <= paddleY + 80) {
          newVelX *= -1
          setScore(s => s + 1)
        }

        if (newX < 0) {
          setGameOver(true)
          onScore(score)
          return prev
        }

        setBallVel({ x: newVelX, y: newVelY })
        return { x: newX, y: newY }
      })
    }, 16)
    return () => clearInterval(interval)
  }, [ballVel, paddleY, gameOver, score, onScore])

  const reset = () => {
    setBallPos({ x: 200, y: 150 })
    setBallVel({ x: 3, y: 3 })
    setScore(0)
    setGameOver(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-terminal-secondary font-mono">SCORE: {score}</div>
        <button onClick={reset} className="px-3 py-1 border border-terminal-text text-terminal-text text-xs hover:bg-terminal-text hover:text-terminal-bg">
          <RotateCcw size={12} />
        </button>
      </div>
      <div id="pong-canvas" className="relative bg-terminal-bg border-2 border-terminal-secondary" style={{ width: 400, height: 300 }}>
        <div className="absolute bg-terminal-secondary" style={{ left: 0, top: paddleY, width: 10, height: 80, boxShadow: '0 0 10px #b794f6' }} />
        <div className="absolute bg-terminal-text rounded-full" style={{ left: ballPos.x, top: ballPos.y, width: 10, height: 10, boxShadow: '0 0 10px #fff' }} />
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500 mb-2">GAME OVER</div>
              <div className="text-terminal-text mb-4">Score: {score}</div>
              <button onClick={reset} className="px-6 py-2 bg-terminal-secondary text-white font-bold">
                RESTART
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">Move mouse to control paddle</div>
    </div>
  )
}

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState(null)
  const [highScores, setHighScores] = useState({ snake: 0, pong: 0 })

  const handleScore = (game, score) => {
    setHighScores(prev => ({
      ...prev,
      [game]: Math.max(prev[game], score)
    }))
  }

  const games = [
    { id: 'snake', name: 'SNAKE', color: 'terminal-accent', icon: '🐍', component: SnakeGame },
    { id: 'pong', name: 'PONG', color: 'terminal-secondary', icon: '🏓', component: PongGame }
  ]

  return (
    <div className="min-h-screen bg-terminal-bg pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block"
          >
            <Gamepad2 className="text-terminal-accent mx-auto mb-4" size={60} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-terminal-text neon-glow mb-4">
            RETRO ARCADE
          </h1>
          <p className="text-gray-400">Classic games, terminal aesthetic</p>
        </div>

        {!activeGame ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              onClick={() => setActiveGame('snake')}
              className="bg-terminal-darker border-2 border-terminal-accent p-8 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="text-6xl mb-4 text-center">🐍</div>
              <h3 className="text-2xl font-bold text-terminal-accent text-center mb-4">SNAKE</h3>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                  <Trophy size={16} />
                  <span className="font-mono">High Score: {highScores.snake}</span>
                </div>
                <button className="px-6 py-2 bg-terminal-accent text-white font-bold hover:opacity-80">
                  PLAY NOW
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setActiveGame('pong')}
              className="bg-terminal-darker border-2 border-terminal-secondary p-8 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="text-6xl mb-4 text-center">🏓</div>
              <h3 className="text-2xl font-bold text-terminal-secondary text-center mb-4">PONG</h3>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                  <Trophy size={16} />
                  <span className="font-mono">High Score: {highScores.pong}</span>
                </div>
                <button className="px-6 py-2 bg-terminal-secondary text-white font-bold hover:opacity-80">
                  PLAY NOW
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setActiveGame(null)}
                className="px-4 py-2 border-2 border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg font-bold"
              >
                ← BACK TO MENU
              </button>
              <div className="flex items-center gap-2 text-yellow-500">
                <Trophy size={20} />
                <span className="font-mono">Best: {highScores[activeGame]}</span>
              </div>
            </div>

            <div className="bg-terminal-darker border-2 border-terminal-accent p-8">
              {activeGame === 'snake' && <SnakeGame onScore={(score) => handleScore('snake', score)} />}
              {activeGame === 'pong' && <PongGame onScore={(score) => handleScore('pong', score)} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
