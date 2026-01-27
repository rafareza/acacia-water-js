import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useProduct } from '../context/ProductContext'
import './Products.css'

export default function Products() {
  const { addToCart } = useCart()
  const { products } = useProduct()
  const [selectedFilter, setSelectedFilter] = useState('Semua')

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  // Dapatkan kategori unik dari produk
  const categories = ['Semua', ...new Set(products.map(p => p.category))]

  const filteredProducts = selectedFilter === 'Semua' 
    ? products 
    : products.filter(product => product.category === selectedFilter)

  return (
    <section id="products" className="products">
      <div className="products-container">
        <h2>Produk Kami</h2>
        <p className="subtitle">Pilihan terbaik air galon dan gas untuk kebutuhan Anda</p>
        
        <div className="filters">
          {categories.map(category => (
            <button 
              key={category}
              className={`filter-btn ${selectedFilter === category ? 'active' : ''}`}
              onClick={() => setSelectedFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <span className="emoji">📦</span>
                )}
              </div>
              <div className="product-info">
                <span className="category-badge">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="stock-info">
                  {product.stock ? (
                    <small>✓ Stok Tersedia - Siap Dikirim</small>
                  ) : (
                    <small className="stock-unavailable">✕ Stok Tidak Tersedia</small>
                  )}
                </div>
                <div className="product-footer">
                  <span className="price">Rp {product.price.toLocaleString('id-ID')}</span>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.stock}
                  >
                    {product.stock ? '🛒 Beli' : '❌ Habis'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
