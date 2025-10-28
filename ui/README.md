# COZY - 커피 주문 앱

## 프로젝트 개요

사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 풀스택 웹 앱입니다.

## 기술 스택

- **프런트엔드**: React, JavaScript, CSS
- **빌드 도구**: Vite
- **패키지 관리**: npm

## 프로젝트 구조

```
ui/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── Header.jsx
│   │   └── Header.css
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── OrderPage.jsx
│   │   ├── OrderPage.css
│   │   ├── AdminPage.jsx
│   │   └── AdminPage.css
│   ├── App.jsx          # 메인 앱 컴포넌트
│   ├── App.css
│   ├── main.jsx         # 엔트리 포인트
│   └── index.css        # 전역 스타일
├── public/              # 정적 파일
├── index.html           # HTML 템플릿
├── package.json
└── vite.config.js
```

## 설치 및 실행 / 배포 환경변수

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 시작되면 브라우저에서 http://localhost:5173 으로 접속할 수 있습니다.

환경변수(Vite):

```
# 로컬(ui/.env.local)
VITE_API_BASE_URL=http://localhost:3000/api

# Render Static Site(대시보드 Environment)
VITE_API_BASE_URL=https://<your-api>.onrender.com/api
```

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 미리보기

```bash
npm run preview
```

빌드된 앱을 로컬에서 미리볼 수 있습니다.

## 주요 기능

### 주문하기 화면
- 메뉴 목록 표시
- 상품 옵션 선택 (샷 추가, 시럽 추가)
- 장바구니 기능
- 주문하기

### 관리자 화면
- 대시보드 (주문 통계)
- 재고 현황 조절
- 주문 현황 관리

## 개발 참고사항

- React 19.1 버전 사용
- 바닐라 JavaScript 사용 (TypeScript 미사용)
- 기본적인 상태 관리로 라우팅 구현
- CSS 파일로 스타일링
