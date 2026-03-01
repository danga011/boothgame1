# Supabase 설정 가이드

## 1. 프로젝트 생성

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 URL과 anon key를 메모

## 2. 환경변수 설정

```bash
# .env (로컬 개발용)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Vercel 배포 시에도 동일한 환경변수를 설정합니다.

## 3. 테이블 생성

Supabase SQL Editor에서 `supabase/migrations/001_create_plays.sql` 실행:

```sql
-- 전체 내용을 SQL Editor에 붙여넣고 실행
```

### 생성되는 항목

| 항목 | 설명 |
|------|------|
| `plays` 테이블 | 게임 결과 저장 |
| `plays_dedup_unique` 제약조건 | (branch, name, phone_hash) 중복 차단 |
| `idx_plays_ranking` 인덱스 | 랭킹 조회 최적화 |
| RLS 정책 | INSERT/SELECT만 허용, UPDATE/DELETE 차단 |
| `plays_ranking` 뷰 | phone_hash 제외 랭킹 조회 |

## 4. RLS 정책 설명

| 정책 | 역할 | 동작 |
|------|------|------|
| Allow anonymous insert | anon | INSERT 허용 |
| Allow anonymous select for ranking | anon | SELECT 허용 |
| (없음) | anon | UPDATE/DELETE 차단 |

**phone_hash 보호**: `plays_ranking` 뷰를 통해 조회하면 phone_hash가 포함되지 않습니다.

## 5. 보안 고려사항

- anon key는 클라이언트에 노출됩니다 (부스 환경 특성)
- RLS로 INSERT/SELECT만 허용하여 위험을 최소화합니다
- phone_hash는 SHA-256 단방향 해시이므로 원본 복구 불가능합니다
- 필요 시 `plays_ranking` 뷰만 SELECT 허용하고 테이블 직접 조회를 차단할 수 있습니다

## 6. 확인 체크리스트

- [ ] `plays` 테이블 생성 완료
- [ ] RLS 활성화 확인 (테이블 → Authentication → RLS enabled)
- [ ] unique constraint 확인 (`plays_dedup_unique`)
- [ ] 인덱스 확인 (`idx_plays_ranking`)
- [ ] `.env`에 URL과 anon key 설정
- [ ] Vercel 환경변수 설정
