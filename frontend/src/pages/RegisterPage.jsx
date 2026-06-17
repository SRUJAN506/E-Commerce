import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      const { token, ...userData } = res.data;
      login(userData, token);
      toast.success(`Welcome to ShopVerse, ${userData.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>✨</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join ShopVerse and start shopping today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block', fontWeight: 500 }}>
              Full Name
            </label>
            <div className="position-relative">
              <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 }} />
              <input
                type="text"
                name="name"
                className="form-control"
                style={{ paddingLeft: 42 }}
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ padding: '14px', fontSize: '1rem' }}
          >
            <FiUserPlus /> {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
