import { useState, useRef } from 'react';
import Round from './Round';
import { QUESTIONS } from './questions';
import { colors } from '../../ui/theme';
import type { RoundResult } from '../../types';
import { ROUND_COUNT } from '../../types';

interface GamePageProps {
  onComplete: (results: RoundResult[], durationMs: number) => void;
}

export default function GamePage({ onComplete }: GamePageProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const resultsRef = useRef<RoundResult[]>([]);
  const gameStartRef = useRef(Date.now());

  const handleRoundComplete = (result: RoundResult) => {
    resultsRef.current = [...resultsRef.current, result];

    if (currentRound < QUESTIONS.length - 1) {
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        setCurrentRound((r) => r + 1);
      }, 500);
    } else {
      const durationMs = Date.now() - gameStartRef.current;
      onComplete(resultsRef.current, durationMs);
    }
  };

  const progress = ((currentRound + 1) / ROUND_COUNT) * 100;

  if (showTransition) {
    return (
      <div
        className="animate-scale-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '1.1rem', color: colors.textMuted }}>
          {currentRound + 1} / {ROUND_COUNT}
        </div>
        <div
          style={{
            width: '200px',
            height: '6px',
            borderRadius: '3px',
            background: colors.bgCard,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              borderRadius: '3px',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Round
      key={currentRound}
      question={QUESTIONS[currentRound]}
      currentRound={currentRound}
      totalRounds={ROUND_COUNT}
      onComplete={handleRoundComplete}
    />
  );
}
