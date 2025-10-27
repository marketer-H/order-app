import { useApp } from '../contexts/AppContext'
import Dashboard from '../components/Dashboard'
import Inventory from '../components/Inventory'
import OrderList from '../components/OrderList'
import './AdminPage.css'

function AdminPage() {
  const { inventory, orders, stats, updateStock, updateOrderStatus } = useApp()

  const handleStartManufacturing = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'manufacturing')
    } catch (error) {
      alert(`상태 업데이트 실패: ${error.message}`)
    }
  }

  return (
    <div className="admin-page">
      <Dashboard
        totalOrders={stats.totalOrders}
        receivedOrders={stats.receivedOrders}
        manufacturingOrders={stats.manufacturingOrders}
        completedOrders={stats.completedOrders}
      />
      
      <Inventory 
        inventory={inventory} 
        onUpdateStock={updateStock}
      />
      
      <OrderList 
        orders={orders}
        onStartManufacturing={handleStartManufacturing}
      />
    </div>
  )
}

export default AdminPage
