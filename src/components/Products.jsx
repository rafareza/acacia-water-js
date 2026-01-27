import { useState } from 'react'
import { useCart } from '../context/CartContext'
import './Products.css'

export default function Products() {
  const { addToCart } = useCart()
  const [selectedFilter, setSelectedFilter] = useState('Semua')

  const products = [
    {
      id: 1,
      name: 'Gas 12kg',
      category: 'Gas',
      price: 217000,
      image: '🔥',
      description: 'Tabung gas lpg untuk kebutuhan komersial dan rumah tangga besar'
    },
    {
      id: 2,
      name: 'Gas 5.5kg',
      category: 'Gas',
      price: 110000,
      image: '🔥',
      description: 'Tabung gas lpg cocok untuk kebutuhan menengah'
    },
    {
      id: 3,
      name: 'Gas 3kg',
      category: 'Gas',
      price: 23000,
      image: '🔥',
      description: 'Tabung gas lpg untuk kebutuhan memasak rumah tangga'
    },
    {
      id: 4,
      name: 'Galon Air Isi Ulang',
      category: 'Galon',
      price: 6000,
      image: '💧',
      description: 'Galon isi ulang ekonomis untuk kebutuhan sehari-hari hemat dan praktis'
    },
    {
      id: 5,
      name: 'Galon Air Aqua',
      category: 'Galon',
      price: 21000,
      image: '💧',
      description: 'Air mineral dengan kualitas tinggi dari sumber mata air'
    },
    {
      id: 6,
      name: 'Galon Air Vit',
      category: 'Galon',
      price: 17000,
      image: '💧',
      description: 'Air mineral dengan harga yang terjangkau'
    }
  ]

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const filteredProducts = selectedFilter === 'Semua' 
    ? products 
    : products.filter(product => product.category === selectedFilter)

  return (
    <section id="products" className="products">
      <div className="products-container">
        <h2>Produk Kami</h2>
        <p className="subtitle">Pilihan terbaik air galon dan gas untuk kebutuhan Anda</p>
        
        <div className="filters">
          <button 
            className={`filter-btn ${selectedFilter === 'Semua' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('Semua')}
          >
            Semua
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'Galon' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('Galon')}
          >
            Galon
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'Gas' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('Gas')}
          >
            Gas
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <span className="emoji">{product.image}</span>
              </div>
              <div className="product-info">
                <span className="category-badge">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="stock-info">
                  <small>✓ Stok Tersedia - Siap Dikirim</small>
                </div>
                <div className="product-footer">
                  <span className="price">Rp {product.price.toLocaleString('id-ID')}</span>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    🛒 Beli
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
