import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp, RefreshCw, Clock, Truck, CheckCircle2, XCircle, Settings, MapPin, BarChart2, Package, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableSkeleton } from '../../components/common/Skeleton';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusConfig = {
  PENDING: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-200', icon: Clock, label: 'Pending' },
  PROCESSING: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200', icon: Settings, label: 'Processing' },
  SHIPPED: { color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-200', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-200', icon: CheckCircle2, label: 'Delivered' },
  CANCELLED: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-200', icon: XCircle, label: 'Cancelled' },
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
      toast.success(`Order status updated to ${status} 📦`);
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update status';
      toast.error(`Error: ${msg}`);
    }
  };

  const filtered = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', active: false, icon: BarChart2 },
    { label: 'Products', path: '/admin/products', active: false, icon: Package },
    { label: 'Orders', path: '/admin/orders', active: true, icon: ShoppingBag },
  ];

  return (
    <div className="bg-background min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Admin Sidebar Navigation */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-24 space-y-6">
              <div className="pb-4 border-b border-border">
                <span className="font-black text-foreground text-sm uppercase tracking-wider">Admin Control</span>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider ${
                      link.active 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <link.icon size={16} />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Orders catalog Workspace */}
          <main className="flex-grow w-full space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground">Customer Orders</h1>
                <p className="text-xs text-muted-foreground mt-1">{orders.length} total orders recorded</p>
              </div>
              <button 
                onClick={fetchOrders}
                className="bg-card border border-border hover:bg-muted text-foreground px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all focus:outline-none"
              >
                <RefreshCw size={14} /> Refresh List
              </button>
            </div>

            {/* Filter Status Badge Tabs */}
            <div className="flex flex-wrap gap-2">
              {['ALL', ...STATUS_OPTIONS].map(status => {
                const count = status === 'ALL' ? orders.length : orders.filter(o => o.status === status).length;
                const isSelected = filterStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all focus:outline-none uppercase tracking-wider ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>

            {/* Orders Table container */}
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-6">
                  <TableSkeleton rows={5} cols={6} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-xs">
                  No orders found with status "{filterStatus}".
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider bg-muted/20">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Items Count</th>
                        <th className="py-3 px-4">Total Price</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4">Date Placed</th>
                        <th className="py-3 px-4">Update Status</th>
                        <th className="py-3 px-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filtered.map(order => {
                        const statusInfo = statusConfig[order.status] || statusConfig['PENDING'];
                        const StatusIcon = statusInfo.icon;
                        const isExpanded = expandedId === order.id;

                        return (
                          <React.Fragment key={order.id}>
                            <tr className="hover:bg-muted/30 transition-colors">
                              <td className="py-4 px-4 font-mono font-bold text-foreground">
                                #{String(order.id).slice(-8).toUpperCase()}
                              </td>
                              <td className="py-4 px-4 font-semibold text-foreground">
                                {order.userName}
                              </td>
                              <td className="py-4 px-4 text-muted-foreground font-semibold">
                                {order.items?.length || 0} items
                              </td>
                              <td className="py-4 px-4 font-extrabold text-primary">
                                ${order.totalAmount.toFixed(2)}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border || 'border-transparent'}`}>
                                  <StatusIcon size={12} />
                                  {statusInfo.label}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-muted-foreground font-semibold">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <select
                                  value={order.status}
                                  onChange={e => handleStatusChange(order.id, e.target.value)}
                                  className="bg-background border border-border text-foreground text-[10px] font-bold rounded-xl px-2 py-1.5 focus:ring-2 focus:ring-primary/10 focus:outline-none cursor-pointer"
                                >
                                  {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                  className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus:outline-none"
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                              </td>
                            </tr>

                            {/* Expanded details dropdown panel */}
                            <AnimatePresence>
                              {isExpanded && (
                                <tr className="bg-muted/10">
                                  <td colSpan={8} className="p-5 border-t border-border/60">
                                    <div className="grid md:grid-cols-2 gap-8 text-left">
                                      
                                      {/* Order Items list */}
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Ordered Items</h4>
                                        <div className="space-y-3">
                                          {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-card p-3 rounded-2xl border border-border/80 shadow-sm">
                                              <div className="flex items-center gap-3">
                                                <img
                                                  src={item.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100'}
                                                  alt={item.productName}
                                                  className="w-10 h-10 rounded-xl object-cover bg-muted border border-border shrink-0"
                                                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100'; }}
                                                />
                                                <div>
                                                  <p className="text-xs font-bold text-foreground line-clamp-1">{item.productName}</p>
                                                  <p className="text-[10px] text-muted-foreground mt-0.5">${item.price?.toFixed(2)} × {item.quantity}</p>
                                                </div>
                                              </div>
                                              <span className="font-extrabold text-xs text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Shipping address details */}
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Shipping Address</h4>
                                        <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-sm flex items-start gap-3 text-xs text-muted-foreground font-semibold">
                                          <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                                          <p className="leading-relaxed">{order.shippingAddress || 'No address provided'}</p>
                                        </div>
                                      </div>

                                    </div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </main>
        </div>

      </div>
    </div>
  );
};

export default AdminOrders;
