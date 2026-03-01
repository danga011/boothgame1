/** LINK 브랜딩 + 부스 디스플레이 최적화 디자인 토큰 */

export const colors = {
  // LINK 브랜드 컬러
  primary: '#f59e0b',
  primaryDark: '#d97706',
  primaryLight: '#fbbf24',
  secondary: '#fbbf24',
  accent: '#f97316',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',

  // 배경 그라데이션 계층
  bgDark: '#0f172a',
  bgDarker: '#0a0f1e',
  bgSurface: '#1e293b',
  bgCard: '#334155',
  bgCardHover: '#3d4f6a',

  // 텍스트
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  // 보더 & 디바이더
  border: '#475569',
  borderLight: '#5a6b82',

  // 글로우 효과
  glowPrimary: 'rgba(245, 158, 11, 0.3)',
  glowAccent: 'rgba(249, 115, 22, 0.2)',
} as const;

export const fonts = {
  heading: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
  body: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
} as const;

export const sizes = {
  /** 부스 큰 화면 기준 폰트 */
  fontXl: '2rem',
  fontLg: '1.5rem',
  fontMd: '1.25rem',
  fontBase: '1.1rem',
  fontSm: '0.95rem',
  fontXs: '0.85rem',

  /** 버튼 높이 (부스 터치 최적화 — 48px 이상) */
  buttonHeight: '56px',
  buttonRadius: '14px',

  /** 카드 */
  cardRadius: '20px',
  cardPadding: '24px',

  /** 간격 */
  spaceSm: '8px',
  spaceMd: '16px',
  spaceLg: '24px',
  spaceXl: '32px',
} as const;

/** 학과별 그라데이션 */
export const majorGradients: Record<string, string> = {
  컴퓨터학부: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  ICT융합학부: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  인공지능학과: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  수리데이터사이언스학과: 'linear-gradient(135deg, #10b981, #059669)',
} as const;
