import { useState, useRef } from 'react';
import Round from './Round';
import { QUESTIONS } from './questions';
import type { RoundResult } from '../../types';

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
      // 라운드 전환 연출
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        setCurrentRound((r) => r + 1);
      }, 800);
    } else {
      // 게임 종료
      const durationMs = Date.now() - gameStartRef.current;
      onComplete(resultsRef.current, durationMs);
    }
  };

  if (showTransition) {
    return (
      <div
        className="animate-scale-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          fontSize: '3rem',
          fontWeight: 800,
        }}
      >
        {currentRound + 1 < QUESTIONS.length
          ? `ROUND ${currentRound + 2}`
          : '결과 분석 중...'}
      </div>
    );
  }

  return (
    <Round
      key={currentRound}
      question={QUESTIONS[currentRound]}
      onComplete={handleRoundComplete}
    />
  );
}
