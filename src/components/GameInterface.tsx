import { Devvit, useInterval, useState } from '@devvit/public-api';
import { GameMode, GamePost, Metric } from '../types/game';
import { formatEra, generateEraOptions } from '../utils/gameLogic';
import { PostCard } from './PostCard';
import { ScoreDisplay } from './ScoreDisplay';

interface GameInterfaceProps {
  mode: GameMode;
  posts: GamePost[];
  timer: number;
  score: number;
  streak: number;
  bestStreak: number;
  currentMetric?: Metric;
  onGuess: (postId: string) => void;
  onBackToMenu: () => void;
  onRetry: () => void;
}

export function GameInterface({
  mode,
  posts,
  timer,
  score,
  streak,
  gameOverParent,
  bestStreak,
  currentMetric,
  onGuess,
  onBackToMenu,
  onRetry
}: GameInterfaceProps) {
  // Add state for the timer and game state
  const [timeLeft, setTimeLeft] = useState(timer);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'correct' | 'incorrect' | null>(null);
  
  // Create an interval that updates every second
  const timerInterval = useInterval(() => {
    if (!gameOver) {
      setTimeLeft((current) => {
        // Decrement the timer
        const newTime = Math.max(0, current - 1);
        
        // If time is up, end the game
        if (newTime === 0) {
          setGameOver(true);
          setGameResult('incorrect');
          timerInterval.stop();
        }
        
        return newTime;
      });
    }
  }, 1000);

  useState(() => {
    if (gameOverParent) {
      setGameOver(true);
      setGameResult('incorrect');
      timerInterval.stop();
    }
    return null;
  });
  
  // Watch for posts changes to reset timer
  useState(() => {
    setTimeLeft(7);
    return null;
  });

  
  // Start the timer immediately if not game over
  if (!gameOver) {
    timerInterval.start();
  }
  
  // Change the timer color based on time remaining
  const timerColor = timeLeft <= 5 ? "downvote" : (timeLeft <= 3 ? "warning" : "neutral");

  // Handle guess function
  const handleGuess = (postId: string, isCorrect: boolean) => {
    // First stop the current timer
    timerInterval.stop();
    
    if (isCorrect) {
      // Reset timer for correct guess
      setTimeLeft(7);
      // Restart the timer
      timerInterval.start();
      // Set result
      setGameResult('correct');
      // Call the parent component's onGuess handler
      onGuess(postId);
    } else {
      // For incorrect guess, set game over
      setGameOver(true);
      setGameResult('incorrect');
    }
  };

  // Handle retry function
  const handleRetry = () => {
    // Reset game state
    setGameOver(false);
    setGameResult(null);
    setTimeLeft(7);
    
    // Call the parent's onRetry function to reset game data
    onRetry();
    
    // Restart the timer
    timerInterval.start();
  };

  // Game over screen
  if (gameOver) {
    return (
      <vstack width="100%" padding="medium" gap="large" alignment="center middle" height="100%">
        <vstack alignment="center" gap="medium">
          <text size="xxlarge" weight="bold">Game Over!</text>
          <text size="large">Your score: {score}</text>
          <text>Best streak: {bestStreak}</text>
        </vstack>
        
        <vstack gap="medium" width="100%" maxWidth="300px">
          <hstack 
            width="100%" 
            padding="medium" 
            backgroundColor="neutral" 
            cornerRadius="medium"
            alignment="center"
            onPress={handleRetry}
          >
            <text color="white" weight="bold">Retry {mode} Mode</text>
          </hstack>
          
          <hstack 
            width="100%" 
            padding="medium" 
            backgroundColor="neutral-background" 
            cornerRadius="medium"
            alignment="center"
            onPress={onBackToMenu}
          >
            <text>Back to Menu</text>
          </hstack>
        </vstack>
      </vstack>
    );
  }

  // In ERA mode, we'll display date options instead of two posts
  if (mode === 'ERA' && posts.length > 0) {
    const post = posts[0];
    const dateOptions = post.createdAt ? generateEraOptions(post.createdAt) : [];
    
    return (
      <vstack width="100%" padding="medium" gap="medium">
        {/* Header remains the same */}
        <hstack width="100%" alignment="space-between">
          <hstack onPress={onBackToMenu}>
            <text>← Back to Menu</text>
          </hstack>
          <hstack padding="small" backgroundColor="primary-background" cornerRadius="medium">
            <text size="small">Era Mode</text>
          </hstack>
        </hstack>
        
        <vstack alignment="center" gap="small">
          <text size="xlarge" weight="bold">Guess the Era</text>
          <text>When was this Reddit post created?</text>
        </vstack>
        
        <ScoreDisplay streak={streak} bestStreak={bestStreak} score={score} />
        
        {/* Timer display */}
        <vstack alignment="center" gap="small">
          <hstack 
            width="60px" 
            height="60px" 
            cornerRadius="full" 
            backgroundColor={timerColor} 
            alignment="center middle"
          >
            <text size="xlarge" weight="bold">{timeLeft}</text>
          </hstack>
          <text>When was this post created?</text>
        </vstack>
        
        <PostCard 
          post={post} 
          showValue={false}
        />
        
        <vstack gap="small" width="100%">
          {dateOptions.map((date, index) => (
            <hstack 
              key={index.toString()}
              width="100%" 
              padding="medium" 
              backgroundColor="neutral-background" 
              cornerRadius="medium"
              onPress={() => {
                // For ERA mode, we consider a guess correct if the year and month match
                const isCorrect = post.createdAt && 
                  date.getFullYear() === post.createdAt.getFullYear() && 
                  date.getMonth() === post.createdAt.getMonth();
                  
                // Use our new handleGuess function
                handleGuess(post.id, isCorrect);
              }}
            >
              <text>{formatEra(date)}</text>
            </hstack>
          ))}
        </vstack>
      </vstack>
    );
  }
  
  // For other modes (KARMA, CHAOS), display two posts to choose from
  return (
    <vstack width="100%" padding="medium" gap="medium">
      <hstack width="100%" alignment="space-between">
        <hstack onPress={onBackToMenu}>
          <text>← Back to Menu</text>
        </hstack>
        <hstack padding="small" backgroundColor="primary-background" cornerRadius="medium">
          <text size="small">{mode} Mode</text>
        </hstack>
      </hstack>
      
      <vstack alignment="center" gap="small">
        <text size="xlarge" weight="bold">Which Post?</text>
        <text>
          {mode === 'CHAOS' && currentMetric 
            ? `Which post has more ${currentMetric}?` 
            : 'Which post has more karma?'}
        </text>
      </vstack>
      
      <ScoreDisplay streak={streak} bestStreak={bestStreak} score={score} />
      
      {/* Timer display */}
      <vstack alignment="center" gap="small">
        <hstack 
          width="60px" 
          height="60px" 
          cornerRadius="full" 
          backgroundColor={timerColor} 
          alignment="center middle"
        >
          <text size="xlarge" weight="bold">{timeLeft}</text>
        </hstack>
        <text>
          {mode === 'CHAOS' && currentMetric 
            ? `Which post has more ${currentMetric}?` 
            : 'Which post has more karma?'}
        </text>
      </vstack>
      
      <vstack gap="medium" width="100%">
        {posts.slice(0, 2).map(post => (
          <PostCard 
            key={post.id}
            post={post} 
            onPress={() => {
              // In KARMA/CHAOS modes, we need to determine if this post is the correct choice
              // This is a simplified example - you'll need to implement the actual comparison logic
              const otherPost = posts.find(p => p.id !== post.id);
              const metric = currentMetric || 'karma';
              const isCorrect = otherPost ? post[metric] > otherPost[metric] : true;
              
              handleGuess(post.id, isCorrect);
            }}
            showValue={false}
          />
        ))}
      </vstack>
    </vstack>
  );
}