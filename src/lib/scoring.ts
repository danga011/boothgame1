import type { Major, AnswerOption, RoundResult, GameResult } from '../types';
import { MAJORS } from '../types';

/**
 * 한 라운드의 점수를 계산한다.
 * MBTI 방식: 속도 보너스 없이 가중치 기반 배분만 수행.
 * 라운드당 100점을 학과별 가중치 비율로 배분한다.
 */
export function calculateRoundScore(
  option: AnswerOption,
): { majorScores: Record<Major, number>; roundScore: number } {
  const totalRoundScore = 100;

  const majorScores = {} as Record<Major, number>;
  let allocated = 0;
  const entries = MAJORS.map((m) => [m, option.weights[m]] as const);

  for (let i = 0; i < entries.length; i++) {
    const [major, weight] = entries[i];
    if (i === entries.length - 1) {
      majorScores[major] = totalRoundScore - allocated;
    } else {
      const score = Math.round((totalRoundScore * weight) / 100);
      majorScores[major] = score;
      allocated += score;
    }
  }

  return { majorScores, roundScore: totalRoundScore };
}

/**
 * 시간 초과(또는 미응답) 시 라운드 점수 (0점)
 */
export function calculateTimeoutRoundScore(): {
  majorScores: Record<Major, number>;
  roundScore: number;
} {
  const majorScores = {} as Record<Major, number>;
  for (const m of MAJORS) majorScores[m] = 0;
  return { majorScores, roundScore: 0 };
}

/**
 * 전체 게임 결과를 계산한다.
 */
export function calculateGameResult(
  roundResults: RoundResult[],
  durationMs: number,
): GameResult {
  const majorScores = {} as Record<Major, number>;
  for (const m of MAJORS) majorScores[m] = 0;

  let totalScore = 0;
  for (const r of roundResults) {
    for (const m of MAJORS) {
      majorScores[m] += r.majorScores[m] || 0;
    }
    totalScore += r.roundScore;
  }

  const majorPercents = {} as Record<Major, number>;
  for (const m of MAJORS) {
    majorPercents[m] =
      totalScore > 0
        ? Math.round((majorScores[m] / totalScore) * 1000) / 10
        : 25;
  }

  const recommendedMajor = getRecommendation(majorPercents);

  return { totalScore, majorScores, majorPercents, recommendedMajor, durationMs };
}

/**
 * 추천 학과를 결정한다.
 * 1) 전체 ±3% 이내 → "균형형"
 * 2) 상위 2개 차이 ≤ 5% → "A+B 융합형"
 * 3) 최고 점수 학과
 */
export function getRecommendation(
  majorPercents: Record<Major, number>,
): string {
  const sorted = (Object.entries(majorPercents) as [Major, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  const max = sorted[0][1];
  const min = sorted[sorted.length - 1][1];

  if (max - min <= 6) return '균형형';
  if (sorted[0][1] - sorted[1][1] <= 5) {
    return `${sorted[0][0]}+${sorted[1][0]} 융합형`;
  }
  return sorted[0][0];
}
