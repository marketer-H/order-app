import { useState } from 'react'
import Dashboard from '../components/Dashboard'
import Inventory from '../components/Inventory'
import OrderList from '../components/OrderList'
import './AdminPage.css'

// 임의의 초기 데이터
const initialInventory = [
  { id: 1, name: '아메리카노 (ICE)', stock: 10 },
  { id: 2, name: '아메리카노 (HOT)', stock: 8 },
  { id: 3, name: '카페라떼', stock: 3 }
]

function AdminPage() {
  // 대시보드 통계
  const [totalOrders, setTotalOrders] = useState(1)
  const [receivedOrders, setReceivedOrders] = useState(1)
  const [manufacturingOrders, setManufacturingOrders] = useState(0)
  const [completedOrders, setCompletedOrders] = useState(0)

  // 재고 관리
  const [inventory, setInventory] = useState(initialInventory)

  // 주문 관리 (초기 데이터)
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderDate: new Date().toISOString(),
      items: [
        { productName: '아메리카노(ICE)', options: '', quantity: 1 }
      ],
      totalAmount: 4000,
      status: 'received' // 'received' or 'manufacturing' or 'completed'
    }
  ])

  const handleUpdateStock = (productId, newStock) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, stock: newStock } : item
      )
    )
  }

  const handleStartManufacturing = (orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'manufacturing' }
          : order
      )
    )
    // 대시보드 통계 업데이트
    setReceivedOrders(prev => Math.max(0, prev - 1))
    setManufacturingOrders(prev => prev + 1)
  }

  return (
    <div className="admin-page">
      <Dashboard
        totalOrders={totalOrders}
        receivedOrders={receivedOrders}
        manufacturingOrders={manufacturingOrders}
        completedOrders={completedOrders}
      />
      
      <Inventory 
        inventory={inventory} 
        onUpdateStock={handleUpdateStock}
      />
      
      <OrderList 
        orders={orders}
        onStartManufacturing={handleStartManufacturing}
      />
    </div>
  )
}

export default AdminPage
