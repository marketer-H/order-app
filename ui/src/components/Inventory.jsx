import './Inventory.css'

function Inventory({ inventory, onUpdateStock }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', class: 'status-out' }
    if (stock < 5) return { text: '주의', class: 'status-warning' }
    return { text: '정상', class: 'status-normal' }
  }

  const handleStockChange = (productId, change) => {
    const currentStock = inventory.find(item => item.id === productId).stock
    const newStock = currentStock + change
    
    if (newStock < 0) return // 재고는 0 이하로 내려갈 수 없음
    
    onUpdateStock(productId, newStock)
  }

  return (
    <div className="inventory">
      <h3>재고 현황</h3>
      <div className="inventory-grid">
        {inventory.map(item => {
          const status = getStockStatus(item.stock)
          return (
            <div key={item.id} className="inventory-card">
              <div className="inventory-item">
                <span className="item-name">{item.name}</span>
                <span className={`stock-status ${status.class}`}>{status.text}</span>
              </div>
              <div className="stock-control">
                <span className="stock-quantity">{item.stock}개</span>
                <div className="stock-buttons">
                  <button 
                    className="stock-btn minus"
                    onClick={() => handleStockChange(item.id, -1)}
                  >
                    -
                  </button>
                  <button 
                    className="stock-btn plus"
                    onClick={() => handleStockChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Inventory

