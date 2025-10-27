const express = require('express')
const router = express.Router()
const pool = require('../config/database')

// GET /api/menus - 전체 메뉴 목록 조회
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image,
        m.stock,
        m.created_at,
        m.updated_at,
        json_agg(
          json_build_object(
            'id', o.id,
            'name', o.name,
            'price', o.price
          )
        ) as options
      FROM menus m
      LEFT JOIN options o ON m.id = o.menu_id
      GROUP BY m.id
      ORDER BY m.id
    `)
    
    const menus = result.rows.map(row => ({
      ...row,
      options: row.options[0].id ? row.options : []
    }))
    
    res.json({ menus })
  } catch (error) {
    console.error('메뉴 조회 오류:', error)
    res.status(500).json({ 
      error: true, 
      message: '메뉴를 불러오는데 실패했습니다.',
      code: 'MENUS_FETCH_ERROR' 
    })
  }
})

// PATCH /api/menus/:id/stock - 재고 수정
router.patch('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params
    const { stock } = req.body
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ 
        error: true, 
        message: '유효하지 않은 재고 수량입니다.',
        code: 'INVALID_STOCK' 
      })
    }
    
    const result = await pool.query(
      'UPDATE menus SET stock = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [stock, id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: true, 
        message: '메뉴를 찾을 수 없습니다.',
        code: 'MENU_NOT_FOUND' 
      })
    }
    
    res.json({ menu: result.rows[0] })
  } catch (error) {
    console.error('재고 수정 오류:', error)
    res.status(500).json({ 
      error: true, 
      message: '재고 수정에 실패했습니다.',
      code: 'STOCK_UPDATE_ERROR' 
    })
  }
})

module.exports = router

