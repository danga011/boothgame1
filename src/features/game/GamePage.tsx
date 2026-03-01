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
      }, 600);
    } else {
      const durationMs = Date.now() - gameStartRef.current;
      onComplete(resultsRef.current, durationMs);
    }
  };

  const progress = ((currentRound + 1) / ROUND_COUNT) * 100;

  if (showTransition) {
    return (
      <div
        className="animate-scale-in-bounce"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: '20px',
        }}
      >
        {/* 라운드 넘버 */}
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Q{currentRound + 2}
        </div>
        <div style={{ fontSize: '1rem', color: colors.textMuted, fontWeight: 500 }}>
          {currentRound + 2} / {ROUND_COUNT}
        </div>

        {/* 진행 바 */}
        <div
          style={{
            width: '220px',
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
              transition: 'width 0.4s ease',
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
