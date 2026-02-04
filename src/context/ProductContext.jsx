import { createContext, useContext, useState, useEffect } from 'react'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  // Load data dari localStorage saat component mount
  useEffect(() => {
    loadProductsFromStorage()
    loadOrdersFromStorage()
    fetchBackendProducts()
    fetchBackendOrders()
  }, [])

  // Load products dari localStorage
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
      if (!res.ok) return
      const body = await res.json()
      const list = Array.isArray(body) ? body : body.data
      if (!Array.isArray(list)) return
      setProducts(list)
      localStorage.setItem('products', JSON.stringify(list))
    } catch (e) {
      console.error('Fetch products failed:', e)
    }
  }

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
        return created
      }
    } catch (e) {
      console.error('Add product failed:', e)
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
        return
      }
    } catch (e) {
      console.error('Update product failed:', e)
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
        return
      }
    } catch (e) {
      console.error('Delete product failed:', e)
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
        getOrdersWithDetails
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
