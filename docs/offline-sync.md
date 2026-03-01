# 오프라인 / 동기화 테스트 절차

## 아키텍처 개요

```
[사용자 플레이]
      ↓
[submitResult()]
      ├─ 온라인 → Supabase INSERT → 성공 → 로컬 저장 (중복 차단용)
      │                            → 실패(중복) → "이미 참여" 안내
      │                            → 실패(기타) → 로컬 큐에 저장
      └─ 오프라인 → 로컬 저장 + 대기 큐에 저장
                          ↓
                   [online 이벤트 감지]
                          ↓
                   [flushPendingQueue()]
                          ↓
                   Supabase INSERT 재시도
                   → 성공 → 큐에서 제거
                   → 중복 → 큐에서 제거
                   → 실패 → 다음 시도까지 유지
```

## 저장소

| 저장소 | 용도 | 기술 |
|--------|------|------|
| IndexedDB `plays` | 로컬 중복 체크 | idb 라이브러리 |
| IndexedDB `pending` | 동기화 대기 큐 | idb 라이브러리 |
| Supabase `plays` | 서버 영구 저장 | Supabase JS SDK |

## 테스트 절차

### 테스트 1: 정상 온라인 플레이

1. `.env`에 Supabase 환경변수 설정
2. `npm run dev`로 실행
3. 게임 플레이 → 결과 확인
4. Supabase Dashboard에서 `plays` 테이블에 레코드 확인
5. 랭킹 페이지에서 Top 5 표시 확인

### 테스트 2: 중복 차단

1. 동일한 이름/계열/전화번호로 재시도
2. 온보딩 화면에서 "이미 참여 기록이 있습니다." 메시지 확인

### 테스트 3: 오프라인 플레이

1. Chrome DevTools → Network → Offline 활성화
2. 게임 플레이 (정상 진행 가능해야 함)
3. 결과 화면 표시 확인
4. DevTools → Application → IndexedDB → `cse-booth-game`
   - `plays` 스토어에 레코드 존재 확인
   - `pending` 스토어에 레코드 존재 확인
5. 랭킹 페이지: "오프라인 모드" 안내 표시

### 테스트 4: 온라인 복귀 시 자동 동기화

1. 테스트 3 이후 Network → Online 복귀
2. 콘솔에서 동기화 로그 확인
3. Supabase Dashboard에서 레코드 추가 확인
4. IndexedDB `pending` 스토어가 비어있는지 확인

### 테스트 5: 오프라인 중복 차단

1. Offline 모드 활성화
2. 게임 플레이 완료
3. 동일한 이름/계열/전화번호로 재시도
4. "이미 참여 기록이 있습니다." 메시지 확인 (로컬 DB 기반)

### 테스트 6: 동기화 중 중복 처리

1. Offline에서 플레이 (레코드 A 생성)
2. Online 복귀 → 동기화 시도
3. 만약 서버에 이미 같은 키가 있으면:
   - unique constraint 에러 (23505) 발생
   - 큐에서 제거 (이미 서버에 존재하므로)
   - 에러 없이 정상 처리

## 디버깅 팁

### IndexedDB 확인
- Chrome: DevTools → Application → IndexedDB → `cse-booth-game`
- `plays`: 로컬 플레이 기록
- `pending`: 동기화 대기 큐

### 콘솔 로그
- `Supabase insert failed, queuing:` — INSERT 실패 시 큐에 저장됨
- `Sync failed for` — 동기화 재시도 실패
- `Sync error for` — 네트워크 에러

### 수동 동기화 트리거
```js
// 브라우저 콘솔에서
window.dispatchEvent(new Event('online'));
```
