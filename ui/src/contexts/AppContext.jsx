import { createContext, useContext, useState, useEffect } from 'react'
import { get, post, patch } from '../utils/api'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [products, setProducts] = useState([])
  const [inventory, setInventory] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    manufacturingOrders: 0,
    completedOrders: 0
  })
  const [loading, setLoading] = useState(true)

  // 초기 데이터 로드
  useEffect(() => {
    loadMenus()
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 메뉴 데이터 로드
  const loadMenus = async () => {
    try {
      const data = await get('/menus')
      if (data.menus) {
        setProducts(data.menus)
        // 재고 데이터 추출
        const inventoryData = data.menus.map(menu => ({
          id: menu.id,
          name: menu.name,
          stock: menu.stock
        }))
        setInventory(inventoryData)
      }
    } catch (error) {
      console.error('메뉴 로드 실패:', error)
      // 에러 발생 시 기본 데이터 사용
      setProducts([])
      setInventory([])
    } finally {
      setLoading(false)
    }
  }

  // 주문 목록 로드
  const loadOrders = async () => {
    try {
      const data = await get('/orders')
      if (data.orders) {
        setOrders(data.orders)
        // 통계 계산
        const totalOrders = data.orders.length
        const receivedOrders = data.orders.filter(o => o.status === 'received').length
        const manufacturingOrders = data.orders.filter(o => o.status === 'manufacturing').length
        const completedOrders = data.orders.filter(o => o.status === 'completed').length
        
        setStats({
          totalOrders,
          receivedOrders,
          manufacturingOrders,
          completedOrders
        })
      }
    } catch (error) {
      console.error('주문 로드 실패:', error)
      setOrders([])
    }
  }

  // 재고 업데이트
  const updateStock = async (productId, newStock) => {
    try {
      const data = await patch(`/menus/${productId}/stock`, { stock: newStock })
      // 로컬 상태 업데이트
      setInventory(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, stock: newStock } : item
        )
      )
      // products도 업데이트
      setProducts(prev =>
        prev.map(product =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      )
      return data
    } catch (error) {
      console.error('재고 업데이트 실패:', error)
      throw error
    }
  }

  // 주문 생성
  const addOrder = async (orderData) => {
    try {
      const data = await post('/orders', orderData)
      
      // 로컬 상태 업데이트
      await loadOrders()
      
      return data
    } catch (error) {
      console.error('주문 생성 실패:', error)
      throw error
    }
  }

  // 주문 상태 업데이트
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await patch(`/orders/${orderId}/status`, { status: newStatus })
      
      // 로컬 상태 업데이트
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      )

      // 통계 업데이트
      if (newStatus === 'manufacturing') {
        setStats(prev => ({
          ...prev,
          receivedOrders: Math.max(0, prev.receivedOrders - 1),
          manufacturingOrders: prev.manufacturingOrders + 1
        }))
      } else if (newStatus === 'completed') {
        setStats(prev => ({
          ...prev,
          manufacturingOrders: Math.max(0, prev.manufacturingOrders - 1),
          completedOrders: prev.completedOrders + 1
        }))
      }
      
      // 주문 목록 다시 로드
      await loadOrders()
    } catch (error) {
      console.error('주문 상태 업데이트 실패:', error)
      throw error
    }
  }

  return (
    <AppContext.Provider value={{
      products,
      inventory,
      orders,
      stats,
      updateStock,
      addOrder,
      updateOrderStatus,
      loading,
      loadOrders
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
