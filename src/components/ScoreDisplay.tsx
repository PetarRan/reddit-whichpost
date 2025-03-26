import { Devvit } from '@devvit/public-api';

interface ScoreDisplayProps {
  streak: number;
  bestStreak: number;
  score: number;
}

export function ScoreDisplay({ streak, bestStreak, score }: ScoreDisplayProps) {
  return (
    <hstack width="100%" gap="small">
      <vstack 
        grow 
        padding="medium" 
        backgroundColor="neutral-background" 
        cornerRadius="medium"
        alignment="center"
      >
        <text size="small">Current Streak</text>
        <text size="xlarge" weight="bold" color="primary">{streak}</text>
      </vstack>
      
      <vstack 
        grow 
        padding="medium" 
        backgroundColor="neutral-background" 
        cornerRadius="medium"
        alignment="center"
      >
        <text size="small">Best Streak</text>
        <text size="xlarge" weight="bold" color="primary">{bestStreak}</text>
      </vstack>
      
      <vstack 
        grow 
        padding="medium" 
        backgroundColor="neutral-background" 
        cornerRadius="medium"
        alignment="center"
      >
        <text size="small">Score</text>
        <text size="xlarge" weight="bold" color="primary">{score}</text>
      </vstack>
    </hstack>
  );
}