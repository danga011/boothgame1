import { useState, useCallback, useRef } from 'react';
import Button from '../../ui/Button';
import Timer from './Timer';
import { colors, sizes } from '../../ui/theme';
import type { Question, Major, RoundResult } from '../../types';
import { ROUND_DURATION_MS, ROUND_COUNT } from '../../types';
import {
  calculateRoundScore,
  calculateTimeoutRoundScore,
} from '../../lib/scoring';

interface RoundProps {
  question: Question;
  onComplete: (result: RoundResult) => void;
}

export default function Round({ question, onComplete }: RoundProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = useRef(false);
  const startTime = useRef(Date.now());

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered.current) return;
      answered.current = true;
      setSelected(idx);

      const timeRemaining = Math.max(0, ROUND_DURATION_MS - (Date.now() - startTime.current));
      const option = question.options[idx];
      const { majorScores, roundScore } = calculateRoundScore(option, timeRemaining);

      // 짧은 딜레이 후 다음 라운드로
      setTimeout(() => {
        onComplete({
          round: question.round,
          selectedOption: idx,
          timeRemainingMs: timeRemaining,
          majorScores: majorScores as Record<Major, number>,
          roundScore,
        });
      }, 600);
    },
    [question, onComplete],
  );

  const handleExpire = useCallback(() => {
    if (answered.current) return;
    answered.current = true;

    const { majorScores, roundScore } = calculateTimeoutRoundScore();
    setTimeout(() => {
      onComplete({
        round: question.round,
        selectedOption: -1,
        timeRemainingMs: 0,
        majorScores: majorScores as Record<Major, number>,
        roundScore,
      });
    }, 600);
  }, [question, onComplete]);

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        gap: '20px',
        padding: '24px',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      {/* 라운드 표시 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: sizes.fontSm,
          color: colors.textMuted,
          fontWeight: 600,
        }}
      >
        ROUND {question.round} / {ROUND_COUNT}
      </div>

      {/* 타이머 */}
      <Timer
        key={question.round}
        durationMs={ROUND_DURATION_MS}
        onExpire={handleExpire}
      />

      {/* 질문 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: sizes.fontLg,
          fontWeight: 700,
          lineHeight: 1.5,
          whiteSpace: 'pre-line',
          margin: '8px 0',
        }}
      >
        {question.scenario}
      </div>

      {/* 선택지 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

      {/* 시간 초과 안내 */}
      {selected === null && answered.current && (
        <div
          className="animate-scale-in"
          style={{
            textAlign: 'center',
            color: colors.warning,
            fontWeight: 700,
            fontSize: sizes.fontMd,
          }}
        >
          시간 초과!
        </div>
      )}
    </div>
  );
}
