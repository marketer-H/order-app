const express = require('express')
const router = express.Router()
const pool = require('../config/database')

// GET /api/orders - 전체 주문 목록 조회
router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    
    let query = `
      SELECT 
        o.id,
        o.order_date,
        o.status,
        o.total_amount,
        o.created_at,
        o.updated_at
      FROM orders o
    `
    
    const params = []
    if (status) {
      query += ' WHERE o.status = $1'
      params.push(status)
    }
    
    query += ' ORDER BY o.order_date DESC'
    
    const ordersResult = await pool.query(query, params)
    
    // 각 주문의 상세 정보 가져오기
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(`
          SELECT 
            oi.id,
            oi.menu_id,
            oi.quantity,
            oi.item_price,
            m.name as product_name,
            (SELECT json_agg(json_build_object('name', opt.name))
             FROM order_item_options oio
             JOIN options opt ON oio.option_id = opt.id
             WHERE oio.order_item_id = oi.id) as options
          FROM order_items oi
          JOIN menus m ON oi.menu_id = m.id
          WHERE oi.order_id = $1
        `, [order.id])
        
        return {
          id: order.id,
          orderDate: order.order_date,
          status: order.status,
          totalAmount: order.total_amount,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: itemsResult.rows.map(item => ({
            productName: item.product_name,
            options: item.options || [],
            quantity: item.quantity
          }))
        }
      })
    )
    
    res.json({ orders })
  } catch (error) {
    console.error('주문 조회 오류:', error)
    console.error('에러 스택:', error.stack)
    res.status(500).json({ 
      error: true, 
      message: '주문을 불러오는데 실패했습니다.',
      code: 'ORDERS_FETCH_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// POST /api/orders - 새로운 주문 생성
router.post('/', async (req, res) => {
  const client = await pool.connect()
  
  try {
    const { items, total_amount } = req.body
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: true, 
        message: '주문 항목이 없습니다.',
        code: 'EMPTY_ORDER' 
      })
    }
    
    await client.query('BEGIN')
    
    // 주문 생성
    const orderResult = await client.query(
      'INSERT INTO orders (order_date, status, total_amount, created_at, updated_at) VALUES (NOW(), $1, $2, NOW(), NOW()) RETURNING *',
      ['received', total_amount]
    )
    
    const orderId = orderResult.rows[0].id
    
    // 각 주문 상품 처리
    for (const item of items) {
      const { menu_id, quantity, item_total_price } = item
      
      // 재고 확인
      const stockCheck = await client.query(
        'SELECT stock FROM menus WHERE id = $1',
        [menu_id]
      )
      
      if (stockCheck.rows.length === 0) {
        await client.query('ROLLBACK')
        return res.status(404).json({ 
          error: true, 
          message: `메뉴 ID ${menu_id}를 찾을 수 없습니다.`,
          code: 'MENU_NOT_FOUND' 
        })
      }
      
      const currentStock = stockCheck.rows[0].stock
      if (currentStock < quantity) {
        await client.query('ROLLBACK')
        return res.status(409).json({ 
          error: true, 
          message: '재고가 부족합니다.',
          code: 'INSUFFICIENT_STOCK' 
        })
      }
      
      // 주문 상세 생성
      const orderItemResult = await client.query(
        'INSERT INTO order_items (order_id, menu_id, quantity, item_price, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [orderId, menu_id, quantity, item_total_price]
      )
      
      const orderItemId = orderItemResult.rows[0].id
      
      // 옵션 저장
      if (item.options && Array.isArray(item.options)) {
        for (const optionId of item.options) {
          await client.query(
            'INSERT INTO order_item_options (order_item_id, option_id, created_at) VALUES ($1, $2, NOW())',
            [orderItemId, optionId]
          )
        }
      }
      
      // 재고 차감
      await client.query(
        'UPDATE menus SET stock = stock - $1, updated_at = NOW() WHERE id = $2',
        [quantity, menu_id]
      )
    }
    
    await client.query('COMMIT')
    
    // 생성된 주문 정보 반환
    const createdOrderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    )
    
    res.status(201).json({ order: createdOrderResult.rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('주문 생성 오류:', error)
    res.status(500).json({ 
      error: true, 
      message: '주문 생성에 실패했습니다.',
      code: 'ORDER_CREATE_ERROR' 
    })
  } finally {
    client.release()
  }
})

// PATCH /api/orders/:id/status - 주문 상태 업데이트
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const validStatuses = ['received', 'manufacturing', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: true, 
        message: '유효하지 않은 주문 상태입니다.',
        code: 'INVALID_STATUS' 
      })
    }
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: true, 
        message: '주문을 찾을 수 없습니다.',
        code: 'ORDER_NOT_FOUND' 
      })
    }
    
    res.json({ order: result.rows[0] })
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error)
    res.status(500).json({ 
      error: true, 
      message: '주문 상태 업데이트에 실패했습니다.',
      code: 'STATUS_UPDATE_ERROR' 
    })
  }
})

module.exports = router

