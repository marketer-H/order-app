import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import ProductCard from '../components/ProductCard'
import Cart from '../components/Cart'
import './OrderPage.css'

function OrderPage() {
  const { products, addOrder } = useApp()
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

  const handleOrder = () => {
    if (cart.length === 0) return
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0)
    
    // 주문 데이터 생성
    const orderItems = cart.map(item => ({
      productName: item.productName,
      options: item.optionsDetails.map(opt => opt.name).join(', '),
      quantity: item.quantity
    }))
    
    addOrder({
      items: orderItems,
      totalAmount: totalAmount
    })
    
    alert(`주문이 완료되었습니다!\n총 ${totalItems}개 품목\n총액 ${totalAmount.toLocaleString()}원`)
    setCart([])
  }

  return (
    <div className="order-page">
      <div className="products-section">
        <h2>메뉴</h2>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
      
      {cart.length > 0 && (
        <Cart items={cart} onOrder={handleOrder} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  )
}

export default OrderPage
