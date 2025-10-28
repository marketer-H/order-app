# Render 배포 가이드

## 1. 사전 준비

### 1.1 GitHub 저장소 푸시
```bash
git add .
git commit -m "배포 준비 완료"
git push
```

### 1.2 파일 확인
- `ui/public/` 폴더에 이미지 3개 있는지 확인
- `server/database/schema.sql` 파일 존재 확인

---

## 2. Render 데이터베이스 설정

### 2.1 PostgreSQL 생성
1. Render Dashboard → "New" → "PostgreSQL"
2. 이름: `order-app-db` (자유롭게)
3. Plan: Free
4. "Create Database" 클릭

### 2.2 스키마 적용
방법 A - psql 사용 (권장):
```bash
# Render DB 정보를 .env 파일에 설정 후
export PGPASSWORD="<Render DB Password>"
export PATH=/Library/PostgreSQL/18/bin:$PATH

psql "host=<Render DB Host> port=5432 dbname=<DB Name> user=<DB User> sslmode=require" \
  -f server/database/schema.sql
```

방법 B - Render 콘솔 사용:
1. PostgreSQL 인스턴스 클릭
2. "psql" 버튼 클릭
3. `server/database/schema.sql` 파일 내용 붙여넣기
4. 실행

### 2.3 데이터 확인
```bash
psql "host=<Host> port=5432 dbname=<DB Name> user=<User> sslmode=require" \
  -c "SELECT * FROM menus;"
```
→ 3개 메뉴가 나와야 함

---

## 3. 백엔드 배포 (Render Web Service)

### 3.1 서비스 생성
1. Render Dashboard → "New" → "Web Service"
2. GitHub 저장소 선택
3. 설정:
   - **Name**: `order-app-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3.2 환경변수 설정
"Environment" 탭에서 추가:

```
# 필수
NODE_ENV=production
PORT=10000

# 데이터베이스 (Render PostgreSQL 정보)
DB_HOST=<Render DB Host>
DB_PORT=5432
DB_NAME=<Render DB Name>
DB_USER=<Render DB User>
DB_PASSWORD=<Render DB Password>

# CORS (프런트엔드 도메인 - 프런트 배포 후 업데이트 필요)
ALLOWED_ORIGINS=https://order-app-frontend2.onrender.com
```

### 3.3 배포
"Create Web Service" 클릭

### 3.4 확인
배포 완료 후 브라우저에서:
`https://<your-backend>.onrender.com`
→ "COZY 백엔드 서버가 실행 중입니다." 메시지 확인

---

## 4. 프런트엔드 배포 (Render Static Site)

### 4.1 서비스 생성
1. Render Dashboard → "New" → "Static Site"
2. GitHub 저장소 선택
3. 설정:
   - **Name**: `order-app-frontend`
   - **Root Directory**: `ui`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 4.2 환경변수 설정
"Environment" 탭에서 추가:

```
# 필수 - 백엔드 API URL (끝에 /api 포함)
VITE_API_BASE_URL=https://<your-backend>.onrender.com/api

# 선택
VITE_APP_TITLE=easys cafe
```

⚠️ **중요**: `<your-backend>`를 실제 백엔드 URL로 변경하세요!

### 4.3 배포
"Create Static Site" 클릭

### 4.4 확인
배포 완료 후 브라우저에서 메뉴가 표시되는지 확인

---

## 5. 백엔드 CORS 업데이트

프런트엔드 배포 완료 후 백엔드 환경변수 업데이트:

1. 백엔드 Web Service → Environment 탭
2. `ALLOWED_ORIGINS` 수정:
   ```
   ALLOWED_ORIGINS=https://<your-frontend>.onrender.com
   ```
3. Save Changes → Manual Deploy 클릭

---

## 6. 문제 해결

### 메뉴가 안 보임
1. Render DB에 스키마 적용됐는지 확인
2. 프런트엔드 환경변수 `VITE_API_BASE_URL` 올바른지 확인
3. 브라우저 개발자도구 → Network 탭에서 `/api/menus` 요청 확인

### CORS 에러
1. 백엔드 `ALLOWED_ORIGINS`에 프런트엔드 도메인 정확히 입력했는지 확인
2. 백엔드 Manual Deploy 실행
3. 브라우저 캐시 삭제 (Ctrl+Shift+R)

### CSS가 안 보임
1. Static Site의 Publish Directory가 `dist`인지 확인
2. Build Command에 `npm run build` 있는지 확인
3. "Clear build cache & deploy" 실행

### 환경변수 변경 후 반영 안 됨
- **백엔드**: Manual Deploy만 실행
- **프런트엔드**: "Clear build cache & deploy" 실행 (중요!)

---

## 7. 체크리스트

배포 전:
- [ ] GitHub에 코드 푸시 완료
- [ ] `ui/public/` 폴더에 이미지 3개 있음
- [ ] `server/database/schema.sql` 파일 있음

배포 후:
- [ ] PostgreSQL 스키마 적용 완료
- [ ] 백엔드 서버 정상 작동
- [ ] 프런트엔드 서버 정상 작동
- [ ] 메뉴 3개 표시됨
- [ ] 주문 생성 가능
- [ ] 관리자 화면에서 주문 확인 가능
- [ ] 주문 상태 변경 가능

---

## 8. 유용한 명령어

### 로컬 DB에서 백업
```bash
pg_dump -h localhost -U postgres order_app > backup.sql
```

### Render DB에 복원
```bash
psql "host=<Render Host> port=5432 dbname=<DB> user=<User> sslmode=require" < backup.sql
```

### 환경변수 확인
Render Dashboard → 각 서비스 → Environment 탭

### 로그 확인
Render Dashboard → 각 서비스 → Logs 탭

