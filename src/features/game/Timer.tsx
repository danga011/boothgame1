import { useEffect, useRef, useState } from 'react';
import { colors } from '../../ui/theme';

interface TimerProps {
  durationMs: number;
  onExpire: () => void;
  /** 현재 남은 시간(ms)을 부모에 전달 */
  onTick?: (remainingMs: number) => void;
}

export default function Timer({ durationMs, onExpire, onTick }: TimerProps) {
  const [remaining, setRemaining] = useState(durationMs);
  const startRef = useRef(Date.now());
  const expiredRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
    expiredRef.current = false;
    setRemaining(durationMs);

    const id = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const left = Math.max(0, durationMs - elapsed);
      setRemaining(left);
      onTick?.(left);

      if (left <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(id);
        onExpire();
      }
    }, 100);

    return () => clearInterval(id);
  }, [durationMs, onExpire, onTick]);

  const seconds = (remaining / 1000).toFixed(1);
  const pct = (remaining / durationMs) * 100;
  const isLow = remaining < 5000;

  return (
    <div style={{ width: '100%' }}>
      {/* 남은 시간 숫자 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 800,
          color: isLow ? colors.error : colors.textPrimary,
          fontVariantNumeric: 'tabular-nums',
          transition: 'color 0.3s',
        }}
      >
        {seconds}
      </div>

      {/* 프로그레스 바 */}
      <div
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: colors.bgCard,
          overflow: 'hidden',
          marginTop: '8px',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: '4px',
            background: isLow
              ? colors.error
              : `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
            transition: 'width 0.1s linear, background 0.3s',
          }}
        />
      </div>
    </div>
  );
}
