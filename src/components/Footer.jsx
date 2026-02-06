import './Footer.css'
import logo from '../assets/acacia.png'

export default function Footer({ onAdminClick }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="Acacia Water Logo" className="footer-logo-img" />
          </div>
          <p className="footer-description">
            Melayani kebutuhan galon air dan tabung gas berkualitas untuk rumah tangga dan bisnis Anda.
          </p>
        </div>

        <div className="footer-contact">
          <h3>📞 Hubungi Kami</h3>
          <p className="contact-item">
            <strong>Admin:</strong> Rafa Rezandrya
          </p>
          <a 
            href="https://wa.me/6285894109114" 
            target="_blank" 
            rel="noopener noreferrer"
            className="wa-link"
          >
            💬 +62 858-9410-9114
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Acacia Water. Semua hak dilindungi.</p>
        <button className="admin-link" onClick={onAdminClick} title="Admin Login">
          🔑 Admin Login
        </button>
      </div>
    </footer>
  )
}
