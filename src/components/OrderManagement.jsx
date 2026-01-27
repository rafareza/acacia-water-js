import { useState, useEffect } from 'react'
import { useProduct } from '../context/ProductContext'
import './OrderManagement.css'

export default function OrderManagement() {
  const { orders, updateOrder, deleteOrder, getOrdersWithDetails } = useProduct()
  const [ordersWithDetails, setOrdersWithDetails] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Format tanggal lengkap dengan jam, menit, detik
  const formatDetailedDateTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
    return date.toLocaleString('id-ID', options)
  }

  useEffect(() => {
    setOrdersWithDetails(getOrdersWithDetails())
  }, [orders])

  // Filter orders
  const filteredOrders = ordersWithDetails.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    updateOrder(id, { status: newStatus })
  }

  // Handle delete
  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus order ini?')) {
      deleteOrder(id)
      alert('Order berhasil dihapus')
    }
  }

  // Calculate order stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    completed: orders.filter(o => o.status === 'Completed').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
  }

  return (
    <div className="order-management">
      <div className="om-header">
        <h2>📋 Manajemen Order</h2>
      </div>

      {/* Stats */}
      <div className="order-stats">
        <div className="stat-card">
          <div className="stat-label">Total Order</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{stats.completed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">Rp {stats.totalRevenue.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="om-controls">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Semua Order</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="search-group">
          <input
            type="text"
            placeholder="Cari order atau pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>📭 Tidak ada order</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Telp</th>
                <th>Produk</th>
                <th>Metode Pembayaran</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td className="date-cell" title={order.createdAt}>{formatDetailedDateTime(order.createdAt)}</td>
                  <td className="customer-name">{order.customerName}</td>
                  <td className="customer-email">{order.customerEmail}</td>
                  <td>
                    <div className="products-list">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="product-item">
                          <span className="product-name">{item.name || 'Unknown'}</span>
                          <span className="product-qty">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td className="amount">
                    Rp {order.total.toLocaleString('id-ID')}
                  </td>
                  <td>
                    <select
                      className={`status-select status-${order.status.toLowerCase()}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="action-cell">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(order.id)}
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="om-info">
        <p>Menampilkan <strong>{filteredOrders.length}</strong> dari <strong>{orders.length}</strong> order</p>
      </div>
    </div>
  )
}
