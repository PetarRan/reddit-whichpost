import { Devvit } from '@devvit/public-api';
import { GamePost } from '../types/game';

interface PostCardProps {
  post: GamePost;
  showValue?: boolean;
  onPress?: () => void;
}

export function PostCard({ post, showValue = false, onPress }: PostCardProps) {
  return (
    <vstack 
      width="100%" 
      backgroundColor="neutral-background"
      cornerRadius="medium"
      overflow="hidden"
      onPress={onPress}
    >
      {post.image && (
        <image 
          url={post.image}
          imageWidth={300}
          imageHeight={169}
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
            <text weight="bold">{post.karma.toLocaleString()} karma</text>
          </hstack>
        )}
      </vstack>
    </vstack>
  );
}