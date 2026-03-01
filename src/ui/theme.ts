/** 부스 디스플레이 최적화 디자인 토큰 */

export const colors = {
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',

  bgDark: '#0f172a',
  bgSurface: '#1e293b',
  bgCard: '#334155',

  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  border: '#475569',
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

  /** 버튼 높이 (부스 터치 최적화) */
  buttonHeight: '64px',
  buttonRadius: '16px',

  /** 카드 */
  cardRadius: '20px',
  cardPadding: '24px',
} as const;
