require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./config/database')

const app = express()

// 미들웨어
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 라우트
app.use('/api/menus', require('./routes/menus'))
app.use('/api/orders', require('./routes/orders'))

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

