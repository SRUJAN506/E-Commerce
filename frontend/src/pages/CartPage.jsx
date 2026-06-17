import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const CartPage = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  if (loading) return (
    <div className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border" style={{ color: 'var(--primary)', width: 48, height: 48 }} role="status" />
    </div>
  );

  return (
    <div className="page-container">
      <div className="d-flex align-items-center gap-3 mb-2">
        <button onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
          <FiArrowLeft size={20} />
        </button>
        <h1 className="section-title" style={{ margin: 0 }}>Shopping Cart</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        {items.length === 0 ? 'Your cart is empty' : `${items.length} item(s) in your cart`}
      </p>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '5rem', marginBottom: 20 }}>🛒</div>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
            Add some products to get started!
          </p>
          <button onClick={() => navigate('/')} className="btn-gradient" style={{ padding: '12px 28px' }}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=80'}
                  alt={item.productName}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=80'; }}
                />
                <div className="flex-grow-1 min-w-0">
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{item.productName}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>
                    ${item.price.toFixed(2)} each
                  </div>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                </div>
                <div style={{ fontWeight: 700, minWidth: 80, textAlign: 'right', fontSize: '1rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', color: '#e74c3c', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(231,76,60,0.2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(231,76,60,0.1)'}
                  title="Remove item"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))}

            <button onClick={() => navigate('/')}
              className="d-flex align-items-center gap-2 mt-4"
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>
              <FiArrowLeft size={14} /> Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary">
              <h5 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.1rem' }}>Order Summary</h5>
              <div className="summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({items.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.25rem' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-gradient w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                style={{ padding: '14px', fontSize: '1rem' }}
              >
                <FiShoppingBag /> Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
