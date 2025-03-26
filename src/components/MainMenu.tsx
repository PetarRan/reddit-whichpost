import { Devvit } from '@devvit/public-api';
import { GameMode } from '../types/game';

interface MainMenuProps {
  onModeSelect: (mode: GameMode) => void;
}

export function MainMenu({ onModeSelect }: MainMenuProps) {
  return (
    <vstack width="100%" padding="medium" gap="medium" alignment="center">
      <text size="xlarge" weight="bold" alignment="center">WhichPost?</text>
      <text alignment="center">Choose which Reddit post has more karma!</text>
      
      <vstack gap="small" width="100%" maxWidth="400px">
        <text size="large" weight="medium">Game Modes</text>
        
        <hstack width="100%" backgroundColor="neutral" padding="medium" cornerRadius="medium" onPress={() => onModeSelect('KARMA')}>
          <vstack>
            <text weight="bold">Play</text>
            <text size="small">Classic mode - Guess which post has more karma</text>
          </vstack>
        </hstack>
        
        <hstack width="100%" backgroundColor="neutral-background" padding="medium" cornerRadius="medium" onPress={() => onModeSelect('CHALLENGE')}>
          <vstack>
            <text weight="bold">Challenge</text>
            <text size="small">Challenge other redditors to a game</text>
          </vstack>
        </hstack>
        
        <hstack width="100%" backgroundColor="neutral-background" padding="medium" cornerRadius="medium" onPress={() => onModeSelect('ERA')}>
          <vstack>
            <text weight="bold">Guess the Era</text>
            <text size="small">When was this post created?</text>
          </vstack>
        </hstack>
        
        <hstack width="100%" backgroundColor="neutral-background" padding="medium" cornerRadius="medium" onPress={() => onModeSelect('CHAOS')}>
          <vstack>
            <text weight="bold">Chaos Mode</text>
            <text size="small">Random metrics each round!</text>
          </vstack>
        </hstack>
      </vstack>
    </vstack>
  );
}