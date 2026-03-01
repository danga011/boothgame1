import Layout from '../../ui/Layout';
import { colors } from '../../ui/theme';

interface StartPageProps {
  onStart: () => void;
}

export default function StartPage({ onStart }: StartPageProps) {
  const tryFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    onStart();
  };

  return (
    <Layout>
      <div
        onClick={tryFullscreen}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 앰비언트 배경 오브 */}
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />

        {/* LINK 로고 */}
        <div
          className="animate-float"
          style={{
            position: 'relative',
            marginBottom: '8px',
          }}
        >
          {/* 로고 뒤 글로우 */}
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.primary}25, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />
          <img
            src="/link.png"
            alt="LINK 학생회"
            style={{
              width: '130px',
              height: '130px',
              objectFit: 'contain',
              position: 'relative',
              filter: 'drop-shadow(0 4px 20px rgba(245, 158, 11, 0.3))',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* 서브 타이틀 */}
        <div
          className="animate-fade-in-down"
          style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: colors.textSecondary,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          LINK와 함께하는
        </div>

        {/* 메인 타이틀 */}
        <div
          className="gradient-text-shimmer"
          style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.25,
            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary}, ${colors.accent}, ${colors.secondary})`,
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          소프트웨어융합대학
          <br />
          학과 적성 검사
        </div>

        {/* 설명 */}
        <div
          className="animate-fade-in-up delay-200"
          style={{
            fontSize: '1.1rem',
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 1.7,
            marginTop: '4px',
          }}
        >
          12가지 질문으로
          <br />
          나에게 맞는 학과를 찾아보세요!
        </div>

        {/* 시작 안내 */}
        <div
          className="animate-tap-pulse"
          style={{
            marginTop: '36px',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: colors.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: colors.primary,
              boxShadow: `0 0 12px ${colors.primary}`,
            }}
          />
          화면을 터치하여 시작
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: colors.primary,
              boxShadow: `0 0 12px ${colors.primary}`,
            }}
          />
        </div>

        {/* 하단 브랜딩 */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            fontSize: '0.8rem',
            color: colors.textMuted,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {!navigator.onLine && (
            <div style={{ marginBottom: '4px', color: colors.warning }}>
              오프라인 모드
            </div>
          )}
          한양대학교 ERICA 소프트웨어융합대학
        </div>
      </div>
    </Layout>
  );
}
