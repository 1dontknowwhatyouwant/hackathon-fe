# Hackathon FE

Next.js App Router 기반의 해커톤 프런트엔드 프로젝트입니다.

## 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Zustand

## 시작하기

의존성을 설치하고 개발 서버를 실행합니다.

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 환경변수

`.env.example`을 복사해 `.env.local`을 만들고 API 주소를 설정합니다.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run lint       # ESLint 검사
npm run type-check # TypeScript 검사
```

## 기본 구조

```text
src/
├─ app/             # 페이지, 레이아웃, 전역 스타일
├─ lib/axios.ts     # Axios 공용 인스턴스
└─ store/           # Zustand 전역 상태
```
