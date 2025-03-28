
export type GameMode = 'KARMA' | 'ERA' | 'CHAOS' | 'CHALLENGE' | 'LEADERBOARD' | null;

export type Metric = 'karma' | 'comments' | 'awards' | 'age';

export type GamePost = {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  karma: number;
  comments?: number;
  awards?: number;
  createdAt?: string;
  image?: string;
}

export type GameResult = {
  isCorrect: boolean;
  newMetric?: Metric;
}
