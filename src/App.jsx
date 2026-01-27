import { useState } from 'react'
import './App.css'
import { CartProvider, useCart } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Products from './components/Products'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { Toast } from './components/Toast'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

function AppContent() {
  const { toast } = useCart()
  const [adminPage, setAdminPage] = useState(null) // null, 'login', atau 'dashboard'

  const isAdminLoggedIn = () => {
    return localStorage.getItem('adminToken') !== null
  }

  const handleAdminClick = () => {
    if (isAdminLoggedIn()) {
      setAdminPage('dashboard')
    } else {
      setAdminPage('login')
    }
  }

  const handleAdminLoginSuccess = () => {
    setAdminPage('dashboard')
  }

  const handleAdminLogout = () => {
    setAdminPage(null)
  }

  // Jika admin page aktif, tampilkan admin panel
  if (adminPage === 'login') {
    return (
      <>
        <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
      </>
    )
  }

  if (adminPage === 'dashboard') {
    return (
      <>
        <AdminDashboard onLogout={handleAdminLogout} />
      </>
    )
  }

  // Tampilkan halaman utama
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <Products />
      <Services />
      <Contact />
      <Footer onAdminClick={handleAdminClick} />
      {toast && <Toast message={toast} />}
    </>
  )
}

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductProvider>
  )
}

export default App
