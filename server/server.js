require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./config/database')

const app = express()

// CORS 설정
let corsOptions = { origin: true }
if (process.env.NODE_ENV === 'production' && process.env.ALLOWED_ORIGIN) {
  corsOptions = {
    origin: process.env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  }
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 라우트
// API 라우트 (표준 경로)
app.use('/api/menus', require('./routes/menus'))
app.use('/api/orders', require('./routes/orders'))

// 호환 라우트 (환경변수에 /api가 누락된 경우 대비)
app.use('/menus', require('./routes/menus'))
app.use('/orders', require('./routes/orders'))

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'COZY 백엔드 서버가 실행 중입니다.' })
})

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: true, 
    message: err.message || '서버 내부 에러가 발생했습니다.',
    code: 'INTERNAL_ERROR' 
  })
})

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ 
    error: true, 
    message: '요청한 리소스를 찾을 수 없습니다.',
    code: 'NOT_FOUND' 
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`)
})

