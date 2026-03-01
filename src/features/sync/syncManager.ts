import { supabase } from '../../lib/supabase';
import {
  addToPendingQueue,
  getPendingRecords,
  removePendingRecord,
  savePlayLocally,
  checkLocalDuplicate,
} from '../../lib/storage';
import type { PlayRecord, PendingRecord } from '../../types';

/**
 * 결과를 저장한다.
 * 온라인 → Supabase 직접 저장
 * 오프라인 → 로컬 큐에 저장, 온라인 복귀 시 자동 동기화
 *
 * @returns 'ok' | 'duplicate' | 'queued'
 */
export async function submitResult(
  record: PlayRecord,
): Promise<'ok' | 'duplicate' | 'queued'> {
  const pendingRecord: PendingRecord = {
    ...record,
    id: `${record.branch}_${record.name}_${record.phone_hash}_${Date.now()}`,
    synced: false,
  };

  // 로컬 중복 확인
  const localDup = await checkLocalDuplicate(
    record.branch,
    record.name,
    record.phone_hash,
  );
  if (localDup) return 'duplicate';

  if (navigator.onLine && supabase) {
    // 온라인: Supabase에 직접 삽입 시도
    const { error } = await supabase.from('plays').insert({
      branch: record.branch,
      name: record.name,
      phone_hash: record.phone_hash,
      total_score: record.total_score,
      recommended_major: record.recommended_major,
      timestamp: record.timestamp,
      duration_ms: record.duration_ms,
      major_scores: record.major_scores,
      major_percents: record.major_percents,
    });

    if (error) {
      // unique constraint violation → 중복
      if (error.code === '23505') return 'duplicate';
      // 기타 에러 → 오프라인 큐에 저장
      console.warn('Supabase insert failed, queuing:', error.message);
      await savePlayLocally(pendingRecord);
      await addToPendingQueue(pendingRecord);
      return 'queued';
    }

    // 성공 → 로컬에도 저장 (오프라인 중복 차단용)
    await savePlayLocally(pendingRecord);
    return 'ok';
  }

  // 오프라인: 로컬에 저장 + 대기 큐에 추가
  await savePlayLocally(pendingRecord);
  await addToPendingQueue(pendingRecord);
  return 'queued';
}

/**
 * 대기 큐의 레코드를 Supabase에 동기화한다.
 * 온라인 복귀 시 호출된다.
 */
export async function flushPendingQueue(): Promise<void> {
  if (!supabase) return;

  const pending = await getPendingRecords();
  for (const record of pending) {
    try {
      const { error } = await supabase.from('plays').insert({
        branch: record.branch,
        name: record.name,
        phone_hash: record.phone_hash,
        total_score: record.total_score,
        recommended_major: record.recommended_major,
        timestamp: record.timestamp,
        duration_ms: record.duration_ms,
        major_scores: record.major_scores,
        major_percents: record.major_percents,
      });

      if (error) {
        // 중복이면 큐에서 제거 (이미 서버에 존재)
        if (error.code === '23505') {
          await removePendingRecord(record.id);
          continue;
        }
        // 기타 에러 → 다음 시도에서 재시도
        console.warn('Sync failed for', record.id, error.message);
        continue;
      }

      await removePendingRecord(record.id);
    } catch {
      console.warn('Sync error for', record.id);
    }
  }
}

/** 온라인 이벤트 리스너 등록 */
export function startOnlineSync(): () => void {
  const handler = () => {
    flushPendingQueue().catch(console.warn);
  };

  window.addEventListener('online', handler);

  // 초기 실행 (이미 온라인인 경우)
  if (navigator.onLine) {
    flushPendingQueue().catch(console.warn);
  }

  return () => window.removeEventListener('online', handler);
}
