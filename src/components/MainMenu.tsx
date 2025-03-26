// src/components/MainMenu.tsx
import { Devvit, useState } from '@devvit/public-api';
import React from 'react';
import { GameMode } from '../types/game';

interface MainMenuProps {
  onModeSelect: (mode: GameMode) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onModeSelect }) => (
  <vstack height="100%" width="100%" alignment="center middle" gap="medium">
    <text size="xlarge">WhichPost?</text>
    <button 
      appearance="primary" 
      onPress={() => onModeSelect('PLAY')}
    >
      PLAY
    </button>
    <button 
      appearance="secondary" 
      onPress={() => onModeSelect('CHALLENGE')}
    >
      CHALLENGE
    </button>
    <button 
      appearance="secondary" 
      onPress={() => onModeSelect('ERA')}
    >
      GUESS THE ERA
    </button>
    <button 
      appearance="secondary" 
      onPress={() => onModeSelect('CHAOS')}
    >
      CHAOS MODE
    </button>
  </vstack>
);