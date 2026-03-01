import { useEffect, useState } from 'react';
import Layout from '../../ui/Layout';
import Button from '../../ui/Button';
import { colors, sizes } from '../../ui/theme';
import { supabase } from '../../lib/supabase';
import { RANKING_SIZE, IDLE_RETURN_SEC, type RankingEntry } from '../../types';

interface RankingPageProps {
  currentPlayer?: { name: string; branch: string; totalScore: number };
  onFinish: () => void;
}

export default function RankingPage({ currentPlayer, onFinish }: RankingPageProps) {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [countdown, setCountdown] = useState(IDLE_RETURN_SEC);

  // 랭킹 데이터 로드
  useEffect(() => {
    async function load() {
      if (!supabase || !navigator.onLine) {
        setRankings([]);
        return;
      }
      try {
        // phone_hash를 제외한 컬럼만 조회
        const { data } = await supabase
          .from('plays')
          .select('name, branch, total_score, recommended_major')
          .order('total_score', { ascending: false })
          .order('duration_ms', { ascending: true })
          .order('timestamp', { ascending: true })
          .limit(RANKING_SIZE);

        if (data) setRankings(data);
      } catch {
        setRankings([]);
      }
    }
    load();
  }, []);

  // 자동 복귀 카운트다운
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          onFinish();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onFinish]);

  const medals = ['🥇', '🥈', '🥉', '4', '5'];

  return (
    <Layout>
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '480px',
          width: '100%',
          gap: '20px',
        }}
      >
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>TOP {RANKING_SIZE}</h1>

        {!navigator.onLine && (
          <div style={{ color: colors.textMuted, fontSize: sizes.fontSm }}>
            오프라인 모드 — 온라인 복귀 시 랭킹이 업데이트됩니다
          </div>
        )}

        {/* 랭킹 리스트 */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rankings.length === 0 && navigator.onLine && (
            <div style={{ textAlign: 'center', color: colors.textMuted, padding: '40px 0' }}>
              아직 참여 기록이 없습니다
            </div>
          )}
          {rankings.map((entry, idx) => {
            const isMe =
              currentPlayer &&
              entry.name === currentPlayer.name &&
              entry.branch === currentPlayer.branch;

            return (
              <div
                key={idx}
                className={isMe ? 'animate-scale-in' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: isMe
                    ? `linear-gradient(135deg, ${colors.primary}22, ${colors.accent}22)`
                    : colors.bgSurface,
                  border: isMe ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                  borderRadius: '16px',
                  padding: '16px 20px',
                }}
              >
                {/* 순위 */}
                <div
                  style={{
                    fontSize: idx < 3 ? '1.8rem' : '1.4rem',
                    fontWeight: 800,
                    width: '40px',
                    textAlign: 'center',
                    color: idx < 3 ? undefined : colors.textMuted,
                  }}
                >
                  {medals[idx]}
                </div>

                {/* 이름 + 계열 */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: sizes.fontMd }}>
                    {entry.name}
                    {isMe && (
                      <span style={{ color: colors.primary, marginLeft: '8px', fontSize: '0.85rem' }}>
                        ← 나
                      </span>
                    )}
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: sizes.fontSm }}>
                    {entry.branch}
                  </div>
                </div>

                {/* 점수 */}
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: colors.primary }}>
                  {entry.total_score}
                </div>
              </div>
            );
          })}
        </div>

        {/* 카운트다운 + 버튼 */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <div style={{ color: colors.textMuted, fontSize: sizes.fontSm, marginBottom: '12px' }}>
            {countdown}초 후 자동으로 대기 화면으로 돌아갑니다
          </div>
          <Button variant="secondary" onClick={onFinish}>
            처음으로
          </Button>
        </div>
      </div>
    </Layout>
  );
}
