import { useChannel, useState } from '@devvit/public-api';

interface LeaderboardProps {
  initialLeaderboard: Array<{member: string, score: number}>;
  context: any;
}

export function Leaderboard({ initialLeaderboard, context }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  
  // Subscribe to leaderboard updates
  const channel = useChannel({
    name: 'leaderboard_updates',
    onMessage: (newEntry) => {
      // Update leaderboard when new scores come in
      const existingEntryIndex = leaderboard.findIndex(entry => entry.member === newEntry.member);
      
      let newLeaderboard = [...leaderboard];
      if (existingEntryIndex >= 0) {
        // Update existing entry if score is higher
        if (newEntry.score > leaderboard[existingEntryIndex].score) {
          newLeaderboard[existingEntryIndex] = newEntry;
        }
      } else {
        // Add new entry
        newLeaderboard.push(newEntry);
      }
      
      // Sort and limit to top 10
      newLeaderboard = newLeaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
        
      setLeaderboard(newLeaderboard);
    },
  });
  
  channel.subscribe();
  
  return (
    <vstack padding="medium" gap="small" width="100%" cornerRadius="medium" backgroundColor="neutral-background">
      <text size="large" weight="bold" alignment="center">Leaderboard</text>
      {leaderboard.length === 0 ? (
        <text alignment="center">No scores yet. Be the first!</text>
      ) : (
        leaderboard.map((entry, index) => (
          <hstack key={index} width="100%" padding="small" gap="medium">
            <text weight="bold">{index + 1}.</text>
            <text>{entry.member}</text>
            <spacer />
            <text weight="bold">{entry.score}</text>
          </hstack>
        ))
      )}
    </vstack>
  );
}