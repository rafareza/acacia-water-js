import './Hero.css'
import acaciaImage from '../assets/acacia water.jpg'

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-content">
        <h2>Galon & Gas</h2>
        <p className="hero-highlight">Antar Cepat!</p>
        <p>Layanan antar galon air dan tabung gas terpercaya dengan kualitas terbaik dari</p>
        <p className="hero-highlight acacia">Acacia Water</p>
      </div>
      <div className="hero-image">
        <img src={acaciaImage} alt="Acacia Water" className="hero-img" />
      </div>
    </section>
  )
}
