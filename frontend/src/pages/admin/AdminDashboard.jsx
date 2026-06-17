import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiBox, FiShoppingCart, FiUsers, FiDollarSign, FiPackage, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/orders'),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts, icon: <FiBox />, color: '#6c63ff', bg: 'rgba(108,99,255,0.15)', link: '/admin/products' },
    { label: 'Total Orders', value: stats?.totalOrders, icon: <FiShoppingCart />, color: '#3498db', bg: 'rgba(52,152,219,0.15)', link: '/admin/orders' },
    { label: 'Total Users', value: stats?.totalUsers, icon: <FiUsers />, color: '#2ecc71', bg: 'rgba(46,204,113,0.15)', link: null },
    { label: 'Total Revenue', value: stats?.totalRevenue != null ? `$${Number(stats.totalRevenue).toFixed(2)}` : null, icon: <FiDollarSign />, color: '#f39c12', bg: 'rgba(243,156,18,0.15)', link: null },
  ];

  const statusClasses = { PENDING: 'status-pending', PROCESSING: 'status-processing', SHIPPED: 'status-shipped', DELIVERED: 'status-delivered', CANCELLED: 'status-cancelled' };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
        <div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Welcome back, Admin 👋</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/admin/products" className="btn-gradient text-decoration-none d-flex align-items-center gap-2"
            style={{ padding: '10px 20px' }}>
            <FiBox /> Manage Products
          </Link>
          <Link to="/admin/orders" className="text-decoration-none d-flex align-items-center gap-2"
            style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #3498db, #2980b9)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 600 }}>
            <FiPackage /> Manage Orders
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-5">
        {statCards.map((card, i) => (
          <div key={i} className="col-sm-6 col-xl-3">
            {card.link ? (
              <Link to={card.link} className="text-decoration-none">
                <StatCard card={card} loading={loading} />
              </Link>
            ) : (
              <StatCard card={card} loading={loading} />
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 style={{ fontWeight: 700, margin: 0 }}>
          <FiTrendingUp className="me-2" style={{ color: 'var(--primary)' }} />
          Recent Orders
        </h5>
        <Link to="/admin/orders" className="text-decoration-none" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>
          View All →
        </Link>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }} role="status" />
          </div>
        ) : (
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
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ card, loading }) => (
  <div className="stats-card" style={{ cursor: card.link ? 'pointer' : 'default' }}>
    <div className="stats-icon" style={{ background: card.bg, color: card.color }}>
      {card.icon}
    </div>
    <div className="stats-value" style={{ color: card.color }}>
      {loading ? <div className="spinner-border spinner-border-sm" style={{ color: card.color }} /> : (card.value ?? '0')}
    </div>
    <div className="stats-label">{card.label}</div>
  </div>
);

export default AdminDashboard;
