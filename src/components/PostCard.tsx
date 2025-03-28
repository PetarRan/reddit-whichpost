import { Devvit } from '@devvit/public-api';
import { GamePost } from '../types/game';

interface PostCardProps {
  post: GamePost;
  showValue?: boolean;
  onPress?: () => void;
  gameMode?: string;
}

export function PostCard({ post, showValue = false, onPress, gameMode = '' }: PostCardProps) {
  return (
    <vstack 
      width="100%" 
      backgroundColor="neutral-background"
      cornerRadius="medium"
      overflow="hidden"
      onPress={onPress}
    >
      {post.thumbnail && (
        <image 
          url={post.thumbnail}
          imageWidth={120}
          imageHeight={120}
          width="100%"
          resizeMode="cover"
        />
      )}
      
      <vstack padding="small" gap="small" width="100%">
        <hstack gap="xsmall">
          <hstack width="16px" height="16px" cornerRadius="small" backgroundColor="primary" />
          <text size="small">r/{post.subreddit}</text>
          <text size="small">•</text>
          <text size="small">u/{post.author}</text>
        </hstack>
        
        <text weight="medium">{post.title}</text>
        
        {showValue && (
          <hstack padding="small" cornerRadius="medium" backgroundColor="primary-background" alignment="center">
            {gameMode === "ERA" ? (
              <text weight="bold">Posted on {new Date(post.createdAt).toLocaleDateString()}</text>
            ) : (
              <text weight="bold">{post.karma.toLocaleString()} karma</text>
            )}
          </hstack>
        )}
      </vstack>
    </vstack>
  );
}