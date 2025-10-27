// 데이터베이스 연결 테스트 스크립트
require('dotenv').config()
const pool = require('../config/database')

async function testConnection() {
  try {
    console.log('데이터베이스 연결 테스트 시작...')
    
    // 연결 테스트
    const result = await pool.query('SELECT NOW() as current_time, current_database() as database')
    console.log('✅ 연결 성공!')
    console.log('데이터베이스:', result.rows[0].database)
    console.log('현재 시간:', result.rows[0].current_time)
    
    // 테이블 존재 확인
    console.log('\n테이블 존재 확인:')
    const tables = ['menus', 'options', 'orders', 'order_items', 'order_item_options']
    
    for (const table of tables) {
      const tableCheck = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      )
      
      const exists = tableCheck.rows[0].exists
      console.log(`  ${table}: ${exists ? '✅' : '❌'}`)
    }
    
    // 메뉴 데이터 확인
    const menuCount = await pool.query('SELECT COUNT(*) as count FROM menus')
    console.log(`\n📊 저장된 메뉴 수: ${menuCount.rows[0].count}`)
    
    if (menuCount.rows[0].count > 0) {
      const menus = await pool.query('SELECT name, stock FROM menus LIMIT 5')
      console.log('\n메뉴 목록:')
      menus.rows.forEach(menu => {
        console.log(`  - ${menu.name}: ${menu.stock}개`)
      })
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ 연결 실패:', error.message)
    console.error('\n문제 해결 방법:')
    console.error('1. PostgreSQL이 설치되어 있는지 확인')
    console.error('2. PostgreSQL 서비스가 실행 중인지 확인')
    console.error('3. .env 파일의 데이터베이스 설정이 올바른지 확인')
    console.error('4. server/SETUP_DB.md 파일 참조')
    process.exit(1)
  }
}

testConnection()

