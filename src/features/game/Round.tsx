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

const optionLabels = ['A', 'B', 'C', 'D'];

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
      }, 450);
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
      {/* 상단: 진행 상황 */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: colors.primary,
            }}
          >
            Q{currentRound + 1}
          </span>
          <span
            style={{
              fontSize: sizes.fontSm,
              color: colors.textMuted,
              fontWeight: 500,
            }}
          >
            / {totalRounds}
          </span>
        </div>
        {/* 프로그레스 바 */}
        <div
          style={{
            width: '100%',
            height: '5px',
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
              transition: 'width 0.4s ease',
              boxShadow: `0 0 8px ${colors.glowPrimary}`,
            }}
          />
        </div>
      </div>

      {/* 질문 텍스트 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: sizes.fontLg,
          fontWeight: 700,
          lineHeight: 1.55,
          whiteSpace: 'pre-line',
          margin: '14px 0 6px',
          color: colors.textPrimary,
          background: colors.bgSurface,
          borderRadius: sizes.cardRadius,
          padding: '24px 20px',
          border: `1px solid ${colors.border}30`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        {question.scenario}
      </div>

      {/* 선택지 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((opt, idx) => (
          <div
            key={idx}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${idx * 0.06}s`,
              animationFillMode: 'both',
            }}
          >
            <Button
              variant="option"
              fullWidth
              selected={selected === idx}
              disabled={answered.current}
              onClick={() => handleSelect(idx)}
              style={{
                opacity: selected !== null && selected !== idx ? 0.35 : 1,
                transform: selected === idx ? 'scale(1.01)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: selected === idx
                    ? colors.primary
                    : `${colors.primary}18`,
                  color: selected === idx
                    ? '#0f172a'
                    : colors.primary,
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  marginRight: '14px',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                {optionLabels[idx]}
              </span>
              {opt.text}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
