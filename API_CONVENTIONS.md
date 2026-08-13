# 입을래? API 공통 규칙

> 프론트엔드와 백엔드가 분리된 저장소에서 동일한 기준으로 API를 설계하고 연동하기 위한 팀 공통 규칙이다.
>
> 기준 명세: `입을래? 프론트–백엔드 API 명세서 검토 반영본 v0.2` (2026-08-12)

## 1. 핵심 합의 사항

| 항목            | 팀 규칙                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| API 공통 경로   | 도메인 말단에 `/api`를 사용하며 `v1,v2,MVP`와 같은 경로는 사용하지 않는다. |
| 환경별 주소     | 소스 코드에 직접 작성하지 않고 환경변수로 관리한다.                        |
| 요청 경로       | 환경변수에 `/api`를 포함하고, 개별 요청에는 리소스 경로만 작성한다.        |
| 인증            | Access Token은 프런트 메모리, Refresh Token은 HttpOnly Cookie로 관리한다.  |
| 성공 응답       | `{ "success": true, "data": ... }`                                         |
| 오류 응답       | `{ "success": false, "error": { "code", "message" } }`                     |
| Validation 오류 | `error.fields` 배열에 필드별 오류를 담는다.                                |
| 날짜·시간       | ISO 8601 형식을 사용한다.                                                  |
| 기준 시간대     | 서버·DB·API는 UTC, 화면 표시는 `Asia/Seoul`을 사용한다.                    |
| Enum            | 영문 대문자 `SNAKE_CASE`를 사용한다.                                       |
| 값 없음         | 단일 값은 `null`, 목록은 `[]`을 반환한다.                                  |
| ID              | API에서는 문자열로 전달한다.                                               |
| 원화 금액       | 원 단위 정수로 전달한다.                                                   |
| 목록 조회       | `page`, `size`, `sort` 기반 페이지네이션을 사용한다.                       |
| 동시 수정       | `version` 기반 낙관적 잠금과 `RESOURCE_VERSION_CONFLICT`를 사용한다.       |
| AI 요청         | `Idempotency-Key`로 중복 생성과 부분 반영을 방지한다.                      |

---

## 2. API 기본 주소와 `/api` 위치

### 2.1 기본 주소

API의 공통 경로는 `/api`로 통일한다. 별도의 버전 경로인 `/v1`은 붙이지 않는다.

```text
로컬 개발: http://localhost:8080/api
운영 환경: https://서비스도메인/api
```

운영 브라우저는 Railway 백엔드를 직접 호출하지 않고 프런트 도메인의 `/api/**` 프록시를 사용한다.

```text
Browser → Vercel /api/** → Railway Backend
```

프론트엔드와 백엔드가 운영 환경에서 같은 도메인을 사용한다면 운영 환경의 값은 다음처럼 상대 경로로 둘 수 있다.

```env
NEXT_PUBLIC_API_BASE_URL=/api
```

브라우저가 백엔드 서버를 직접 호출하는 로컬 개발 환경의 예시는 다음과 같다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

`NEXT_PUBLIC_`이 붙은 환경변수는 브라우저에 공개될 수 있다. API 기본 주소는 공개되어도 되는 값이지만, API 키나 비밀번호 같은 비밀 값은 절대 넣지 않는다.

### 2.2 환경변수 파일 관리

- 실제 값은 `.env.local` 등 배포 환경에 맞는 파일이나 배포 서비스 설정에 저장한다.
- 실제 환경변수 파일은 Git에 올리지 않는다.
- 변수 이름과 예시만 담은 `.env.example`은 저장소에 올린다.

`.env.example` 예시:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 2.3 Axios 공통 인스턴스

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

환경변수에 이미 `/api`가 포함되어 있으므로 개별 요청에는 `/api`를 다시 붙이지 않는다.

```ts
// 권장: GET http://localhost:8080/api/products
api.get("/products");

// 금지: /api가 중복될 수 있음
api.get("/api/products");
```

### 2.4 인증 토큰과 사용자 정보 저장

| 데이터 | 저장 위치 | 전송 방식 | 수명 |
| --- | --- | --- | --- |
| Access Token | Zustand 메모리 상태 | `Authorization: Bearer` | 30분 |
| Refresh Token | 백엔드 발급 HttpOnly Cookie | Cookie | 14일 |
| 공개 사용자 정보 | Zustand persist를 통한 localStorage | API Body에 사용하지 않음 | 로그아웃까지 |

- Access Token은 로그인·회원가입·재발급 성공 응답 Body에서 받는다.
- Access Token을 localStorage나 sessionStorage에 저장하거나 Zustand persist 대상에 포함하지 않는다.
- 새로고침으로 Access Token이 사라지면 `/auth/refresh`를 한 번 호출해 메모리 상태를 복원한다.
- Refresh Token은 JavaScript로 읽지 않으며 Axios의 `withCredentials: true`로 전송한다.
- 화면 표시용 사용자 정보만 `userId`, `email`, `nickname`, `gender`, `profileImageUrl` 범위에서 localStorage에 저장한다.
- localStorage 값은 인증·인가의 근거로 신뢰하지 않으며 권한 판단은 서버가 JWT `sub`로 수행한다.
- 로그아웃은 Access Token과 Refresh Cookie를 함께 보내며, 성공 여부와 관계없이 프런트 메모리 세션을 제거한다.
- 운영 Refresh Cookie는 `refresh_token`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/api/auth`, `Max-Age=1209600`을 기준으로 한다.
- 브라우저의 인증 관련 POST는 신뢰 Origin을 검증하고 OAuth Callback은 `oauth_state` Cookie와 Query `state`를 검증한다.

---

## 3. URL 및 요청 작성 규칙

- 리소스 이름은 복수 명사와 소문자 케밥 표기법을 사용한다.
- 동작을 URL에 넣기보다 HTTP Method로 표현한다.
- 경로의 ID 이름은 어떤 리소스의 ID인지 알 수 있게 작성한다.
- 검색·필터·정렬·페이지 정보는 Query Parameter로 전달한다.

```http
GET    /api/products
GET    /api/products/{productId}
POST   /api/products
PATCH  /api/products/{productId}
DELETE /api/products/{productId}

GET /api/style-recommendations?page=0&size=20&sort=createdAt,desc
```

다음과 같이 동사를 URL에 중복해서 쓰는 방식은 피한다.

```http
POST /api/createProduct
GET  /api/getProducts
```

---

## 4. 성공 응답 형식

### 4.1 단일 객체

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "MCM 가방",
    "price": 1250000,
    "currency": "KRW"
  }
}
```

### 4.2 배열

페이지네이션을 사용하지 않는 작은 목록은 `data`에 배열을 담는다.

```json
{
  "success": true,
  "data": [
    {
      "code": "CASUAL",
      "label": "캐주얼"
    }
  ]
}
```

### 4.3 응답 본문이 없는 성공

삭제처럼 반환할 데이터가 없다면 `204 No Content`를 사용하고 응답 본문을 보내지 않는다. `204` 응답에 JSON 본문을 함께 보내지 않는다.

### 4.4 HTTP 상태 코드

| 상황                        |                   상태 코드 |
| --------------------------- | --------------------------: |
| 조회·수정 성공              |                    `200 OK` |
| 생성 성공                   |               `201 Created` |
| 비동기 작업 접수·탈퇴 요청  |              `202 Accepted` |
| 성공했지만 반환할 본문 없음 |            `204 No Content` |
| 잘못된 요청·Validation 실패 |           `400 Bad Request` |
| 인증 필요                   |          `401 Unauthorized` |
| 권한 없음                   |             `403 Forbidden` |
| 리소스 없음                 |             `404 Not Found` |
| 중복 또는 현재 상태와 충돌  |              `409 Conflict` |
| 호출 제한 초과              |   `429 Too Many Requests` |
| 외부 서비스 장애            |           `502 Bad Gateway` |
| 외부 서비스 Timeout         |         `504 Gateway Timeout` |
| 서버 내부 오류              | `500 Internal Server Error` |

---

## 5. 페이지네이션 규칙

### 5.1 요청 형식

목록이 계속 늘어날 수 있는 API는 기본적으로 페이지네이션을 적용한다.

```http
GET /api/products?page=0&size=20&sort=createdAt,desc
```

| 파라미터 | 규칙                                   |           기본값 |
| -------- | -------------------------------------- | ---------------: |
| `page`   | `0`부터 시작한다. 첫 페이지는 `0`이다. |              `0` |
| `size`   | 한 페이지의 항목 수이다.               |             `20` |
| `sort`   | `필드명,정렬방향` 형식이다.            | `createdAt,desc` |

- `size`의 최댓값은 `100`으로 제한한다.
- 정렬 방향은 `asc` 또는 `desc`만 사용한다.
- 여러 정렬 조건이 필요하면 `sort`를 반복해서 보낼 수 있다.
- 지원하지 않는 정렬 필드는 `400 Bad Request`로 처리한다.

```http
GET /api/products?page=0&size=20&sort=status,asc&sort=createdAt,desc
```

### 5.2 페이지 응답 형식

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "123",
        "name": "MCM 가방"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 41,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

조회 결과가 없을 때도 `items`는 `null`이 아니라 빈 배열을 반환한다.

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

프론트 화면에서 사용자에게 보이는 페이지 번호는 필요하면 `page + 1`로 표시한다. API 요청과 응답의 `page` 값은 항상 0부터 시작한다.

---

## 6. 일반 오류 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "상품을 찾을 수 없습니다."
  }
}
```

- `code`는 프론트엔드가 오류 종류를 구분할 때 사용하는 고정된 영문 코드이다.
- `message`는 사용자 안내 또는 개발 중 확인을 위한 설명이다.
- 프론트엔드는 `message` 문자열을 비교하지 않고 `code`를 기준으로 분기한다.
- 서버의 예외 메시지, SQL, 파일 경로, 스택 트레이스 등 내부 정보는 응답에 노출하지 않는다.

```ts
if (error.code === "PRODUCT_NOT_FOUND") {
  // 상품 없음 화면 표시
}
```

오류 코드는 대문자 `SNAKE_CASE`를 사용하며, 가능한 한 `대상_원인` 형태로 작성한다.

```text
PRODUCT_NOT_FOUND
EMAIL_ALREADY_EXISTS
ACCESS_TOKEN_EXPIRED
FILE_SIZE_EXCEEDED
```

---

## 7. Validation 오류 형식

입력값 검증이 실패하면 `400 Bad Request`와 함께 잘못된 필드를 배열로 반환한다.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값을 확인해 주세요.",
    "fields": [
      {
        "field": "email",
        "reason": "올바른 이메일 형식이 아닙니다."
      },
      {
        "field": "password",
        "reason": "비밀번호는 8자 이상이어야 합니다."
      }
    ]
  }
}
```

- `field`는 프론트 요청 DTO의 필드명과 정확히 일치시킨다.
- 한 필드에 오류가 여러 개여도 우선순위가 가장 높은 오류 하나만 반환한다.
- 여러 필드가 잘못되었다면 가능한 한 한 번에 모두 반환한다.
- 요청 본문 자체가 없거나 JSON 문법이 잘못된 경우에는 `fields` 없이 일반 오류 형식을 사용할 수 있다.

---

## 8. 날짜·시간과 기준 시간대

### 8.1 형식

ISO 8601 형식으로 통일한다.

| 데이터 종류        | 형식          | 예시                   |
| ------------------ | ------------- | ---------------------- |
| 특정 시각          | UTC 날짜·시간 | `2026-08-05T07:30:00Z` |
| 날짜만 의미하는 값 | `YYYY-MM-DD`  | `2026-08-05`           |
| 시간만 의미하는 값 | `HH:mm:ss`    | `16:30:00`             |

`2026/08/05`, `08-05-2026`, `2026년 8월 5일`처럼 화면 표시용으로 가공한 값을 API에서 보내지 않는다.

### 8.2 시간대

- 서버와 DB 저장: UTC
- API 요청·응답: UTC
- 프론트 화면 표시: `Asia/Seoul`
- 생일, 행사일 등 날짜 자체만 의미하는 값: 시간대 변환 없이 `YYYY-MM-DD`

예를 들어 API가 `2026-08-05T07:30:00Z`를 반환하면 프론트는 한국 시간 `2026-08-05 16:30`으로 표시한다.

---

## 9. Enum 표현

Enum은 영문 대문자 `SNAKE_CASE`로 전달한다.

```json
{
  "status": "IN_PROGRESS",
  "style": "STREET_CASUAL",
  "season": "SPRING"
}
```

사용자에게 보일 한글 문구는 프론트에서 변환한다.

```ts
const statusLabel = {
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
} as const;
```

상품 태그는 종류를 섞지 않고 `STYLE`, `SEASON`, `OCCASION`, `FEATURE`로 구분한다.

```text
STYLE
- CASUAL
- FORMAL
- NEAT
- GLAMOROUS

SEASON
- SPRING
- SUMMER
- AUTUMN
- WINTER
- ALL_SEASON

OCCASION
- DAILY
- DATE
- TRAVEL
- GATHERING
- CEREMONY
- OUTDOOR
- OTHER

FEATURE
- LIGHTWEIGHT
- COMPACT
- SPACIOUS
```

`EXHIBITION`, `CAFE`는 Occasion이 아니라 장소 카테고리다.

---

## 10. `null`, 빈 배열, 빈 문자열

| 상황                               | 반환값                                         |
| ---------------------------------- | ---------------------------------------------- |
| 선택값이 아직 없거나 설정되지 않음 | `null`                                         |
| 목록에 항목이 없음                 | `[]`                                           |
| 문자열 입력이 비어 있음            | 빈 문자열 자체가 의미 있을 때만 `""`           |
| 필드가 API 계약에 있지만 값이 없음 | 필드를 생략하지 않고 `null` 또는 정해진 기본값 |

```json
{
  "nickname": null,
  "profileImageUrl": null,
  "items": []
}
```

- 배열은 항상 배열로 반환하여 프론트에서 바로 `map`, `filter` 등을 사용할 수 있게 한다.
- 선택 필드가 응답마다 사라지지 않게 하여 프론트 타입을 안정적으로 유지한다.
- 공백 문자열을 `null` 대신 사용하지 않는다.

---

## 11. ID와 금액 자료형

### 11.1 ID

DB에서 숫자로 저장하더라도 API 요청과 응답에서는 문자열로 전달한다.

```json
{
  "id": "1234567890123456789",
  "productId": "987654321"
}
```

JavaScript의 안전한 정수 범위를 넘는 ID가 숫자로 전달될 때 값이 달라질 수 있으므로, 모든 ID를 문자열로 통일한다.

### 11.2 금액

원화 금액은 원 단위 정수와 통화 코드를 함께 전달한다.

```json
{
  "price": 1250000,
  "currency": "KRW"
}
```

API에서 `"1,250,000원"`처럼 표시용 문자열을 보내지 않는다. 쉼표와 통화 표시는 프론트에서 처리한다.

```ts
`${price.toLocaleString("ko-KR")}원`;
```

---

## 12. 인증 재발급과 로그아웃

### 12.1 앱 시작

```text
Zustand 사용자 정보 복원
→ POST /auth/refresh
→ 성공 시 Access Token을 메모리에 저장
→ 실패 시 비로그인 상태로 확정
→ 인증 초기화 완료 표시
```

Refresh Cookie가 없는 방문자의 `401`은 정상적인 비로그인 초기 상태이므로 사용자 오류로 표시하지 않는다.

### 12.2 보호 API의 401

1. 실패한 요청이 이미 재시도된 요청인지 확인한다.
2. 진행 중인 재발급 Promise가 있으면 새 재발급을 만들지 않고 같은 Promise를 기다린다.
3. 재발급 성공 시 새 Access Token을 저장하고 원래 요청을 한 번만 재시도한다.
4. 재발급 실패 시 메모리 토큰과 공개 사용자 정보를 제거한다.
5. 로그인·회원가입·이메일 인증 같은 공개 인증 API의 `401`은 재발급하지 않는다.

무한 재시도와 여러 Refresh Token의 동시 회전을 방지하기 위해 재발급은 항상 단일 실행으로 잠근다.

### 12.3 로그아웃

```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
Cookie: refresh_token=...
```

- 백엔드는 Refresh Token을 폐기하고 Cookie를 삭제한다.
- 이미 폐기된 Token이나 없는 Cookie도 멱등 성공으로 처리할 수 있다.
- 성공 응답은 `204 No Content`다.
- 프런트는 요청 성공 여부와 관계없이 로컬 세션을 제거한다.

---

## 13. 동시성·중복 요청·부분 쓰기

### 13.1 조회 요청 경합

- 필터나 페이지가 바뀌면 이전 조회의 `AbortController`를 취소한다.
- 요청 번호를 증가시키고 최신 번호와 일치하는 응답만 상태에 반영한다.
- 검증이 끝난 응답 스냅샷을 한 번의 Zustand `set`으로 반영한다.

### 13.2 수정 충돌

- 사용자, 취향, 아이템, 스타일 플랜 수정 요청에는 현재 `version`을 포함한다.
- 서버는 낙관적 잠금으로 버전을 확인한다.
- 충돌 시 `409 RESOURCE_VERSION_CONFLICT`를 반환한다.
- 프런트는 최신 데이터를 다시 불러온 뒤 사용자가 재시도하도록 안내한다.

### 13.3 생성 요청 멱등성

AI Job 생성은 호출자가 만든 UUID를 `Idempotency-Key` Header로 전달한다.

```http
POST /api/ai-jobs
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

- 같은 사용자·같은 Key·같은 Body는 기존 Job을 반환한다.
- 같은 Key에 다른 Body가 오면 `IDEMPOTENCY_KEY_CONFLICT`를 반환한다.
- 네트워크 재시도에서는 새 Key를 만들지 않고 최초 Key를 재사용한다.
- 여러 테이블을 변경하는 서버 작업은 하나의 DB 트랜잭션으로 처리하고 실패 시 전체 롤백한다.
- 프런트는 서버 성공 전에 영구 상태로 확정하지 않으며 낙관적 UI를 사용하면 롤백 상태를 함께 정의한다.

---

## 14. 이미지와 AI Job

### 14.1 아이템 이미지 등록 순서

이미지는 UserItem 생성의 필수 조건이 아니다.

이미지를 정상적으로 분석하고 등록하는 흐름:

```text
원본 File을 브라우저 메모리에 보관
→ AI_INPUT 서명 발급과 업로드
→ ITEM_ANALYSIS Job 완료
→ 사용자가 분석 결과 확인·수정
→ UserItem 생성
→ 같은 원본 File을 ITEM 용도로 다시 업로드
→ AI_INPUT 정리
```

이미지를 선택하지 않았거나 업로드에 실패한 흐름:

```text
사용자가 아이템 정보를 직접 입력·확인
→ POST /my-items
→ 이미지 없이 생성 완료
→ 다음 화면으로 이동
→ 필요하면 아이템 상세에서 ITEM 이미지 추가
```

- `AI_INPUT` 이미지를 `ITEM` 이미지로 직접 승격하지 않는다.
- ITEM 이미지는 최대 3장, PROFILE은 최대 1장이다.
- 허용 형식은 JPG·PNG·WebP, 최대 크기는 10MB, 긴 변은 최대 1600px이다.
- 이미지 삭제는 `DELETE_PENDING`으로 전환한 뒤 외부 저장소에서 처리하며 재요청은 멱등 성공이다.
- 이미지 미선택, 서명 실패, 외부 업로드 실패, 완료 등록 실패는 UserItem 생성 차단 사유가 아니다.
- 이미지 없이 생성된 아이템은 목록의 `primaryImageUrl`을 `null`, 상세의 `images`를 `[]`로 반환한다.
- 이미지 실패 때문에 UserItem에 별도 상태값을 추가하지 않는다. 이미지 생명주기는 `ImageAssetStatus`로 관리한다.
- 아이템이 먼저 생성된 뒤 ITEM 이미지 업로드가 실패하면 아이템을 롤백하거나 삭제하지 않는다.
- 프런트는 입력 폼과 미리보기를 유지하고 `다시 시도`, `다른 사진 선택`, `이미지 없이 계속`을 제공한다.
- `이미지 없이 계속`을 선택하면 업로드 요청을 취소하고 아이템 생성 성공 화면으로 이동한다.
- 완료 등록 API만 실패했다면 같은 `publicId`와 업로드 결과로 완료 등록만 멱등 재시도하며 파일을 중복 업로드하지 않는다.

### 14.2 AI Job 정책

- AI Job 유형은 `PREFERENCE_ANALYSIS`, `ITEM_ANALYSIS`, `STYLE_PLAN`만 사용한다.
- `PURCHASE_UTILITY`는 AI Job 유형에서 제거한다.
- 상태는 `PENDING → PROCESSING → SUCCEEDED` 또는 `PENDING → PROCESSING → FAILED`로만 전이한다.
- `SUCCEEDED`, `FAILED`는 종료 상태다.
- 사용자당 동시 실행은 1개다.
- 사용자당 하루 최대 10회다.
- 외부 처리 Timeout은 20초다.
- 서버 자동 재시도는 최대 1회다.
- 동일 사용자·동일 입력 결과는 24시간 캐시할 수 있다.
- 클라이언트 Polling은 2초 간격으로 최대 30초 동안 수행한다.
- 최대 Polling 조회 횟수는 15회다.
- `SUCCEEDED` 또는 `FAILED`를 받으면 즉시 Polling을 종료한다.
- 화면 이탈 시 진행 중 요청을 취소하고 다음 Polling을 예약하지 않는다.
- 30초 경과는 프런트 자동 조회 중단을 뜻하며 백엔드 Job을 취소하지 않는다.
- 시간 초과 후 사용자가 `다시 확인`을 선택하면 새 Job을 만들지 않고 같은 `jobId`를 조회한다.
- Polling은 고정 2초 간격이며 지수 백오프를 사용하지 않는다.

AI Provider 처리 실패와 HTTP API 실패는 구분한다.

- Job 생성·조회 요청 자체가 정상 처리됐다면 Job이 `FAILED`여도 `200 OK`와 성공 Envelope를 반환한다.
- 프런트는 HTTP 상태가 아니라 `data.status`를 기준으로 Job 완료 여부를 판단한다.
- `FAILED`에서는 `result`가 `null`, `fallback`과 `error`는 필수다.
- `fallback`은 AI 유형별 대체 화면을 구성할 수 있는 정상 데이터 객체다.
- 인증·인가 실패, 잘못된 요청, 존재하지 않는 Job은 기존 일반 오류 Envelope를 사용한다.

`FAILED` Job 조회 예시:

```json
{
  "success": true,
  "data": {
    "jobId": "9001",
    "type": "PREFERENCE_ANALYSIS",
    "status": "FAILED",
    "cached": false,
    "result": null,
    "fallback": {
      "preferredColors": [],
      "preferredCategories": [],
      "preferredStyleTags": [],
      "summary": "기본 제품을 먼저 보여드릴게요."
    },
    "error": {
      "code": "AI_PROVIDER_UNAVAILABLE",
      "message": "AI 취향 분석을 완료하지 못했습니다."
    },
    "createdAt": "2026-08-13T01:30:00Z",
    "completedAt": "2026-08-13T01:30:20Z"
  }
}
```

---

## 15. 확정 전 P0와 제안 Endpoint

다음 항목은 팀 합의 전 구현 계약으로 고정하지 않는다.

- 회원 탈퇴 시 LOCAL 비밀번호 재확인과 소셜 재인증 범위
- 추천 항목 안에서 복수 태그 일치율을 계산하는 세부 공식
- 구매 활용성 네 기준의 배점과 최종 점수 계산식
- 장소 추천의 카테고리·거리·기타 조건별 가중치
- `/favorites`, `/saved-places` Endpoint명 최종 승인

홈 API는 기존 결과를 집계하는 조회 전용이며 새 추천, AI Job, OpenAI, Kakao Local 호출을 시작하지 않는다.

### 15.1 AI 취향 분석과 홈 제품 리스트

취향 분석은 사용자의 취향을 분석해 홈 화면의 제품 리스트를 구성하는 용도로 사용한다.

```text
사용자 취향 입력
→ PREFERENCE_ANALYSIS AI Job 생성·완료
→ preferredColors / preferredCategories / preferredStyleTags / summary 저장
→ 저장된 취향 결과를 기준으로 홈 제품 목록 구성
→ GET /home의 preferenceProducts로 반환
```

- 홈 API 호출 시 새 AI Job을 만들지 않는다.
- 가장 최근에 저장된 취향 분석 결과만 조회한다.
- 취향 분석 전이거나 매칭 상품이 없으면 `preferenceProducts: []`를 반환한다.
- 홈의 `preferenceProducts`는 보유 제품 기반 추천 API의 `products`와 다른 결과다.
- 홈 제품 Item은 `productId`, `name`, `preferenceMatchScore`, `primaryImageUrl`을 반환한다.

### 15.2 추천 기능 분리

#### 스마트 착용 추천

```text
사용자가 원하는 무드 선택
→ 드래그바로 스타일 강도 선택
→ 선택한 조건에 맞는 제품 추천
```

- 사용자가 이번 추천의 의도를 직접 입력하는 기능이다.
- 추천 제품 리스트와 Request DTO, Zustand 상태, 캐시 Key를 공유하지 않는다.
- 무드 Enum, 드래그바 축·범위·단계, Endpoint는 별도 합의 후 확정한다.

#### 추천 제품 리스트

추천 제품 리스트는 사용자가 보유한 제품의 분석 결과를 입력으로 사용하는 서버 `RULE_BASED` 기능이다.

| 항목 | 최대 점수 | JSON 필드 |
| --- | ---: | --- |
| STYLE | 30 | `styleScore` |
| OCCASION | 25 | `occasionScore` |
| SEASON | 25 | `seasonScore` |
| FEATURE | 20 | `featureScore` |
| 합계 | 100 | `totalScore` |

```text
보유 제품 분석 결과
+ 후보 MCM 상품의 STYLE / OCCASION / SEASON / FEATURE 태그
→ 항목별 점수와 총점 계산
→ 총점 내림차순 순위와 추천 이유 반환
```

- AI가 후보 상품 중 추천 상품을 선택하지 않는다.
- 추천 응답의 `generationType`은 `RULE_BASED`다.
- 응답의 기존 `score`와 `scoreBreakdown.totalScore`는 같은 값이어야 한다.
- 각 점수는 0 이상이며 항목별 최대 점수를 넘을 수 없다.
- `totalScore = styleScore + occasionScore + seasonScore + featureScore`다.
- 총점 동률 정렬 기준과 복수 태그 일치율의 세부 계산식은 별도로 확정한다.
- 추천 결과가 없으면 `200`과 `products: []`를 반환한다.
- MCM 상품에 연결되지 않은 보유 아이템은 현재 `ITEM_ANALYSIS`와 DB에 추천용 태그가 없어 분석·저장 계약을 추가로 합의해야 한다.

### 15.3 구매 전 활용 가능성 분석

구매 전 활용 가능성은 AI를 사용하지 않고 백엔드 `RULE_BASED` 방식으로 다음 네 가지 기준을 계산한다.

| 기준 | JSON 필드 | 설명 |
| --- | --- | --- |
| 내 아이템과 스타일 조합 가능 | `itemStyleCompatibility` | 구매 후보와 현재 보유 아이템의 스타일 조합 가능성 |
| 취향 태그 일치 | `preferenceTagMatch` | 구매 후보 태그와 사용자 취향 태그의 일치도 |
| 현재 보유 카테고리와의 조합 | `ownedCategoryCompatibility` | 구매 후보 카테고리와 보유 카테고리 구성의 조합 가능성 |
| 계절 활용성 | `seasonalUtility` | 상품의 SEASON 태그를 기준으로 한 계절 활용 범위 |

- 기존 `categoryCompatibility`, `colorCompatibility`, `styleCompatibility`, `duplicationPenalty` 계약은 사용하지 않는다.
- 중고·재판매 기능이 없으므로 재판매 가치와 관리 난이도는 구매 활용 가능성 평가 기준에서 제외한다.
- 네 점수는 `factors` 객체에 구조화해 반환한다.
- 항목별 최대 점수, 가중치와 최종 `utilityScore` 계산식은 별도로 확정한다.
- `POST /api/purchase-utility-analyses`는 `{ "productId": "101" }`를 받아 동기식으로 분석한다.
- 이 요청은 AI Job, `Idempotency-Key`, AI 폴링을 사용하지 않는다.
- 분석이 완료되면 `status: READY`와 `analysis`를 반환한다.
- 분석 근거가 부족하면 분석 Row를 만들지 않고 `status: INSUFFICIENT_DATA`, `analysis: null`, 안내 메시지를 반환한다.

### 15.4 장소 추천 방식

장소 추천은 Kakao Local의 실제 장소 데이터와 백엔드 `RULE_BASED` 점수 계산을 사용한다.

```text
Backend → Kakao Local API로 장소 후보 검색
→ (provider, providerPlaceId) 기준 places Upsert
→ category / distance / 요청 조건 등으로 점수 계산
→ score 내림차순으로 rank와 reason 생성
→ Frontend에 장소 좌표와 추천 결과 반환
→ MapLibre GL JS가 OpenFreeMap 지도에 마커 표시
```

역할을 다음과 같이 분리한다.

| 구성 요소 | 역할 |
| --- | --- |
| Kakao Local API | 실제 장소명, 카테고리, 주소, 좌표, 장소 URL 제공 |
| Backend | 장소 캐시, 카테고리·거리·조건 점수 계산, 정렬, 추천 이유 생성 |
| MapLibre GL JS + OpenFreeMap | 백엔드가 반환한 좌표와 순위를 지도와 마커로 표시 |

- Kakao REST API Key는 백엔드 비밀 환경변수에서만 관리한다.
- 프런트는 Kakao JavaScript SDK Key를 사용하지 않고 Kakao Local API를 직접 호출하지 않는다.
- 추천 결과는 `rank`, `score`, `reason`, `place`를 반환한다.
- `score`는 서버가 계산하며 프런트는 다시 계산하거나 순서를 변경하지 않는다.
- 추천 결과는 필요하면 `style_plan_places`에 저장한다.
- 별도 OpenAI 호출과 `PLACE_RECOMMENDATION` AI Job은 사용하지 않는다.
- 카테고리·거리·기타 조건별 가중치와 동률 정렬 기준은 별도로 확정한다.
- Kakao 장애·Timeout은 각각 `PLACE_PROVIDER_UNAVAILABLE`과 외부 서비스 상태 코드로 처리한다.

### 15.5 마이 아이템 구매 후 MVP 범위

세척·수선·보관 등의 관리 기록은 MVP에서 제외한다.

- 중고 거래, 판매 글, 소유권 이전, 재판매 가치 분석 기능을 만들지 않는다.
- 관리 기록 화면을 만들지 않는다.
- 관리 기록 Controller와 Endpoint를 정의하지 않는다.
- 기존 DB에 `CareRecord` 구조가 있더라도 이번 API 연동 범위에는 포함하지 않는다.
- 착용·사용 기록, 활용도 분석, 미사용 아이템 재활용 추천, 제품 패스포트·디지털 ID, 관리 가이드·일정은 별도 합의 전까지 포함 여부를 확정하지 않는다.

---

## 16. API 변경의 분류

변경 전에 프론트 영향도를 기준으로 다음과 같이 분류한다.

### 16.1 호환 가능한 변경

- 응답에 새로운 선택 필드 추가
- 새로운 API Endpoint 추가
- 새로운 선택 Query Parameter 추가
- 기존 동작을 바꾸지 않는 문서·설명 수정

### 16.2 호환성이 깨지는 변경

- Endpoint 또는 HTTP Method 변경
- 기존 요청·응답 필드의 삭제 또는 이름 변경
- 필드 자료형 변경
- 필수 요청 필드 추가
- Enum 값의 삭제 또는 이름 변경
- `null` 가능 여부 변경
- 페이지네이션 구조 또는 시작 번호 변경
- 기존 상태 코드나 오류 코드의 의미 변경

---

## 17. 분리된 프론트·백엔드 저장소에서 API 변경 공유 방법

---

프론트가 원하는 응답 구조가 있다고 해서 프론트 저장소에서 API 계약을 먼저 확정하지 않는다.

1. 프론트에서 백엔드 저장소에 API 변경 요청 Issue를 생성한다.
2. 현재 불편한 점과 원하는 요청·응답 예시를 작성한다.
3. 백엔드 담당자와 변경 가능 여부 및 형식을 합의한다.
4. 백엔드 담당자는 해당 협의안을 코드에 적용한다.(PR 또는 직접 작성)
5. 프론트는 확정된 백엔드 PR을 기준으로 구현한다.

Issue 제목 예시:

```text
[API 요청] 상품 목록 응답에 대표 이미지 URL 추가
```

기존 프론트가 바로 깨지는 변경이라면 백엔드가 잠시 이전 필드와 새 필드를 함께 제공하는 방식이 가장 안전하다.(배포 후 참고)

```json
{
  "image": "https://example.com/old.jpg",
  "imageUrl": "https://example.com/new.jpg"
}
```

프론트 전환과 배포가 끝난 뒤 별도 백엔드 PR에서 이전 필드를 제거한다.

---

## 18. API 변경 PR 템플릿

백엔드 저장소의 `.github/pull_request_template.md` 또는 API 변경 PR 본문에 다음 양식을 사용한다.

````md
## 변경 유형

- [ ] 새로운 API 추가
- [ ] 호환 가능한 변경
- [ ] 호환성이 깨지는 변경
- [ ] 문서만 변경

## 대상 API

- Method: `GET`
- Path: `/api/products`

이후 카톡 또는 깃허브 PR로 변경했다고 알려주기.

## 변경 이유

상품 목록 데이터가 많아질 때 전체 데이터를 한 번에 불러오는 문제를 막기 위해 페이지네이션을 적용합니다.

## 변경 전

```json
{
  "success": true,
  "data": []
}
```

## 변경 후

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

## 요청 규칙

- `page`: 0부터 시작, 기본값 0
- `size`: 기본값 20, 최댓값 100
- `sort`: `필드명,asc|desc`

## 프론트 영향

- 목록 타입을 배열에서 페이지 객체로 변경해야 합니다.
- `data.items`를 기준으로 렌더링해야 합니다.
- 페이지 이동 시 `page`, `size`를 Query Parameter로 전달해야 합니다.

## 오류 및 상태 코드

- `200`: 조회 성공
- `400`: 잘못된 페이지·정렬 조건

## 관련 작업

- Backend Issue: #번호
- Frontend Issue/PR: 상대 저장소 URL 또는 `없음`

## 적용 및 배포 순서

1. 백엔드 개발 서버 배포
2. 프론트 연동 확인
3. 프론트 병합 및 배포

## 확인 체크리스트

- [ ] 프론트 담당자가 변경 내용을 확인했습니다.
- [ ] 기존 API 사용자에게 미치는 영향을 확인했습니다.
- [ ] 테스트와 CI가 통과했습니다.
- [ ] 팀 채널에 PR 링크와 적용 환경을 공유했습니다.
````

### 18.1 PR 제목 규칙

```text
[API] 상품 목록 페이지네이션 적용
[API] 추천 결과에 reason 필드 추가
[API][Breaking] image 필드를 imageUrl로 변경
```

호환성이 깨지는 변경은 제목에 `[Breaking]`을 추가한다.

---

## 19. 프론트 대응 PR 템플릿

```md
## 관련 API 변경

- Backend PR: 상대 백엔드 저장소 PR URL
- 대상 API: `GET /api/products`

## 프론트 변경 내용

- 페이지 응답 타입을 추가했습니다.
- 상품 목록을 `data.items`로 렌더링하도록 수정했습니다.
- 페이지 이동 시 `page`, `size`를 전달하도록 수정했습니다.

## 연동 환경

- [ ] Mock 데이터
- [ ] 로컬 백엔드
- [ ] 개발 서버

## 확인 항목

- [ ] 첫 페이지 조회
- [ ] 다음·이전 페이지 이동
- [ ] 빈 목록 처리
- [ ] 로딩 처리
- [ ] 일반 오류 처리
- [ ] Validation 오류 처리
```

---

## 20. API 변경 완료 조건

다음 조건을 모두 만족해야 API 변경이 완료된 것으로 본다.

- [ ] 구현 코드가 완료되었다.
- [ ] 성공, 일반 오류, Validation 오류가 공통 형식을 따른다.
- [ ] 페이지네이션이 필요한 목록에 공통 페이지 형식을 적용했다.
- [ ] 백엔드 테스트와 CI가 통과했다.
- [ ] 프론트 영향도를 PR에 작성했다.
- [ ] 필요한 프론트 Issue/PR과 상호 링크했다.
- [ ] 프론트 담당자가 개발 환경에서 연동을 확인했다.
- [ ] 병합·배포 순서가 필요한 경우 양쪽 담당자가 확인했다.

---
