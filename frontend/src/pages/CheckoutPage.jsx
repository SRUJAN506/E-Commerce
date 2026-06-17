import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiMapPin, FiCheck, FiArrowLeft } from 'react-icons/fi';

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    try {
      setLoading(true);
      await api.post('/orders', { shippingAddress: address });
      await fetchCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => navigate('/cart')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
          <FiArrowLeft size={20} />
        </button>
        <h1 className="section-title" style={{ margin: 0 }}>Checkout</h1>
      </div>

      <div className="row g-4">
        {/* Shipping Form */}
        <div className="col-lg-7">
          <div className="glass-card p-4">
            <h5 className="d-flex align-items-center gap-2 mb-4" style={{ fontWeight: 700 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
              <FiMapPin style={{ color: 'var(--primary)' }} /> Shipping Address
            </h5>
            <form id="checkout-form" onSubmit={handlePlaceOrder}>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Enter your complete shipping address&#10;e.g. 123 Main Street, Apt 4B&#10;     New York, NY 10001&#10;     United States"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
              <div className="mt-3 p-3" style={{ background: 'rgba(52,152,219,0.08)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                🚚 Standard shipping (3–5 business days) — $9.99
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-5">
          <div className="order-summary">
            <h5 style={{ fontWeight: 700, marginBottom: 20 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, marginRight: 10 }}>2</span>
              Order Summary
            </h5>

            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }}>
              {items.map(item => (
                <div key={item.id} className="d-flex justify-content-between align-items-center py-2"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.productName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>× {item.quantity}</div>
                  </div>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.2rem' }}>
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading || items.length === 0}
              className="btn-gradient w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
              style={{ padding: '14px', fontSize: '1rem' }}
            >
              <FiCheck /> {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
