import { openDB, type IDBPDatabase } from 'idb';
import type { PendingRecord } from '../types';

const DB_NAME = 'cse-booth-game';
const DB_VERSION = 1;
const STORE_PLAYS = 'plays';
const STORE_PENDING = 'pending';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_PLAYS)) {
          const store = db.createObjectStore(STORE_PLAYS, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('dedup', ['branch', 'name', 'phone_hash'], {
            unique: true,
          });
        }
        if (!db.objectStoreNames.contains(STORE_PENDING)) {
          db.createObjectStore(STORE_PENDING, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

/** 로컬 DB에 플레이 기록 저장 (오프라인 중복 차단용) */
export async function savePlayLocally(record: PendingRecord): Promise<void> {
  const db = await getDB();
  await db.put(STORE_PLAYS, record);
}

/** 로컬 DB에서 중복 여부 확인 */
export async function checkLocalDuplicate(
  branch: string,
  name: string,
  phoneHash: string,
): Promise<boolean> {
  const db = await getDB();
  const result = await db.getFromIndex(STORE_PLAYS, 'dedup', [
    branch,
    name,
    phoneHash,
  ]);
  return !!result;
}

/** 동기화 대기 큐에 추가 */
export async function addToPendingQueue(
  record: PendingRecord,
): Promise<void> {
  const db = await getDB();
  await db.put(STORE_PENDING, record);
}

/** 동기화 대기 큐의 모든 레코드 조회 */
export async function getPendingRecords(): Promise<PendingRecord[]> {
  const db = await getDB();
  return db.getAll(STORE_PENDING);
}

/** 동기화 완료된 레코드 제거 */
export async function removePendingRecord(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_PENDING, id);
}
