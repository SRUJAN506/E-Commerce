import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Package, ShoppingBag, Users, DollarSign, ArrowUpRight, TrendingUp, Clock, Truck, CheckCircle2, XCircle, Settings, BarChart2, AlertCircle, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  PENDING: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-200', icon: Clock, label: 'Pending' },
  PROCESSING: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200', icon: Settings, label: 'Processing' },
  SHIPPED: { color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-200', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-200', icon: CheckCircle2, label: 'Delivered' },
  CANCELLED: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-200', icon: XCircle, label: 'Cancelled' },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/orders'),
          api.get('/products')
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
        
        // Find items with stock < 5
        setLowStockProducts(productsRes.data.filter(p => p.stock < 5).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: stats?.totalRevenue != null ? `$${Number(stats.totalRevenue).toFixed(2)}` : '$0.00', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Orders', value: stats?.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Products', value: stats?.totalProducts, icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  // SVG Chart data
  const revenueChartData = [400, 600, 500, 800, 700, 950, stats?.totalRevenue ? Math.min(stats.totalRevenue, 1200) : 1100];
  const maxVal = Math.max(...revenueChartData);

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', active: true, icon: BarChart2 },
    { label: 'Products', path: '/admin/products', active: false, icon: Package },
    { label: 'Orders', path: '/admin/orders', active: false, icon: ShoppingBag },
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

          {/* Main Workspace Dashboard Content */}
          <main className="flex-grow w-full space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">Admin Analytics</h1>
              <p className="text-xs text-muted-foreground mt-1">Real-time metrics, low-stock warnings, and transaction logs.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-500/10 font-extrabold px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{card.label}</p>
                      <p className="text-2xl font-black text-foreground mt-1">
                        {loading ? '...' : (card.value ?? '0')}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Revenue line chart */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 text-left">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-primary" /> Sales Trend Over Time
                </h3>
                <div className="h-48 w-full flex items-end justify-between pt-6 px-2 relative">
                  {/* SVG line overlay */}
                  <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="url(#chartGrad)"
                      strokeWidth="2.5"
                      points={revenueChartData.map((val, idx) => {
                        const x = (idx / (revenueChartData.length - 1)) * 100;
                        const y = 95 - (val / maxVal) * 75;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Bars backing visual */}
                  {revenueChartData.map((val, idx) => {
                    const heightPercent = (val / maxVal) * 75;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                        <span className="text-[9px] font-mono text-muted-foreground font-bold mb-1">${val}</span>
                        <div 
                          className="w-4/5 bg-primary/5 rounded-t-md hover:bg-primary/20 transition-colors"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[9px] text-muted-foreground font-bold mt-2">M{idx+1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category distribution horizontal chart */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 text-left">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Sales Category Share</h3>
                <div className="space-y-4 pt-2">
                  {[
                    { label: 'Electronics', count: 48, pct: 45 },
                    { label: 'Clothing', count: 32, pct: 30 },
                    { label: 'Sports Equipment', count: 16, pct: 15 },
                    { label: 'Books & Kitchen', count: 10, pct: 10 }
                  ].map(cat => (
                    <div key={cat.label} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-foreground">{cat.label}</span>
                        <span className="text-muted-foreground font-mono">{cat.pct}% ({cat.count})</span>
                      </div>
                      <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tables sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-left">
              
              {/* Recent Orders table */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest">Recent Orders</h3>
                  <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline">View All Orders</Link>
                </div>
                {loading ? (
                  <div className="py-8 flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : recentOrders.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">No recent orders.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground font-extrabold uppercase tracking-wider">
                          <th className="py-2.5 text-left">Order ID</th>
                          <th className="py-2.5 text-left">Customer</th>
                          <th className="py-2.5 text-right">Amount</th>
                          <th className="py-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {recentOrders.map(o => {
                          const status = statusConfig[o.status] || statusConfig['PENDING'];
                          return (
                            <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-3 font-mono font-bold">#{String(o.id).slice(-8).toUpperCase()}</td>
                              <td className="py-3 font-semibold">{o.userName}</td>
                              <td className="py-3 text-right font-extrabold text-primary">${o.totalAmount?.toFixed(2)}</td>
                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${status.bg} ${status.color}`}>
                                  {status.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-500" /> Catalog Low Stock Warnings
                  </h3>
                  <Link to="/admin/products" className="text-xs font-bold text-primary hover:underline">Manage Stock</Link>
                </div>
                {loading ? (
                  <div className="py-8 flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : lowStockProducts.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">No low stock warnings. All items above threshold!</p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 border border-border rounded-2xl bg-background">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover border border-border" />
                          <div>
                            <p className="font-bold text-xs text-foreground line-clamp-1">{p.name}</p>
                            <p className="text-[9px] text-muted-foreground font-semibold uppercase">{p.categoryName}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold font-mono ${p.stock === 0 ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {p.stock} Left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </main>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
