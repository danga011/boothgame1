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
          gap: '20px',
          cursor: 'pointer',
          width: '100%',
          height: '100%',
        }}
      >
        {/* LINK 로고 (PNG 우선, SVG 폴백) */}
        <picture>
          <source srcSet="/link-logo.png" type="image/png" />
          <img
            src="/link-logo.svg"
            alt="LINK"
            style={{ width: '120px', height: '120px', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </picture>

        {/* 서브 타이틀 */}
        <div
          style={{
            fontSize: '1.3rem',
            fontWeight: 600,
            color: colors.textSecondary,
            letterSpacing: '2px',
          }}
        >
          LINK와 함께하는
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.3,
            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary}, ${colors.accent})`,
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
          style={{
            fontSize: '1.15rem',
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 1.6,
            marginTop: '8px',
          }}
        >
          12가지 질문으로
          <br />
          나에게 맞는 학과를 찾아보세요!
        </div>

        {/* 시작 안내 */}
        <div
          className="animate-pulse"
          style={{
            marginTop: '32px',
            fontSize: '1.3rem',
            fontWeight: 600,
            color: colors.primary,
          }}
        >
          화면을 터치하여 시작
        </div>

        {/* 오프라인 표시 */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '0.85rem',
            color: colors.textMuted,
          }}
        >
          {!navigator.onLine && '오프라인 모드'}
        </div>
      </div>
    </Layout>
  );
}
