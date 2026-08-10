import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiPackage, FiClock, FiMapPin, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const statusClasses = {
  PENDING: 'status-pending',
  PROCESSING: 'status-processing',
  SHIPPED: 'status-shipped',
  DELIVERED: 'status-delivered',
  CANCELLED: 'status-cancelled',
};

const statusIcons = {
  PENDING: '⏳',
  PROCESSING: '⚙️',
  SHIPPED: '🚚',
  DELIVERED: '✅',
  CANCELLED: '❌',
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border" style={{ color: 'var(--primary)', width: 48, height: 48 }} role="status" />
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="section-title">Order History</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        {orders.length > 0 ? `${orders.length} order(s) placed` : 'No orders yet'}
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '5rem', marginBottom: 20 }}>📦</div>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>No orders yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Start shopping to see your orders here!
          </p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} className="glass-card p-4 mb-3">
              {/* Header */}
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <FiPackage style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      #{String(order.id).slice(-10).toUpperCase()}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <FiClock size={12} />
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className={`status-badge ${statusClasses[order.status] || 'status-pending'}`}>
                    {statusIcons[order.status]} {order.status}
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--primary)', cursor: 'pointer', padding: '6px 10px', borderRadius: 8 }}>
                    {expandedId === order.id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Items Ordered
                      </div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center py-2"
                          style={{ borderBottom: '1px solid var(--border)' }}>
                          <div className="d-flex align-items-center gap-3">
                            {item.imageUrl && (
                              <img src={item.imageUrl} alt={item.productName}
                                style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.productName}</div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                ${item.price.toFixed(2)} × {item.quantity}
                              </div>
                            </div>
                          </div>
                          <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="col-md-4">
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Delivery Address
                      </div>
                      <div className="p-3" style={{ background: 'rgba(108,99,255,0.05)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <FiMapPin size={14} style={{ color: 'var(--primary)', marginRight: 6 }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{order.shippingAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
