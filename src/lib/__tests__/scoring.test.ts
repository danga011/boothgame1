import { describe, it, expect } from 'vitest';
import {
  calculateRoundScore,
  calculateTimeoutRoundScore,
  calculateGameResult,
  getRecommendation,
} from '../scoring';
import type { AnswerOption, RoundResult, Major } from '../../types';
import { MAJORS } from '../../types';

const mockOption: AnswerOption = {
  text: '테스트',
  weights: {
    컴퓨터학부: 40,
    ICT융합학부: 25,
    인공지능학과: 15,
    수리데이터사이언스학과: 20,
  },
};

describe('calculateRoundScore', () => {
  it('최대 속도보너스(20초 남음)시 총점 130', () => {
    const { roundScore } = calculateRoundScore(mockOption, 20_000);
    expect(roundScore).toBe(130);
  });

  it('속도보너스 0(0초 남음)시 총점 100', () => {
    const { roundScore } = calculateRoundScore(mockOption, 0);
    expect(roundScore).toBe(100);
  });

  it('학과별 점수 합이 라운드 총점과 같다', () => {
    const { majorScores, roundScore } = calculateRoundScore(mockOption, 15_000);
    const sum = Object.values(majorScores).reduce((a, b) => a + b, 0);
    expect(sum).toBe(roundScore);
  });

  it('가중치 비율에 따라 점수가 배분된다', () => {
    const { majorScores } = calculateRoundScore(mockOption, 20_000);
    // 40%가 가장 높아야 함
    expect(majorScores['컴퓨터학부']).toBeGreaterThan(majorScores['인공지능학과']);
    expect(majorScores['컴퓨터학부']).toBeGreaterThan(majorScores['수리데이터사이언스학과']);
  });

  it('음수 시간은 0으로 처리', () => {
    const { roundScore } = calculateRoundScore(mockOption, -1000);
    expect(roundScore).toBe(100);
  });
});

describe('calculateTimeoutRoundScore', () => {
  it('모든 학과 0점, 라운드 총점 0', () => {
    const { majorScores, roundScore } = calculateTimeoutRoundScore();
    expect(roundScore).toBe(0);
    for (const m of MAJORS) {
      expect(majorScores[m]).toBe(0);
    }
  });
});

describe('calculateGameResult', () => {
  it('4라운드 결과를 정확히 합산한다', () => {
    const rounds: RoundResult[] = MAJORS.map((_, i) => {
      const { majorScores, roundScore } = calculateRoundScore(mockOption, 20_000);
      return {
        round: i + 1,
        selectedOption: 0,
        timeRemainingMs: 20_000,
        majorScores: majorScores as Record<Major, number>,
        roundScore,
      };
    });

    const result = calculateGameResult(rounds, 60_000);
    expect(result.totalScore).toBe(130 * 4); // 520
    expect(result.durationMs).toBe(60_000);
  });

  it('학과별 퍼센트가 합산 ~100%', () => {
    const rounds: RoundResult[] = MAJORS.map((_, i) => {
      const { majorScores, roundScore } = calculateRoundScore(mockOption, 10_000);
      return {
        round: i + 1,
        selectedOption: 0,
        timeRemainingMs: 10_000,
        majorScores: majorScores as Record<Major, number>,
        roundScore,
      };
    });

    const result = calculateGameResult(rounds, 80_000);
    const percentSum = Object.values(result.majorPercents).reduce((a, b) => a + b, 0);
    // 반올림으로 인해 ±1 허용
    expect(percentSum).toBeGreaterThanOrEqual(99);
    expect(percentSum).toBeLessThanOrEqual(101);
  });

  it('0점일 때 균등 배분 (25%)', () => {
    const rounds: RoundResult[] = [1, 2, 3, 4].map((round) => ({
      round,
      selectedOption: -1,
      timeRemainingMs: 0,
      majorScores: Object.fromEntries(MAJORS.map((m) => [m, 0])) as Record<Major, number>,
      roundScore: 0,
    }));

    const result = calculateGameResult(rounds, 80_000);
    for (const m of MAJORS) {
      expect(result.majorPercents[m]).toBe(25);
    }
  });
});

describe('getRecommendation', () => {
  it('하나의 학과가 명확히 높으면 해당 학과 반환', () => {
    const percents = {
      컴퓨터학부: 50,
      ICT융합학부: 20,
      인공지능학과: 15,
      수리데이터사이언스학과: 15,
    } as Record<Major, number>;

    expect(getRecommendation(percents)).toBe('컴퓨터학부');
  });

  it('상위 2개 차이 ≤ 5%이면 융합형', () => {
    const percents = {
      컴퓨터학부: 30,
      ICT융합학부: 28,
      인공지능학과: 22,
      수리데이터사이언스학과: 20,
    } as Record<Major, number>;

    const result = getRecommendation(percents);
    expect(result).toContain('융합형');
    expect(result).toContain('컴퓨터학부');
    expect(result).toContain('ICT융합학부');
  });

  it('전체 ±3% 이내이면 균형형', () => {
    const percents = {
      컴퓨터학부: 26,
      ICT융합학부: 25,
      인공지능학과: 25,
      수리데이터사이언스학과: 24,
    } as Record<Major, number>;

    expect(getRecommendation(percents)).toBe('균형형');
  });

  it('정확히 균등이면 균형형', () => {
    const percents = {
      컴퓨터학부: 25,
      ICT융합학부: 25,
      인공지능학과: 25,
      수리데이터사이언스학과: 25,
    } as Record<Major, number>;

    expect(getRecommendation(percents)).toBe('균형형');
  });
});
