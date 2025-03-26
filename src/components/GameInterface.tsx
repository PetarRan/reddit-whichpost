import { Devvit } from '@devvit/public-api';
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
}

export function GameInterface({
  mode,
  posts,
  timer,
  score,
  streak,
  bestStreak,
  currentMetric,
  onGuess,
  onBackToMenu
}: GameInterfaceProps) {
  // In ERA mode, we'll display date options instead of two posts
  if (mode === 'ERA' && posts.length > 0) {
    const post = posts[0];
    const dateOptions = post.createdAt ? generateEraOptions(post.createdAt) : [];
    
    return (
      <vstack width="100%" padding="medium" gap="medium">
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
        
        <vstack alignment="center" gap="small">
          <hstack width="50px" height="50px" cornerRadius="full" backgroundColor="neutral" alignment="center">
            <text size="xlarge" weight="bold">{timer}</text>
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
                  
                // If correct, call onGuess with the post ID, otherwise call with a dummy ID
                onGuess(isCorrect ? post.id : 'incorrect');
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
        <text size="xlarge" weight="bold">WhichPost?</text>
        <text>
          {mode === 'CHAOS' && currentMetric 
            ? `Which post has more ${currentMetric}?` 
            : 'Which post has more karma?'}
        </text>
      </vstack>
      
      <ScoreDisplay streak={streak} bestStreak={bestStreak} score={score} />
      
      <vstack alignment="center" gap="small">
        <hstack width="50px" height="50px" cornerRadius="full" backgroundColor="neutral" alignment="center">
          <text size="xlarge" weight="bold">{timer}</text>
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
            onPress={() => onGuess(post.id)}
            showValue={false}
          />
        ))}
      </vstack>
    </vstack>
  );
}