# Japari client

React, Vite 기반의 Japari web client입니다. Node.js 22.12 이상이 필요합니다.

## 환경 변수

프로젝트 루트의 `.env`에 다음 값을 설정합니다.

```dotenv
VITE_OAUTH_GITHUB_AUTH_SERVER=
VITE_OAUTH_GOOGLE_AUTH_SERVER=
VITE_SOCKET_SERVER_URL=
```

## 실행

```bash
npm ci
npm start
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다. `/api` 요청은 `http://localhost:4000`으로 전달됩니다.

## 빌드

```bash
npm run build
```

배포 산출물은 `build` 디렉터리에 생성됩니다.

## Storybook

```bash
npm run storybook
npm run build-storybook
```
