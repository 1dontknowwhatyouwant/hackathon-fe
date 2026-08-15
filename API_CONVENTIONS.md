# 입을래? 프론트–백엔드 API 명세서 검토 반영본 v0.3

> 기준일: 2026-08-13
> 목적: 프론트엔드 연동 계약 정리, Springdoc OpenAPI/Swagger 구현 기준, 최신 팀 회의 결정의 단일 문서화
> 상태: **API v0.2 + 2026-08-13 팀 회의 확정사항 + 현재 `feat/database-schema` Flyway V1~V9 + API_CONVENTIONS 정합성 반영본**
> 원칙: 이 문서에서 **확정**으로 표시한 정책은 구현 기준으로 사용한다. DB 정리처럼 후속 검토가 명시된 항목은 기존 Migration을 수정하지 않고 별도 후속 Migration으로 처리한다.

---

# 0. 기준 문서·우선순위

이 문서는 다음 자료를 종합한다.

1. 2026-08-13 최신 팀 회의 결정
2. `Hackathon_BE/API_CONVENTIONS.md`
3. `login-auth-handoff-final-review-v5.md`
4. `image-ai-external-services-handoff-final-review-v6.md`
5. `erd-domain-handoff-final-review-v6.md`
6. 기존 `입을래_API_명세서_검토반영_v0.2.md`
7. 현재 `feat/database-schema`의 Flyway V1~V9

충돌 시 우선순위:

```text
최신 팀 명시적 합의
→ API_CONVENTIONS의 공통 계약
→ 최신 FINAL-REVIEW 정책
→ 현재 적용된 DB 구조
→ API v0.2
→ 이전 초안
```

DB가 최신 제품 정책보다 우선하지 않는다. 다만 이미 적용된 Flyway Versioned Migration을 과거 시점에서 수정하지 않는다.

```text
정책 변경
→ 현재 DB 영향 확인
→ 필요하면 새 Migration
```

---

## 0.1 v0.3 핵심 변경 요약

### ProductTag

- 최종 ProductTag 19개 확정.
- FEATURE는 `COMPACT`, `SPACIOUS`, `MULTIWAY`만 사용.
- `LIGHTWEIGHT`, `LOGO`, `STATEMENT` 제외.
- DB의 `product_tags.display_name` 제거 완료.
- 화면 표시 한글/다국어 문구는 프론트가 `code → label`로 관리.
- 기존 “V9 태그 기준 데이터” 계획은 변경됨.
  - V9: `display_name` 컬럼 제거
  - V10: ProductTag 19개 기준 데이터 삽입 예정

### 기능 범위

v0.2에서 API 범위 밖이었던 다음 기능을 MVP 범위에 다시 포함한다.

- 착용/사용 기록
- 활용도 분석
- 장기 미사용 제품 안내
- 다시 활용할 제품 추천
- 제품 패스포트
- 관리 가이드/관리 일정

다음은 제외한다.

- 관리 기록(Care Record) 사용자 기능
- 제품 상태 표시
- 중고 판매/리셀
- 장기 미사용 아이템 재활용 **AI**
- 독립 MCM 상품 추천 AI
- 장소 추천 AI

### 추천·분석

독립 MCM 상품 추천은 `RULE_BASED`.

```text
STYLE       최대 30
OCCASION    최대 25
SEASON      최대 25
FEATURE     최대 20
총          최대 100
```

FEATURE 부분 일치:

```text
FEATURE 점수
= 20 × (일치 FEATURE 개수 / 사용자가 선택한 FEATURE 개수)
```

구매 전 활용 가능성은 **AI를 사용하지 않고 Backend Rule-Based로만 계산**한다.

```text
취향 태그 일치                 최대 30
내 아이템과 스타일 조합 가능     최대 25
계절 활용성                    최대 25
현재 보유 카테고리와의 조합       최대 20
총                            최대 100
```

### 장소

```text
FE 위치 + OCCASION
→ BE
→ Kakao Local
→ places Upsert
→ 서버 Rule-Based
→ FE
→ OpenFreeMap 3D 지도
```

추천 점수:

```text
카테고리 적합도 최대 60
거리 적합도      최대 40
총               최대 100
```

Kakao는 지도 렌더링이 아니라 장소 데이터 공급자로 사용한다.

### 회원 탈퇴

- LOCAL: 비밀번호 재인증
- NAVER/KAKAO: Provider 재로그인 + OAuth state 검증 + Provider 사용자 ID 일치 확인
- 성공 시 `ACCOUNT_DELETE` 용도의 1회용 `reauthToken`
- 유효시간 5분
- 1회 사용 후 재사용 금지
- 탈퇴 API는 유효한 재인증 증명이 있어야 실행

### AI Job

- `PENDING → PROCESSING → SUCCEEDED | FAILED`
- AI 처리 실패 Job 조회는 `HTTP 200 + status=FAILED`
- `error`와 선택적 `fallback` 제공
- 실제 서버 장애는 별도의 5xx
- FE Polling: 2초 간격, 네트워크 응답 시간을 포함해 최대 30초
- `DORMANT_ITEM_REUSE`는 MVP AI Job Type에서 사용하지 않는다.

### 명칭

사용자 화면 명칭:

```text
스타일 플랜
→ 스마트 착용 추천
```

DB/코드 호환성을 위해 이번 v0.3에서는 기술 리소스 이름을 유지한다.

```text
DB: style_plans
API: /style-plans
AiJobType: STYLE_PLAN
```

즉 화면 문구만 “스마트 착용 추천”을 사용하고, 기존 V8 Migration을 이름 변경 목적으로 다시 만들지 않는다.

---

## 0.2 v0.3에서 제외하는 기능

- 관리 기록 생성·조회·수정·삭제 API
- 중고 판매·판매 글·소유권 이전
- 장바구니·결제·재고·배송
- 정품 인증
- 비회원 체험
- 자동 날씨 조회
- 실제 이메일 알림 발송
- AI 기반 장기 미사용 아이템 재활용 추천
- 독립 MCM 상품 추천용 AI Job
- 장소 추천용 AI Job
- 얼굴·신체 이미지 분석
- 동영상
- 다른 브랜드를 추천 후보로 사용하는 기능

---

# 1. 공통 API 계약

## 1.1 Base URL

```text
로컬: http://localhost:8080/api
운영: https://{frontend-domain}/api
```

운영:

```text
Browser
→ Vercel /api/**
→ Railway Backend
```

프론트 Axios:

```ts
api.get("/products");       // O
api.get("/api/products");   // X
```

---

## 1.2 인증

| 토큰 | 형식 | 저장 위치 | 전송 | 수명 |
|---|---|---|---|---|
| Access Token | JWT | 프론트 메모리 | `Authorization: Bearer` | 30분 |
| Refresh Token | 난수 Token | HttpOnly Cookie | Cookie | 14일 |

Access Token은 `localStorage`, `sessionStorage`에 저장하지 않는다.

보호 API:

```http
Authorization: Bearer {accessToken}
```

사용자 ID는 요청 Body/Query의 `userId`를 신뢰하지 않고 JWT `sub`에서 얻는다.

---

## 1.3 Refresh Cookie

운영 기본값:

```text
Name: refresh_token
HttpOnly: true
Secure: true
SameSite: Lax
Path: /api/auth
Max-Age: 1209600
Domain: 지정하지 않음
```

로컬 cross-origin Cookie 요청:

```text
FE: credentials/include 또는 Axios withCredentials=true
BE: allowCredentials(true)
Access-Control-Allow-Origin: 정확한 Origin
Wildcard 금지
```

CORS 허용 Origin과 인증 POST 신뢰 Origin 검증은 별개다.

---

## 1.4 이름·자료형

| 대상 | 규칙 |
|---|---|
| Endpoint | 소문자 `kebab-case` |
| JSON/Query/Path | `lowerCamelCase` |
| DB | `snake_case` |
| Enum | 대문자 `SNAKE_CASE` |
| API ID | JSON String |
| 금액 | KRW 원 단위 정수 |
| 점수 | JSON Number, 0~100 |
| 시각 | UTC ISO 8601 |
| 날짜 | `YYYY-MM-DD` |
| 위도/경도 | Decimal |

DB에서 `BIGINT`여도 API ID는 문자열로 전달한다.

---

## 1.5 성공 응답

```json
{
  "success": true,
  "data": {}
}
```

- 생성: `201`
- 조회/수정: `200`
- 비동기 접수: `202`
- Body 없는 삭제/해제: `204`

`204`에는 Body를 넣지 않는다.

---

## 1.6 오류 응답

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "제품을 찾을 수 없습니다."
  }
}
```

Validation에서만:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값을 확인해 주세요.",
    "fields": [
      {
        "field": "size",
        "reason": "size는 1 이상 100 이하여야 합니다."
      }
    ]
  }
}
```

---

## 1.7 정상 빈 결과

```text
목록 없음          → 200 + []
페이지 결과 없음    → 200 + items:[]
선택 단일 값 없음   → null
특정 ID 리소스 없음 → 404
```

정상적인 추천 없음·활용 데이터 부족·장소 없음은 서버 장애가 아니다.

---

## 1.8 페이지네이션

```text
page 기본 0
size 기본 20
size 허용 1~100
sort=field,direction
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 0,
    "size": 20,
    "totalElements": 0,
    "totalPages": 0,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

---

## 1.9 HTTP 상태 코드

| HTTP | 의미 |
|---:|---|
| 200 | 조회·수정·정상 빈 결과·AI FAILED Job 조회 |
| 201 | 리소스 생성 |
| 202 | AI Job 접수·회원 탈퇴 처리 접수 |
| 204 | Body 없는 삭제·해제 |
| 400 | 형식·Validation·도메인 입력 오류 |
| 401 | 인증 실패·토큰 실패 |
| 403 | 계정 상태·Origin·권한 오류 |
| 404 | 특정 리소스 없음 |
| 409 | 중복·멱등성·버전·상태 충돌 |
| 429 | 호출 제한 |
| 500 | 처리되지 않은 서버 내부 오류 |
| 502 | 외부 Provider 장애 |
| 504 | 외부 Provider Timeout |

---

# 2. v0.3 전체 Endpoint 목록

> `인증`이 `Access`인 Endpoint는 Bearer Access Token이 필요하다.

| 영역 | Method | Path | 인증 | v0.3 |
|---|---|---|---|---|
| 상태 | GET | `/api/health` | 공개 | 유지 |
| 이메일 인증 | POST | `/api/auth/email-verifications` | 공개 | 유지 |
| 이메일 인증 | POST | `/api/auth/email-verifications/confirm` | 공개 | 유지 |
| 로그인 ID | GET | `/api/auth/login-ids/{loginId}/availability` | 공개 | 유지 |
| 회원가입 | POST | `/api/auth/signup` | 공개 | 유지 |
| 로그인 | POST | `/api/auth/login` | 공개 | 유지 |
| OAuth | GET | `/api/auth/oauth/{provider}` | 공개 | 유지 |
| OAuth | GET | `/api/auth/oauth/{provider}/callback` | 공개 | 유지 |
| OAuth 가입 | POST | `/api/auth/oauth/signup` | Onboarding Cookie | 유지 |
| 토큰 갱신 | POST | `/api/auth/refresh` | Refresh Cookie | 유지 |
| 로그아웃 | POST | `/api/auth/logout` | Access + Refresh | 유지 |
| 탈퇴 재인증 LOCAL | POST | `/api/auth/reauth/password` | Access | 신규 |
| 탈퇴 재인증 SOCIAL 시작 | POST | `/api/auth/reauth/oauth/{provider}/start` | Access | Authorization URL 반환 |
| 탈퇴 재인증 SOCIAL | GET | `/api/auth/reauth/oauth/{provider}/callback` | OAuth state | 신규 |
| 사용자 | GET | `/api/users/me` | Access | 유지 |
| 사용자 | PATCH | `/api/users/me` | Access | 유지 |
| 회원 탈퇴 | DELETE | `/api/users/me` | Access + reauth | 확정 |
| 취향 | GET | `/api/preferences/me` | Access | 유지 |
| 취향 | PUT | `/api/preferences/me` | Access | 유지 |
| 제품 | GET | `/api/products` | Access | 유지 |
| 제품 | GET | `/api/products/{productId}` | Access | 유지 |
| MCM 추천 | POST | `/api/recommendations` | Access | Rule-Based 확정 |
| MCM 추천 | GET | `/api/recommendations/{recommendationId}` | Access | 유지 |
| 찜 | GET | `/api/products/favorites` | Access | v0.3 정규화 |
| 찜 | PUT | `/api/products/{productId}/favorite` | Access | v0.3 정규화 |
| 찜 | DELETE | `/api/products/{productId}/favorite` | Access | v0.3 정규화 |
| 마이 아이템 | GET | `/api/my-items` | Access | 유지 |
| 마이 아이템 | GET | `/api/my-items/{myItemId}` | Access | 유지 |
| 마이 아이템 | POST | `/api/my-items` | Access | 유지 |
| 마이 아이템 | PATCH | `/api/my-items/{myItemId}` | Access | 상태 필드 제외 예정 |
| 마이 아이템 | DELETE | `/api/my-items/{myItemId}` | Access | 유지 |
| 제품 패스포트 | GET | `/api/my-items/{myItemId}/passport` | Access | 신규 범위 |
| 활용도 | GET | `/api/my-items/{myItemId}/utilization` | Access | 신규 범위 |
| 착용/사용 기록 | POST | `/api/usage-records` | Access | 신규 범위 |
| 착용/사용 기록 | GET | `/api/usage-records` | Access | 신규 범위 |
| 착용/사용 기록 | GET | `/api/usage-records/{usageRecordId}` | Access | 신규 범위 |
| 착용/사용 기록 | PATCH | `/api/usage-records/{usageRecordId}` | Access | 신규 범위 |
| 착용/사용 기록 | DELETE | `/api/usage-records/{usageRecordId}` | Access | 신규 범위 |
| 아이템별 기록 | GET | `/api/my-items/{myItemId}/usage-records` | Access | 신규 범위 |
| 재활용 추천 | GET | `/api/reuse-recommendations` | Access | Rule-Based |
| 관리 가이드 | GET | `/api/my-items/{myItemId}/care-guide` | Access | 신규 범위 |
| 이미지 | POST | `/api/image-uploads/signature` | Access | 유지 |
| 이미지 | POST | `/api/image-uploads/complete` | Access | 유지 |
| 이미지 | DELETE | `/api/images/{imageId}` | Access | 유지 |
| AI Job | POST | `/api/ai-jobs` | Access | 유지 |
| AI Job | GET | `/api/ai-jobs/{jobId}` | Access | FAILED 계약 변경 |
| 구매 활용성 | POST | `/api/purchase-utility-analyses` | Access | Rule-Based 직접 분석 |
| 구매 활용성 | GET | `/api/purchase-utility-analyses/{analysisId}` | Access | 결과 재조회 |
| 스마트 착용 추천 저장 | POST | `/api/style-plans` | Access | 기술 경로 유지 |
| 스마트 착용 추천 목록 | GET | `/api/style-plans` | Access | 기술 경로 유지 |
| 스마트 착용 추천 상세 | GET | `/api/style-plans/{stylePlanId}` | Access | 기술 경로 유지 |
| 스마트 착용 추천 수정 | PATCH | `/api/style-plans/{stylePlanId}` | Access | 기술 경로 유지 |
| 스마트 착용 추천 삭제 | DELETE | `/api/style-plans/{stylePlanId}` | Access | 기술 경로 유지 |
| 장소 검색 | GET | `/api/places` | Access | Kakao |
| 장소 추천 | POST | `/api/style-plans/{stylePlanId}/place-recommendations` | Access | Rule-Based |
| 저장 장소 | GET | `/api/places/saved` | Access | v0.3 정규화 |
| 장소 저장 | PUT | `/api/places/{placeId}/saved` | Access | v0.3 정규화 |
| 장소 해제 | DELETE | `/api/places/{placeId}/saved` | Access | v0.3 정규화 |
| 홈 | GET | `/api/home` | Access | 조회 전용 |

### Endpoint 정규화 메모

v0.2에서 P0였던 `/favorites`, `/saved-places`는 v0.3에서 `API_CONVENTIONS.md`의 “대상 리소스 + 원하는 최종 상태” 규칙과 v0.1 구조에 맞춰 다음으로 통일한다.

```text
GET    /api/products/favorites
PUT    /api/products/{productId}/favorite
DELETE /api/products/{productId}/favorite

GET    /api/places/saved
PUT    /api/places/{placeId}/saved
DELETE /api/places/{placeId}/saved
```

같은 PUT/DELETE를 반복해도 최종 상태가 달라지지 않는 멱등 동작으로 구현한다.

---

# 3. 인증·회원 탈퇴 재인증

기존 로그인·회원가입·OAuth·Refresh 계약은 v0.2를 유지한다.

## 3.1 LOCAL 회원 탈퇴 재인증

```http
POST /api/auth/reauth/password
Authorization: Bearer {accessToken}
```

Request:

```json
{
  "password": "current-password"
}
```

정책:

```text
현재 Access 사용자 확인
→ LocalCredential 존재 확인
→ 비밀번호 검증
→ 성공
→ purpose=ACCOUNT_DELETE 재인증 증명 발급
→ 5분 유효
→ 1회 사용
```

v0.3 보안 구현 계약:

- 원문 reauth Token은 DB에 장기 저장하지 않는다.
- URL Query/Fragment에 넣지 않는다.
- 민감 값은 로그에 남기지 않는다.
- 재사용은 거부한다.
- 다른 사용자에게 사용할 수 없다.
- `purpose=ACCOUNT_DELETE` 외 용도로 사용할 수 없다.

Response 예시:

```json
{
  "success": true,
  "data": {
    "reauthenticated": true,
    "expiresInSeconds": 300
  }
}
```

> 회의는 “5분·1회용 reauthToken”의 의미를 확정했다. 실제 브라우저 전달 세부는 v0.3에서 URL 노출을 피하기 위해 HttpOnly 단기 Cookie 방식 사용을 권장한다. 구현 시 `reauth_token` Cookie를 사용하면 LOCAL과 SOCIAL 흐름을 동일하게 만들 수 있다.

---

## 3.2 SOCIAL 회원 탈퇴 재인증

지원:

```text
NAVER
KAKAO
```

시작:

```http
POST /api/auth/reauth/oauth/{provider}/start
Authorization: Bearer {accessToken}
```

Request:

```json
{
  "returnTo": "https://frontend.example.com/auth/reauth/account-deletion/callback"
}
```

Response는 Provider의 `authorizationUrl`을 반환한다. 프런트는 Bearer 인증이 필요한 시작 요청을 Axios로 먼저 호출한 뒤 반환된 URL로 이동한다.

처리:

```text
현재 로그인 사용자
→ OAuth 재로그인 시작
→ reauth 전용 state 발급
→ Provider
→ callback
→ state 검증
→ provider 사용자 ID 획득
→ 현재 SocialAccount(provider, providerUserId)와 비교
→ 일치 시 ACCOUNT_DELETE 재인증 증명 발급
```

Callback:

```http
GET /api/auth/reauth/oauth/{provider}/callback
```

금지:

- Provider 이메일만으로 동일인 판단
- Provider 사용자 ID 불일치 상태에서 토큰 발급
- 재인증 Token을 URL Query/Fragment에 노출

---

## 3.3 회원 탈퇴

```http
DELETE /api/users/me
Authorization: Bearer {accessToken}
Cookie: reauth_token=...
```

조건:

- Access 사용자와 reauth 사용자 동일
- `purpose=ACCOUNT_DELETE`
- 미사용 Token
- 발급 후 5분 이내

성공:

```http
202 Accepted
```

```json
{
  "success": true,
  "data": {
    "status": "DELETION_PENDING"
  }
}
```

기존 탈퇴 정책을 유지한다.

```text
DELETION_PENDING
→ 이후 인증/토큰 차단
→ Refresh Token 폐기
→ 사용자 데이터 정리
→ 24시간 이내 익명화
→ DELETED + deletedAt
```

회의에서 재인증 방식만 변경·확정했으며, 기존 “24시간 이내 익명화” 정책을 폐기하지 않았으므로 v0.3에서도 유지한다.

---

# 4. 사용자·취향 API

## 4.1 내 정보

```http
GET /api/users/me
PATCH /api/users/me
```

기존 계약 유지.

---

## 4.2 내 취향 조회

```http
GET /api/preferences/me
```

현재 V4 DB에 영속되는 필드는:

```text
preferredColors
preferredCategories
preferredStyleTags
summary
confidence
analysisVersion
aiJobId
analyzedAt
version
```

응답 예시:

```json
{
  "success": true,
  "data": {
    "completed": true,
    "preferredColors": ["BLACK", "BEIGE"],
    "preferredCategories": ["BAG", "CLOTHING"],
    "preferredStyleTags": ["CASUAL", "NEAT"],
    "summary": "차분하고 깔끔한 스타일을 선호해요.",
    "confidence": 0.84,
    "analysisVersion": "preference-v1",
    "analyzedAt": "2026-08-13T06:00:00Z",
    "version": 2
  }
}
```

아직 프로필이 없다면 404 대신 정상 미완료 상태를 반환한다.

---

## 4.3 내 취향 저장·수정

```http
PUT /api/preferences/me
```

Request:

```json
{
  "preferredColors": ["BLACK", "BEIGE"],
  "preferredCategories": ["BAG", "CLOTHING"],
  "preferredStyleTags": ["CASUAL", "NEAT"],
  "aiJobId": "9001",
  "version": 2
}
```

`preferredStyleTags`에는 최종 STYLE 코드만 사용한다.

```text
CASUAL
FORMAL
NEAT
GLAMOROUS
```

### 추천 점수용 OCCASION/SEASON/FEATURE 입력 위치

현재 V4에는 `preferredOccasionTags`, `preferredSeasonTags`, `preferredFeatureTags` 컬럼이 없다.

따라서 v0.3에서는 DB 구조를 억지로 해석하지 않고 다음처럼 분리한다.

```text
지속 취향 STYLE
→ PreferenceProfile.preferredStyleTags

추천 시점 조건 OCCASION/SEASON/FEATURE
→ POST /api/recommendations Request
```

추후 OCCASION/SEASON/FEATURE도 장기 취향으로 영속화하기로 팀이 결정하면 기존 V4를 고치는 대신 후속 Migration을 추가한다.

---

# 5. ProductTag·제품 API

## 5.1 최종 ProductTag

### ProductTagType

```text
STYLE
SEASON
OCCASION
FEATURE
```

### STYLE

```text
CASUAL
FORMAL
NEAT
GLAMOROUS
```

### SEASON

```text
SPRING
SUMMER
AUTUMN
WINTER
ALL_SEASON
```

### OCCASION

```text
DAILY
DATE
TRAVEL
GATHERING
CEREMONY
OUTDOOR
OTHER
```

### FEATURE

```text
COMPACT
SPACIOUS
MULTIWAY
```

제외:

```text
LIGHTWEIGHT
LOGO
STATEMENT
VERSATILE
WORK
```

`WORK`는 필요한 경우 `DAILY` 또는 `OTHER` 문맥으로 처리한다.

---

## 5.2 ProductTag 표시명

DB:

```text
id
type
code
```

`display_name` 없음.

API도 ProductTag의 localized label을 Source of Truth로 제공하지 않는다.

프론트:

```ts
CASUAL -> "캐주얼"
DATE -> "데이트"
COMPACT -> "컴팩트"
```

처럼 화면 표시명을 자체 관리한다.

---

## 5.3 제품 목록

```http
GET /api/products
```

예:

```http
GET /api/products?keyword=쇼퍼&category=BAG&color=BROWN&minPrice=500000&maxPrice=2000000&page=0&size=20&sort=price,asc
```

기존 필터·페이지 계약 유지.

---

## 5.4 제품 상세

```http
GET /api/products/{productId}
```

Response 예시:

```json
{
  "success": true,
  "data": {
    "productId": "101",
    "brand": "MCM",
    "sku": "MCM-AREN-001",
    "name": "Aren Shopper",
    "category": "BAG",
    "description": "MCM 샘플 제품 설명",
    "price": 1450000,
    "primaryColor": "BROWN",
    "material": "LEATHER",
    "productUrl": "https://www.mcmworldwide.com/...",
    "images": [
      {
        "url": "https://example.com/product.webp",
        "altText": "Aren Shopper 정면",
        "sortOrder": 0,
        "primary": true
      }
    ],
    "tags": {
      "style": ["CASUAL", "NEAT"],
      "season": ["ALL_SEASON"],
      "occasion": ["DAILY", "DATE"],
      "feature": ["COMPACT"]
    },
    "favorited": false,
    "isSample": true
  }
}
```

서로 다른 ProductTagType을 하나의 배열에 섞지 않는다.

---

# 6. MCM Rule-Based 추천 API

## 6.1 생성

```http
POST /api/recommendations
Authorization: Bearer {accessToken}
```

독립 MCM 추천에는 OpenAI를 호출하지 않는다.

Request:

```json
{
  "occasion": "DATE",
  "season": "AUTUMN",
  "preferredFeatures": ["COMPACT", "MULTIWAY"],
  "category": "BAG",
  "limit": 3
}
```

| 필드 | 필수 | 규칙 |
|---|---:|---|
| `occasion` | O | 최종 OCCASION 7개 |
| `season` | O | `SPRING/SUMMER/AUTUMN/WINTER` |
| `preferredFeatures` | O | 1~3개, 중복 금지 |
| `category` | X | 제품 카테고리 제한 |
| `limit` | X | 기본 3, 1~3 |

`ALL_SEASON`은 상품 태그 값이며 추천 요청의 현재 계절 값으로 사용하지 않는다.

---

## 6.2 추천 점수

총점:

```text
STYLE       30
OCCASION    25
SEASON      25
FEATURE     20
TOTAL      100
```

### STYLE

Source:

```text
PreferenceProfile.preferredStyleTags
vs
Product STYLE tags
```

v0.3 계산:

```text
하나 이상 일치 → 30
일치 없음      → 0
```

### OCCASION

```text
Request occasion과 Product OCCASION 일치 → 25
불일치                               → 0
```

### SEASON

```text
Product가 요청 season 보유 → 25
또는 Product가 ALL_SEASON 보유 → 25
그 외 → 0
```

### FEATURE

확정 공식:

```text
20 × (일치 FEATURE 개수 / preferredFeatures 개수)
```

예:

```text
사용자: [COMPACT, MULTIWAY]
상품:   [COMPACT]

20 × 1/2 = 10
```

내부 점수는 소수 둘째 자리까지 보관 가능하고, FE 표시 시 반올림 정수를 사용할 수 있다.

---

## 6.3 추천 처리

```text
현재 사용자 취향 조회
→ ACTIVE MCM 후보 조회
→ Request 조건 적용
→ ProductTag 점수 계산
→ 총점 내림차순
→ 동점이면 안정적인 2차 정렬
→ 최대 limit개
→ Recommendation + RecommendationProduct 저장
```

저장:

```text
generationType = RULE_BASED
aiJobId = null
```

`RecommendationProduct.score`는 0~100.

동점 2차 정렬은 구현에서 `productId ASC` 등 결정론적 기준을 사용한다.

---

## 6.4 추천 Response

```json
{
  "success": true,
  "data": {
    "recommendationId": "301",
    "generationType": "RULE_BASED",
    "scorePolicyVersion": "product-recommendation-v1",
    "products": [
      {
        "rank": 1,
        "score": 90.0,
        "scoreBreakdown": {
          "style": 30.0,
          "occasion": 25.0,
          "season": 25.0,
          "feature": 10.0
        },
        "reason": "선호 스타일과 데이트 상황, 가을 시즌에 잘 맞는 제품입니다.",
        "product": {
          "productId": "101",
          "name": "Aren Shopper",
          "category": "BAG",
          "price": 1450000,
          "primaryImageUrl": "https://example.com/product.webp",
          "favorited": false
        }
      }
    ],
    "generatedAt": "2026-08-13T06:00:00Z"
  }
}
```

추천 결과가 없으면:

```json
"products": []
```

---

## 6.5 추천 상세

```http
GET /api/recommendations/{recommendationId}
```

다른 사용자의 추천 ID는 존재 여부를 과도하게 노출하지 않도록 `RECOMMENDATION_NOT_FOUND` 404.

---

# 7. 찜 API

```http
GET    /api/products/favorites?page=0&size=20&sort=createdAt,desc
PUT    /api/products/{productId}/favorite
DELETE /api/products/{productId}/favorite
```

PUT 재요청:

```text
이미 찜 상태
→ 성공
→ 계속 찜
```

DELETE 재요청:

```text
이미 해제 상태
→ 204
```

---

# 8. 마이 아이템 API

## 8.1 등록 흐름

현재 이미지 정책 유지:

```text
AI_INPUT 업로드
→ ITEM_ANALYSIS
→ 분석 결과 확인
→ UserItem 생성
→ 같은 로컬 원본 파일을 ITEM 용도로 별도 업로드
```

`AI_INPUT`을 `ITEM`으로 승격하지 않는다.

프런트엔드 등록 분기:

```text
AI 성공
→ category / primaryColor / material 자동 채움
→ 사용자가 자동 입력값을 포함한 모든 값을 수정 가능
→ 나머지 정보 입력
→ UserItem 생성

AI 실패
→ 같은 등록 폼에서 category / primaryColor / material 직접 입력
→ aiJobId 없이 UserItem 생성

사진 없음
→ 처음부터 같은 등록 폼에서 모든 필수 정보 직접 입력
→ UserItem 생성

UserItem 생성 후 ITEM 이미지 업로드 실패
→ UserItem 생성 성공을 유지
→ 입력 폼을 다시 작성하지 않음
→ 같은 myItemId로 ITEM 이미지만 재업로드
```

UserItem 생성과 ITEM 이미지 업로드는 하나의 프런트엔드 성공 상태로 묶지 않는다. 이미지 업로드 실패를 이유로 이미 생성된 UserItem을 다시 생성하지 않는다.

---

## 8.2 아이템 생성

```http
POST /api/my-items
```

Request 예시:

```json
{
  "productId": null,
  "brandName": "MCM",
  "name": "브라운 토트백",
  "category": "BAG",
  "primaryColor": "BROWN",
  "material": "LEATHER",
  "materialSource": "AI_ESTIMATED",
  "purchaseDate": "2026-08-01",
  "purchasePrice": 1200000,
  "memo": "선물받은 가방",
  "aiJobId": "9001"
}
```

마이 아이템 등록 화면의 입력 책임:

| 필드 | 화면 입력 정책 |
|---|---|
| `brandName` | 사용자 직접 입력 |
| `name` | 사용자 직접 입력 |
| `category` | 사용자 직접 입력, AI 성공 시 자동 제안 가능 |
| `primaryColor` | 사용자 직접 입력, AI 성공 시 자동 제안 가능 |
| `material` | 사용자 직접 입력, AI 성공 시 자동 제안 가능 |
| `purchaseDate` | 사용자 직접 입력, 선택 |
| `purchasePrice` | 사용자 직접 입력, 선택 |
| `memo` | 사용자 직접 입력, 선택 |

AI가 제안한 `category`, `primaryColor`, `material`도 등록 전 사용자가 수정할 수 있다. `brandName`, `name`, 구매 정보, 메모는 ITEM_ANALYSIS 결과로 자동 입력하지 않는다.

Response:

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "myItemId": "501"
  }
}
```

### UserItem status 정책

2026-08-13 회의에서 중고 판매 기능을 제거했으므로 사용자 기능에서는 상태값을 사용하지 않는다.

현재 V5 DB에는 `user_items.status`가 아직 존재한다. 따라서:

- v0.3 Request/Response에서는 `status`를 신규 계약으로 노출하지 않는다.
- V10 ProductTag 완료 후 V5/V6 구조를 확인한다.
- 실제 컬럼/인덱스 제거 여부는 후속 Migration에서 결정한다.
- 기존 V5를 수정하지 않는다.

그 전까지 서버 내부에서 기존 NOT NULL 조건을 만족시키기 위한 임시 내부값이 필요하면 사용자 API 계약과 분리한다.

---

## 8.3 이미지 0장 허용

아이템 정보 저장과 ITEM 이미지 저장을 하나의 전체 롤백 Transaction으로 묶지 않는다.

```text
UserItem 생성 성공
→ 이미지 업로드 시도
   ├─ 성공
   └─ 실패
       → UserItem 유지
       → 이미지 0장 상태 임시 허용
       → 같은 myItemId로 재업로드
```

마이 아이템 조회 응답은 이미지가 없을 수 있으므로:

```json
{
  "images": []
}
```

을 정상 상태로 처리한다.

---

## 8.4 목록

```http
GET /api/my-items?keyword=토트&category=BAG&view=ALL&page=0&size=20&sort=createdAt,desc
```

`view`:

```text
ALL
LOW_USAGE
```

`LOW_USAGE`는 장기 미사용 안내 화면에서 사용한다.

장기 미사용 판정의 정확한 일수 임계값은 API 필드가 아니라 서버 Rule Policy로 관리하며, 별도 정책 버전을 둔다.

---

## 8.5 상세

```http
GET /api/my-items/{myItemId}
```

status는 v0.3 응답에서 제외한다.

---

## 8.6 수정

```http
PATCH /api/my-items/{myItemId}
```

`version` 기반 낙관적 잠금을 유지한다.

status 변경은 v0.3 계약에서 제거한다.

---

## 8.7 삭제

```http
DELETE /api/my-items/{myItemId}
```

- UserItem: Soft Delete
- 연결 ITEM 이미지: 삭제 대기
- 재삭제: 멱등 성공
- Response `204`

---

# 9. 착용/사용 기록 API

> 사용자 화면 용어는 “착용/사용 기록”, 현재 DB 내부는 `wear_records`, `wear_record_items`를 유지한다.

## 9.1 기록 생성

```http
POST /api/usage-records
```

Request:

```json
{
  "myItemIds": ["501", "502"],
  "wornAt": "2026-08-13T03:00:00Z",
  "occasion": "DATE",
  "placeName": "성수",
  "weatherSummary": null,
  "memo": "주말 데이트"
}
```

정책:

- `myItemIds`: 1~10개, 중복 금지
- 모든 UserItem은 현재 사용자 소유
- 삭제된 UserItem 연결 금지
- `occasion`: 최종 OCCASION 7개 사용
- `wornAt`: UTC ISO 8601
- `placeName`, `weatherSummary`, `memo`: 선택

Response:

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "usageRecordId": "1001",
    "version": 0
  }
}
```

---

## 9.2 기록 목록

```http
GET /api/usage-records?page=0&size=20&sort=wornAt,desc
```

아이템별:

```http
GET /api/my-items/{myItemId}/usage-records?page=0&size=20&sort=wornAt,desc
```

---

## 9.3 기록 상세

```http
GET /api/usage-records/{usageRecordId}
```

Response 예시:

```json
{
  "success": true,
  "data": {
    "usageRecordId": "1001",
    "wornAt": "2026-08-13T03:00:00Z",
    "occasion": "DATE",
    "placeName": "성수",
    "weatherSummary": null,
    "memo": "주말 데이트",
    "items": [
      {
        "myItemId": "501",
        "name": "브라운 토트백",
        "sortOrder": 0
      }
    ],
    "version": 0,
    "createdAt": "2026-08-13T03:05:00Z"
  }
}
```

---

## 9.4 기록 수정

```http
PATCH /api/usage-records/{usageRecordId}
```

Request 예시:

```json
{
  "memo": "저녁 약속",
  "version": 0
}
```

조합 아이템 자체까지 수정할 필요가 생기면 별도 계약으로 확장한다. v0.3 기본 PATCH는 기록 메타데이터 수정에 집중한다.

---

## 9.5 기록 삭제

```http
DELETE /api/usage-records/{usageRecordId}
```

Hard Delete.

---

# 10. 활용도·장기 미사용·다시 활용 추천

## 10.1 AI 사용 여부

다음은 AI가 계산하지 않는다.

```text
사용 횟수
마지막 사용일
사용 간격
활용도 점수/레벨
장기 미사용 판정
```

백엔드 Rule-Based로 계산한다.

장기 미사용 아이템 재활용 **AI Job**은 MVP에서 제외한다.

---

## 10.2 아이템 활용도

```http
GET /api/my-items/{myItemId}/utilization
```

Response 구조:

```json
{
  "success": true,
  "data": {
    "myItemId": "501",
    "calculable": true,
    "usageCount": 12,
    "lastUsedAt": "2026-07-20T02:00:00Z",
    "daysSinceLastUse": 24,
    "utilizationScore": 72,
    "utilizationLevel": "MEDIUM",
    "policyVersion": "utilization-v1",
    "missingData": []
  }
}
```

데이터 부족:

```json
{
  "success": true,
  "data": {
    "myItemId": "501",
    "calculable": false,
    "usageCount": 0,
    "lastUsedAt": null,
    "daysSinceLastUse": null,
    "utilizationScore": null,
    "utilizationLevel": null,
    "policyVersion": "utilization-v1",
    "missingData": ["USAGE_HISTORY"]
  }
}
```

> 활용도 수치의 상세 산식과 `LOW/MEDIUM/HIGH` 경계값은 이번 회의에서 확정하지 않았다. 따라서 v0.3은 “Rule-Based이며 API 형태는 위와 같다”까지만 계약으로 고정하고, 정확한 내부 계산식은 별도 `utilization-v1` 정책 구현 시 테스트로 고정한다.

---

## 10.3 장기 미사용 안내

```http
GET /api/my-items?view=LOW_USAGE
```

정상적으로 대상이 없으면 빈 페이지를 반환한다.

---

## 10.4 다시 활용할 제품 추천

```http
GET /api/reuse-recommendations?limit=3
```

- AI 사용 안 함
- 사용 기록/활용도/최근 사용일 기반 Rule-Based
- 정확한 장기 미사용 일수와 세부 순위 Rule은 `utilization-v1`과 함께 관리

Response:

```json
{
  "success": true,
  "data": {
    "generationType": "RULE_BASED",
    "items": [
      {
        "myItemId": "501",
        "name": "브라운 토트백",
        "lastUsedAt": "2026-06-10T02:00:00Z",
        "usageCount": 2,
        "reasonCode": "LONG_UNUSED"
      }
    ]
  }
}
```

프론트 표시문구는 `reasonCode`를 기준으로 작성할 수 있다.

---

# 11. 제품 패스포트 API

제품 패스포트는 별도의 인증서가 아니라 **제품 정보 + 제품/구매 정보 + 사용 이력**을 한 화면에 모은 조회 View다.

제품 상태는 제외한다.

```http
GET /api/my-items/{myItemId}/passport
```

Response:

```json
{
  "success": true,
  "data": {
    "myItemId": "501",
    "productInfo": {
      "linkedProductId": "101",
      "brandName": "MCM",
      "name": "Aren Shopper",
      "category": "BAG",
      "primaryColor": "BROWN",
      "material": "LEATHER",
      "images": []
    },
    "purchaseInfo": {
      "purchaseDate": "2026-08-01",
      "purchasePrice": 1200000
    },
    "usageSummary": {
      "usageCount": 12,
      "lastUsedAt": "2026-08-10T03:00:00Z"
    },
    "recentUsageRecords": []
  }
}
```

제외:

```text
status
SOLD
DISPOSED
현재 상태 등급
관리 기록
```

---

# 12. 관리 가이드·관리 일정 API

관리 기록 자체는 MVP에서 제외하지만 관리 안내는 유지한다.

```http
GET /api/my-items/{myItemId}/care-guide
```

Response 예시:

```json
{
  "success": true,
  "data": {
    "myItemId": "501",
    "available": true,
    "material": "LEATHER",
    "guide": [
      {
        "code": "STORAGE",
        "title": "보관",
        "description": "직사광선과 습기를 피해 보관해 주세요."
      }
    ],
    "schedule": {
      "recommendedIntervalDays": null,
      "recommendedNextCareAt": null
    }
  }
}
```

중요:

- 관리 기록 CRUD는 만들지 않는다.
- 현재 V6의 `care_records.next_care_at`이 관리 일정과 결합되어 있는지 V10 후 확인한다.
- 가이드/일정을 `care_records`에 의존하지 않고 계산할 수 있으면 `care_records` 삭제가 가능하다.
- 실제 DB 정리 전까지 API가 `care_records`를 Source of Truth라고 가정하지 않는다.

---

# 13. 이미지 업로드 API

## 13.1 서명

```http
POST /api/image-uploads/signature
```

Request:

```json
{
  "purpose": "ITEM",
  "referenceId": "501"
}
```

| purpose | referenceId |
|---|---|
| PROFILE | 없음 |
| ITEM | myItemId 필수 |
| AI_INPUT | 없음 |

---

## 13.2 완료

```http
POST /api/image-uploads/complete
```

ITEM:

- `sortOrder`: 0~2 필수
- 아이템당 최대 3장
- 이미지 없는 아이템 자체는 허용
- 같은 `myItemId`로 재시도 가능

PROFILE:

- 사용자당 최대 1장

AI_INPUT:

- `TEMPORARY`
- AI Job 완료 후 삭제 흐름

---

## 13.3 삭제

```http
DELETE /api/images/{imageId}
```

- 소유권 확인
- `DELETE_PENDING`
- Cloudinary 비동기 삭제
- 최종 `DELETED`
- 재삭제 멱등 성공
- `204`

---

# 14. AI Job API

## 14.1 MVP AiJobType

v0.3에서 실제 사용:

```text
PREFERENCE_ANALYSIS
ITEM_ANALYSIS
STYLE_PLAN
```

MVP에서 사용하지 않음:

```text
DORMANT_ITEM_REUSE
PRODUCT_RECOMMENDATION
PLACE_RECOMMENDATION
```

현재 DB `ai_jobs.type`은 문자열이므로 미사용 Type 제거 때문에 과거 Migration을 수정할 필요는 없다.

---

## 14.2 Job 생성

```http
POST /api/ai-jobs
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

Response:

```http
202 Accepted
```

```json
{
  "success": true,
  "data": {
    "jobId": "9001",
    "type": "ITEM_ANALYSIS",
    "status": "PENDING",
    "cached": false,
    "createdAt": "2026-08-13T06:00:00Z"
  }
}
```

정책:

- `(userId, Idempotency-Key)` Unique
- 같은 Key + 같은 Body → 기존 Job
- 같은 Key + 다른 Body → `409 IDEMPOTENCY_KEY_CONFLICT`
- 사용자당 하루 최대 10회
- 사용자당 동시 1개
- OpenAI 호출 Timeout 20초
- 자동 Retry 최대 1회
- 동일 사용자 동일 입력 24시간 캐시

---

## 14.3 타입별 Request

### PREFERENCE_ANALYSIS

```json
{
  "type": "PREFERENCE_ANALYSIS",
  "context": {
    "selectedColors": ["BLACK", "BEIGE"],
    "selectedCategories": ["BAG", "CLOTHING"],
    "selectedStyleTags": ["CASUAL", "NEAT"],
    "language": "ko"
  }
}
```

### ITEM_ANALYSIS

```json
{
  "type": "ITEM_ANALYSIS",
  "imageIds": ["701"],
  "context": {
    "language": "ko"
  }
}
```

### STYLE_PLAN — 사용자 화면 “스마트 착용 추천”

```json
{
  "type": "STYLE_PLAN",
  "context": {
    "occasion": "DATE",
    "styleTags": ["NEAT", "GLAMOROUS"],
    "styleIntensity": 72,
    "weatherCondition": null,
    "prioritizeOwnedItems": true,
    "language": "ko"
  }
}
```

---

## 14.4 Job 조회

```http
GET /api/ai-jobs/{jobId}
```

### 처리 중

```json
{
  "success": true,
  "data": {
    "jobId": "9001",
    "type": "ITEM_ANALYSIS",
    "status": "PROCESSING",
    "result": null,
    "fallback": null,
    "error": null,
    "createdAt": "2026-08-13T06:00:00Z",
    "completedAt": null
  }
}
```

### 성공

```text
HTTP 200
status=SUCCEEDED
result != null
```

### AI 처리 실패

AI Provider 호출/결과 검증 등의 **Job 실행 실패가 정상적으로 기록된 경우**:

```http
HTTP 200
```

```json
{
  "success": true,
  "data": {
    "jobId": "9001",
    "type": "STYLE_PLAN",
    "status": "FAILED",
    "result": null,
    "error": {
      "code": "AI_PROVIDER_UNAVAILABLE",
      "message": "스마트 착용 추천 생성에 실패했습니다.",
      "retryable": true
    },
    "fallback": {
      "type": "RULE_BASED",
      "result": {
        "message": "최근 활용이 적은 보유 아이템을 중심으로 기본 조합을 표시합니다."
      }
    },
    "createdAt": "2026-08-13T06:00:00Z",
    "completedAt": "2026-08-13T06:00:08Z"
  }
}
```

구분:

```text
Job 결과 FAILED
→ 200 + status=FAILED

서버 자체 처리 불가/예외
→ 5xx
```

---

## 14.5 Fallback

| Job Type | Fallback |
|---|---|
| PREFERENCE_ANALYSIS | 사용자가 선택한 설문 값을 그대로 취향 값으로 사용 |
| ITEM_ANALYSIS | 사용자가 category/color/material 등을 직접 입력 |
| STYLE_PLAN | 최근 사용이 적은 보유 아이템 중심의 Rule-Based 기본 조합 |

`DORMANT_ITEM_REUSE` Fallback은 v0.3 MVP 계약에서 제거한다.

---

## 14.6 FE Polling

확정:

```text
간격: 2초
FE 최대 대기: 30초
```

예:

```text
POST /ai-jobs
→ PENDING
→ 2초
→ GET
→ PROCESSING
→ ...
→ SUCCEEDED / FAILED
```

30초는 네트워크 응답 시간을 포함한 FE 화면의 최대 대기 정책이다. 30초에 도달하면 진행 중인 조회를 취소하지만 서버 Job 기록이나 처리를 강제 취소하지 않는다.

---

# 15. 구매 전 활용 가능성 분석

## 15.1 처리 원칙

확정:

```text
점수·호환 아이템·요약 문구
→ Backend Rule-Based
```

OpenAI와 AI Job을 호출하지 않는다. 같은 입력과 정책 버전에는 같은 결과가 나와야 한다.

---

## 15.2 점수

```text
preferenceTagFitScore           최대 30
styleCombinationScore           최대 25
seasonUsabilityScore            최대 25
ownedCategoryCombinationScore   최대 20
utilityScore                    최대 100
```

DB의 `utility_score`에 최종 점수를 저장하고, 세부 항목은 `factor_json`에 저장할 수 있다.

현재 V7에 존재하는 `duplicate_similarity_score`는 이번 회의의 최종 100점 공식에 포함되지 않는다.

따라서 v0.3 공개 API 응답에서는 `duplicateSimilarityScore`를 제거한다. 해당 DB 컬럼을 물리적으로 제거할지는 후속 Schema 정리에서 별도로 판단하며, V7을 수정하지 않는다.

---

## 15.3 분석 시작

```http
POST /api/purchase-utility-analyses
```

Request:

```json
{
  "productId": "101"
}
```

백엔드 처리 개념:

```text
현재 사용자 + 대상 MCM 제품
→ Rule-Based 4개 Factor 계산
→ utilityScore
→ 충분한 데이터면 PurchaseUtilityAnalysis 저장
→ 정책 버전에 맞는 정형 summary/reason 생성
→ 분석 결과 응답
```

데이터 부족 시 Analysis Row를 억지로 만들지 않는 기존 정책 유지.

---

## 15.4 분석 생성 Response

충분한 데이터면 `201 Created`와 15.5의 전체 분석 객체를 반환한다. 데이터가 부족하면 `422 PURCHASE_UTILITY_INSUFFICIENT_DATA`를 반환하며 AI Fallback은 사용하지 않는다.

---

## 15.5 분석 상세

```http
GET /api/purchase-utility-analyses/{analysisId}
```

Response:

```json
{
  "success": true,
  "data": {
    "analysisId": "801",
    "product": {
      "productId": "101",
      "name": "Aren Shopper",
      "category": "BAG",
      "price": 1450000,
      "primaryImageUrl": "https://example.com/product.webp"
    },
    "utilityScore": 82.0,
    "factors": {
      "preferenceTagFitScore": 27.0,
      "styleCombinationScore": 20.0,
      "seasonUsabilityScore": 20.0,
      "ownedCategoryCombinationScore": 15.0
    },
    "compatibleItemCount": 7,
    "compatibleItems": [
      {
        "myItemId": "501",
        "name": "베이지 재킷",
        "imageUrl": "https://example.com/jacket.webp",
        "reason": "구매 후보 제품과 함께 활용하기 좋은 아이템입니다."
      }
    ],
    "summary": "보유 아이템과 조합하기 쉽고 취향 및 계절 활용성이 높은 편입니다.",
    "analyzedAt": "2026-08-13T06:00:00Z"
  }
}
```

`summary`와 호환 이유는 점수 정책 버전에 맞는 정형 Rule-Based 문구다.

---

## 15.6 세부 Factor 산식

회의에서는 “4개 Factor의 최대 가중치”를 확정했다.

각 Factor 내부에서 정확히 몇 점을 주는지에 대한 세부 Rule까지는 확정하지 않았다.

따라서:

- 각 Factor는 0~자기 최대점 범위
- deterministic
- 같은 입력이면 같은 결과
- `purchase-utility-rule-v1`처럼 버전 관리
- 단위 테스트로 고정
- AI를 호출하지 않음

을 v0.3 계약으로 둔다.

---

# 16. 스마트 착용 추천 — 내부 StylePlan

## 16.1 명칭

사용자 화면:

```text
스마트 착용 추천
```

기술 리소스:

```text
AiJobType: STYLE_PLAN
API: /style-plans
DB: style_plans/*
```

---

## 16.2 생성 흐름

```text
1. POST /api/ai-jobs type=STYLE_PLAN
2. FE가 2초 Polling
3. AI result 미리보기
4. 사용자가 “이 스타일로 결정”
5. POST /api/style-plans
6. 저장 후 필요하면 장소 추천
```

AI Job 성공만으로 자동 저장하지 않는다.

---

## 16.3 AI 성공 미리보기

```json
{
  "previewId": "job:9001",
  "title": "데이트 룩",
  "description": "깔끔한 보유 아이템을 중심으로 구성했어요.",
  "ownedItems": [
    {
      "myItemId": "501",
      "name": "브라운 데일리백",
      "imageUrl": "https://example.com/item.webp",
      "role": "BAG",
      "sortOrder": 0
    }
  ],
  "recommendedProducts": [
    {
      "productId": "101",
      "name": "Aren Shopper",
      "imageUrl": "https://example.com/product.webp",
      "rank": 1,
      "reason": "전체 색상 톤과 잘 어울려요."
    }
  ],
  "generationType": "AI"
}
```

---

## 16.4 저장

```http
POST /api/style-plans
```

Request:

```json
{
  "aiJobId": "9001",
  "title": "데이트 룩",
  "occasion": "DATE",
  "plannedAt": "2026-08-15T10:00:00Z",
  "weatherCondition": null,
  "description": "깔끔한 보유 아이템을 중심으로 구성했어요.",
  "status": "CONFIRMED",
  "ownedItems": [
    {
      "myItemId": "501",
      "role": "BAG",
      "sortOrder": 0
    }
  ],
  "recommendedProducts": [
    {
      "productId": "101",
      "rank": 1,
      "reason": "전체 색상 톤과 잘 어울려요."
    }
  ]
}
```

제한:

```text
보유 아이템 최대 10
MCM 추천 상품 최대 3
추천 장소 최대 3
```

모든 UserItem 소유권과 Product 존재를 저장 시 다시 확인한다.

---

## 16.5 목록·상세·수정·삭제

```http
GET    /api/style-plans
GET    /api/style-plans/{stylePlanId}
PATCH  /api/style-plans/{stylePlanId}
DELETE /api/style-plans/{stylePlanId}
```

PATCH 기본 수정 가능:

```text
title
plannedAt
status
version
```

조합 자체 변경은 새 스마트 착용 추천 생성을 권장한다.

---

# 17. 장소 검색·추천·OpenFreeMap 연동

## 17.1 역할

```text
Kakao Local
→ 실제 장소 검색 데이터

Backend
→ 캐시 + Rule-Based 추천

OpenFreeMap
→ 프론트 지도 렌더링
```

프론트가 Kakao Map SDK를 사용할 필요는 없다.

---

## 17.2 v0.3 서비스 PlaceCategory

```text
CAFE
RESTAURANT
CULTURE
ATTRACTION
SHOPPING
```

`OTHER`는 Kakao 원본 카테고리 중 서비스 5개로 분류하지 못한 경우 내부 Fallback으로 사용할 수 있다.

---

## 17.3 장소 검색

```http
GET /api/places?query=성수&category=CAFE&latitude=37.5445&longitude=127.0560&radius=3000
```

| 필드 | 필수 | 규칙 |
|---|---:|---|
| `query` | X | 지역명·상호·키워드 |
| `category` | X | 서비스 PlaceCategory |
| `latitude` | X | longitude와 쌍 |
| `longitude` | X | latitude와 쌍 |
| `radius` | X | 1~20000m |

검색 Endpoint는 범용 검색이므로 `query` 또는 좌표 기반 조건 중 유효한 검색 조건이 있어야 한다.

처리:

```text
Kakao Local
→ provider=KAKAO
→ (provider, providerPlaceId) Upsert
→ 내부 placeId
→ FE
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "placeId": "1001",
        "name": "성수 카페",
        "category": "CAFE",
        "categoryName": "음식점 > 카페",
        "address": "서울 성동구 ...",
        "roadAddress": "서울 성동구 ...",
        "latitude": 37.5412,
        "longitude": 127.0563,
        "saved": false
      }
    ]
  }
}
```

FE는 `latitude`, `longitude`를 OpenFreeMap에 사용한다.

사용자 좌표 자체는 DB에 저장하지 않는다.

---

## 17.4 OCCASION → 장소 카테고리

v0.3 추천 기준:

| OCCASION | 우선 카테고리 |
|---|---|
| DAILY | CAFE, RESTAURANT |
| DATE | CAFE, RESTAURANT, CULTURE |
| TRAVEL | ATTRACTION, CULTURE, RESTAURANT |
| GATHERING | RESTAURANT, CAFE |
| CEREMONY | RESTAURANT |
| OUTDOOR | ATTRACTION |
| OTHER | 전체 후보 |

Kakao의 원본 `categoryName`은 그대로 보존할 수 있고, 위 서비스 카테고리는 추천 Rule 계산용이다.

---

## 17.5 스마트 착용 추천 기반 장소 추천

```http
POST /api/style-plans/{stylePlanId}/place-recommendations
```

Request:

```json
{
  "latitude": 37.5445,
  "longitude": 127.0560,
  "radius": 3000,
  "category": null,
  "query": null
}
```

- latitude/longitude 필수
- radius 기본 3000m, 최대 20000m
- category는 사용자가 특정 장소 종류를 선택했을 때 선택
- query는 지역/상호 키워드를 추가로 제한할 때 선택
- OCCASION은 Request에서 중복 입력하지 않고 `StylePlan.occasion`을 사용

처리:

```text
StylePlan 소유권 검증
→ occasion 확인
→ Kakao 후보 검색
→ places Upsert
→ category suitability 계산
→ distance 계산
→ 최대 3개
→ style_plan_places 교체 저장
→ 응답
```

---

## 17.6 장소 추천 점수

확정 최대 가중치:

```text
categorySuitabilityScore 최대 60
distanceScore            최대 40
totalScore               최대 100
```

v0.3 구현 정규화:

### Category

StylePlan Occasion의 우선 카테고리에 포함:

```text
60점
```

사용자가 `category`를 명시하면 해당 카테고리에 맞지 않는 후보는 기본적으로 제외한다.

### Distance

요청 `radius` 안의 후보:

```text
distanceScore = 40 × max(0, 1 - distanceMeters / radiusMeters)
```

즉 가까울수록 높은 점수.

> “60 + 40” 가중치는 팀에서 확정했고, 위 선형 거리 정규화 식은 구현을 결정론적으로 만들기 위해 v0.3에서 정의한 기술 세부다. 이후 체감 품질 조정 시 `place-ranking-v2`처럼 정책 버전을 올려 변경한다.

동점:

```text
1. totalScore DESC
2. distance ASC
3. Kakao 원본 결과 순서
```

---

## 17.7 장소 추천 Response

```json
{
  "success": true,
  "data": {
    "stylePlanId": "601",
    "rankingPolicyVersion": "place-ranking-v1",
    "places": [
      {
        "rank": 1,
        "score": 92.0,
        "scoreBreakdown": {
          "categorySuitability": 60.0,
          "distance": 32.0
        },
        "reasonCode": "OCCASION_CATEGORY_AND_DISTANCE_MATCH",
        "place": {
          "placeId": "1001",
          "name": "성수 카페",
          "category": "CAFE",
          "categoryName": "음식점 > 카페",
          "roadAddress": "서울 성동구 ...",
          "latitude": 37.5412,
          "longitude": 127.0563,
          "saved": false
        }
      }
    ]
  }
}
```

장소 추천에는 OpenAI를 호출하지 않는다.

---

# 18. 장소 저장 API

```http
GET    /api/places/saved?page=0&size=20&sort=createdAt,desc
PUT    /api/places/{placeId}/saved
DELETE /api/places/{placeId}/saved
```

PUT/DELETE는 멱등.

---

# 19. 홈 API

```http
GET /api/home
```

홈은 집계 조회 전용.

홈 호출만으로 다음을 새로 실행하지 않는다.

```text
OpenAI
AI Job
Recommendation 생성
Kakao Local
장소 추천
```

기존에 저장된 데이터만 집계한다.

---

# 20. Enum 최종 정리

## 20.1 ProductTagType

```text
STYLE
SEASON
OCCASION
FEATURE
```

## 20.2 Occasion

```text
DAILY
DATE
TRAVEL
GATHERING
CEREMONY
OUTDOOR
OTHER
```

## 20.3 PlaceCategory

```text
CAFE
RESTAURANT
CULTURE
ATTRACTION
SHOPPING
OTHER
```

## 20.4 ImageAssetPurpose

```text
PROFILE
ITEM
AI_INPUT
```

## 20.5 ImageAssetStatus

```text
TEMPORARY
ACTIVE
DELETE_PENDING
DELETED
```

## 20.6 AiJobType — MVP 사용

```text
PREFERENCE_ANALYSIS
ITEM_ANALYSIS
STYLE_PLAN
```

MVP 비사용:

```text
DORMANT_ITEM_REUSE
```

새로 만들지 않음:

```text
PRODUCT_RECOMMENDATION
PLACE_RECOMMENDATION
```

## 20.7 AiJobStatus

```text
PENDING
PROCESSING
SUCCEEDED
FAILED
```

## 20.8 GenerationType

```text
AI
RULE_BASED
MANUAL
```

## 20.9 StylePlanStatus

```text
DRAFT
CONFIRMED
COMPLETED
CANCELED
```

## 20.10 WeatherCondition

```text
SUNNY
CLOUDY
RAINY
SNOWY
HOT
COLD
WINDY
INDOOR
OTHER
```

## 20.11 StyleItemRole

```text
MAIN
TOP
BOTTOM
SHOES
BAG
ACCESSORY
```

---

# 21. 오류 코드 v0.3

## 21.1 공통

```text
VALIDATION_ERROR
REQUEST_BODY_INVALID
RESOURCE_ACCESS_DENIED
RESOURCE_VERSION_CONFLICT
IDEMPOTENCY_KEY_CONFLICT
INTERNAL_SERVER_ERROR
```

## 21.2 인증

기존:

```text
EMAIL_ALREADY_EXISTS
EMAIL_VERIFICATION_INVALID
EMAIL_VERIFICATION_EXPIRED
EMAIL_VERIFICATION_RATE_LIMITED
SIGNUP_TOKEN_INVALID
PASSWORD_CONFIRM_MISMATCH
REQUIRED_TERMS_NOT_AGREED
PROFILE_INCOMPLETE
LOGIN_ID_ALREADY_EXISTS
SOCIAL_EMAIL_CONFLICT
INVALID_CREDENTIALS
ACCESS_TOKEN_INVALID
ACCESS_TOKEN_EXPIRED
REFRESH_TOKEN_INVALID
ACCOUNT_NOT_ACTIVE
ORIGIN_NOT_ALLOWED
OAUTH_STATE_INVALID
OAUTH_PROVIDER_ERROR
```

재인증 신규:

```text
REAUTH_REQUIRED
REAUTH_INVALID
REAUTH_EXPIRED
REAUTH_ALREADY_USED
REAUTH_PURPOSE_INVALID
OAUTH_ACCOUNT_MISMATCH
```

## 21.3 도메인

```text
MY_ITEM_NOT_FOUND
USAGE_RECORD_NOT_FOUND
PRODUCT_NOT_FOUND
RECOMMENDATION_NOT_FOUND
STYLE_PLAN_NOT_FOUND
PLACE_NOT_FOUND
PURCHASE_UTILITY_ANALYSIS_NOT_FOUND
IMAGE_NOT_FOUND
AI_JOB_NOT_FOUND
```

## 21.4 이미지·AI·외부 서비스

```text
IMAGE_ACCESS_DENIED
IMAGE_FORMAT_NOT_ALLOWED
IMAGE_TOO_LARGE
IMAGE_DIMENSION_TOO_LARGE
IMAGE_UPLOAD_SIGNATURE_INVALID
IMAGE_LIMIT_EXCEEDED
IMAGE_SORT_ORDER_CONFLICT

AI_REQUEST_INVALID
AI_JOB_ALREADY_RUNNING
AI_DAILY_LIMIT_EXCEEDED
AI_PROVIDER_UNAVAILABLE
AI_REQUEST_TIMEOUT

EXTERNAL_FREE_QUOTA_EXCEEDED
IMAGE_STORAGE_UNAVAILABLE
PLACE_PROVIDER_UNAVAILABLE
```

---

# 22. Swagger/OpenAPI 구현 규칙

Controller Tag:

```text
Auth
Users
Preferences
Products
Recommendations
Favorites
My Items
Usage Records
Utilization
Reuse Recommendations
Product Passport
Care Guide
Images
AI Jobs
Purchase Utility
Smart Wear Recommendations
Places
Saved Places
Home
```

규칙:

- 보호 Endpoint: `@SecurityRequirement(name = "bearerAuth")`
- DTO 직접 문서화
- Entity 직접 반환 금지
- ID Schema는 String
- 페이지는 공통 `PageResponse<T>`
- AI `result`, `fallback`은 Type별 `oneOf`
- `FAILED` Job도 GET 응답 200임을 명시
- OAuth는 Redirect/State/Cookie 흐름 명시
- reauth는 5분·1회용·`ACCOUNT_DELETE` 목적 명시
- 점수 Response에는 최대점수와 정책 버전을 설명
- 장소 API 문서에는 “Kakao 장소 데이터 → OpenFreeMap 렌더링” 역할 분리를 명시
- `display_name`을 ProductTag Schema에 다시 추가하지 않음

---

# 23. DB·Migration 정합성

현재 `feat/database-schema`:

```text
V1  사용자·인증
V2  AI Job
V3  MCM 상품·ProductTag
V4  취향·찜
V5  마이 아이템·ImageAsset
V6  착용·관리 기록
V7  Recommendation·PurchaseUtilityAnalysis
V8  Place·SavedPlace·StylePlan
V9  product_tags.display_name 제거
```

## 23.1 V9

현재 확정:

```sql
ALTER TABLE product_tags
    DROP COLUMN display_name;
```

V9를 수정하지 않는다.

---

## 23.2 V10

다음 작업:

```text
V10__insert_product_tag_reference_data.sql
```

19개:

```text
STYLE      4
SEASON     5
OCCASION   7
FEATURE    3
TOTAL     19
```

컬럼:

```text
type
code
```

만 INSERT.

---

## 23.3 V10 이후 V5/V6 확인

반드시 실제 SQL과 테스트를 확인한 뒤 결정한다.

### V5

현재 확인 대상:

```text
user_items.status
idx_user_items_user_status
status를 전제로 한 테스트/DTO/Enum
```

팀 제품 정책:

```text
UserItem 사용자 상태 기능 불필요
```

하지만 기존 V5를 수정하지 않는다.

제거가 필요하면 V11+ Migration.

### V6

현재 확인 대상:

```text
care_records
fk_care_records_user_item
idx_care_records_user_item_cared_at
next_care_at
관련 테스트
```

팀 제품 정책:

```text
관리 기록 제거
관리 가이드/관리 일정 유지
```

따라서 `care_records`가 관리 가이드/일정에 실제 필요한지 확인한 뒤 삭제 여부를 결정한다.

기존 V6를 수정하지 않는다.

---

## 23.4 V7 메모

현재 `purchase_utility_analyses`에는:

```text
duplicate_similarity_score
factor_json
```

이 존재한다.

최신 점수 공식에는 `duplicate_similarity_score`가 포함되지 않는다.

v0.3 API에서는 이를 공개하지 않는다.

물리 컬럼 제거 여부는 별도 DB 정리에서 결정한다.

---

## 23.5 V8 메모

사용자 화면 명칭이 “스마트 착용 추천”으로 바뀌어도:

```text
style_plans
style_plan_items
style_plan_products
style_plan_places
```

는 그대로 유지한다.

명칭만으로 V8을 다시 쓰지 않는다.

---

# 24. v0.2 P0 해소 상태

| v0.2 P0 | v0.3 |
|---|---|
| FEATURE 기준값 | `COMPACT/SPACIOUS/MULTIWAY` 확정 |
| 회원 탈퇴 재인증 | LOCAL password / SOCIAL OAuth + 5분 1회용 reauth 확정 |
| 추천 점수 | 30/25/25/20 확정 |
| 구매 활용성 공식 | 30/25/25/20 확정 |
| 장소 추천 | Kakao + Rule-Based 확정 |
| Endpoint명 | v0.3에서 API_CONVENTIONS 형식으로 정규화 |

새로운 후속 DB 검토:

```text
V10 이후
→ V5 UserItem status
→ V6 care_records
→ 필요 시 새 Migration
```

---

# 25. v0.3 구현 순서

```text
1. V10 ProductTag 19개 기준 데이터
2. V10 전용 Testcontainers 통합 테스트
3. Flyway 전체 clean check
4. V10 commit/push
5. V5/V6 실제 Schema/FK/Index/Test 검토
6. UserItem status / CareRecord DB 정리 결정
7. 필요하면 후속 Migration
8. API v0.3 DTO/Enum 정의
9. Auth reauth 구현
10. Product/Recommendation Rule-Based 구현
11. MyItem/Usage/Passport/Utilization 구현
12. Image 흐름 구현
13. AI Job 공통 + FAILED/Fallback 계약 구현
14. PURCHASE_UTILITY Rule-Based 직접 분석
15. STYLE_PLAN(스마트 착용 추천) 구현
16. Kakao Local + Rule-Based 장소 추천
17. Swagger v0.3 동기화
18. FE 연동
19. 전체 테스트
20. 배포 검증
```

---

# 26. 구현 시 변경 금지 핵심

```text
- API 기본 경로는 /api
- API ID는 String
- Access Token은 Bearer + 프론트 메모리
- Refresh Token은 HttpOnly Cookie
- 사용자 소유권은 JWT sub 기준
- ProductTag display_name을 DB에 다시 만들지 않음
- ProductTag 최종값은 19개
- 독립 MCM 추천은 RULE_BASED
- 구매 활용 점수와 정형 설명은 모두 Rule-Based이며 AI를 사용하지 않음
- 장소 추천은 Kakao + Rule-Based, FE 지도는 OpenFreeMap
- DORMANT_ITEM_REUSE AI는 MVP에서 제외
- AI Polling은 2초, 네트워크 시간을 포함한 FE 최대 30초
- AI Job FAILED는 GET 200 + status=FAILED + error/fallback
- 관리 기록 API는 만들지 않음
- UserItem 상태를 사용자 API에 새로 노출하지 않음
- 과거 V1~V9 Migration을 정책 변경 때문에 수정하지 않음
```

---

# 27. 아직 별도 세부 정책으로 남는 항목

v0.3 작성 시점에 제품 방향은 확정됐지만 아래 수치/DB 제거 세부는 별도 구현 정책으로 남긴다.

1. `utilization-v1`
   - 활용도 정확한 계산식
   - LOW/MEDIUM/HIGH 경계
   - 장기 미사용 일수 임계값

2. `purchase-utility-rule-v1`
   - 30/25/25/20 각 Factor 내부의 세부 점수 산식
   - 최대 가중치는 확정되어 변경하지 않음

3. V10 이후 DB 정리
   - `user_items.status` 실제 제거 여부
   - `care_records` 실제 제거 여부
   - V7 `duplicate_similarity_score` 정리 여부

이 항목들은 API v0.3의 큰 기능 경로를 다시 바꾸는 P0가 아니라, 현재 DB와 구현 Rule을 정리하는 후속 작업이다.

---

# 28. 최종 서비스 흐름 요약

```text
회원가입/로그인
→ 취향 분석 AI
→ Preference 저장
→ MCM 제품 탐색
→ ProductTag Rule-Based MCM 추천
→ 제품 상세/찜
→ 구매 전 활용 가능성
   └─ Backend Rule Score + 정형 설명
→ 마이 아이템 등록
   ├─ ITEM_ANALYSIS AI
   └─ 이미지 실패 시 아이템 유지
→ 착용/사용 기록
→ 활용도/장기 미사용/다시 활용 추천 Rule-Based
→ 제품 패스포트
→ 관리 가이드/일정
→ 스마트 착용 추천(STYLE_PLAN AI)
→ Kakao Local 장소 후보
→ 서버 Rule-Based 장소 추천
→ OpenFreeMap 3D 지도 표시
```

---

# 29. 문서 상태 결론

이 v0.3은 2026-08-13 회의에서 확정된 제품 정책을 API v0.2와 현재 Flyway V1~V9에 반영한 구현 기준 문서다.

특히 다음은 v0.2의 P0가 아니라 v0.3 확정 기준으로 본다.

```text
ProductTag 19개
MCM Rule-Based 추천
추천 점수 30/25/25/20
구매 활용도 30/25/25/20
구매 활용 점수와 설명 Rule-Based, AI 미사용
Kakao Local + Rule-Based 장소 추천
장소 점수 category 60 + distance 40
회원 탈퇴 재인증 5분 1회용
AI FAILED 200 + error/fallback
FE Polling 2초 / 최대 30초
관리 기록 제외
제품 패스포트 포함
착용/사용 기록 포함
활용도/장기 미사용/다시 활용 추천 포함
장기 미사용 AI 제외
사용자 화면 “스마트 착용 추천”
```

다만 V5/V6의 물리 DB 정리는 V10 완료 후 실제 FK·Index·Test를 확인한 뒤 새 Migration으로 진행한다.
