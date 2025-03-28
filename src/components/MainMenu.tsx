import { Devvit } from '@devvit/public-api';
import { GameMode } from '../types/game';

interface MainMenuProps {
  onModeSelect: (mode: GameMode) => void;
}

export function MainMenu({ onModeSelect }: MainMenuProps) {
  return (
    <vstack width="100%" padding="medium" gap="medium" alignment="center">
      <image 
        url="https://styles.redditmedia.com/t5_dzza2p/styles/communityIcon_qfoxpolpsfqe1.png" 
        imageWidth={50} 
        imageHeight={50} 
        resizeMode="fit"
      /> 

      <text size="xlarge" weight="bold" alignment="center">Which Post?</text>

      <text alignment="center">A Reddit guessing game!</text>
      
      <vstack gap="small" width="100%" maxWidth="400px">        
        <hstack width="100%" backgroundColor="neutral" padding="medium" gap="small" cornerRadius="medium" onPress={() => onModeSelect('KARMA')}>
          <vstack>
            <icon name="play" size="large" />
          </vstack>
          <vstack>
            <text weight="bold"> Play</text>
            <text size="small"> Classic mode - Guess which post has more karma</text>
          </vstack>
        </hstack>
        
        <hstack width="100%" backgroundColor="neutral-background" padding="medium" gap="medium" cornerRadius="medium" onPress={() => onModeSelect('CHALLENGE')}>
          <vstack>
            <icon name="award" size="large" />
          </vstack>
          <vstack>
            <text weight="bold"> Challenge</text>
            <text size="small"> Challenge other redditors to a game</text>
          </vstack>
        </hstack>
        
        <hstack width="100%" backgroundColor="neutral-background" padding="medium" gap="medium" cornerRadius="medium" onPress={() => onModeSelect('ERA')}>
          <vstack>
            <icon name="calendar" size="large" />
          </vstack>
          <vstack>
            <text weight="bold"> Guess the Era</text>
            <text size="small"> When was this post created?</text>
          </vstack>
        </hstack>
        
        <hstack width="100%" backgroundColor="neutral-background" padding="medium" gap="medium" cornerRadius="medium" onPress={() => onModeSelect('CHAOS')}>
          <vstack>
            <icon name="warning" size="large" />
          </vstack>
          <vstack>
            <text weight="bold"> Chaos Mode</text>
            <text size="small"> Random metrics each round!</text>
          </vstack>
        </hstack>
      </vstack>
    </vstack>
  );
}