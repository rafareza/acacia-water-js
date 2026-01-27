import { useState } from 'react'
import './Header.css'
import Cart from './Cart'
import logo from '../assets/acacia.png'

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logo} alt="Acacia Water Logo" className="logo-img" />
          <div className="logo-text">
            <h1>Acacia Water</h1>
            <p>Toko Online Air Galon & Gas</p>
          </div>
        </div>
        
        <nav className="nav">
          <a href="#top" className="nav-link">Beranda</a>
          <a href="#products" className="nav-link">Produk</a>
          <a href="#services" className="nav-link">Layanan Kami</a>
          <a href="#contact" className="nav-link">Hubungi Kami</a>
        </nav>

        <div className="header-actions">
          <Cart />
        </div>
      </div>
    </header>
  )
}
