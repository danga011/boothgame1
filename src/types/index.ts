// ── Domain Constants ──

export const BRANCHES = ['인문', '자연', '전'] as const;
export type Branch = (typeof BRANCHES)[number];

export const MAJORS = [
  '컴퓨터학부',
  'ICT융합학부',
  '인공지능학과',
  '수리데이터사이언스학과',
] as const;
export type Major = (typeof MAJORS)[number];

export const MAJOR_DESCRIPTIONS: Record<Major, string> = {
  컴퓨터학부: '시스템을 설계하고 구현하는 핵심 개발자',
  ICT융합학부: '기술을 연결해 현실 문제를 해결하는 융합 전문가',
  인공지능학과: '데이터로 미래를 예측하는 AI 전문가',
  수리데이터사이언스학과: '수학과 데이터로 세상을 분석하는 전문가',
};

export const MAJOR_SHORT: Record<Major, string> = {
  컴퓨터학부: '컴퓨터',
  ICT융합학부: 'ICT융합',
  인공지능학과: 'AI',
  수리데이터사이언스학과: '수리DS',
};

export const MAJOR_COLORS: Record<Major, string> = {
  컴퓨터학부: '#3b82f6',
  ICT융합학부: '#8b5cf6',
  인공지능학과: '#06b6d4',
  수리데이터사이언스학과: '#10b981',
};

// ── App State ──

export type AppStep = 'idle' | 'onboarding' | 'game' | 'results' | 'ranking';

// ── Player ──

export interface PlayerInfo {
  branch: Branch;
  name: string;
  phoneHash: string;
}

// ── Questions ──

export interface AnswerOption {
  text: string;
  weights: Record<Major, number>; // must sum to 100
}

export interface Question {
  round: number;
  scenario: string;
  options: AnswerOption[];
}

// ── Results ──

export interface RoundResult {
  round: number;
  selectedOption: number;
  timeRemainingMs: number;
  majorScores: Record<Major, number>;
  roundScore: number;
}

export interface GameResult {
  totalScore: number;
  majorScores: Record<Major, number>;
  majorPercents: Record<Major, number>;
  recommendedMajor: string;
  durationMs: number;
}

// ── Storage / Sync ──

export interface PlayRecord {
  branch: string;
  name: string;
  phone_hash: string;
  total_score: number;
  recommended_major: string;
  timestamp: string;
  duration_ms: number;
  major_scores: Record<string, number>;
  major_percents: Record<string, number>;
}

export interface PendingRecord extends PlayRecord {
  id: string;
  synced: boolean;
}

// ── Ranking ──

export interface RankingEntry {
  name: string;
  branch: string;
  total_score: number;
  recommended_major: string;
}

// ── Game Config ──

export const ROUND_DURATION_MS = 20_000;
export const ROUND_COUNT = 4;
export const MAX_ACCURACY = 100;
export const MAX_SPEED_BONUS = 30;
export const MAX_ROUND_SCORE = MAX_ACCURACY + MAX_SPEED_BONUS; // 130
export const MAX_TOTAL_SCORE = MAX_ROUND_SCORE * ROUND_COUNT; // 520
export const RANKING_SIZE = 5;
export const IDLE_RETURN_SEC = 15;
