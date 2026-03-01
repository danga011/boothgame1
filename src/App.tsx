import { useState, useEffect, useCallback } from 'react';
import type { AppStep, Branch, PlayerInfo, RoundResult, GameResult, PlayRecord } from './types';
import { calculateGameResult } from './lib/scoring';
import { submitResult, startOnlineSync } from './features/sync/syncManager';
import StartPage from './features/start/StartPage';
import OnboardingPage from './features/onboarding/OnboardingPage';
import GamePage from './features/game/GamePage';
import ResultsPage from './features/results/ResultsPage';
import RankingPage from './features/ranking/RankingPage';

export default function App() {
  const [step, setStep] = useState<AppStep>('idle');
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // 온라인 동기화 시작
  useEffect(() => {
    const cleanup = startOnlineSync();
    return cleanup;
  }, []);

  // 뒤로가기 방지
  useEffect(() => {
    const pushState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    pushState();
    const handler = () => pushState();
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const reset = useCallback(() => {
    setStep('idle');
    setPlayerInfo(null);
    setGameResult(null);
  }, []);

  const handleStart = () => setStep('onboarding');

  const handleOnboarding = (branch: Branch, name: string, phoneHash: string) => {
    setPlayerInfo({ branch, name, phoneHash });
    setStep('game');
  };

  const handleGameComplete = async (results: RoundResult[], durationMs: number) => {
    const result = calculateGameResult(results, durationMs);
    setGameResult(result);

    if (playerInfo) {
      const record: PlayRecord = {
        branch: playerInfo.branch,
        name: playerInfo.name,
        phone_hash: playerInfo.phoneHash,
        total_score: result.totalScore,
        recommended_major: result.recommendedMajor,
        timestamp: new Date().toISOString(),
        duration_ms: result.durationMs,
        major_scores: result.majorScores,
        major_percents: result.majorPercents,
      };

      const status = await submitResult(record);
      if (status === 'duplicate') {
        console.warn('Duplicate detected after game — record was already saved');
      }
    }

    setStep('results');
  };

  const handleResultsNext = () => setStep('ranking');
  const handleFinish = () => reset();

  switch (step) {
    case 'idle':
      return <StartPage onStart={handleStart} />;

    case 'onboarding':
      return <OnboardingPage onSubmit={handleOnboarding} onBack={reset} />;

    case 'game':
      return <GamePage onComplete={handleGameComplete} />;

    case 'results':
      return gameResult
        ? <ResultsPage result={gameResult} onNext={handleResultsNext} />
        : null;

    case 'ranking':
      return (
        <RankingPage
          currentPlayer={
            playerInfo && gameResult
              ? { name: playerInfo.name, branch: playerInfo.branch, totalScore: gameResult.totalScore }
              : undefined
          }
          onFinish={handleFinish}
        />
      );

    default:
      return null;
  }
}
