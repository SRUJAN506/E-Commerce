import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const { token, ...userData } = res.data;
      login(userData, token);
      await fetchCart();
      toast.success(`Welcome back, ${userData.name}! 👋`);
      navigate(userData.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🛍️</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your ShopVerse account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block', fontWeight: 500 }}>
              Email Address
            </label>
            <div className="position-relative">
              <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 }} />
              <input
                type="email"
                name="email"
                className="form-control"
                style={{ paddingLeft: 42 }}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="mb-4">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block', fontWeight: 500 }}>
              Password
            </label>
            <div className="position-relative">
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 }} />
              <input
                type="password"
                name="password"
                className="form-control"
                style={{ paddingLeft: 42 }}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ padding: '14px', fontSize: '1rem' }}
          >
            <FiLogIn /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            Create account
          </Link>
        </p>

        {/* Admin hint */}
        <div style={{
          textAlign: 'center', marginTop: 20, padding: '12px 16px',
          background: 'rgba(108, 99, 255, 0.08)', borderRadius: 10,
          border: '1px solid rgba(108, 99, 255, 0.2)', fontSize: '0.8rem'
        }}>
          <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>🔑 Demo Admin Account</div>
          <div style={{ color: 'var(--text-secondary)' }}>admin@ecommerce.com / Admin@123</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
