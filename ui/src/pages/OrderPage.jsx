import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import ProductCard from '../components/ProductCard'
import Cart from '../components/Cart'
import './OrderPage.css'

function OrderPage() {
  const { products, addOrder, loading } = useApp()
  const [cart, setCart] = useState([])

  const handleAddToCart = (item) => {
    const optionsText = item.options.join(', ')
    const optionsDetails = item.optionsDetails || []
    
    // 같은 상품 + 같은 옵션 조합이 있는지 확인
    const existingItemIndex = cart.findIndex(
      cartItem =>
        cartItem.productId === item.productId &&
        cartItem.options.join(', ') === optionsText
    )

    if (existingItemIndex >= 0) {
      // 이미 존재하면 수량만 증가
      const newCart = [...cart]
      newCart[existingItemIndex].quantity += 1
      const optionsPrice = newCart[existingItemIndex].optionsDetails.reduce((sum, opt) => sum + opt.price, 0)
      newCart[existingItemIndex].totalPrice = (newCart[existingItemIndex].basePrice + optionsPrice) * newCart[existingItemIndex].quantity
      setCart(newCart)
    } else {
      // 새로 추가
      const optionsPrice = optionsDetails.reduce((sum, opt) => sum + opt.price, 0)
      const totalPrice = item.basePrice + optionsPrice

      setCart([
        ...cart,
        {
          productId: item.productId,
          productName: item.productName,
          basePrice: item.basePrice,
          options: item.options,
          optionsDetails: optionsDetails,
          quantity: 1,
          totalPrice: totalPrice
        }
      ])
    }
  }

  const handleRemoveItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
  }

  const handleOrder = async () => {
    if (cart.length === 0) return
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0)
    
    try {
      // 주문 데이터 생성 (백엔드 형식에 맞게)
      const orderItems = cart.map(item => {
        const basePrice = item.basePrice
        const optionsPrice = item.optionsDetails.reduce((sum, opt) => sum + opt.price, 0)
        const itemTotalPrice = (basePrice + optionsPrice) * item.quantity
        
        // options는 이미 option ID 배열로 저장되어 있음
        return {
          menu_id: item.productId,
          quantity: item.quantity,
          options: item.options,  // 옵션 ID 배열 (예: [1, 2])
          item_total_price: itemTotalPrice
        }
      })
      
      await addOrder({
        items: orderItems,
        total_amount: totalAmount
      })
      
      alert(`주문이 완료되었습니다!\n총 ${totalItems}개 품목\n총액 ${totalAmount.toLocaleString()}원`)
      setCart([])
    } catch (error) {
      alert(`주문 실패: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="order-page">
        <div className="loading-message">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="order-page">
      <div className="products-section">
        <h2>메뉴</h2>
        {products.length === 0 ? (
          <div className="empty-message">메뉴가 없습니다.</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
      
      {cart.length > 0 && (
        <Cart items={cart} onOrder={handleOrder} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  )
}

export default OrderPage
