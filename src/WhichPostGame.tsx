import { Devvit, useState, useInterval } from '@devvit/public-api';
import { MainMenu } from './components/MainMenu';
import { useRedditPosts } from './hooks/useRedditPosts';
import { GameInterface } from './components/GameInterface';
import { determineCorrectGuess, generateMockPosts,  } from './utils/gameLogic';
import { GameMode, GamePost, Metric } from './types/game';

export function WhichPostGame(context) {
  const [mode, setMode] = useState<GameMode>(null);
  const [posts, setPosts] = useState<Omit<GamePost, 'createdAt'> & { createdAt: string }[]>([]);
  const [timer, setTimer] = useState(7);
  const [currentMetric, setCurrentMetric] = useState<Metric>('karma');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [shouldFetchPosts, setShouldFetchPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { postCache, loading, getRandomPosts } = useRedditPosts(context.context);

  const timerInterval = useInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        handleTimeOut();
        setIsTimerRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1100); // Giving it 100ms

  if (isTimerRunning) {
    timerInterval.start();
  } else {
    timerInterval.stop();
  }

  if (shouldFetchPosts && mode) {
    setIsLoading(true);
    setIsTimerRunning(false);
    
    // Get posts from cache instead of making a new request
    if (postCache.length > 10) {
      // We have enough cached posts, use them
      const gamePosts = getRandomPosts(2);
      setPosts(gamePosts);
      setTimer(7);
      setIsTimerRunning(true);
      setShouldFetchPosts(false);
      setIsLoading(false);
    } else {
      // Fallback to mock posts if cache is empty
      const mockPosts = generateMockPosts(mode);
      setPosts(mockPosts);
      setTimer(7);
      setIsTimerRunning(true);
      setShouldFetchPosts(false);
      setIsLoading(false);
    }
  }

  const handleGuess = (chosenPostId: string) => {
    if (posts.length === 0) return;

    setIsTimerRunning(false);

    const { isCorrect, newMetric } = determineCorrectGuess(
      posts, 
      chosenPostId, 
      mode, 
      currentMetric
    );

    if (newMetric) {
      setCurrentMetric(newMetric);
    }

    if (isCorrect) {
      const newStreak = streak + 1;
      setScore(prev => prev + (100 * newStreak));
      setStreak(newStreak);
      
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
    } else {
      setGameOver(true);
      setStreak(0);
    }

    setShouldFetchPosts(true);
  };

  const handleTimeOut = () => {
    setStreak(0);
    setShouldFetchPosts(true);
  };

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    
    setShouldFetchPosts(true);
  };

  // Main render logic
  return mode !== null ? (
    <GameInterface 
      mode={mode}
      posts={posts}
      timer={timer}
      score={score}
      streak={streak}
      bestStreak={bestStreak}
      gameOverParent={gameOver}
      currentMetric={mode === 'CHAOS' ? currentMetric : undefined}
      onGuess={handleGuess}
      onBackToMenu={() => {
        setIsTimerRunning(false);
        setMode(null);
      }}
      onRetry={() => {
        setScore(0);
        setStreak(0);
        setGameOver(false);
        setTimer(7);
        setShouldFetchPosts(true); // ToDo
        setIsTimerRunning(true);
      }}
    />
  ) : (
    <MainMenu onModeSelect={handleModeSelect} />
  );
}