import { useState } from 'react'
import { useCart } from '../context/CartContext'
import Checkout from './Checkout'
import './Cart.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

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
                onClick={() => setIsCheckoutOpen(true)}
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
    </>
  )
}
