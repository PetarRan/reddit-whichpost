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
  onRetry,
}: GameInterfaceProps) {
  const [timeLeft, setTimeLeft] = useState(timer);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'correct' | 'incorrect' | null>(null);

  const timerInterval = useInterval(() => {
    if (!gameOver) {
      setTimeLeft((current) => {
        const newTime = Math.max(0, current - 1);
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

  useState(() => {
    setTimeLeft(12);
    return null;
  });

  if (!gameOver) {
    timerInterval.start();
  }

  const timerColor = timeLeft <= 5 ? "downvote" : (timeLeft <= 3 ? "warning" : "neutral");

  const handleGuess = (postId: string, isCorrect: boolean) => {
    timerInterval.stop();
    if (isCorrect) {
      setTimeLeft(12);
      timerInterval.start();
      setGameResult('correct');
      onGuess(postId);
    } else {
      setGameOver(true);
      setGameResult('incorrect');
    }
  };

  const handleRetry = () => {
    setGameOver(false);
    setGameResult(null);
    setTimeLeft(12);
    onRetry();
    timerInterval.start();
  };

  if (gameOver) {

    const metric = currentMetric || 'karma';
    const correctPost = posts.reduce((a, b) => a[metric] > b[metric] ? a : b);
    const incorrectPost = posts.find(post => post.id !== correctPost.id);  

    return (
      <vstack width="100%" padding="medium" gap="large" alignment="center middle" height="100%">
        <vstack alignment="center" gap="medium">
          <text size="xxlarge" weight="bold">Game Over!</text>
          <text size="large">Your score: {score}</text>
          <text>Best streak: {bestStreak}</text>
        </vstack>
        <hstack gap="medium" width="100%" alignment="center">
          {mode === 'ERA' ? (
            <vstack 
              key={correctPost.id} 
              width="45%" 
              borderWidth="2px" 
              borderColor="red"
              cornerRadius="medium"
              padding="small"
            >
              <PostCard 
                post={correctPost} 
                showValue={true}
                metric={metric}
                gameMode={mode}
              />
            </vstack>
          ) : (
            posts.slice(0, 2).map(post => (
              <vstack 
          key={post.id} 
          width="45%" 
          borderWidth="2px" 
          borderColor={post.id === correctPost.id ? "green" : "red"}
          cornerRadius="medium"
          padding="small"
              >
          <PostCard 
            post={post} 
            showValue={true}
            metric={metric}
            gameMode={mode}
            currentMetric={currentMetric}
          />
              </vstack>
            ))
          )}
        </hstack>

      {mode !== 'ERA' && incorrectPost && (
        <text>
          The difference was {Math.abs(correctPost[metric] - incorrectPost[metric])} {metric}!
        </text>
      )}

        <hstack gap="medium" width="100%" maxWidth="600px" alignment='center'>
          <button 
            width="45%" 
            backgroundColor="neutral" 
            cornerRadius="medium"
            alignment="center"
            appearance='secondary'
            onPress={handleRetry}
          >
            Retry {mode} Mode
          </button>
          <button 
            width="45%" 
            backgroundColor="neutral-background" 
            cornerRadius="medium"
            alignment="center"
            appearance='bordered'
            onPress={onBackToMenu}
          >
            Back to Menu
          </button>
        </hstack>
      </vstack>
    );
  }

  if (mode === 'CHALLENGE') {
    return (
      <vstack width="100%" padding="medium" gap="medium" alignment="center middle" height="100%">
        <text size="xxlarge" weight="bold">COMING SOON</text>
        <text size="large">The Challenge mode is under development. Stay tuned!</text>
        <button 
          width="45%" 
          backgroundColor="neutral-background" 
          cornerRadius="medium"
          alignment="center"
          appearance="bordered"
          onPress={onBackToMenu}
        >
          Back to Menu
        </button>
      </vstack>
    );
  }  

  if (mode === 'ERA' && posts.length > 0) {
    const post = posts[0];
    return (
      <vstack width="100%" padding="medium" gap="medium" alignment='center'>
        <hstack width="100%">
          <hstack onPress={onBackToMenu}>
            <text>← Back to Menu</text>
          </hstack>
          <spacer grow />
          <hstack padding="small" backgroundColor="primary-background" cornerRadius="medium">
            <text size="small">Era Mode</text>
          </hstack>
        </hstack>
        <vstack alignment="center" gap="small">
          <text>When was this Reddit post created?</text>
        </vstack>
        <ScoreDisplay streak={streak} bestStreak={bestStreak} score={score} />
        <vstack alignment="center" gap="small">
          <hstack 
            width="30px" 
            height="30px" 
            cornerRadius="full" 
            backgroundColor={timerColor} 
            alignment="center middle"
          >
            <text size="large" weight="bold">{timeLeft}</text>
          </hstack>
        </vstack>
        <vstack width="70%" alignment="center">
          <PostCard 
            post={post} 
            showValue={false}
          />
        </vstack>
        <hstack gap="medium" width="100%" alignment="center middle">
          <hstack 
            width="50%" 
            padding="medium" 
            backgroundColor="neutral-background" 
            cornerRadius="medium"
            alignment="center middle"
            onPress={() => {
              const postDate = new Date(post.createdAt);
              const is2010s = postDate && 
                postDate.getFullYear() >= 2010 && 
                postDate.getFullYear() < 2020;
              handleGuess(post.id, is2010s);
            }}
          >
            <text>2010s</text>
          </hstack>
          <hstack 
            width="50%" 
            padding="medium" 
            backgroundColor="neutral-background" 
            cornerRadius="medium"
            alignment="center middle"
            onPress={() => {
              const postDate = new Date(post.createdAt);
              const is2020s = postDate && postDate.getFullYear() >= 2020;
              handleGuess(post.id, is2020s);
            }}
          >
            <text>2020s</text>
          </hstack>
        </hstack>
      </vstack>
    );
  }

  return (
    <vstack width="100%" padding="medium" gap="medium">
      <hstack width="100%">
        <hstack onPress={onBackToMenu}>
          <text>← Back to Menu</text>
        </hstack>
        <spacer grow />
        <hstack padding="small" backgroundColor="primary-background" cornerRadius="medium">
          <text size="small">{mode} Mode</text>
        </hstack>
      </hstack>
      <vstack alignment="center" gap="small">
        <text>
          {mode === 'CHAOS' && currentMetric 
            ? `Which post has more ${currentMetric}?` 
            : 'Which post has more karma?'}
        </text>
      </vstack>
      <ScoreDisplay streak={streak} bestStreak={bestStreak} score={score} />
      <vstack alignment="center" gap="small">
        <hstack 
          width="30px" 
          height="30px" 
          cornerRadius="full" 
          backgroundColor={timerColor} 
          alignment="center middle"
        >
          <text size="large" weight="bold">{timeLeft}</text>
        </hstack>
        <text>
          {mode === 'CHAOS' && currentMetric 
            ? `Which post has more ${currentMetric}?` 
            : 'Which post has more karma?'}
        </text>
      </vstack>
      <hstack gap="medium" width="100%" alignment="center">
        {posts.slice(0, 2).map(post => (
          <vstack key={post.id} width="45%">
            <PostCard 
              key={post.id}
              post={post} 
              onPress={() => {
                const otherPost = posts.find(p => p.id !== post.id);
                const metric = currentMetric || 'karma';
                const isCorrect = otherPost ? post[metric] > otherPost[metric] : true;
                handleGuess(post.id, isCorrect);
              }}
              showValue={false}
            />
          </vstack>
        ))}
      </hstack>
    </vstack>
  );
}
