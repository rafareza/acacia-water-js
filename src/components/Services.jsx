import './Services.css'

export default function Services() {
  const services = [
    {
      id: 1,
      title: 'Pengantaran Express',
      description: 'Layanan antar kilat dalam 30 menit untuk area tertentu',
      features: ['Prioritas tinggi', 'Gratis ongkir'],
      icon: '🚀'
    },
    {
      id: 2,
      title: 'Paket Berlangganan',
      description: 'Hemat lebih banyak dengan paket langganan bulanan',
      features: ['Jadwal antar tetap', 'Prioritas stok'],
      icon: '📅'
    }
  ]

  return (
    <section id="services" className="services">
      <div className="services-container">
        <h2>Layanan Kami</h2>
        <p className="services-subtitle">Komitmen kami untuk memberikan pelayanan terbaik</p>
        
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
