import './Contact.css'

export default function Contact() {
  const contactInfo = [
    {
      id: 1,
      title: 'Telepon',
      icon: '📞',
      mainInfo: '0858-9410-9114',
      subInfo: 'Setiap Hari'
    },
    {
      id: 2,
      title: 'Alamat',
      icon: '📍',
      mainInfo: 'Perum Harapan Mulya Regency',
      subInfo: 'Cluster Acacia Blok CA 23 NO 08'
    },
    {
      id: 3,
      title: 'Jam Operasional',
      icon: '🕐',
      mainInfo: '08:00 - 17:00',
      subInfo: 'Setiap Hari'
    }
  ]

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2>Hubungi Kami</h2>
        <p className="contact-subtitle">Customer service kami siap membantu Anda</p>
        
        <div className="contact-grid">
          {contactInfo.map((info) => (
            <div key={info.id} className="contact-card">
              <div className="contact-icon">{info.icon}</div>
              <h3>{info.title}</h3>
              <p className="main-info">{info.mainInfo}</p>
              <p className="sub-info">{info.subInfo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
