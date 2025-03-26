// src/utils/gameLogic.ts
import { GamePost, Metric, GameMode } from '../types/game';

export const determineCorrectGuess = (
  posts: [GamePost, GamePost], 
  chosenPostId: string, 
  mode: GameMode, 
  currentMetric?: Metric
): { isCorrect: boolean; newMetric?: Metric } => {
  const selectMetric = mode === 'CHAOS' 
    ? currentMetric 
    : mode === 'ERA' 
    ? 'age' 
    : 'karma';

  switch (selectMetric) {
    case 'karma':
      return {
        isCorrect: posts[0].karma > posts[1].karma 
          ? chosenPostId === posts[0].id 
          : chosenPostId === posts[1].id
      };
    case 'comments':
      return {
        isCorrect: posts[0].commentCount > posts[1].commentCount 
          ? chosenPostId === posts[0].id 
          : chosenPostId === posts[1].id
      };
    case 'age':
      return {
        isCorrect: posts[0].createdAt < posts[1].createdAt 
          ? chosenPostId === posts[0].id 
          : chosenPostId === posts[1].id
      };
    case 'mystery':
      const metrics: Metric[] = ['karma', 'comments', 'age'];
      const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
      return {
        isCorrect: false,
        newMetric: randomMetric
      };
    default:
      return { isCorrect: false };
  }
};

export const generateMockPosts = (): [GamePost, GamePost] => [
  {
    id: 'post1',
    title: 'First Amazing Post',
    subreddit: 'r/funny',
    karma: 5000,
    commentCount: 250,
    createdAt: Date.now() - 86400000, // 1 day ago
    thumbnailUrl: 'https://example.com/thumbnail1.jpg'
  },
  {
    id: 'post2',
    title: 'Second Awesome Post',
    subreddit: 'r/pics',
    karma: 7500,
    commentCount: 400,
    createdAt: Date.now() - 172800000, // 2 days ago
    thumbnailUrl: 'https://example.com/thumbnail2.jpg'
  }
];