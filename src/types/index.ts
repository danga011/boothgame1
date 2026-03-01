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
  컴퓨터학부: '컴퓨터의 핵심 원리를 이해하고 견고한 소프트웨어 시스템을 설계하는 개발자',
  ICT융합학부: '기술과 인문학, 디자인을 융합하여 새로운 가치를 창조하는 융합 전문가',
  인공지능학과: 'AI 기술로 미래를 설계하고 혁신을 이끄는 인공지능 전문가',
  수리데이터사이언스학과: '수학적 사고와 데이터 분석으로 세상의 패턴을 발견하는 전문가',
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

// ── MBTI-style Type Info ──

export const MAJOR_TYPE_NAMES: Record<Major, string> = {
  컴퓨터학부: '시스템 아키텍트',
  ICT융합학부: '크리에이티브 퓨저',
  인공지능학과: 'AI 파이오니어',
  수리데이터사이언스학과: '데이터 사이언티스트',
};

export const MAJOR_TYPE_INTROS: Record<Major, string> = {
  컴퓨터학부:
    '당신은 논리적이고 체계적인 사고를 바탕으로 복잡한 시스템을 설계하고 구현하는 타입입니다. 문제를 작은 단위로 분해해 해결하며, 코드로 아이디어를 현실화하는 데 강점을 보입니다.',
  ICT융합학부:
    '당신은 기술의 경계를 넘어 다양한 분야를 연결하고, 사람 중심의 혁신적 서비스를 만들어내는 타입입니다. 데이터 분석과 디자인 모두에 관심이 많고, 새로운 가치를 창조합니다.',
  인공지능학과:
    '당신은 AI 기술의 무한한 가능성에 끌리며, 실험과 프로젝트를 통해 새로운 AI 솔루션을 만들어내는 타입입니다. 최신 기술 트렌드에 민감하고 혁신을 주도합니다.',
  수리데이터사이언스학과:
    '당신은 수학적 사고와 꼼꼼한 분석력으로 데이터 속 숨겨진 패턴을 발견하는 타입입니다. 이론적 기반 위에서 문제를 해석하며, 정밀한 추론을 통해 최적의 답을 찾아냅니다.',
};

export const MAJOR_KEYWORDS: Record<Major, string[]> = {
  컴퓨터학부: ['알고리즘', '시스템설계', '소프트웨어개발', '오픈소스'],
  ICT융합학부: ['데이터인텔리전스', '디자인컨버전스', 'UX', '융합'],
  인공지능학과: ['딥러닝', '머신러닝', '컴퓨터비전', '자연어처리'],
  수리데이터사이언스학과: ['수학', '통계', '빅데이터', '데이터분석'],
};

export const MAJOR_TRAITS: Record<Major, string[]> = {
  컴퓨터학부: ['논리적 사고력', '체계적 문제 해결', '깊은 기술 이해', '꼼꼼한 구현력'],
  ICT융합학부: ['창의적 사고력', '융합적 관점', '사용자 중심 설계', '커뮤니케이션'],
  인공지능학과: ['기술 선도력', '실험 정신', '패턴 인식', '혁신적 사고'],
  수리데이터사이언스학과: ['수학적 직관', '분석적 사고', '패턴 발견', '정밀한 추론'],
};

export const MAJOR_EDUCATION: Record<Major, string> = {
  컴퓨터학부:
    '기초이론과 핵심 전공지식을 기반으로 실무능력과 국제적 역량을 갖춘 창조·융합형 인재를 양성합니다. OSS(오픈소스) 교육, 산학프로젝트, 인턴십이 특징입니다.',
  ICT융합학부:
    '소프트웨어 기술에 데이터 분석, 디자인을 융합하는 혁신적 교육과정을 제공합니다. 데이터인텔리전스전공과 디자인컨버전스전공 2개 트랙으로 운영됩니다.',
  인공지능학과:
    'AI 기술을 제대로 이해하고 발전시킬 수 있는 창의적 실용 AI 인재를 양성합니다. 프로젝트 기반 학습(PBL)과 최첨단 AI 인프라가 특징입니다.',
  수리데이터사이언스학과:
    '수학적·통계학적 사고에 기반한 데이터사이언스 전문 인재를 양성합니다. 수학 기초이론과 PBL 수업, 코딩 교육을 병행합니다.',
};

export const MAJOR_SUBJECTS: Record<Major, string[]> = {
  컴퓨터학부: ['알고리즘', '자료구조론', '시스템프로그래밍', '운영체제', '컴퓨터네트워크', '데이터베이스'],
  ICT융합학부: ['데이터인텔리전스', '디자인컨버전스', 'UX/UI 디자인', '미디어테크놀로지', '데이터시각화', '인터랙션디자인'],
  인공지능학과: ['머신러닝', '딥러닝', '컴퓨터비전', '자연어처리', '강화학습', 'AI 프로젝트'],
  수리데이터사이언스학과: ['확률과 통계', '선형대수학', '최적화이론', '빅데이터분석', '수리모델링', '데이터마이닝'],
};

export const MAJOR_CAREERS: Record<Major, string[]> = {
  컴퓨터학부: ['소프트웨어 개발자', '시스템 아키텍트', '보안 전문가', '클라우드 엔지니어', '풀스택 개발자'],
  ICT융합학부: ['데이터 분석가', 'UX/UI 디자이너', '프로덕트 매니저', '서비스 기획자', '디지털 마케터'],
  인공지능학과: ['AI/ML 엔지니어', 'AI 연구원', 'AI 서비스 개발자', '컴퓨터비전 전문가', 'NLP 엔지니어'],
  수리데이터사이언스학과: ['데이터 사이언티스트', '퀀트 분석가', '보험계리사', '통계 연구원', '금융 데이터 분석가'],
};

// ── App State ──

export type AppStep = 'idle' | 'onboarding' | 'game' | 'results';

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
  email?: string;
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

export const ROUND_COUNT = 12;
export const MAX_ROUND_SCORE = 100;
export const MAX_TOTAL_SCORE = MAX_ROUND_SCORE * ROUND_COUNT; // 1200
export const RANKING_SIZE = 5;
export const IDLE_RETURN_SEC = 30;
