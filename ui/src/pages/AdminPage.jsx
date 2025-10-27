import { useApp } from '../contexts/AppContext'
import Dashboard from '../components/Dashboard'
import Inventory from '../components/Inventory'
import OrderList from '../components/OrderList'
import './AdminPage.css'

function AdminPage() {
  const { inventory, orders, stats, updateStock, updateOrderStatus } = useApp()

  const handleStartManufacturing = (orderId) => {
    updateOrderStatus(orderId, 'manufacturing')
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
