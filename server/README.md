# COZY 백엔드 서버

## 프로젝트 개요

커피 주문 앱의 백엔드 서버입니다. Express.js와 PostgreSQL을 사용하여 구현되었습니다.

## 기술 스택

- **프레임워크**: Node.js, Express.js
- **데이터베이스**: PostgreSQL
- **ORM**: pg (PostgreSQL client)
- **미들웨어**: CORS, dotenv

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 데이터베이스 설정

1. PostgreSQL 설치 및 실행
2. 데이터베이스 생성:
   ```bash
   createdb order_app
   ```
3. 스키마 생성:
   ```bash
   psql order_app < database/schema.sql
   ```

### 3. 환경 변수 설정

`.env` 파일을 수정하여 데이터베이스 연결 정보를 설정합니다:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_app
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. 서버 실행

**개발 모드** (nodemon 사용):
```bash
npm run dev
```

**프로덕션 모드**:
```bash
npm start
```

서버가 `http://localhost:3000` 에서 실행됩니다.

## API 엔드포인트

### 메뉴 관련

- **GET /api/menus**: 전체 메뉴 목록 조회
- **PATCH /api/menus/:id/stock**: 메뉴 재고 수정

### 주문 관련

- **GET /api/orders**: 주문 목록 조회
- **POST /api/orders**: 새로운 주문 생성
- **PATCH /api/orders/:id/status**: 주문 상태 업데이트

## 데이터베이스 구조

### Tables
- `menus`: 메뉴 정보
- `options`: 메뉴 옵션
- `orders`: 주문 정보
- `order_items`: 주문 상세 정보
- `order_item_options`: 주문 상품 옵션

## 프로젝트 구조

```
server/
├── config/
│   └── database.js        # 데이터베이스 연결 설정
├── routes/
│   ├── menus.js           # 메뉴 라우터
│   └── orders.js           # 주문 라우터
├── database/
│   └── schema.sql         # 데이터베이스 스키마
├── server.js              # 메인 서버 파일
├── .env                   # 환경 변수 설정
├── package.json
└── README.md
```

## 주요 기능

- ✅ 메뉴 조회 (옵션 포함)
- ✅ 주문 생성 (재고 차감)
- ✅ 주문 목록 조회
- ✅ 주문 상태 업데이트
- ✅ 재고 수정
- ✅ 에러 처리

## 개발 참고사항

- CORS 활성화 (프런트엔드 연동을 위해)
- 환경 변수는 `.env` 파일에서 관리
- 데이터베이스 연결 풀 사용 (pg Pool)
- 트랜잭션 처리 (주문 생성 시)

