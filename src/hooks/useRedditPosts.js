// useRedditPosts.js
import { useState, useAsync } from '@devvit/public-api';

export function useRedditPosts(context) {
  const [postCache, setPostCache] = useState([]);
  
  const { loading } = useAsync(
    async () => {
      const popularSubreddits = ['memes', 'cats', 'funny', 'gaming', 'pics'];
      const fetchPromises = popularSubreddits.map(subreddit => 
        context.reddit.getTopPosts({
          subredditName: subreddit,
          timeframe: 'all',
          limit: 40,
          pageSize: 40,
        }).all()
      );
      
      const allSubredditPosts = await Promise.all(fetchPromises);
      return allSubredditPosts.flat().map(post => ({
        id: post.id,
        title: post.title,
        subreddit: post.subredditName,
        author: post.authorName,
        karma: post.score,
        comments: post.numberOfComments,
        createdAt: post.createdAt,
        thumbnail: post.thumbnail?.url
      }));
    },
    {
      finally: (data) => {
        if (data) setPostCache(data);
      }
    }
  );
  
  return {
    postCache,
    loading,
    getRandomPosts: (count = 2) => {
      if (postCache.length < count) return [];
      const shuffled = [...postCache].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
  };
}