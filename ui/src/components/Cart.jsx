import './Cart.css'

function Cart({ items, onOrder, onRemoveItem }) {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0)
  }

  const formatOptions = (options) => {
    if (!options || options.length === 0) return ''
    return ' (' + options.map(opt => opt.name).join(', ') + ')'
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h3>장바구니</h3>
      </div>
      <div className="cart-body">
        <div className="cart-left">
          <div className="cart-items-title">주문 내역</div>
          <div className="cart-items">
            {items.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-info">
                  <span className="item-name">
                    {item.productName}
                    {formatOptions(item.optionsDetails)}
                  </span>
                </div>
                <div className="item-details">
                  <span className="item-quantity">X {item.quantity}</span>
                  <span className="item-price">{item.totalPrice.toLocaleString()}원</span>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => onRemoveItem(index)}
                  title="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="cart-right">
          <div className="cart-total">
            <span className="total-label">총 금액</span>
            <span className="total-amount">{calculateTotal().toLocaleString()}원</span>
          </div>
          <button className="order-btn" onClick={onOrder}>
            주문하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
