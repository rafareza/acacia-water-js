import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useProduct } from '../context/ProductContext'
import './Checkout.css'

export default function Checkout({ onClose }) {
  const { cart, getTotalPrice, clearCart } = useCart()
  const { addOrder } = useProduct()
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    notes: ''
  })
  const [selectedPayment, setSelectedPayment] = useState('bank')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    const totalPrice = getTotalPrice()

    // Simpan data penjualan ke localStorage (untuk sales report)
    const saleData = {
      date: new Date().toLocaleDateString('id-ID'),
      customerName: formData.fullName,
      customerEmail: formData.phone,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: totalPrice,
      paymentMethod: selectedPayment === 'bank' ? 'Transfer Bank' : 'Cash on Delivery',
      address: formData.address,
      notes: formData.notes,
      status: 'Completed'
    }

    const existingSales = localStorage.getItem('salesData')
    const salesArray = existingSales ? JSON.parse(existingSales) : []
    salesArray.push(saleData)
    localStorage.setItem('salesData', JSON.stringify(salesArray))

    // Simpan order ke ProductContext database
    const orderData = {
      customerName: formData.fullName,
      customerEmail: formData.phone,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: totalPrice,
      paymentMethod: selectedPayment === 'bank' ? 'Transfer Bank' : 'Cash on Delivery',
      address: formData.address,
      notes: formData.notes,
      status: 'Pending',
      date: new Date().toLocaleDateString('id-ID')
    }

    addOrder(orderData)

    // Kosongkan keranjang setelah order berhasil
    clearCart()

    setOrderPlaced(true)
  }

  const totalPrice = getTotalPrice()

  if (orderPlaced) {
    return (
      <div className="checkout-overlay" onClick={onClose}>
        <div className="checkout-success" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✓</div>
          <h2>Pesanan Berhasil!</h2>
          <p>Terima kasih telah berbelanja di Acacia Water</p>
          <p className="order-details">
            <strong>Nama:</strong> {formData.fullName}<br />
            <strong>Telepon:</strong> {formData.phone}<br />
            <strong>Metode Pembayaran:</strong> {selectedPayment === 'bank' ? 'Transfer Bank' : 'Cash on Delivery'}
          </p>
          <button className="close-success-btn" onClick={onClose}>Tutup</button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-container" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close" onClick={onClose}>✕</button>

        <h1>Checkout</h1>

        <div className="checkout-content">
          {/* A. Ringkasan Pesanan */}
          <section className="checkout-section">
            <h2>A. Ringkasan Pesanan</h2>
            <div className="order-summary">
              {cart.length === 0 ? (
                <p>Keranjang Anda kosong</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="order-item-info">
                        <span className="order-item-emoji">{item.image}</span>
                        <div className="order-item-details">
                          <h4>{item.name}</h4>
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="order-item-price">
                        <strong>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                      </div>
                    </div>
                  ))}
                  <div className="order-total">
                    <span>Total Pesanan:</span>
                    <span className="total-amount">Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* B. Informasi Pengiriman */}
          <section className="checkout-section">
            <h2>B. Informasi Pengiriman</h2>
            <form className="shipping-form">
              <div className="form-group">
                <label htmlFor="fullName">Nama Lengkap *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Nomor Telepon *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Contoh: 08xxxxxxxxx"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Alamat Lengkap *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap Anda (jalan, kelurahan, kecamatan, kota, provinsi, kode pos)"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Catatan (Opsional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Catatan khusus untuk pesanan Anda"
                  rows="2"
                ></textarea>
              </div>
            </form>
          </section>

          {/* C. Metode Pembayaran */}
          <section className="checkout-section">
            <h2>C. Metode Pembayaran</h2>
            <div className="payment-methods">
              {/* Transfer Bank */}
              <div 
                className={`payment-card ${selectedPayment === 'bank' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('bank')}
              >
                <div className="payment-radio">
                  <input
                    type="radio"
                    id="bank"
                    name="payment"
                    value="bank"
                    checked={selectedPayment === 'bank'}
                    onChange={() => setSelectedPayment('bank')}
                  />
                  <label htmlFor="bank">Transfer Bank</label>
                </div>
                <div className="payment-details">
                  <p><strong>Bank:</strong> BCA</p>
                  <p><strong>No Rekening:</strong> 5211687666</p>
                  <p><strong>Atas Nama:</strong> Rafa Rezandrya Jaelani</p>
                  <p className="payment-instruction">Silakan transfer sesuai total pesanan, kemudian konfirmasi pesanan dan kirim bukti pembayaran melalui WhatsApp admin.</p>
                  <a 
                    href="https://wa.me/6285894109114?text=Halo%20Admin%20Acacia%20Water%2C%20saya%20ingin%20mengkonfirmasi%20pesanan%20saya%20dan%20mengirimkan%20bukti%20pembayaran.%0ANama%3A%20" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="wa-confirm-btn"
                  >
                    💬 Konfirmasi via WhatsApp Admin
                  </a>
                </div>
              </div>

              {/* COD */}
              <div 
                className={`payment-card ${selectedPayment === 'cod' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('cod')}
              >
                <div className="payment-radio">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={() => setSelectedPayment('cod')}
                  />
                  <label htmlFor="cod">Cash on Delivery (COD)</label>
                </div>
                <div className="payment-details">
                  <p>Pembayaran tunai langsung kepada kurir saat barang diterima.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="checkout-actions">
            <button className="btn-cancel" onClick={onClose}>Batal</button>
            <button className="btn-place-order" onClick={handlePlaceOrder}>Pesan Sekarang</button>
          </div>
        </div>
      </div>
    </div>
  )
}
