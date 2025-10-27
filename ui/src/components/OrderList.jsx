import './OrderList.css'

function OrderList({ orders, onStartManufacturing }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  const formatOptions = (options) => {
    if (!options || !Array.isArray(options) || options.length === 0) {
      return ''
    }
    return ' (' + options.map(opt => opt.name || opt).join(', ') + ')'
  }

  if (orders.length === 0) {
    return (
      <div className="order-list">
        <h3>주문 현황</h3>
        <div className="no-orders">
          <p>주문 내역이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="order-list">
      <h3>주문 현황</h3>
      <div className="orders-container">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <span className="order-date">{formatDate(order.orderDate)}</span>
              <span className={`order-status ${order.status}`}>
                {order.status === 'received' ? '주문 접수' : '제조 중'}
              </span>
            </div>
            <div className="order-details">
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <span className="order-item-name">{item.productName}</span>
                    <span className="order-item-options">{formatOptions(item.options)}</span>
                    <span className="order-item-quantity"> X {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="order-price">{order.totalAmount.toLocaleString()}원</div>
            </div>
            {order.status === 'received' && (
              <button 
                className="action-btn"
                onClick={() => onStartManufacturing(order.id)}
              >
                제조 시작
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderList

