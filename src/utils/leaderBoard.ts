import { Context } from '@devvit/public-api';

export async function saveScore(context: Context, username: string, score: number) {
  // Save the score to Redis sorted set
  await context.redis.zAdd('game_leaderboard', { member: username, score: score });
  
  // Notify all clients about the leaderboard update
  context.realtime.send('leaderboard_updates', { member: username, score: score });
}

export async function getLeaderboard(context: Context, limit: number = 10) {
  // Get top scores from Redis sorted set
  return await context.redis.zRange('game_leaderboard', 0, limit - 1, {
    reverse: true,
    by: 'rank',
  });
}