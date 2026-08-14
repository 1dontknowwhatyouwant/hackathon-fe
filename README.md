# 입을래? Frontend

보유 아이템과 사용자 취향을 기반으로 어울리는 장소와 상품의 활용 가능성을 추천하는 모바일 중심 서비스입니다.

Next.js App Router로 화면과 URL을 관리하며, 백엔드 연동 전에도 주요 사용자 흐름을 확인할 수 있도록 더미 데이터를 제공합니다. API 계층은 `입을래? 프론트–백엔드 API 명세서 검토 반영본 v0.3`을 기준으로 구성하며 상세 기준은 [`API_CONVENTIONS.md`](./API_CONVENTIONS.md)를 따릅니다.

## 기술 스택과 선택 이유

| 기술 | 버전 | 선택 이유 |
| --- | --- | --- |
| Node.js | 22 | `.nvmrc`, `package.json`의 `engines`, GitHub Actions에서 같은 버전을 사용해 개발 환경 차이를 줄입니다. |
| Next.js | 16 | App Router의 파일 기반 라우팅과 서버·클라이언트 컴포넌트 분리를 사용합니다. 동적 상품 상세 경로는 정적 생성합니다. |
| React | 19 | 화면을 기능별 컴포넌트로 나누고 상태 변화에 따라 선언적으로 렌더링합니다. |
| TypeScript | strict | API 응답, 화면 데이터, 컴포넌트 Props를 타입으로 명시해 잘못된 데이터 사용을 개발 단계에서 발견합니다. |
| Tailwind CSS | 4 | 모바일 화면의 간격과 상태별 스타일을 컴포넌트 가까이에서 빠르게 관리합니다. 공통 애니메이션과 외부 라이브러리 스타일은 전역 CSS에 둡니다. |
| Axios | 1 | 공용 인스턴스에서 Bearer Token 첨부, Refresh Cookie 전송, 401 단일 재발급, 10초 타임아웃을 일관되게 적용합니다. |
| Zustand | 5 | Access Token 메모리 상태, 공개 사용자 정보와 화면별 비동기 상태를 적은 보일러플레이트로 관리합니다. |
| MapLibre GL JS | 5 | 벡터 타일 기반 지도, 마커·팝업 제어, 카메라 이동, 3D 건물 레이어를 구현하기 위해 사용합니다. 현재 지도 스타일은 OpenFreeMap을 사용합니다. |
| ESLint | 10 | Next.js, TypeScript, React Hooks 규칙을 로컬과 CI에서 동일하게 검사합니다. |

## 실행 환경

- Node.js `22.x`
- npm
- 기본 개발 서버: `http://localhost:3000`
- 기본 백엔드 API: `http://localhost:8080/api`

Node 버전을 맞춥니다.

```bash
nvm use
```

의존성을 설치하고 개발 서버를 실행합니다.

```bash
npm ci
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 환경변수

`.env.example`을 복사해 `.env.local`을 만듭니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_API_MOCKS=true
```

- API 공통 경로 `/api`까지 환경변수에 포함합니다.
- 개별 API 요청에는 `/products`, `/my-items`처럼 리소스 경로만 작성합니다.
- `NEXT_PUBLIC_` 변수는 브라우저에 노출될 수 있으므로 API 키, 토큰, 비밀번호를 저장하지 않습니다.
- 환경변수를 변경한 뒤에는 개발 서버를 다시 실행합니다.
- `NEXT_PUBLIC_USE_API_MOCKS=false`로 바꾸면 추천·홈·구매 활용성 화면이 실제 API를 호출합니다.

## 주요 화면과 경로

| 경로 | 화면 | 상태 |
| --- | --- | --- |
| `/` | 커버 화면 | 구현 |
| `/login` | 일반·소셜 로그인 | API v0.3 인증 모듈 연결 |
| `/signup` | 이메일 인증 기반 회원가입 | API v0.3 인증 모듈 연결 |
| `/dashboard` | 로그인 후 홈 대시보드 | `GET /home`의 취향 제품 목록 표시 |
| `/design-system` | 디자인 시스템 확인 화면 | 구현 |
| `/place` | 룩 기반 장소 추천과 3D 지도 | 백엔드 위도·경도를 OpenFreeMap에 표시 |
| `/preferences` | 영구 저장 취향 분석 | 색상·제품 카테고리·STYLE 선택과 저장 |
| `/smart-recommendations` | 스마트 착용 추천 | 무드 선택·스타일 강도 슬라이더·STYLE_PLAN |
| `/recommendations` | MCM 추천 조건과 결과 | OCCASION·SEASON·FEATURE 선택 후 추천 요청 |
| `/recommendations/[productId]` | 추천 상품 상세 | 더미 상품별 정적 경로 생성 |
| `/recommendations/[productId]/value-check` | 구매 전 활용 가능성 결과 | 서버 Rule-Based 분석 API 사용 |
| `/items` | 보유 아이템 목록(screen20) | 더미 데이터 사용 |
| `/items/new` | 아이템 등록(screen21) | AI 자동 채움·직접 입력·이미지 후속 업로드 |
| `/items/image-retry` | 등록 완료 아이템 사진 재업로드 | UserItem 재생성 없이 ITEM 이미지만 재시도 |
| `/screen22` | 제품 이미지 분석 진행 화면 | ITEM_ANALYSIS 폴링과 수동 입력 fallback |
| `/screen24` | 제품 패스포트 | 더미 제품·인증 정보 사용 |
| `/screen26` | 맞춤 관리 가이드 | API v0.3 형식의 더미 데이터 사용 |
| `/screen27` | 관리 캘린더 | API v0.3 형식의 더미 데이터 사용 |
| `/my` | 사용자 정보 | localStorage 사용자 정보 또는 더미 데이터 사용 |
| `/my/account-deletion` | 회원 탈퇴 | LOCAL 비밀번호·SOCIAL OAuth 재인증 분기 |
| `/auth/reauth/account-deletion/callback` | 소셜 탈퇴 재인증 콜백 | 재인증 결과만 전달하고 토큰은 URL에 넣지 않음 |

하단 메뉴의 현재 연결은 다음과 같습니다.

| 메뉴 | 경로 |
| --- | --- |
| 홈 | `/dashboard` |
| 추천 | `/recommendations` |
| 등록 | `/items/new` |
| 아이템 | `/items` |
| MY | `/my` |

## 인증 및 사용자 정보 저장 정책

Access Token, Refresh Token, 화면 표시용 사용자 정보의 역할과 저장 위치를 분리합니다.

| 데이터 | 저장 위치 | 관리 주체 | 원칙 |
| --- | --- | --- | --- |
| Access Token | Zustand 메모리 상태 | 프런트엔드 | 응답 Body로 받아 Bearer Header로 전송하며 persist하지 않습니다. |
| Refresh Token | HttpOnly Cookie | 백엔드 | JavaScript로 읽지 않고 `withCredentials` 요청에만 포함합니다. |
| 공개 사용자 정보 | localStorage | 프런트엔드 | `userId`, `email`, `nickname`, `gender`, `profileImageUrl`만 `useAuthStore`로 저장합니다. |

- 로그인·회원가입 성공 시 Access Token과 공개 사용자 정보를 `setSession`으로 한 번에 반영합니다.
- 앱 시작 시 사용자 정보 hydration 후 `/auth/refresh`를 호출해 Access Token을 복구합니다.
- Axios 요청 인터셉터가 Access Token을 `Authorization: Bearer` Header에 넣습니다.
- 보호 API의 401은 진행 중인 재발급 Promise를 공유하고 원래 요청을 최대 한 번만 재시도합니다.
- 로그인·회원가입·이메일 인증 등 공개 인증 API의 401은 재발급 대상으로 처리하지 않습니다.
- Access Token과 비밀번호를 localStorage 또는 sessionStorage에 저장하지 않습니다.
- localStorage 값은 사용자가 변경할 수 있으므로 인증·인가 판단에 사용하지 않습니다.
- `AuthStoreHydrator`가 공개 사용자 정보 복원과 Refresh 요청을 마친 뒤 `hasHydrated`를 `true`로 변경합니다.
- 로그아웃 요청에는 Access Token과 Refresh Cookie를 모두 보내고 프런트 세션은 요청 성공 여부와 관계없이 제거합니다.
- 서로 다른 Origin에서 쿠키 인증을 사용하려면 백엔드가 명시적 허용 Origin과 credential 허용 설정을 제공해야 합니다.
- 인증 관련 POST는 백엔드의 신뢰 Origin 검증을 전제로 합니다.

### 회원 탈퇴 재인증

- 일반 사용자는 현재 비밀번호로 재인증한 뒤 `DELETE /users/me`를 호출합니다.
- 카카오·네이버 사용자는 Bearer 인증으로 OAuth 재인증 시작 API를 호출한 뒤 백엔드가 반환한 Provider URL로 이동합니다.
- OAuth 콜백이 성공하면 백엔드는 5분·1회용 `reauth_token`을 HttpOnly Cookie로 발급하고 프런트 콜백 화면으로 돌려보냅니다.
- 프런트는 재인증 Token을 URL, localStorage, Zustand에 저장하지 않습니다.
- LOCAL과 SOCIAL 모두 최종적으로 같은 회원 탈퇴 API를 호출하고 `DELETION_PENDING` 응답을 처리합니다.

## API와 비동기 상태 정책

### 공통 요청 설정

| 항목 | 현재 기준 |
| --- | --- |
| API 기본 주소 | `NEXT_PUBLIC_API_BASE_URL` |
| 공통 경로 | 환경변수에 `/api` 포함 |
| credential | `withCredentials: true` |
| 보호 API 인증 | `Authorization: Bearer {accessToken}` |
| Content-Type | `application/json` |
| 일반 요청 타임아웃 | 10초 |
| AI Job 접수 타임아웃 | 20초 |
| 페이지 시작 번호 | 0 |
| 기본 페이지 크기 | 20, 최대 100 |

성공 응답은 `{ success: true, data }`, 오류 응답은 `{ success: false, error }`로 해석합니다. `error.fields`는 Validation 오류에서만 사용하며 UI는 `message` 문자열 비교가 아닌 고정된 `code`를 기준으로 분기합니다.

API 호출은 다음 도메인 모듈로 분리합니다.

| 모듈 | 담당 영역 |
| --- | --- |
| `authApi` | 이메일 인증, 회원가입, 로그인, OAuth 시작, 탈퇴 재인증, 로그아웃 |
| `profileApi` | 내 정보, 회원 탈퇴, 취향, 홈 집계 |
| `catalogApi` | 상품, 추천, 찜 |
| `closetApi` | 내 아이템, 사용 기록, 활용도, 재활용 추천, 제품 패스포트, 관리 가이드, 이미지 업로드 |
| `intelligenceApi` | AI 취향·이미지·스타일 분석, 장소 검색·추천 |
| `utilityApi` | AI를 사용하지 않는 구매 전 활용 가능성 Rule-Based 분석 |

### 추천 상품 요청 경합

추천 상품 필터를 빠르게 전환할 때 이전 응답이 최신 결과를 덮지 않도록 다음 정책을 적용합니다.

1. 새 조회가 시작되면 기존 요청의 `AbortController`를 취소합니다.
2. 각 요청에 증가하는 요청 번호를 부여합니다.
3. 응답 시 현재 활성 요청 번호와 일치하는지 다시 확인합니다.
4. 취소됐거나 오래된 응답은 Zustand 상태에 반영하지 않습니다.
5. 검증을 마친 완성된 상품 배열과 상태를 한 번의 `set` 호출로 반영합니다.

이 방식은 클라이언트의 오래된 응답 경합과 목록 일부만 반영되는 상태를 방지합니다. 서버 DB의 트랜잭션 원자성까지 보장하는 방식은 아닙니다.

### Partial write와 DB 트랜잭션 경합

현재 실제 DB 쓰기 연동은 완료되지 않았지만 클라이언트 계약은 다음과 같이 정의했습니다.

- 여러 테이블을 수정하는 작업은 하나의 DB 트랜잭션으로 처리하고 실패 시 전체 롤백합니다.
- AI Job 생성은 호출자가 만든 `Idempotency-Key`를 재시도에서도 그대로 사용합니다.
- 사용자·취향·아이템·스타일 플랜 수정은 `version` 기반 낙관적 잠금을 사용합니다.
- 버전 충돌은 `409 RESOURCE_VERSION_CONFLICT`로 처리합니다.
- 프런트엔드는 서버 성공 응답 전 영구 상태로 확정하지 않으며, optimistic update를 사용한다면 롤백 상태를 함께 정의합니다.

### 상품 태그 계약

```text
STYLE: CASUAL, FORMAL, NEAT, GLAMOROUS
SEASON: SPRING, SUMMER, AUTUMN, WINTER, ALL_SEASON
OCCASION: DAILY, DATE, TRAVEL, GATHERING, CEREMONY, OUTDOOR, OTHER
FEATURE: COMPACT, SPACIOUS, MULTIWAY
```

장소 카테고리는 `CAFE`, `RESTAURANT`, `CULTURE`, `ATTRACTION`, `SHOPPING`이며, 분류할 수 없는 값만 내부 Fallback인 `OTHER`를 사용합니다.

### 추천 기능 구분

| 기능 | 사용자 입력·분석 기준 | 결과 |
| --- | --- | --- |
| 홈 취향 제품 리스트 | AI가 분석한 사용자의 취향 정보 | 취향 일치도가 높은 제품을 홈에 표시 |
| 스마트 착용 추천 | 사용자가 선택한 무드와 스타일 강도 | STYLE_PLAN과 어울리는 제품 조합을 생성 |
| MCM 제품 추천 | 취향 STYLE과 요청 OCCASION·SEASON·FEATURE | 서버 점수가 높은 MCM 제품을 최대 3개 추천 |

세 기능은 목적과 입력값이 다르므로 같은 요청 DTO와 상태로 처리하지 않습니다. 독립 MCM 추천은 `POST /recommendations`, 스마트 착용 추천은 `STYLE_PLAN` AI Job으로 구분합니다.

### AI 취향 분석과 홈 제품 리스트

```text
사용자의 취향 입력 수집
→ PREFERENCE_ANALYSIS AI Job
→ 취향 색상·카테고리·STYLE 태그와 요약 저장
→ 저장된 취향 분석 결과로 홈 제품 목록 구성
→ GET /home의 preferenceProducts로 반환
```

- 취향 분석은 사용자의 취향을 해석해 홈에 표시할 제품 리스트의 기준을 만드는 데 사용합니다.
- 홈 요청 자체는 AI를 새로 호출하지 않고 가장 최근에 저장된 취향 분석 결과를 조회합니다.
- 취향 분석이 완료되지 않았거나 표시할 상품이 없으면 `preferenceProducts: []`를 반환합니다.
- 홈 취향 제품 리스트는 저장된 취향을 집계한 결과이며, 매번 OCCASION·SEASON·FEATURE를 선택하는 `/recommendations` 화면 결과와 별도입니다.

### 추천 제품 리스트 점수

추천 제품 리스트는 서버 `RULE_BASED` 방식으로 계산합니다.

| 평가 항목 | 최대 점수 |
| --- | ---: |
| STYLE | 30점 |
| OCCASION | 25점 |
| SEASON | 25점 |
| FEATURE | 20점 |
| 합계 | 100점 |

서버는 저장된 취향 STYLE과 요청의 OCCASION·현재 SEASON·선호 FEATURE를 후보 MCM 제품 태그와 비교해 항목별 점수, 총점, 순위와 추천 이유를 반환합니다. AI가 후보 상품 중 추천 대상을 선택하는 방식은 사용하지 않습니다.

### 구매 전 활용 가능성 분석 기준

구매 전 활용 가능성은 AI를 호출하지 않고 백엔드 `RULE_BASED` 방식으로만 계산합니다.

| 분석 기준 | API 필드 | 최대 점수 |
| --- | --- | ---: |
| 취향 태그 일치 | `preferenceTagFitScore` | 30점 |
| 내 아이템과 스타일 조합 | `styleCombinationScore` | 25점 |
| 계절 활용성 | `seasonUsabilityScore` | 25점 |
| 현재 보유 카테고리와의 조합 | `ownedCategoryCombinationScore` | 20점 |

프런트는 `POST /purchase-utility-analyses`로 분석을 요청하고 점수·조합 결과·서버 정형 설명을 한 번에 받습니다. `PURCHASE_UTILITY`는 AI Job Type으로 사용하지 않습니다.

### 장소 추천 방식

장소 후보 확보와 점수 계산은 모두 백엔드 책임입니다. 프런트는 백엔드가 응답한 위도·경도만 지도 좌표로 사용합니다.

```text
백엔드가 실제 장소 후보를 확보
→ 백엔드가 카테고리·거리·요청 조건 등으로 점수 계산
→ 점수 내림차순으로 rank와 reason 생성
→ 프런트가 백엔드 위도·경도를 받아 OpenFreeMap 지도에 마커 표시
```

- 장소 점수와 정렬은 백엔드가 담당하며 프런트에서 다시 계산하지 않습니다.
- 프런트는 MapLibre GL JS로 OpenFreeMap 벡터 지도를 렌더링하고 백엔드 응답 좌표를 마커로 표시합니다.
- 프런트는 Kakao SDK, Kakao REST API, Kakao API Key를 사용하지 않습니다.
- 장소 추천은 별도 OpenAI 호출을 사용하지 않습니다.
- 장소 추천 점수는 카테고리 적합도 최대 60점과 거리 최대 40점으로 계산하며 `place-ranking-v1` 정책 버전을 함께 반환합니다.

### 이미지 업로드 UX

아이템 이미지는 선택 사항입니다. 이미지가 없거나 업로드에 실패해도 아이템 등록과 다음 화면 이동을 막지 않습니다.

- 이미지 미선택: 수동으로 입력한 아이템 정보만 저장하고 기본 이미지를 표시합니다.
- 업로드 실패: 작성한 폼과 선택한 이미지 미리보기를 유지하고 `다시 시도`, `다른 사진 선택`, `이미지 없이 계속`을 제공합니다.
- `이미지 없이 계속`: 이미지 업로드를 건너뛰고 아이템을 생성한 뒤 다음 화면으로 이동합니다.
- 아이템 생성 후 이미지 실패: 생성된 아이템을 롤백하지 않고 상세 화면에서 이미지를 나중에 추가할 수 있게 합니다.
- 이미지가 없는 API 응답은 목록에서 `primaryImageUrl: null`, 상세에서 `images: []`를 사용합니다.
- 이미지 분석이 불가능하면 AI 추정값 대신 사용자가 입력·확인한 카테고리·색상·소재를 저장합니다.

### AI 실패와 Fallback

AI Job 상태는 다음 단방향 흐름을 따릅니다.

```text
PENDING → PROCESSING → SUCCEEDED
                     ↘ FAILED
```

- `SUCCEEDED`와 `FAILED`는 종료 상태이며 이전 상태로 돌아가지 않습니다.
- AI 처리에 실패해도 Job 조회 API 자체는 `200`과 `{ success: true, data }`를 반환합니다.
- 실패 여부는 HTTP 오류가 아니라 `data.status: "FAILED"`로 판단합니다.
- `FAILED` 응답은 `result: null`, 화면에 사용할 타입별 `fallback`, 사용자 분기용 `error`를 포함합니다.
- 프런트는 fallback으로 화면을 계속 구성하고 필요한 경우 AI 결과 대신 기본 추천 또는 직접 입력 UX를 제공합니다.
- 인증 실패, 잘못된 Job ID, 요청 형식 오류처럼 API 요청 자체가 실패한 경우에만 일반 오류 응답을 사용합니다.

AI Job Polling은 다음 값으로 고정합니다.

| 항목 | 값 |
| --- | ---: |
| 조회 간격 | 2초 |
| 최대 조회 시간 | 30초 |
| 최대 조회 횟수 | 15회 |

- `SUCCEEDED` 또는 `FAILED`를 받으면 즉시 Polling을 종료합니다.
- 사용자가 화면을 벗어나면 `AbortController`로 진행 중인 조회를 취소하고 다음 Polling을 예약하지 않습니다.
- 네트워크 응답 시간을 포함한 실제 경과 시간이 30초에 도달하면 진행 중인 조회를 취소하고 자동 Polling을 종료합니다.
- 30초 종료는 프런트 조회만 중단하며 백엔드 Job 상태를 변경하지 않습니다.
- 고정 2초 간격이므로 지수 백오프는 사용하지 않습니다.

## 예외 처리 현황

| 시나리오 | 현재 동작 | 추가로 필요한 결정 |
| --- | --- | --- |
| 일반 API 응답 지연 | 10초 후 Axios 타임아웃 | 오류 코드별 자동 재시도와 백오프 여부 |
| AI Job 접수 지연 | 20초 후 Axios 타임아웃 | 서버 처리 결과 재조회 기준 |
| AI 처리 실패 | `200`, `success: true`, `status: FAILED`와 fallback 반환 | AI 유형별 fallback 데이터 확정 |
| 추천 필터 연속 변경 | 이전 요청 취소, 최신 요청만 반영 | 실제 API 연동 후 취소 응답 로깅 기준 |
| 추천 상품 조회 실패 | 오류 메시지와 수동 재시도 제공 | 오류 코드별 문구와 모니터링 연동 |
| 존재하지 않는 상품 ID | Next.js `notFound()` 처리 | 브랜드에 맞는 404 화면 |
| 아이템 중복 제출 | 로딩 중 제출 버튼 비활성화 | 서버 중복 검사 범위 |
| AI Job 중복 제출 | `Idempotency-Key` 전달 틀 구현 | Key 보관 기간과 클라이언트 재시도 UI |
| 동시 수정 | 요청의 `version`과 409 오류 타입 정의 | 충돌 후 병합 또는 덮어쓰기 UX |
| 아이템 이름 누락 | 공백 제거 후 이름이 없으면 제출 버튼 비활성화 | 전체 필드 Validation 계약 |
| 새로고침 | 동적 상품 상세 경로를 정적 생성해 직접 접근 가능 | 실제 상품 조회 로딩·오류 상태 |
| 상세 화면 뒤로가기 | 같은 Origin 방문 기록이 있으면 뒤로 이동하고, 없으면 추천 목록으로 이동 | 없음 |
| 인증 만료 | `/auth/refresh` 단일 실행 후 원 요청 1회 재시도 | 만료 시 로그인 화면 이동 정책 |
| Refresh 실패 | Access Token과 공개 사용자 정보 제거 | 사용자 안내 문구 |
| 환경변수 누락 | Axios `baseURL`이 비어 요청이 실패할 수 있음 | 앱 시작 시 fail-fast 검증 여부 |
| 지도 로딩 지연 | 2초 이상 지연될 때 지도 영역에 로더 표시 | 타일 제공자 장애 시 대체 지도 정책 |
| 예상하지 못한 렌더링 오류 | 전용 Error Boundary 없음 | `error.tsx`와 최종 fallback UI |

사용자에게는 이해 가능한 메시지만 표시하고, 토큰·비밀번호·개인정보·서버 내부 오류·스택 트레이스를 화면이나 로그에 남기지 않습니다.

## 설계 가정

| ID | 설계 가정 | 근거와 검증 | 가정이 틀릴 때의 대응 | 상태 |
| --- | --- | --- | --- | --- |
| ASM-001 | 클라이언트 실행 환경은 Node.js 22입니다. | `.nvmrc`, `engines`, CI에서 검증합니다. | 로컬 Node 버전을 22로 변경합니다. | 확정 |
| ASM-002 | URL은 `src/app`의 App Router만 관리합니다. | 프로덕션 빌드의 Route 목록으로 검증합니다. | `src/pages`를 추가하지 않고 App Router 경로로 이동합니다. | 확정 |
| ASM-003 | UI는 390px 모바일 프레임을 기준으로 하되 작은 화면에서는 전체 너비를 사용합니다. | `MobileScreenLayout`과 모바일 브라우저 렌더링으로 확인합니다. | 추가 breakpoint와 화면별 overflow를 점검합니다. | 현재 기준 |
| ASM-004 | 상품·장소·아이템 화면은 실제 백엔드 연결 전까지 더미 데이터를 사용합니다. | `src/data`와 각 Zustand store에서 확인합니다. | 도메인 API 응답을 화면 ViewModel로 변환해 교체합니다. | 임시 |
| ASM-005 | API ID는 문자열, 원화 가격은 원 단위 정수를 사용합니다. | TypeScript 타입과 API 공통 규칙으로 검증합니다. | 백엔드 DTO와 프런트 타입을 함께 변경합니다. | 확정 |
| ASM-006 | Access Token은 메모리, Refresh Token은 HttpOnly Cookie에 저장합니다. | `useAuthStore`, Axios 인터셉터, `AuthStoreHydrator`로 확인합니다. | 인증 방식 변경 시 저장·CSRF·CORS 정책을 재검토합니다. | 확정 |
| ASM-007 | 운영 환경의 동시 사용자 수와 허용 응답 시간은 아직 확정되지 않았습니다. | 부하 테스트와 운영 요구사항이 없습니다. | 목표 지표 확정 후 캐시·페이지네이션·재시도 정책을 조정합니다. | 미정 |
| ASM-008 | 최소 지원 브라우저 버전은 아직 확정되지 않았습니다. | 브라우저 지원 정책이 없습니다. | MapLibre, CSS, 애니메이션 지원 범위를 기준으로 명시합니다. | 미정 |

## UI 공통 정책

- `MobileScreenLayout`이 모바일 프레임과 고정 하단 메뉴 영역을 관리합니다.
- `BottomNavigation`을 모든 메뉴 화면에서 재사용합니다.
- `DetailActionCard`를 상품 상세와 활용 가능성 결과의 회색 정보 카드에 재사용합니다.
- `LuxuryReveal`을 화면 진입 시 페이드·상승·블러 효과에 재사용합니다.
- `AnimatedCounter`는 시작과 끝이 느리고 중앙이 빠른 점수 증가 애니메이션을 제공합니다.
- `prefers-reduced-motion: reduce` 환경에서는 장식 애니메이션을 제거하거나 최종 값을 즉시 표시합니다.

## 폴더 구조

```text
src/
├─ app/                                  # App Router 페이지와 전역 설정
│  ├─ dashboard/page.tsx
│  ├─ design-system/page.tsx
│  ├─ items/
│  │  ├─ image-retry/page.tsx
│  │  ├─ new/page.tsx
│  │  └─ page.tsx
│  ├─ login/page.tsx
│  ├─ my/
│  │  ├─ page.tsx
│  │  └─ account-deletion/page.tsx
│  ├─ place/page.tsx
│  ├─ preferences/page.tsx
│  ├─ recommendations/
│  │  ├─ page.tsx
│  │  └─ [productId]/
│  │     ├─ page.tsx
│  │     └─ value-check/page.tsx
│  ├─ screen22/page.tsx
│  ├─ screen24/page.tsx
│  ├─ screen26/page.tsx
│  ├─ screen27/page.tsx
│  ├─ smart-recommendations/page.tsx
│  ├─ signup/page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ auth/                              # 로그인·회원가입 화면
│  ├─ common/                            # 여러 기능에서 사용하는 공통 UI
│  │  ├─ button/
│  │  ├─ card/
│  │  ├─ feedback/
│  │  ├─ layout/
│  │  ├─ motion/
│  │  ├─ navigation/
│  │  ├─ selection/
│  │  └─ section/
│  ├─ cover/                             # 커버 화면
│  ├─ care/                              # 활용도·재활용 알림·관리 가이드 화면
│  ├─ dashboard/                         # 로그인 후 홈 화면
│  ├─ design-system/                     # 디자인 시스템 확인 화면
│  ├─ items/                             # 아이템 목록·등록 화면
│  ├─ my/                                # 사용자 화면
│  ├─ place/                             # 장소 추천·지도
│  ├─ preferences/                       # 영구 저장 취향 선택 화면
│  ├─ recommendations/                   # 스마트 착용 추천 화면
│  ├─ products/                          # 추천 상품 목록·상세·활용 가능성
│  └─ providers/                         # 전역 클라이언트 초기화
├─ data/                                 # 백엔드 연결 전 더미 데이터
├─ lib/
│  ├─ apiError.ts                        # 공통 오류 응답 해석
│  └─ axios.ts                           # Axios·Bearer·401 재발급
├─ services/
│  └─ api/
│     ├─ authApi.ts                      # 인증
│     ├─ catalogApi.ts                   # 상품·추천·찜
│     ├─ closetApi.ts                    # 아이템·사용 기록·활용도·패스포트·관리 가이드·이미지
│     ├─ intelligenceApi.ts              # AI 취향·이미지·스타일·장소
│     ├─ profileApi.ts                   # 사용자·취향·홈
│     ├─ utilityApi.ts                   # 구매 활용성 Rule-Based 분석
│     └─ index.ts                        # 통합 진입점
├─ store/                                # Zustand 전역 상태
└─ types/
   ├─ api.ts                             # API v0.3 계약 타입
   ├─ menu.ts
   ├─ place.ts
   └─ product.ts                         # 화면 ViewModel 타입
```

### 폴더 사용 원칙

- `app`에는 URL을 만드는 `page.tsx`, 루트 레이아웃, 전역 CSS만 둡니다.
- 화면 구현은 도메인별 `components` 폴더에 둡니다.
- 두 기능 이상에서 사용할 UI는 `components/common`으로 이동합니다.
- API 호출은 `services/api`에서 도메인별로 나누고 공용 Axios 설정은 `lib`, 공유 상태는 `store`에서 관리합니다.
- API DTO는 `types/api.ts`, 화면 렌더링에 맞춘 ViewModel은 기존 도메인 타입에 두고 변환 함수로 경계를 분리합니다.
- 더미 데이터와 타입은 각각 `data`, `types`에 분리합니다.

## 명령어

```bash
npm run dev        # 개발 서버 실행
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 빌드 실행
npm run lint       # ESLint 검사
npm run type-check # TypeScript 검사
```

## CI

`main` 브랜치의 push와 pull request에서 다음 검사를 실행합니다.

1. Node.js 22 설정
2. `npm ci`
3. `npm run lint`
4. `npm run type-check`
5. `npm run build`

## API 연동 진행 상태

현재 반영된 항목:

- [x] `{ success, data }`, `{ success: false, error }` 공통 타입
- [x] Access Token 메모리 저장과 Bearer Header 첨부
- [x] Refresh Cookie 전송과 401 동시 재발급 잠금
- [x] 일반 요청 10초, AI Job 접수 20초 타임아웃
- [x] 페이지 응답과 0-based 페이지 타입
- [x] `Idempotency-Key`, `version`, `RESOURCE_VERSION_CONFLICT` 계약
- [x] 인증·사용자·상품·아이템·AI·장소 도메인 API 모듈 분리
- [x] FEATURE를 `COMPACT`, `SPACIOUS`, `MULTIWAY`로 확정
- [x] MCM 상품 추천을 서버 `RULE_BASED` 방식으로 확정
- [x] 추천 제품 점수를 STYLE 30·OCCASION 25·SEASON 25·FEATURE 20으로 확정
- [x] 찜을 `/products/{productId}/favorite`, 저장 장소를 `/places/{placeId}/saved`로 정규화
- [x] 구매 전 활용 가능성을 AI Job에서 분리하고 Rule-Based API로 연결
- [x] AI 취향 분석 결과를 홈 제품 리스트에 사용
- [x] 장소 추천을 카테고리 60점·거리 40점의 서버 `RULE_BASED` 방식으로 확정
- [x] 착용·사용 기록, 활용도, 재활용 추천 API 계약 반영
- [x] 제품 패스포트와 관리 가이드·일정 조회 API 계약 반영
- [x] LOCAL 비밀번호·SOCIAL OAuth 탈퇴 재인증과 비동기 회원 탈퇴 화면 연결
- [x] AI Job을 2초 간격, 네트워크 시간을 포함해 최대 30초로 Polling
- [x] 이미지 미등록·업로드 실패 시에도 아이템 등록 진행

실제 화면 연결 또는 후속 정책 구현이 필요한 항목:

- [ ] 구매 효용 Factor 내부 세부 산식을 `purchase-utility-rule-v1` 테스트로 고정
- [ ] 활용도 세부 산식과 LOW·MEDIUM·HIGH 경계를 `utilization-v1` 테스트로 고정
- [ ] 실제 응답을 화면 ViewModel로 변환하는 Mapper 구현
- [ ] 사용 기록·활용도·패스포트·관리 가이드 화면을 실제 API에 연결
- [ ] 환경변수 누락 시 fail-fast 처리 결정
- [ ] 공통 Error Boundary와 오류 코드별 사용자 메시지 추가
- [ ] 운영 모니터링과 외부 서비스 장애 대체 정책 확정

## MVP 범위 결정

### 확정 제외

- 중고 거래, 판매 글, 소유권 이전과 재판매 가치 분석
- 세척·수선·보관 등의 아이템 관리 기록
- 관리 기록 생성·조회·수정·삭제 화면과 API

관련 DB 구조가 존재하더라도 이번 MVP에서는 프런트 화면과 API 연동 범위에 포함하지 않습니다.

### 확정 포함

- 착용·사용 기록
- 아이템 활용도 분석
- 오래 사용하지 않은 아이템 안내와 Rule-Based 재활용 추천
- 제품 정보·구매 정보·사용 이력을 모은 제품 패스포트
- 관리 가이드·관리 일정
