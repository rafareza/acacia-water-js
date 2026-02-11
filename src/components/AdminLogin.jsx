import { useState } from 'react'
import './AdminLogin.css'
import logo from '../assets/acacia.png'

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulasi login admin (dalam produksi, ini akan ke backend)
    setTimeout(() => {
      if (username === 'adminacacia' && password === 'admin123') {
        localStorage.setItem('adminToken', 'token_' + Date.now())
        localStorage.setItem('adminUser', username)
        onLoginSuccess()
      } else {
        setError('Username atau password salah')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="Acacia Water Logo" className="login-logo" />
          <p>Admin Login</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}

              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Sedang login...' : 'Login'}
          </button>
        </form>

        <div className="login-info">
          <p>Demo Credentials:</p>
          <p>Username: adminacacia</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}
