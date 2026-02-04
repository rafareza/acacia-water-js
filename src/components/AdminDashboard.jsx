import { useState, useEffect } from 'react'
import { useProduct } from '../context/ProductContext'
import './AdminDashboard.css'
import logo from '../assets/acacia.png'
import ProductManagement from './ProductManagement'
import OrderManagement from './OrderManagement'

export default function AdminDashboard({ onLogout }) {
  const { orders } = useProduct()
  const [activeTab, setActiveTab] = useState('overview')
  const [salesData, setSalesData] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalItems: 0,
    topProduct: null
  })

  useEffect(() => {
    setSalesData(orders)
    calculateStats(orders)
  }, [orders])

  const calculateStats = (sales) => {
    let totalRevenue = 0
    let totalItems = 0
    const productCount = {}

    sales.forEach(transaction => {
      totalRevenue += transaction.total
      transaction.items.forEach(item => {
        totalItems += item.quantity
        productCount[item.name] = (productCount[item.name] || 0) + item.quantity
      })
    })

    const topProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]

    setStats({
      totalRevenue,
      totalTransactions: sales.length,
      totalItems,
      topProduct: topProduct ? { name: topProduct[0], count: topProduct[1] } : null
    })
  }

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

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    onLogout()
  }

  const exportToCSV = () => {
    let csv = 'Tanggal,Nama Pelanggan,No Telepon,Total,Status\n'
    
    salesData.forEach(sale => {
      const dateStr = sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('id-ID') : (sale.date || '')
      csv += `${dateStr},${sale.customerName},${sale.customerEmail},${sale.total},${sale.status}\n`
    })

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    element.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <img src={logo} alt="Acacia Water Logo" className="admin-logo" />
          <div className="admin-title-text">
            <h1>Admin Dashboard</h1>
            <p>Kelola dan pantau penjualan Acacia Water</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Produk
        </button>
        <button
          className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 Order
        </button>
      </div>

      <div className="admin-content">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Statistics Cards */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <p className="stat-label">Total Penjualan</p>
                  <p className="stat-value">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-content">
                  <p className="stat-label">Total Transaksi</p>
                  <p className="stat-value">{stats.totalTransactions}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <p className="stat-label">Total Item Terjual</p>
                  <p className="stat-value">{stats.totalItems}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <p className="stat-label">Produk Terlaris</p>
                  <p className="stat-value">
                    {stats.topProduct ? `${stats.topProduct.name}` : 'N/A'}
                  </p>
                  {stats.topProduct && (
                    <p className="stat-subtitle">({stats.topProduct.count} unit)</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sales Report Section */}
            <div className="report-section">
              <div className="report-header">
                <h2>📋 Laporan Penjualan</h2>
                <button className="export-btn" onClick={exportToCSV}>
                  📥 Export CSV
                </button>
              </div>

              {salesData.length === 0 ? (
                <div className="empty-report">
                  <p>Belum ada data penjualan</p>
                </div>
              ) : (
                <div className="report-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Nama Pelanggan</th>
                        <th>No Telepon</th>
                        <th>Produk</th>
                        <th>Jumlah</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((sale, idx) => (
                        <tr key={idx}>
                          <td className="date-cell" title={sale.createdAt}>{formatDetailedDateTime(sale.createdAt || sale.date)}</td>
                          <td>{sale.customerName}</td>
                          <td>{sale.customerEmail}</td>
                          <td>
                            {sale.items.map((item, i) => (
                              <div key={i} className="product-info">
                                {item.name}
                              </div>
                            ))}
                          </td>
                          <td>{sale.items.reduce((sum, item) => sum + item.quantity, 0)} unit</td>
                          <td className="amount">
                            Rp {sale.total.toLocaleString('id-ID')}
                          </td>
                          <td>
                            <span className={`status-badge status-${sale.status.toLowerCase()}`}>
                              {sale.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <ProductManagement />
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <OrderManagement />
        )}
      </div>
    </div>
  )
}
