import { Devvit, useState } from '@devvit/public-api';
import React from 'react';

import { MainMenu } from './components/MainMenu';
import { GameInterface } from './components/GameInterface';
import { determineCorrectGuess, generateMockPosts } from './utils/gameLogic';
import { GameMode, GamePost, Metric } from './types/game';

function WhichPostGame() {
  const [mode, setMode] = useState<GameMode>(null);
  const [posts, setPosts] = useState<GamePost[] | null>(null);
  const [timer, setTimer] = useState(7);
  const [currentMetric, setCurrentMetric] = useState<Metric>('karma');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const fetchPosts = async () => {
    // TODO: Replace with actual Reddit API fetch
    const mockPosts = generateMockPosts();
    setPosts(mockPosts);
    startTimer();
  };

  const startTimer = () => {
    setTimer(7);
    const timerInterval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(timerInterval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGuess = (chosenPostId: string) => {
    if (!posts) return;

    const { isCorrect, newMetric } = determineCorrectGuess(
      posts as [GamePost, GamePost], 
      chosenPostId, 
      mode, 
      currentMetric
    );

    if (newMetric) {
      setCurrentMetric(newMetric);
      // Recursive call with same post for mystery metric
      return handleGuess(chosenPostId);
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Fetch new posts
    fetchPosts();
  };

  const handleTimeOut = () => {
    setStreak(0);
    fetchPosts();
  };

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
    fetchPosts();
  };

  // Main render logic
  return mode !== null && posts ? (
    <GameInterface 
      mode={mode}
      posts={posts}
      timer={timer}
      score={score}
      streak={streak}
      currentMetric={mode === 'CHAOS' ? currentMetric : undefined}
      onGuess={handleGuess}
      onBackToMenu={() => setMode(null)}
    />
  ) : (
    <MainMenu onModeSelect={handleModeSelect} />
  );
}

// Configure Devvit app
Devvit.configure({
  redditAPI: true,
});

// Add custom post type
Devvit.addCustomPostType({
  name: 'WhichPost Game',
  render: (context) => (
    <vstack height="100%" width="100%">
      <WhichPostGame />
    </vstack>
  ),
});

export default Devvit;