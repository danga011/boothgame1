-- ============================================================
-- Migration 002: plays 테이블에 email 컬럼 추가
-- ============================================================

ALTER TABLE plays
  ADD COLUMN IF NOT EXISTS email TEXT;

-- 이메일 형식 검증 제약조건
ALTER TABLE plays
  ADD CONSTRAINT plays_email_format
  CHECK (email IS NULL OR email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$');
