import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  // Load data saat component mount - produk selalu prioritas dari backend (admin)
  useEffect(() => {
    loadOrdersFromStorage()
    loadProducts()
    fetchBackendOrders()

    // Auto-refresh produk setiap 3 detik untuk realtime sync dengan admin
    const productRefreshInterval = setInterval(() => {
      loadProducts()
    }, 3000)

    // Listen untuk perubahan localStorage dari tab lain (admin update produk)
    const handleStorageChange = (event) => {
      if (event.key === 'products') {
        try {
          const updatedProducts = JSON.parse(event.newValue)
          if (Array.isArray(updatedProducts)) {
            setProducts(updatedProducts)
          }
        } catch (error) {
          console.error('Error parsing updated products:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearInterval(productRefreshInterval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Load products: prioritas dari backend (ikuti data admin), fallback ke localStorage/default
  const loadProducts = async () => {
    const fromBackend = await fetchBackendProducts()
    if (fromBackend && fromBackend.length > 0) {
      setProducts(fromBackend)
      localStorage.setItem('products', JSON.stringify(fromBackend))
    } else {
      loadProductsFromStorage()
    }
  }

  // Fallback: load products dari localStorage (jika backend tidak tersedia)
  const loadProductsFromStorage = () => {
    const storedProducts = localStorage.getItem('products')
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts))
      } catch (error) {
        console.error('Error loading products:', error)
        initializeDefaultProducts()
      }
    } else {
      initializeDefaultProducts()
    }
  }

  // Load orders dari localStorage
  const loadOrdersFromStorage = () => {
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders))
      } catch (error) {
        console.error('Error loading orders:', error)
      }
    }
  }

  const fetchBackendProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/products')
      if (!res.ok) {
        console.warn('Backend API returned status:', res.status)
        return null
      }
      const body = await res.json()
      const list = Array.isArray(body) ? body : body.data
      if (!Array.isArray(list)) {
        console.warn('Invalid data format from backend')
        return null
      }
      console.log('Loaded products from backend:', list.length, 'items')
      return list
    } catch (e) {
      console.warn('Backend not available, using localStorage/defaults:', e.message)
      return null
    }
  }

  // Refresh products dari backend - untuk sinkronisasi dengan data admin
  const refreshProducts = useCallback(async () => {
    const list = await fetchBackendProducts()
    if (list && list.length > 0) {
      setProducts(list)
      localStorage.setItem('products', JSON.stringify(list))
    }
  }, [])

  const fetchBackendOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/orders')
      if (!res.ok) return
      const body = await res.json()
      const list = Array.isArray(body) ? body : body.data
      if (!Array.isArray(list)) return
      setOrders(list)
      localStorage.setItem('orders', JSON.stringify(list))
    } catch (e) {
      console.error('Fetch orders failed:', e)
    }
  }

  // Inisialisasi produk default
  const initializeDefaultProducts = () => {
    const defaultProducts = [
      {
        id: 1,
        name: 'Galon Air 19L',
        price: 21000,
        imageUrl: 'https://via.placeholder.com/200?text=Galon+Air+19L',
        category: 'Air',
        stock: true,
        description: 'Air galon berkualitas tinggi 19 liter',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Galon Air 5L',
        price: 8000,
        imageUrl: 'https://via.placeholder.com/200?text=Galon+Air+5L',
        category: 'Air',
        stock: true,
        description: 'Air galon 5 liter untuk kebutuhan sehari-hari',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Tabung Gas Elpiji 3kg',
        price: 25000,
        imageUrl: 'https://via.placeholder.com/200?text=Tabung+Gas+3kg',
        category: 'Gas',
        stock: true,
        description: 'Tabung gas elpiji 3 kilogram',
        createdAt: new Date().toISOString()
      }
    ]
    setProducts(defaultProducts)
    localStorage.setItem('products', JSON.stringify(defaultProducts))
  }

  // Add product
  const addProduct = async (productData) => {
    try {
      const res = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      if (res.ok) {
        const body = await res.json()
        const created = Array.isArray(body) ? body[0] : body.data
        const updatedProducts = [...products, created]
        setProducts(updatedProducts)
        localStorage.setItem('products', JSON.stringify(updatedProducts))
        console.log('Product added to backend:', created.id)
        return created
      } else {
        console.warn('Failed to add product to backend, status:', res.status)
      }
    } catch (e) {
      console.warn('Backend not available, saving to localStorage only:', e.message)
    }
    const fallback = {
      id: Date.now(),
      ...productData,
      createdAt: new Date().toISOString()
    }
    const updatedProducts = [...products, fallback]
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    return fallback
  }

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      if (res.ok) {
        const body = await res.json()
        const updatedServer = Array.isArray(body) ? body[0] : body.data
        const updatedProducts = products.map(p => p.id === id ? updatedServer : p)
        setProducts(updatedProducts)
        localStorage.setItem('products', JSON.stringify(updatedProducts))
        console.log('Product updated in backend:', id)
        return
      } else {
        console.warn('Failed to update product to backend, status:', res.status)
      }
    } catch (e) {
      console.warn('Backend not available, updating localStorage only:', e.message)
    }
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
    )
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        const updatedProducts = products.filter(p => p.id !== id)
        setProducts(updatedProducts)
        localStorage.setItem('products', JSON.stringify(updatedProducts))
        console.log('Product deleted from backend:', id)
        return
      } else {
        console.warn('Failed to delete product from backend, status:', res.status)
      }
    } catch (e) {
      console.warn('Backend not available, deleting from localStorage only:', e.message)
    }
    const updatedProducts = products.filter(p => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  // Get product by ID
  const getProductById = (id) => {
    return products.find(p => p.id === id)
  }

  // Add order
  const addOrder = async (orderData) => {
    const payload = {
      ...orderData,
      createdAt: new Date().toISOString()
    }
    try {
      const res = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const body = await res.json()
        const created = Array.isArray(body) ? body[0] : body.data
        const updatedOrders = [...orders, created]
        setOrders(updatedOrders)
        localStorage.setItem('orders', JSON.stringify(updatedOrders))
        return created
      }
    } catch (e) {
      console.error('Add order failed:', e)
    }
    const fallback = {
      id: 'ORD-' + Date.now(),
      ...payload
    }
    const updatedOrders = [...orders, fallback]
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    return fallback
  }

  // Update order
  const updateOrder = async (id, orderData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      if (res.ok) {
        const body = await res.json()
        const updatedServer = Array.isArray(body) ? body[0] : body.data
        const updatedOrders = orders.map(o => o.id === id ? updatedServer : o)
        setOrders(updatedOrders)
        localStorage.setItem('orders', JSON.stringify(updatedOrders))
        return
      }
    } catch (e) {
      console.error('Update order failed:', e)
    }
    const updatedOrders = orders.map(o =>
      o.id === id ? { ...o, ...orderData, updatedAt: new Date().toISOString() } : o
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  // Delete order
  const deleteOrder = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        const updatedOrders = orders.filter(o => o.id !== id)
        setOrders(updatedOrders)
        localStorage.setItem('orders', JSON.stringify(updatedOrders))
        return
      }
    } catch (e) {
      console.error('Delete order failed:', e)
    }
    const updatedOrders = orders.filter(o => o.id !== id)
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  // Get orders with product details
  const getOrdersWithDetails = () => {
    return orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        productDetails: getProductById(item.id)
      }))
    }))
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrdersWithDetails,
        refreshProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider')
  }
  return context
}
