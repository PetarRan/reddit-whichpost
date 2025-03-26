// src/components/Timer.tsx
import { Devvit, useState } from '@devvit/public-api';
import React, { useEffect } from 'react';

interface TimerProps {
  initialTime: number;
  onTimeOut: () => void;
  isPaused?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ 
  initialTime, 
  onTimeOut, 
  isPaused = false 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    // Reset timer if initial time changes
    setTimeRemaining(initialTime);
  }, [initialTime]);

  useEffect(() => {
    // Skip if paused
    if (isPaused) return;

    // If time runs out, call onTimeOut
    if (timeRemaining <= 0) {
      onTimeOut();
      return;
    }

    // Set up interval to count down
    const timerId = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          onTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount or when paused
    return () => clearInterval(timerId);
  }, [timeRemaining, isPaused, onTimeOut, initialTime]);

  // Color changes based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 2) return 'red';
    if (timeRemaining <= 4) return 'orange';
    return 'green';
  };

  return (
    <text 
      size="medium" 
      color={getTimerColor()}
    >
      {`Timer: ${timeRemaining}s`}
    </text>
  );
};