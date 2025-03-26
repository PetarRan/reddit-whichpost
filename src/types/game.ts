export type GameMode = 'PLAY' | 'CHALLENGE' | 'ERA' | 'CHAOS' | null;
export type Metric = 'karma' | 'comments' | 'age' | 'mystery';

export type GamePost = {
  id: string;
  title: string;
  subreddit: string;
  karma: number;
  commentCount: number;
  createdAt: number;
  thumbnailUrl?: string;
}