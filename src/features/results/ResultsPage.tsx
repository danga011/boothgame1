import { useState } from 'react';
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
  MAJOR_DESCRIPTIONS,
  MAJOR_COLORS,
  MAJOR_TYPE_NAMES,
  MAJOR_TYPE_INTROS,
  MAJOR_KEYWORDS,
  MAJOR_TRAITS,
  MAJOR_EDUCATION,
  MAJOR_SUBJECTS,
  MAJOR_CAREERS,
  type Major,
  type GameResult,
  type PlayerInfo,
} from '../../types';
import { supabase } from '../../lib/supabase';

interface ResultsPageProps {
  result: GameResult;
  playerInfo: PlayerInfo;
  onFinish: () => void;
}

export default function ResultsPage({ result, playerInfo, onFinish }: ResultsPageProps) {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const chartData = MAJORS.map((m) => ({
    major: m,
    value: result.majorPercents[m],
    fullMark: 100,
  }));

  const isFusion = result.recommendedMajor.includes('융합형');
  const isBalanced = result.recommendedMajor === '균형형';
  const singleMajor = !isFusion && !isBalanced
    ? (result.recommendedMajor as Major)
    : null;

  // 상위 학과 결정 (보고서 상세용)
  const sortedMajors = (Object.entries(result.majorPercents) as [Major, number][])
    .sort((a, b) => b[1] - a[1]);
  const topMajor = sortedMajors[0][0];

  const typeName = singleMajor
    ? MAJOR_TYPE_NAMES[singleMajor]
    : isFusion
      ? '하이브리드 이노베이터'
      : '올라운드 플레이어';

  const typeIntro = singleMajor
    ? MAJOR_TYPE_INTROS[singleMajor]
    : isFusion
      ? '두 가지 이상의 분야에 걸쳐 강점을 가진 융합형 인재입니다. 하나의 전공에 국한되지 않고 다양한 기술과 관점을 결합하여 새로운 가치를 만들어냅니다.'
      : '모든 분야에 균형 잡힌 잠재력을 가진 올라운드 타입입니다. 어떤 학과에 가더라도 본인의 강점을 발휘할 수 있는 유연한 인재입니다.';

  const primaryColor = singleMajor
    ? MAJOR_COLORS[singleMajor]
    : isFusion
      ? MAJOR_COLORS[topMajor]
      : colors.primary;

  const handleEmailSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setEmailStatus('saving');
    try {
      if (!supabase) throw new Error('Not connected');
      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: {
          email,
          playerName: playerInfo.name,
          branch: playerInfo.branch,
          phoneHash: playerInfo.phoneHash,
          recommendedMajor: singleMajor || topMajor,
          typeName,
          majorPercents: result.majorPercents,
        },
      });
      if (error) throw error;
      if (data && !data.success) throw new Error(data.error);
      setEmailStatus('saved');
    } catch {
      setEmailStatus('error');
    }
  };

  const sectionStyle: React.CSSProperties = {
    background: colors.bgSurface,
    borderRadius: sizes.cardRadius,
    padding: '20px',
    width: '100%',
    border: `1px solid ${colors.border}25`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  };

  return (
    <Layout centered={false}>
      <div
        className="report-scrollable"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '520px',
          width: '100%',
          margin: '0 auto',
          padding: '20px 0 40px',
          gap: '16px',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* 헤더: 로고 + 타이틀 */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '4px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
            <div
              style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${colors.primary}20, transparent 70%)`,
                filter: 'blur(6px)',
              }}
            />
            <img
              src="/link.png"
              alt="LINK"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                position: 'relative',
                filter: `drop-shadow(0 2px 12px ${colors.glowPrimary})`,
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, letterSpacing: '1px' }}>
            LINK와 함께하는 소프트웨어융합대학 검사
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              marginTop: '8px',
              background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {playerInfo.name}님의 검사 결과
          </div>
        </div>

        {/* 유형 뱃지 */}
        <div
          className="animate-badge-reveal"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}12, ${primaryColor}25, ${primaryColor}12)`,
            border: `2px solid ${primaryColor}50`,
            borderRadius: sizes.cardRadius,
            padding: '28px 20px',
            textAlign: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '10px', letterSpacing: '2px', textTransform: 'uppercase', position: 'relative' }}>
            당신의 유형
          </div>
          <div
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: primaryColor,
              lineHeight: 1.2,
              marginBottom: '10px',
              position: 'relative',
              textShadow: `0 0 30px ${primaryColor}30`,
            }}
          >
            {typeName}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: colors.textSecondary, position: 'relative' }}>
            {result.recommendedMajor}
          </div>
        </div>

        {/* 유형 설명 */}
        <div className="animate-fade-in-up" style={sectionStyle}>
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '10px', fontWeight: 600 }}>
            유형 분석
          </div>
          <div style={{ fontSize: '1rem', color: colors.textSecondary, lineHeight: 1.7 }}>
            {typeIntro}
          </div>
        </div>

        {/* 키워드 */}
        {singleMajor && (
          <div className="animate-fade-in-up" style={{ ...sectionStyle, display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {MAJOR_KEYWORDS[singleMajor].map((kw) => (
              <span
                key={kw}
                style={{
                  background: `${primaryColor}20`,
                  color: primaryColor,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                #{kw}
              </span>
            ))}
          </div>
        )}

        {/* 레이더 차트 */}
        <div className="animate-fade-in-up" style={{ ...sectionStyle, padding: '16px 8px' }}>
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '4px', fontWeight: 600, paddingLeft: '12px' }}>
            학과 적합도
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="68%">
                <PolarGrid stroke={colors.border} />
                <PolarAngleAxis
                  dataKey="major"
                  tick={{ fill: colors.textSecondary, fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 60]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  dataKey="value"
                  stroke={primaryColor}
                  fill={primaryColor}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 학과별 퍼센트 바 */}
        <div className="animate-fade-in-up" style={sectionStyle}>
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '14px', fontWeight: 600 }}>
            학과별 적합도
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedMajors.map(([major, pct]) => (
              <div key={major}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.textPrimary }}>
                    {major}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: MAJOR_COLORS[major] }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: colors.bgCard, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(pct * 2, 100)}%`,
                      height: '100%',
                      borderRadius: '4px',
                      background: `linear-gradient(90deg, ${MAJOR_COLORS[major]}90, ${MAJOR_COLORS[major]})`,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 0 8px ${MAJOR_COLORS[major]}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 성격 특성 */}
        {singleMajor && (
          <div className="animate-fade-in-up" style={sectionStyle}>
            <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '14px', fontWeight: 600 }}>
              당신의 강점
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {MAJOR_TRAITS[singleMajor].map((trait, i) => (
                <div
                  key={trait}
                  className="animate-fade-in-up"
                  style={{
                    background: colors.bgCard,
                    borderRadius: '12px',
                    padding: '14px 12px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    borderTop: `3px solid ${primaryColor}${i === 0 ? '' : '60'}`,
                    animationDelay: `${i * 0.08}s`,
                    animationFillMode: 'both',
                  }}
                >
                  {trait}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추천 학과 상세 */}
        <div className="animate-fade-in-up" style={{ ...sectionStyle, borderLeft: `4px solid ${primaryColor}` }}>
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '6px', fontWeight: 600 }}>
            {singleMajor ? '추천 학과 소개' : '1순위 학과 소개'}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: primaryColor }}>
            {singleMajor || topMajor}
          </div>

          <div style={{ fontSize: '0.9rem', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '16px' }}>
            {MAJOR_EDUCATION[singleMajor || topMajor]}
          </div>

          {/* 주요 과목 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '8px', fontWeight: 600 }}>
              주요 과목
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {MAJOR_SUBJECTS[singleMajor || topMajor].map((subj) => (
                <span
                  key={subj}
                  style={{
                    background: colors.bgCard,
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: colors.textPrimary,
                  }}
                >
                  {subj}
                </span>
              ))}
            </div>
          </div>

          {/* 졸업 후 진로 */}
          <div>
            <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '8px', fontWeight: 600 }}>
              졸업 후 진로
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {MAJOR_CAREERS[singleMajor || topMajor].map((career) => (
                <div
                  key={career}
                  style={{ fontSize: '0.9rem', color: colors.textSecondary, paddingLeft: '8px' }}
                >
                  - {career}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 전체 학과 한눈에 */}
        <div className="animate-fade-in-up" style={sectionStyle}>
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '14px', fontWeight: 600 }}>
            소프트웨어융합대학 4개 학과
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MAJORS.map((m) => (
              <div
                key={m}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: m === (singleMajor || topMajor) ? `${MAJOR_COLORS[m]}15` : 'transparent',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  border: m === (singleMajor || topMajor) ? `1px solid ${MAJOR_COLORS[m]}40` : '1px solid transparent',
                }}
              >
                <div
                  style={{
                    width: '4px',
                    height: '36px',
                    borderRadius: '2px',
                    background: MAJOR_COLORS[m],
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: colors.textPrimary }}>
                    {m}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>
                    {MAJOR_DESCRIPTIONS[m]}
                  </div>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: MAJOR_COLORS[m] }}>
                  {result.majorPercents[m]}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 이메일 섹션 */}
        <div className="animate-fade-in-up" style={{ ...sectionStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '8px', fontWeight: 600 }}>
            검사 결과를 이메일로 받아보세요
          </div>
          {emailStatus === 'saved' ? (
            <div className="animate-scale-in-bounce" style={{ color: colors.success, fontWeight: 600, fontSize: '0.95rem', padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              결과가 이메일로 전송되었습니다!
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="off"
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.border}`,
                  background: colors.bgCard,
                  color: colors.textPrimary,
                  padding: '0 16px',
                  fontSize: '0.95rem',
                }}
              />
              <Button
                variant="primary"
                onClick={handleEmailSubmit}
                disabled={emailStatus === 'saving' || !email}
                style={{
                  minWidth: '80px',
                  height: '48px',
                  fontSize: '0.9rem',
                  opacity: emailStatus === 'saving' ? 0.6 : 1,
                }}
              >
                {emailStatus === 'saving' ? '...' : '보내기'}
              </Button>
            </div>
          )}
          {emailStatus === 'error' && (
            <div style={{ color: colors.error, fontSize: '0.85rem', marginTop: '6px' }}>
              전송에 실패했습니다. 다시 시도해주세요.
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <Button
          variant="secondary"
          fullWidth
          onClick={onFinish}
          style={{ flexShrink: 0, marginTop: '8px' }}
        >
          처음으로 돌아가기
        </Button>

        {/* 푸터 */}
        <div style={{ textAlign: 'center', padding: '8px 0 16px', fontSize: '0.8rem', color: colors.textMuted }}>
          제10대 소프트웨어융합대학 학생회 LINK | 한양대학교 ERICA 소프트웨어융합대학
        </div>
      </div>
    </Layout>
  );
}
