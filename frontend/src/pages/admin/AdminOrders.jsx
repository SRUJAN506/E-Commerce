import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusClasses = {
  PENDING: 'status-pending',
  PROCESSING: 'status-processing',
  SHIPPED: 'status-shipped',
  DELIVERED: 'status-delivered',
  CANCELLED: 'status-cancelled',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${status}`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);

  if (loading) return (
    <div className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border" style={{ color: 'var(--primary)', width: 48, height: 48 }} role="status" />
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>Order Management</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders} className="d-flex align-items-center gap-2"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}>
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Status Filter */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {['ALL', ...STATUS_OPTIONS].map(status => (
          <button key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              border: filterStatus === status ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: filterStatus === status ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
              color: filterStatus === status ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}>
            {status} {status !== 'ALL' && `(${orders.filter(o => o.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-dark-custom mb-0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <>
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{order.userName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{order.items.length} item(s)</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${statusClasses[order.status] || 'status-pending'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="form-select"
                        style={{ fontSize: '0.8rem', padding: '5px 8px', minWidth: 140 }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--primary)', cursor: 'pointer', padding: '5px 8px', borderRadius: 6 }}>
                        {expandedId === order.id ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-expanded`}>
                      <td colSpan={8} style={{ padding: 0 }}>
                        <div style={{ padding: '20px 24px', background: 'rgba(108,99,255,0.04)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                          <div className="row g-3">
                            <div className="col-md-7">
                              <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ORDER ITEMS</strong>
                              <div className="mt-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="d-flex justify-content-between align-items-center py-2"
                                    style={{ borderBottom: '1px solid var(--border)' }}>
                                    <div className="d-flex align-items-center gap-2">
                                      {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.productName}
                                          style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                                          onError={e => e.target.style.display = 'none'}
                                        />
                                      )}
                                      <span style={{ fontSize: '0.9rem' }}>{item.productName}</span>
                                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>× {item.quantity}</span>
                                    </div>
                                    <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="col-md-5">
                              <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SHIPPING ADDRESS</strong>
                              <div className="mt-2 p-3" style={{ background: 'rgba(108,99,255,0.05)', borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                📍 {order.shippingAddress}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
            <p style={{ color: 'var(--text-secondary)' }}>No orders found for status: {filterStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
