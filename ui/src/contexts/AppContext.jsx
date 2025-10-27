import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  // 상품 데이터
  const [products] = useState([
    {
      id: 1,
      name: '아메리카노(ICE)',
      price: 4000,
      description: '간단한 설명...',
      image: '/americano-ice.jpg',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    },
    {
      id: 2,
      name: '아메리카노(HOT)',
      price: 4000,
      description: '간단한 설명...',
      image: '/americano-hot.jpg',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    },
    {
      id: 3,
      name: '카페라떼',
      price: 5000,
      description: '간단한 설명...',
      image: '/caffe-latte.jpg',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    }
  ])

  // 재고 데이터
  const [inventory, setInventory] = useState([
    { id: 1, name: '아메리카노 (ICE)', stock: 10 },
    { id: 2, name: '아메리카노 (HOT)', stock: 8 },
    { id: 3, name: '카페라떼', stock: 3 }
  ])

  // 주문 데이터
  const [orders, setOrders] = useState([])

  // 통계
  const [stats, setStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    manufacturingOrders: 0,
    completedOrders: 0
  })

  const updateStock = (productId, newStock) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, stock: newStock } : item
      )
    )
  }

  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      orderDate: new Date().toISOString(),
      ...orderData,
      status: 'received'
    }
    
    setOrders(prev => [newOrder, ...prev])
    setStats(prev => ({
      ...prev,
      totalOrders: prev.totalOrders + 1,
      receivedOrders: prev.receivedOrders + 1
    }))
  }

  const updateOrderStatus = (orderId, newStatus) => {
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
  }

  return (
    <AppContext.Provider value={{
      products,
      inventory,
      orders,
      stats,
      updateStock,
      addOrder,
      updateOrderStatus
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

