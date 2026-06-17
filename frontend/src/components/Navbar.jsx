import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSettings, FiMenu } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar-custom">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Brand */}
          <Link to="/" className="text-decoration-none" onClick={() => setMenuOpen(false)}>
            <span className="navbar-brand-text">🛍️ ShopVerse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-md-flex align-items-center gap-2">
            <Link to="/" className="nav-link-custom text-decoration-none">Home</Link>

            {user ? (
              <>
                <Link to="/orders" className="nav-link-custom text-decoration-none d-flex align-items-center gap-1">
                  <FiPackage size={15} /> Orders
                </Link>

                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="nav-link-custom text-decoration-none d-flex align-items-center gap-1">
                    <FiSettings size={15} /> Admin
                  </Link>
                )}

                <Link to="/cart" className="nav-link-custom text-decoration-none position-relative cart-badge">
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>

                <div className="d-flex align-items-center gap-2 ms-2" style={{ borderLeft: '1px solid var(--border)', paddingLeft: 12 }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <FiUser size={13} className="me-1" />{user.name}
                  </span>
                  <button onClick={handleLogout} className="btn-gradient" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    <FiLogOut size={13} className="me-1" />Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link-custom text-decoration-none">Login</Link>
                <Link to="/register" className="btn-gradient text-decoration-none"
                  style={{ padding: '8px 20px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="d-md-none"
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="d-md-none mt-3 pb-2" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <Link to="/" className="nav-link-custom text-decoration-none d-block mb-2" onClick={() => setMenuOpen(false)}>Home</Link>
            {user ? (
              <>
                <Link to="/orders" className="nav-link-custom text-decoration-none d-block mb-2" onClick={() => setMenuOpen(false)}>Orders</Link>
                <Link to="/cart" className="nav-link-custom text-decoration-none d-block mb-2" onClick={() => setMenuOpen(false)}>
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="nav-link-custom text-decoration-none d-block mb-2" onClick={() => setMenuOpen(false)}>Admin</Link>
                )}
                <button onClick={handleLogout} className="btn-gradient w-100 mt-2" style={{ padding: '10px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link-custom text-decoration-none d-block mb-2" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-gradient text-decoration-none d-block text-center mt-2"
                  style={{ padding: '10px', borderRadius: 8, color: 'white' }} onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
