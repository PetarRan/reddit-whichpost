import { Devvit } from '@devvit/public-api';
import { GameMode } from '../types/game';

interface MainMenuProps {
  onModeSelect: (mode: GameMode) => void;
}

export function MainMenu({ onModeSelect }: MainMenuProps) {
  return (
    <vstack width="100%" padding="large" gap="medium" alignment="center">
      <image 
        url="https://styles.redditmedia.com/t5_dzza2p/styles/communityIcon_qfoxpolpsfqe1.png" 
        imageWidth={50} 
        imageHeight={50} 
        resizeMode="fit"
      /> 

      <text size="xlarge" weight="bold" alignment="center">Which Post?</text>

      <text alignment="center">A Reddit guessing game!</text>
      
      <vstack gap="small" width="100%" maxWidth="400px">        
        <button 
          width="100%" 
          appearance='bordered' 
          padding="medium" 
          cornerRadius="medium" 
          icon='play'
          onPress={() => onModeSelect('KARMA')}
        >
              Classic Mode
        </button>

        <button 
          width="100%" 
          appearance='bordered' 
          padding="medium" 
          cornerRadius="medium" 
          icon='calendar'
          onPress={() => onModeSelect('ERA')}
        >
          Guess the Era
        </button>
        
        <button 
          width="100%" 
          appearance='bordered' 
          padding="medium" 
          cornerRadius="medium" 
          icon='karma'
          onPress={() => onModeSelect('CHAOS')}
        >
          Chaos Mode
        </button>

        <button 
          width="100%" 
          appearance='bordered' 
          padding="medium" 
          cornerRadius="medium" 
          icon='users'
          onPress={() => onModeSelect('CHALLENGE')}
        >
          Challenge
        </button>

        <button 
          width="100%" 
          appearance='bordered' 
          padding="medium" 
          cornerRadius="medium" 
          icon='award'
          onPress={() => onModeSelect('LEADERBOARD')}
        >
          Leaderboards
        </button>
      </vstack>
    </vstack>
  );
}
