# 데이터베이스 설정 가이드

PostgreSQL을 설치했지만 PATH에 추가되지 않은 경우입니다. 다음 단계를 따라 진행하세요.

## 1. PostgreSQL 설치 위치 확인

macOS에서 PostgreSQL은 여러 방법으로 설치할 수 있습니다:

### A. Homebrew로 설치한 경우
```bash
# PostgreSQL 경로 확인
brew --prefix postgresql

# PATH에 추가 (zsh의 경우)
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 서비스 시작
brew services start postgresql
```

### B. PostgreSQL.app으로 설치한 경우
1. Applications 폴더에서 PostgreSQL.app 찾기
2. PostgreSQL.app 실행
3. 서버가 실행되면 사용 가능

### C. Homebrew가 없는 경우
```bash
# Homebrew 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# PostgreSQL 설치
brew install postgresql@16

# 서비스 시작
brew services start postgresql@16
```

## 2. 데이터베이스 생성

PostgreSQL이 실행 중이면:

```bash
# 데이터베이스 생성
createdb order_app

# 또는 psql을 통한 생성
psql postgres -c "CREATE DATABASE order_app;"

# 스키마 실행
psql order_app < database/schema.sql

# 데이터 확인
psql order_app -c "SELECT * FROM menus;"
```

## 3. 데이터베이스가 이미 존재하는 경우

```bash
# 기존 데이터베이스 삭제 후 재생성
dropdb order_app
createdb order_app
psql order_app < database/schema.sql
```

## 4. .env 파일 확인

데이터베이스 연결 정보가 올바른지 확인:

```bash
cd server
cat .env
```

기본 설정:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_app
DB_USER=postgres
DB_PASSWORD=postgres
```

## 5. 연결 테스트

서버를 실행하고 테스트:

```bash
cd server
npm run dev
```

다른 터미널에서:
```bash
# 기본 엔드포인트 테스트
curl http://localhost:3000/

# 메뉴 조회 테스트
curl http://localhost:3000/api/menus
```

## 문제 해결

### PostgreSQL을 찾을 수 없는 경우

**Homebrew로 설치:**
```bash
# Homebrew 설치 확인
which brew

# 없다면 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# PostgreSQL 설치
brew install postgresql@16

# 서비스 시작
brew services start postgresql@16

# PATH 추가
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### PostgreSQL 서비스가 실행되지 않는 경우

```bash
# 서비스 상태 확인
brew services list

# PostgreSQL 시작
brew services start postgresql

# 또는 수동 시작
pg_ctl -D /opt/homebrew/var/postgresql@16 start
```

### 패스워드를 설정하지 않은 경우

기본 PostgreSQL 사용자는 패스워드가 없을 수 있습니다. .env 파일에서:

```env
DB_PASSWORD=
```

또는 사용자가 이미 설정한 패스워드를 .env 파일에 입력하세요.

