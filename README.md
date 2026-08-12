# 입을래? Frontend

보유 아이템과 사용자 취향을 기반으로 어울리는 장소와 상품의 활용 가능성을 추천하는 모바일 중심 서비스입니다.

Next.js App Router로 화면과 URL을 관리하며, 백엔드 연동 전에도 주요 사용자 흐름을 확인할 수 있도록 더미 데이터를 제공합니다. API 계약의 상세 기준은 [`API_CONVENTIONS.md`](./API_CONVENTIONS.md)를 따릅니다.

## 기술 스택과 선택 이유

| 기술 | 버전 | 선택 이유 |
| --- | --- | --- |
| Node.js | 22 | `.nvmrc`, `package.json`의 `engines`, GitHub Actions에서 같은 버전을 사용해 개발 환경 차이를 줄입니다. |
| Next.js | 16 | App Router의 파일 기반 라우팅과 서버·클라이언트 컴포넌트 분리를 사용합니다. 동적 상품 상세 경로는 정적 생성합니다. |
| React | 19 | 화면을 기능별 컴포넌트로 나누고 상태 변화에 따라 선언적으로 렌더링합니다. |
| TypeScript | strict | API 응답, 화면 데이터, 컴포넌트 Props를 타입으로 명시해 잘못된 데이터 사용을 개발 단계에서 발견합니다. |
| Tailwind CSS | 4 | 모바일 화면의 간격과 상태별 스타일을 컴포넌트 가까이에서 빠르게 관리합니다. 공통 애니메이션과 외부 라이브러리 스타일은 전역 CSS에 둡니다. |
| Axios | 1 | 공용 인스턴스에서 API 기본 주소, credential 전송, JSON 헤더, 10초 타임아웃을 일관되게 적용합니다. |
| Zustand | 5 | 인증 사용자 정보와 여러 화면에서 공유하는 비동기 상태를 적은 보일러플레이트로 관리합니다. |
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
```

- API 공통 경로 `/api`까지 환경변수에 포함합니다.
- 개별 API 요청에는 `/products`, `/items`처럼 리소스 경로만 작성합니다.
- `NEXT_PUBLIC_` 변수는 브라우저에 노출될 수 있으므로 API 키, 토큰, 비밀번호를 저장하지 않습니다.
- 환경변수를 변경한 뒤에는 개발 서버를 다시 실행합니다.

## 주요 화면과 경로

| 경로 | 화면 | 상태 |
| --- | --- | --- |
| `/` | 커버 화면 | 구현 |
| `/design-system` | 디자인 시스템 확인 화면 | 구현 |
| `/place` | 룩 기반 장소 추천과 3D 지도 | 더미 장소 데이터 사용 |
| `/recommendations` | 추천 상품 목록과 카테고리 필터 | 더미 상품 데이터 사용 |
| `/recommendations/[productId]` | 추천 상품 상세 | 더미 상품별 정적 경로 생성 |
| `/recommendations/[productId]/value-check` | 구매 전 활용 가능성 결과 | 더미 점수와 분석 결과 사용 |
| `/items` | 보유 아이템 목록 | 더미 데이터 사용 |
| `/items/new` | 아이템 등록 | 더미 등록 동작 사용 |
| `/my` | 사용자 정보 | localStorage 사용자 정보 또는 더미 데이터 사용 |
| `/posts` | 협업 확인용 페이지네이션 화면 | 더미 데이터 사용 |

하단 메뉴의 현재 연결은 다음과 같습니다.

| 메뉴 | 경로 |
| --- | --- |
| 홈 | `/place` |
| 추천 | `/recommendations` |
| 등록 | `/items/new` |
| 아이템 | `/items` |
| MY | `/my` |

## 인증 및 사용자 정보 저장 정책

인증 토큰과 화면 표시용 사용자 정보는 분리해 저장합니다.

| 데이터 | 저장 위치 | 관리 주체 | 원칙 |
| --- | --- | --- | --- |
| Access·Refresh Token | 쿠키 | 백엔드 | 가능한 경우 `HttpOnly`, `Secure`, 적절한 `SameSite` 속성으로 발급하며 프런트엔드 JavaScript에서 읽지 않습니다. |
| 공개 사용자 정보 | localStorage | 프런트엔드 | `id`, `email`, `nickname`, `profileImageUrl`만 `useAuthStore`를 통해 저장합니다. |

- Axios는 `withCredentials: true`로 쿠키를 요청에 포함합니다.
- 토큰을 localStorage, sessionStorage 또는 Zustand 상태에 복사하지 않습니다.
- localStorage 값은 사용자가 변경할 수 있으므로 인증·인가 판단에 사용하지 않습니다.
- `useAuthStore`는 `skipHydration`을 사용하며 `AuthStoreHydrator`가 복원을 완료한 뒤 `hasHydrated`를 `true`로 변경합니다.
- 로그아웃 시 백엔드가 HttpOnly 쿠키를 만료시킨 뒤 프런트엔드의 공개 사용자 정보를 제거하는 것을 정책으로 합니다.
- 서로 다른 Origin에서 쿠키 인증을 사용하려면 백엔드가 명시적 허용 Origin과 credential 허용 설정을 제공해야 합니다.
- 상태 변경 요청의 CSRF 방어 방식은 백엔드와 합의해야 합니다.

## API와 비동기 상태 정책

### 공통 요청 설정

| 항목 | 현재 기준 |
| --- | --- |
| API 기본 주소 | `NEXT_PUBLIC_API_BASE_URL` |
| 공통 경로 | 환경변수에 `/api` 포함 |
| credential | `withCredentials: true` |
| Content-Type | `application/json` |
| 타임아웃 | 10초 |

타임아웃이 발생하면 Axios 요청은 실패로 처리됩니다. 사용자 메시지, 재시도 횟수, 백오프 정책은 API 연결 시 화면별 요구사항에 맞춰 공통 오류 계층으로 통합해야 합니다.

### 추천 상품 요청 경합

추천 상품 필터를 빠르게 전환할 때 이전 응답이 최신 결과를 덮지 않도록 다음 정책을 적용합니다.

1. 새 조회가 시작되면 기존 요청의 `AbortController`를 취소합니다.
2. 각 요청에 증가하는 요청 번호를 부여합니다.
3. 응답 시 현재 활성 요청 번호와 일치하는지 다시 확인합니다.
4. 취소됐거나 오래된 응답은 Zustand 상태에 반영하지 않습니다.
5. 검증을 마친 완성된 상품 배열과 상태를 한 번의 `set` 호출로 반영합니다.

이 방식은 클라이언트의 오래된 응답 경합과 목록 일부만 반영되는 상태를 방지합니다. 서버 DB의 트랜잭션 원자성까지 보장하는 방식은 아닙니다.

### Partial write와 DB 트랜잭션 경합

현재 실제 DB 쓰기 연동은 완료되지 않았습니다. 생성·수정 API를 연결하기 전에 백엔드와 아래 항목을 확정해야 합니다.

- 여러 테이블을 수정하는 작업은 하나의 DB 트랜잭션으로 처리하고 실패 시 전체 롤백합니다.
- 중복 제출이 가능한 생성 API는 idempotency key 또는 서버 중복 검사를 검토합니다.
- 동시에 같은 데이터를 수정할 수 있으면 optimistic locking, 버전 필드 또는 명시적인 잠금 정책을 정합니다.
- `409 Conflict`의 오류 코드와 사용자 재시도 흐름을 합의합니다.
- 프런트엔드는 서버 성공 응답 전 영구 상태로 확정하지 않으며, optimistic update를 사용한다면 롤백 상태를 함께 정의합니다.

## 예외 처리 현황

| 시나리오 | 현재 동작 | 추가로 필요한 결정 |
| --- | --- | --- |
| 외부 API 응답 지연 | 10초 후 Axios 타임아웃 | 공통 메시지, 자동 재시도와 백오프 여부 |
| 추천 필터 연속 변경 | 이전 요청 취소, 최신 요청만 반영 | 실제 API 연동 후 취소 응답 로깅 기준 |
| 추천 상품 조회 실패 | 오류 메시지와 수동 재시도 제공 | 오류 코드별 문구와 모니터링 연동 |
| 존재하지 않는 상품 ID | Next.js `notFound()` 처리 | 브랜드에 맞는 404 화면 |
| 아이템 중복 제출 | 로딩 중 제출 버튼 비활성화 | 서버 idempotency 정책 |
| 아이템 이름 누락 | 공백 제거 후 이름이 없으면 제출 버튼 비활성화 | 전체 필드 Validation 계약 |
| 새로고침 | 동적 상품 상세 경로를 정적 생성해 직접 접근 가능 | 실제 상품 조회 로딩·오류 상태 |
| 상세 화면 뒤로가기 | 같은 Origin 방문 기록이 있으면 뒤로 이동하고, 없으면 추천 목록으로 이동 | 없음 |
| 인증 만료 | 401 재발급 구현 주석만 존재 | 재발급 Endpoint, 동시 재발급 잠금, 최대 재시도 횟수 |
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
| ASM-004 | 상품·장소·아이템 데이터는 백엔드 계약 확정 전까지 더미 데이터를 사용합니다. | `src/data`와 각 Zustand store에서 확인합니다. | API 응답 타입을 확정한 뒤 더미 조회를 실제 호출로 교체합니다. | 임시 |
| ASM-005 | API ID는 문자열, 원화 가격은 원 단위 정수를 사용합니다. | TypeScript 타입과 API 공통 규칙으로 검증합니다. | 백엔드 DTO와 프런트 타입을 함께 변경합니다. | 팀 합의 필요 |
| ASM-006 | Access·Refresh Token은 백엔드가 쿠키로 관리합니다. | Axios credential 설정과 인증 정책으로 확인합니다. | 인증 방식 변경 시 저장·CSRF·CORS 정책을 재검토합니다. | 팀 합의 필요 |
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
│  ├─ design-system/page.tsx
│  ├─ items/
│  │  ├─ page.tsx
│  │  └─ new/page.tsx
│  ├─ my/page.tsx
│  ├─ place/page.tsx
│  ├─ posts/page.tsx
│  ├─ recommendations/
│  │  ├─ page.tsx
│  │  └─ [productId]/
│  │     ├─ page.tsx
│  │     └─ value-check/page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ common/                            # 여러 기능에서 사용하는 공통 UI
│  │  ├─ button/
│  │  ├─ card/
│  │  ├─ feedback/
│  │  ├─ layout/
│  │  ├─ motion/
│  │  ├─ navigation/
│  │  ├─ pagination/
│  │  └─ section/
│  ├─ cover/                             # 커버 화면
│  ├─ design-system/                     # 디자인 시스템 확인 화면
│  ├─ items/                             # 아이템 목록·등록 화면
│  ├─ my/                                # 사용자 화면
│  ├─ place/                             # 장소 추천·지도
│  ├─ posts/                             # 페이지네이션 협업 화면
│  ├─ products/                          # 추천 상품 목록·상세·활용 가능성
│  └─ providers/                         # 전역 클라이언트 초기화
├─ data/                                 # 백엔드 연결 전 더미 데이터
├─ lib/
│  └─ axios.ts                           # Axios 공용 인스턴스
├─ services/
│  └─ backendApi.ts                      # 백엔드 API 호출 틀
├─ store/                                # Zustand 전역 상태
└─ types/                                # 도메인 TypeScript 타입
```

### 폴더 사용 원칙

- `app`에는 URL을 만드는 `page.tsx`, 루트 레이아웃, 전역 CSS만 둡니다.
- 화면 구현은 도메인별 `components` 폴더에 둡니다.
- 두 기능 이상에서 사용할 UI는 `components/common`으로 이동합니다.
- API 호출은 `services`, 공용 Axios 설정은 `lib`, 공유 상태는 `store`에서 관리합니다.
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

## 백엔드 연동 전 확인 항목

- [ ] 성공 응답을 `API_CONVENTIONS.md`의 `{ success, data }` 형식으로 통일
- [ ] 오류 응답의 `code`, `message`, `fields` 계약 확정
- [ ] 401 재발급 Endpoint와 동시 재발급 방지 정책 확정
- [ ] 생성 API의 중복 제출 및 idempotency 정책 확정
- [ ] DB 트랜잭션, 충돌 감지, `409 Conflict` 처리 기준 확정
- [ ] CSRF와 CORS credential 정책 확정
- [ ] 환경변수 누락 시 fail-fast 처리 결정
- [ ] 공통 Error Boundary와 사용자 오류 메시지 체계 추가
- [ ] 운영 환경의 타임아웃·재시도·모니터링 기준 확정
