// src/components/GameInterface.tsx
import { Devvit, useState } from '@devvit/public-api';
import React from 'react';
import { GameMode, GamePost, Metric } from '../types/game';

interface GameInterfaceProps {
  mode: GameMode;
  posts: GamePost[];
  timer: number;
  score: number;
  streak: number;
  currentMetric?: Metric;
  onGuess: (postId: string) => void;
  onBackToMenu: () => void;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({ 
  mode, 
  posts, 
  timer, 
  score, 
  streak, 
  currentMetric, 
  onGuess, 
  onBackToMenu 
}) => (
  <vstack height="100%" width="100%" gap="medium" alignment="center middle">
    <text size="large">{`Mode: ${mode}`}</text>
    <text size="medium">{`Timer: ${timer}s`}</text>
    <text size="medium">{`Score: ${score} | Streak: ${streak}`}</text>
    
    {mode === 'CHAOS' && currentMetric && (
      <text size="small">{`Current Metric: ${currentMetric}`}</text>
    )}

    <hstack width="100%" height="50%" gap="medium" alignment="center">
      {posts.map((post, index) => (
        <vstack 
          key={post.id}
          width="45%" 
          height="100%" 
          backgroundColor="lightgray" 
          alignment="center middle"
          onPress={() => onGuess(post.id)}
        >
          <text>{post.title}</text>
          <text size="small">{`r/${post.subreddit}`}</text>
        </vstack>
      ))}
    </hstack>

    <button 
      appearance="secondary" 
      onPress={onBackToMenu}
    >
      Back to Menu
    </button>
  </vstack>
);