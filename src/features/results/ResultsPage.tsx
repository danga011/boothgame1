import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import Layout from '../../ui/Layout';
import Button from '../../ui/Button';
import { colors, sizes } from '../../ui/theme';
import {
  MAJORS,
  MAJOR_SHORT,
  MAJOR_DESCRIPTIONS,
  MAJOR_COLORS,
  type Major,
  type GameResult,
  MAX_TOTAL_SCORE,
} from '../../types';

interface ResultsPageProps {
  result: GameResult;
  onNext: () => void;
}

export default function ResultsPage({ result, onNext }: ResultsPageProps) {
  const chartData = MAJORS.map((m) => ({
    major: MAJOR_SHORT[m],
    value: result.majorPercents[m],
    fullMark: 100,
  }));

  const isFusion = result.recommendedMajor.includes('융합형');
  const isBalanced = result.recommendedMajor === '균형형';
  const singleMajor = !isFusion && !isBalanced
    ? (result.recommendedMajor as Major)
    : null;

  return (
    <Layout centered={false}>
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '520px',
          width: '100%',
          margin: '0 auto',
          paddingTop: '20px',
          gap: '16px',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* 총점 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: sizes.fontSm, color: colors.textMuted }}>
            총점
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            {result.totalScore}
            <span style={{ fontSize: '1.2rem', color: colors.textMuted }}>
              {' '}
              / {MAX_TOTAL_SCORE}
            </span>
          </div>
        </div>

        {/* 추천 학과 */}
        <div
          className="animate-scale-in"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}22, ${colors.secondary}22)`,
            border: `2px solid ${colors.primary}44`,
            borderRadius: sizes.cardRadius,
            padding: '20px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div style={{ fontSize: sizes.fontSm, color: colors.textSecondary, marginBottom: '8px' }}>
            추천 학과
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            {result.recommendedMajor}
          </div>
          <div style={{ fontSize: sizes.fontBase, color: colors.textSecondary, lineHeight: 1.5 }}>
            {singleMajor
              ? MAJOR_DESCRIPTIONS[singleMajor]
              : isFusion
                ? '두 분야의 강점을 모두 갖춘 융합형 인재!'
                : '모든 분야에 균형 잡힌 잠재력의 소유자!'}
          </div>
        </div>

        {/* 레이더 차트 */}
        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke={colors.border} />
              <PolarAngleAxis
                dataKey="major"
                tick={{ fill: colors.textSecondary, fontSize: 14, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 60]}
                tick={false}
                axisLine={false}
              />
              <Radar
                dataKey="value"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 학과별 퍼센트 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            width: '100%',
          }}
        >
          {MAJORS.map((m) => (
            <div
              key={m}
              style={{
                background: colors.bgSurface,
                borderRadius: '12px',
                padding: '14px',
                borderLeft: `4px solid ${MAJOR_COLORS[m]}`,
              }}
            >
              <div style={{ fontSize: '0.85rem', color: colors.textMuted }}>
                {MAJOR_SHORT[m]}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                {result.majorPercents[m]}%
              </div>
            </div>
          ))}
        </div>

        {/* 다음 버튼 */}
        <Button fullWidth onClick={onNext} style={{ marginTop: '8px', flexShrink: 0 }}>
          랭킹 보기
        </Button>
      </div>
    </Layout>
  );
}
