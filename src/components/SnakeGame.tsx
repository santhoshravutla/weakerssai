import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction, Point } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RefreshCw, Play } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'arrowdown':
        case 's':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'arrowleft':
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'arrowright':
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const gameLoop = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;
      if (deltaTime > speed) {
        moveSnake();
        lastTimeRef.current = time;
      }
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake, speed]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#00cccc';
      if (i === 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
      }
      ctx.fillRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2);
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setGameOver(false);
    if (score > highScore) setHighScore(score);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 tear">
      <div className="flex justify-between w-full max-w-[400px] px-4 font-pixel">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">::CORE_BYTES_HARVESTED</span>
          <span 
            className="text-4xl font-black neon-text-cyan glitch-hard" 
            data-text={score}
          >
            {score}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">::MAX_YIELD_RECORDED</span>
          <span 
            className="text-4xl font-black neon-text-magenta glitch-hard" 
            data-text={Math.max(score, highScore)}
          >
            {Math.max(score, highScore)}
          </span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan opacity-20 animate-pulse"></div>
        <div className="relative bg-black p-1 brutal-border overflow-hidden">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="cursor-crosshair sm:w-[400px] sm:h-[400px] w-[300px] h-[300px] image-rendering-pixelated grayscale brightness-110 contrast-125"
          />

          <AnimatePresence>
            {(isPaused || gameOver) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm"
              >
                <div className="flex flex-col items-center text-center p-8 brutal-border">
                  {gameOver ? (
                    <>
                      <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
                      <h2 
                        className="text-3xl font-pixel mb-4 glitch-hard neon-text-magenta"
                        data-text="SYSTEM_FAILURE"
                      >
                        SYSTEM_FAILURE
                      </h2>
                      <p className="text-white/70 mb-6 uppercase tracking-[0.3em] font-terminal">RECOVERY_INDEX: {score}</p>
                      <button
                        onClick={resetGame}
                        className="brutal-button"
                      >
                        REBOOT_SEQUENCE
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full border-2 border-neon-cyan flex items-center justify-center mb-6 animate-pulse">
                        <Play className="w-8 h-8 text-neon-cyan fill-neon-cyan" />
                      </div>
                      <h2 
                        className="text-2xl font-pixel mb-4 glitch-hard neon-text-cyan text-center"
                        data-text="INITIALIZE_LINK"
                      >
                        INITIALIZE_LINK
                      </h2>
                      <p className="text-white/60 text-[10px] mb-8 max-w-[240px] font-terminal tracking-widest uppercase">SYPHONING_DATA_STREAM... USE_KEYS_WASD_TO_NAVIGATE.</p>
                      <button
                        onClick={() => setIsPaused(false)}
                        className="brutal-button"
                      >
                        EXECUTE_CORE
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="sm:hidden text-center text-white/40 text-xs">
        Tap directional buttons below (if added) or use keyboard
      </div>
    </div>
  );
};
