import { createContext, useContext, useState, useEffect } from 'react'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  // Load data dari localStorage saat component mount
  useEffect(() => {
    loadProductsFromStorage()
    loadOrdersFromStorage()
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

  // Inisialisasi produk default
  const initializeDefaultProducts = () => {
    const defaultProducts = [
      {
        id: 1,
        name: 'Galon Air 19L',
        price: 21000,
        image: '💧',
        category: 'Air',
        stock: 50,
        description: 'Air galon berkualitas tinggi 19 liter',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Galon Air 5L',
        price: 8000,
        image: '💧',
        category: 'Air',
        stock: 100,
        description: 'Air galon 5 liter untuk kebutuhan sehari-hari',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Tabung Gas Elpiji 3kg',
        price: 25000,
        image: '⛽',
        category: 'Gas',
        stock: 30,
        description: 'Tabung gas elpiji 3 kilogram',
        createdAt: new Date().toISOString()
      }
    ]
    setProducts(defaultProducts)
    localStorage.setItem('products', JSON.stringify(defaultProducts))
  }

  // Add product
  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      createdAt: new Date().toISOString()
    }
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    return newProduct
  }

  // Update product
  const updateProduct = (id, productData) => {
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
    )
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  // Delete product
  const deleteProduct = (id) => {
    const updatedProducts = products.filter(p => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  // Get product by ID
  const getProductById = (id) => {
    return products.find(p => p.id === id)
  }

  // Add order
  const addOrder = (orderData) => {
    const newOrder = {
      id: 'ORD-' + Date.now(),
      ...orderData,
      createdAt: new Date().toISOString()
    }
    const updatedOrders = [...orders, newOrder]
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    return newOrder
  }

  // Update order
  const updateOrder = (id, orderData) => {
    const updatedOrders = orders.map(o =>
      o.id === id ? { ...o, ...orderData, updatedAt: new Date().toISOString() } : o
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  // Delete order
  const deleteOrder = (id) => {
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
