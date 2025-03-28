import { Devvit } from '@devvit/public-api';
import { GamePost } from '../types/game';

interface PostCardProps {
  post: GamePost;
  showValue?: boolean;
  onPress?: () => void;
  gameMode?: string;
  currentMetric?: string;
}

export function PostCard({ post, showValue = false, onPress, gameMode = '', currentMetric }: PostCardProps) {
  let formattedDate = '';
  if(post.createdAt !== undefined) {
    const date = new Date(post.createdAt);
    formattedDate = date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");
  }
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
              <text weight="bold">Posted on {formattedDate}</text>
            ) : currentMetric === 'karma' ? (
              <text weight="bold">{post.karma.toLocaleString()} karma</text>
            ) : currentMetric === 'comments' && post.comments !== undefined ? (
              <text weight="bold">{post.comments.toLocaleString()} comments</text>
            // ) : currentMetric === 'awards' && post.awards !== undefined ? (
            //   <text weight="bold">{post.awards.toLocaleString()} awards</text> // ToDo To be added!
            ) : (
              <text weight="bold">{post.karma.toLocaleString()} karma</text>
            )}
          </hstack>
        )}
      </vstack>
    </vstack>
  );
}