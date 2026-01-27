import { useState } from 'react'
import { useProduct } from '../context/ProductContext'
import './ProductManagement.css'

export default function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useProduct()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '💧',
    category: '',
    stock: '',
    description: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      alert('Mohon isi semua field yang wajib')
      return
    }

    const productData = {
      name: formData.name,
      price: parseInt(formData.price),
      image: formData.image,
      category: formData.category,
      stock: parseInt(formData.stock),
      description: formData.description
    }

    if (editingId) {
      updateProduct(editingId, productData)
      alert('Produk berhasil diperbarui')
    } else {
      addProduct(productData)
      alert('Produk berhasil ditambahkan')
    }

    resetForm()
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: '💧',
      category: '',
      stock: '',
      description: ''
    })
    setIsFormOpen(false)
    setEditingId(null)
  }

  // Handle edit
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
      description: product.description
    })
    setEditingId(product.id)
    setIsFormOpen(true)
  }

  // Handle delete
  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id)
      alert('Produk berhasil dihapus')
    }
  }

  return (
    <div className="product-management">
      <div className="pm-header">
        <h2>📦 Manajemen Produk</h2>
        <button className="btn-add-product" onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? '✕ Batal' : '+ Tambah Produk'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="product-form">
          <h3>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nama Produk *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Galon Air 19L"
                  required
                />
              </div>
              <div className="form-group">
                <label>Harga *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Contoh: 21000"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Icon/Emoji</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  maxLength="2"
                  placeholder="💧"
                />
              </div>
              <div className="form-group">
                <label>Kategori *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Air">Air</option>
                  <option value="Gas">Gas</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stok *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Contoh: 50"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Deskripsi</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsi produk"
                rows="3"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Perbarui Produk' : 'Tambah Produk'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="pm-search">
        <input
          type="text"
          placeholder="Cari produk atau kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="products-table">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>📦 Tidak ada produk</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Icon</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="icon-cell">{product.image}</td>
                  <td className="name-cell">{product.name}</td>
                  <td>{product.category}</td>
                  <td className="price-cell">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`stock-badge ${product.stock > 20 ? 'in-stock' : 'low-stock'}`}>
                      {product.stock} unit
                    </span>
                  </td>
                  <td className="description-cell">{product.description}</td>
                  <td className="action-cell">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
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

      <div className="pm-stats">
        <p>Total Produk: <strong>{products.length}</strong></p>
        <p>Total Stok: <strong>{products.reduce((sum, p) => sum + p.stock, 0)} unit</strong></p>
      </div>
    </div>
  )
}
