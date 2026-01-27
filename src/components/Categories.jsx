import './Categories.css'

export default function Categories() {
  const features = [
    {
      id: 1,
      title: 'Antar Cepat',
      icon: '🚗',
      description: 'Pengantaran 30 - 60 menit'
    },
    {
      id: 2,
      title: '08:00 - 17:00',
      icon: '🕐',
      description: 'Jam operasional'
    },
    {
      id: 3,
      title: 'Terpercaya',
      icon: '🛡️',
      description: 'Produk berkualitas tinggi'
    },
    {
      id: 4,
      title: 'Rating 4.9',
      icon: '⭐',
      description: 'Kepuasan pelanggan terjamin'
    }
  ]

  return (
    <section className="categories">
      <div className="categories-container">
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
