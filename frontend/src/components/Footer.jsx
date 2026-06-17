import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-md-4 mb-4">
          <h5 style={{
            background: 'var(--gradient)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.3rem'
          }}>
            🛍️ ShopVerse
          </h5>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 10, lineHeight: 1.7 }}>
            Your premium e-commerce destination for electronics, fashion, books, sports & more.
          </p>
        </div>

        <div className="col-md-2 col-6 mb-4">
          <h6 style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 14, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Shop
          </h6>
          {['Electronics', 'Clothing', 'Books', 'Sports'].map(l => (
            <Link key={l} to={`/?search=${l}`}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = 'var(--primary)'}
              onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
              {l}
            </Link>
          ))}
        </div>

        <div className="col-md-2 col-6 mb-4">
          <h6 style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 14, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Account
          </h6>
          {[['Profile', '/'], ['My Orders', '/orders'], ['Cart', '/cart'], ['Login', '/login']].map(([label, path]) => (
            <Link key={label} to={path}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: 8, transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = 'var(--primary)'}
              onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
              {label}
            </Link>
          ))}
        </div>

        <div className="col-md-4 mb-4">
          <h6 style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 14, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Newsletter
          </h6>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 14 }}>
            Subscribe for exclusive deals and new arrivals
          </p>
          <div className="d-flex gap-2">
            <input type="email" className="form-control" placeholder="Your email address" style={{ flex: 1 }} />
            <button className="btn-gradient" style={{ whiteSpace: 'nowrap', padding: '0 16px' }}>Subscribe</button>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border)', margin: '20px 0' }} />
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          © 2024 ShopVerse. All rights reserved.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          Built with React.js &amp; Spring Boot 🚀
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
