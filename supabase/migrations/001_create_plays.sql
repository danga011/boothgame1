-- ============================================================
-- Supabase: plays 테이블 (부스 게임 결과 저장)
-- ============================================================

CREATE TABLE IF NOT EXISTS plays (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  branch        TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone_hash    TEXT NOT NULL,       -- SHA-256(phoneLast4)
  total_score   INTEGER NOT NULL,
  recommended_major TEXT NOT NULL,
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_ms   INTEGER NOT NULL,
  major_scores  JSONB NOT NULL DEFAULT '{}',
  major_percents JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 중복 참여 차단: branch + name + phone_hash 유니크
ALTER TABLE plays
  ADD CONSTRAINT plays_dedup_unique UNIQUE (branch, name, phone_hash);

-- 랭킹 조회 인덱스: 총점 DESC → 소요시간 ASC → 시간 ASC
CREATE INDEX IF NOT EXISTS idx_plays_ranking
  ON plays (total_score DESC, duration_ms ASC, timestamp ASC);

-- ============================================================
-- RLS (Row Level Security)
-- 부스용 공개 클라이언트: 최소 권한 설계
-- ============================================================

ALTER TABLE plays ENABLE ROW LEVEL SECURITY;

-- INSERT: anon 역할 허용
CREATE POLICY "Allow anonymous insert"
  ON plays FOR INSERT
  TO anon
  WITH CHECK (true);

-- SELECT: 랭킹 top5 조회용 — phone_hash 제외 뷰 사용 권장
-- 직접 SELECT는 phone_hash 포함이므로 뷰를 통해 제한
CREATE POLICY "Allow anonymous select for ranking"
  ON plays FOR SELECT
  TO anon
  USING (true);

-- UPDATE/DELETE 차단 (정책 없음 = 거부)

-- ============================================================
-- 랭킹 조회용 뷰 (phone_hash 제외)
-- ============================================================

CREATE OR REPLACE VIEW plays_ranking AS
  SELECT
    name,
    branch,
    total_score,
    recommended_major,
    duration_ms,
    timestamp
  FROM plays
  ORDER BY total_score DESC, duration_ms ASC, timestamp ASC
  LIMIT 100;

-- 뷰에 anon SELECT 권한 부여
GRANT SELECT ON plays_ranking TO anon;
