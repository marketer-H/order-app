import { useState } from 'react'
import './ProductCard.css'

function ProductCard({ product, onAddToCart }) {
  const [selectedOptionIds, setSelectedOptionIds] = useState(new Set())

  const handleOptionChange = (optionId) => {
    setSelectedOptionIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(optionId)) {
        newSet.delete(optionId)
      } else {
        newSet.add(optionId)
      }
      return newSet
    })
  }

  const handleAddToCart = () => {
    const selectedOptionsArray = Array.from(selectedOptionIds)
    const selectedOptionsDetails = product.options.filter(opt => selectedOptionIds.has(opt.id))

    onAddToCart({
      productId: product.id,
      productName: product.name,
      basePrice: product.price,
      options: selectedOptionsArray, // option ID 배열
      optionsDetails: selectedOptionsDetails
    })

    // 옵션 초기화
    setSelectedOptionIds(new Set())
  }

  const calculateTotalPrice = () => {
    let total = product.price
    product.options.forEach(opt => {
      if (selectedOptionIds.has(opt.id)) {
        total += opt.price
      }
    })
    return total
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || '/coffee-icon.svg'} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price.toLocaleString()}원</p>
        <p className="product-description">{product.description}</p>
        <div className="product-options">
          {product.options.map((option) => (
            <label key={option.id} className="option-checkbox">
              <input
                type="checkbox"
                checked={selectedOptionIds.has(option.id)}
                onChange={() => handleOptionChange(option.id)}
              />
              <span>
                {option.name} ({option.price > 0 ? `+${option.price.toLocaleString()}원` : '+0원'})
              </span>
            </label>
          ))}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  )
}

export default ProductCard

