
export type GameMode = 'KARMA' | 'ERA' | 'CHAOS' | 'CHALLENGE' | null;

export type Metric = 'karma' | 'comments' | 'awards' | 'age';

export type GamePost = {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  karma: number;
  comments?: number;
  awards?: number;
  createdAt?: Date;
  image?: string;
}

export type GameResult = {
  isCorrect: boolean;
  newMetric?: Metric;
}
