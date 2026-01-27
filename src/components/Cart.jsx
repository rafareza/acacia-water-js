import { useState } from 'react'
import { useCart } from '../context/CartContext'
import Checkout from './Checkout'
import './Cart.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const totalPrice = getTotalPrice()
  const cartCount = cart.length

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button className="cart-trigger" onClick={toggleCart}>
        🛒
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}

      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Keranjang Belanja</h2>
          <button className="close-btn" onClick={toggleCart}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p className="empty-icon">🛒</p>
            <p>Keranjang Anda masih kosong</p>
            <button className="continue-shopping-btn" onClick={toggleCart}>
              Lanjutkan Belanja
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <span className="emoji">{item.image}</span>
                  </div>
                  
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>

                  <div className="item-quantity">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    <p>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Hapus item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={() => setIsConfirmOpen(true)}
              >
                Lanjut ke Pembayaran
              </button>
              <button 
                className="clear-cart-btn"
                onClick={clearCart}
              >
                Kosongkan Keranjang
              </button>
            </div>
          </>
        )}
      </div>

      {isCheckoutOpen && (
        <Checkout onClose={() => setIsCheckoutOpen(false)} />
      )}

      {isConfirmOpen && (
        <div className="confirm-overlay" onClick={() => setIsConfirmOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Konfirmasi Pembelian</h2>
            
            <div className="confirm-items">
              {cart.map(item => (
                <div key={item.id} className="confirm-item">
                  <div className="confirm-item-left">
                    <span className="confirm-item-emoji">{item.image}</span>
                    <div className="confirm-item-info">
                      <p className="confirm-item-name">{item.name}</p>
                      <p className="confirm-item-qty">Kuantitas: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="confirm-item-right">
                    <p className="confirm-item-price">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="confirm-total">
              <span>Total Harga:</span>
              <span className="confirm-total-amount">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
            </div>

            <p className="confirm-question">Apakah Anda yakin ingin membeli item ini?</p>

            <div className="confirm-actions">
              <button 
                className="confirm-btn-yes"
                onClick={() => {
                  setIsConfirmOpen(false)
                  setIsCheckoutOpen(true)
                }}
              >
                ✓ Ya, Lanjutkan
              </button>
              <button 
                className="confirm-btn-no"
                onClick={() => setIsConfirmOpen(false)}
              >
                ✕ Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
