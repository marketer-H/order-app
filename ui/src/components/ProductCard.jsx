import { useState } from 'react'
import './ProductCard.css'

function ProductCard({ product, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState({
    shot: false,
    syrup: false
  })

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  const handleAddToCart = () => {
    const selectedOptionsList = Object.entries(selectedOptions)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key)

    onAddToCart({
      productId: product.id,
      productName: product.name,
      basePrice: product.price,
      options: selectedOptionsList,
      optionsDetails: product.options.filter(opt => selectedOptionsList.includes(opt.id))
    })

    // 옵션 초기화
    setSelectedOptions({
      shot: false,
      syrup: false
    })
  }

  const calculateTotalPrice = () => {
    let total = product.price
    if (selectedOptions.shot) total += 500
    if (selectedOptions.syrup) total += 0
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
                checked={selectedOptions[option.id]}
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

