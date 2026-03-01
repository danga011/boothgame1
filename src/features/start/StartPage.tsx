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
          gap: '32px',
          cursor: 'pointer',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.3,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          소프트웨어융합대학
          <br />
          학과 적성 탐색기
        </div>

        <div
          style={{
            fontSize: '1.3rem',
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          4가지 질문에 답하고
          <br />
          나에게 맞는 학과를 찾아보세요!
        </div>

        <div
          className="animate-pulse"
          style={{
            marginTop: '40px',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: colors.primary,
          }}
        >
          화면을 터치하여 시작
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '0.9rem',
            color: colors.textMuted,
          }}
        >
          {!navigator.onLine && '⚡ 오프라인 모드'}
        </div>
      </div>
    </Layout>
  );
}
