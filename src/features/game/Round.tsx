import { useState, useCallback, useRef } from 'react';
import Button from '../../ui/Button';
import { colors, sizes } from '../../ui/theme';
import type { Question, Major, RoundResult } from '../../types';
import { calculateRoundScore } from '../../lib/scoring';

interface RoundProps {
  question: Question;
  currentRound: number;
  totalRounds: number;
  onComplete: (result: RoundResult) => void;
}

export default function Round({ question, currentRound, totalRounds, onComplete }: RoundProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = useRef(false);

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered.current) return;
      answered.current = true;
      setSelected(idx);

      const option = question.options[idx];
      const { majorScores, roundScore } = calculateRoundScore(option);

      setTimeout(() => {
        onComplete({
          round: question.round,
          selectedOption: idx,
          timeRemainingMs: 0,
          majorScores: majorScores as Record<Major, number>,
          roundScore,
        });
      }, 400);
    },
    [question, onComplete],
  );

  const progress = ((currentRound + 1) / totalRounds) * 100;

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        gap: '16px',
        padding: '24px',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      {/* 진행 상황 */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: sizes.fontSm,
            color: colors.textMuted,
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          Q{currentRound + 1} / {totalRounds}
        </div>
        <div
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: colors.bgCard,
            overflow: 'hidden',
          }}
        >
          <div
            className="progress-bar-fill"
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

      {/* 질문 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: sizes.fontLg,
          fontWeight: 700,
          lineHeight: 1.5,
          whiteSpace: 'pre-line',
          margin: '12px 0',
        }}
      >
        {question.scenario}
      </div>

      {/* 선택지 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((opt, idx) => (
          <Button
            key={idx}
            variant="option"
            fullWidth
            selected={selected === idx}
            disabled={answered.current}
            onClick={() => handleSelect(idx)}
            style={{
              opacity: selected !== null && selected !== idx ? 0.4 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ marginRight: '12px', fontWeight: 800, color: colors.primary }}>
              {String.fromCharCode(65 + idx)}
            </span>
            {opt.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
