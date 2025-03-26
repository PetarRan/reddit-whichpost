
import { GameMode, GamePost, GameResult, Metric } from '../types/game';

const postTitles = [
  "I can't believe my cat actually did this",
  "This view from my hotel room is absolutely breathtaking",
  "After 10 years of trying, I finally beat this game",
  "My grandmother turned 100 today and shared her secret to a long life",
  "TIL that honey never spoils and archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old",
  "Scientists have discovered a new species of deep-sea creature that can survive extreme pressure",
  "Breaking: Major political development just announced",
  "What's a life hack that you think everyone should know?",
  "This movie detail blew my mind when I noticed it on my fifth rewatch",
  "Found this rare vinyl record at a garage sale for $1"
];

const subreddits = [
  'pics', 'funny', 'gaming', 'aww', 'todayilearned', 'science', 'worldnews', 'askreddit',
  'movies', 'music'
];

const authors = [
  'reddit_user123', 'karma_collector', 'post_master', 'upvote_magnet', 'award_winner'
];

// Generate a single mock post
const generateMockPost = (mode: GameMode): GamePost => {
  const id = Math.random().toString(36).substring(2, 15);
  const title = postTitles[Math.floor(Math.random() * postTitles.length)];
  const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];
  const karma = Math.floor(Math.random() * 100000);
  
  const post: GamePost = {
    id,
    title,
    subreddit,
    author,
    karma,
    image: Math.random() > 0.3 ? "https://picsum.photos/seed/" + id + "/300/200" : undefined
  };
  
  // Add mode-specific properties
  if (mode === 'CHAOS' || mode === 'ERA') {
    // Generate a random date within the last 5 years
    const now = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(now.getFullYear() - 5);
    post.createdAt = new Date(fiveYearsAgo.getTime() + Math.random() * (now.getTime() - fiveYearsAgo.getTime()));
    
    // Add additional properties for chaos mode
    if (mode === 'CHAOS') {
      post.comments = Math.floor(Math.random() * 5000);
      post.awards = Math.floor(Math.random() * 20);
    }
  }
  
  return post;
};

// Generate posts for a game round
export const generateMockPosts = (mode: GameMode): GamePost[] => {
  if (mode === 'ERA') {
    // For ERA mode, we only need one post
    const post = generateMockPost(mode);
    post.karma = 10000 + Math.floor(Math.random() * 90000); // Higher karma for era posts
    return [post];
  }
  
  // For other modes, generate two different posts
  const post1 = generateMockPost(mode);
  let post2 = generateMockPost(mode);
  
  // Ensure the posts have different karma values
  while (post2.karma === post1.karma) {
    post2 = generateMockPost(mode);
  }
  
  return [post1, post2];
};

// Generate date options for ERA mode
export const generateEraOptions = (correctDate: Date): Date[] => {
  const options: Date[] = [];
  
  // Add correct date
  options.push(new Date(correctDate));
  
  // Add dates 3-12 months older
  const older = new Date(correctDate);
  older.setMonth(older.getMonth() - 3 - Math.floor(Math.random() * 9));
  options.push(older);
  
  // Add dates 3-12 months newer
  const newer = new Date(correctDate);
  newer.setMonth(newer.getMonth() + 3 + Math.floor(Math.random() * 9));
  options.push(newer);
  
  // Add a date 1-3 years different (randomly older or newer)
  const farDate = new Date(correctDate);
  if (Math.random() > 0.5) {
    farDate.setFullYear(farDate.getFullYear() - 1 - Math.floor(Math.random() * 2));
  } else {
    farDate.setFullYear(farDate.getFullYear() + 1 + Math.floor(Math.random() * 2));
  }
  options.push(farDate);
  
  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
};

// Format date for display
export const formatEra = (date: Date): string => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

// Determine if the user's guess is correct
export const determineCorrectGuess = (
  posts: GamePost[],
  chosenPostId: string,
  mode: GameMode,
  currentMetric: Metric
): GameResult => {
  if (mode === 'ERA') {
    // This will be handled by the component directly
    return { isCorrect: chosenPostId === posts[0].id };
  }
  
  if (mode === 'CHAOS') {
    // For CHAOS mode, compare based on the current metric
    const [post1, post2] = posts;
    let post1Value = 0;
    let post2Value = 0;
    
    // Get values based on metric
    switch (currentMetric) {
      case 'karma':
        post1Value = post1.karma;
        post2Value = post2.karma;
        break;
      case 'comments':
        post1Value = post1.comments || 0;
        post2Value = post2.comments || 0;
        break;
      case 'awards':
        post1Value = post1.awards || 0;
        post2Value = post2.awards || 0;
        break;
      case 'age':
        post1Value = post1.createdAt ? Date.now() - post1.createdAt.getTime() : 0;
        post2Value = post2.createdAt ? Date.now() - post2.createdAt.getTime() : 0;
        break;
    }
    
    const higherValuePost = post1Value > post2Value ? post1 : post2;
    const isCorrect = chosenPostId === higherValuePost.id;
    
    // Get a new random metric for the next round
    const metrics: Metric[] = ['karma', 'comments', 'awards', 'age'];
    const newMetric = metrics[Math.floor(Math.random() * metrics.length)];
    
    return { isCorrect, newMetric };
  } else {
    // For KARMA mode, compare based on karma
    const [post1, post2] = posts;
    const higherKarmaPost = post1.karma > post2.karma ? post1 : post2;
    const isCorrect = chosenPostId === higherKarmaPost.id;
    
    return { isCorrect };
  }
};

// Format metric value for display
export const formatMetricValue = (value: number | Date, metric: Metric): string => {
  if (value instanceof Date) {
    return formatEra(value);
  }
  
  switch (metric) {
    case 'karma':
      return `${value.toLocaleString()} karma`;
    case 'comments':
      return `${value.toLocaleString()} comments`;
    case 'awards':
      return `${value} award${value !== 1 ? 's' : ''}`;
    case 'age':
      // Convert milliseconds to days
      const days = Math.floor(value / (1000 * 60 * 60 * 24));
      return `${days} day${days !== 1 ? 's' : ''} old`;
    default:
      return value.toString();
  }
};
