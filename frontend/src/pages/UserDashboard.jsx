import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, CheckCircle2, Clock, Truck, XCircle, ShieldCheck, Heart, LayoutDashboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/common/EmptyState';

const statusConfig = {
  PENDING: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-200', icon: Clock, label: 'Pending', stepIndex: 0 },
  PROCESSING: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200', icon: Settings, label: 'Processing', stepIndex: 1 },
  SHIPPED: { color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-200', icon: Truck, label: 'Shipped', stepIndex: 2 },
  DELIVERED: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-200', icon: CheckCircle2, label: 'Delivered', stepIndex: 4 },
  CANCELLED: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-200', icon: XCircle, label: 'Cancelled', stepIndex: -1 },
};

const timelineSteps = [
  { label: 'Ordered', status: 'PENDING' },
  { label: 'Confirmed', status: 'PROCESSING' },
  { label: 'Shipped', status: 'SHIPPED' },
  { label: 'Delivered', status: 'DELIVERED' }
];

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { favourites } = useFavourites();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDOB, setProfileDOB] = useState('');

  // Settings Password form
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile details saved! 💾');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password updated successfully! 🔐');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-background min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Dashboard Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-24 space-y-6">
              
              {/* User Identity Details */}
              <div className="flex items-center gap-4 pb-6 border-b border-border/80">
                <div className="w-11 h-11 bg-primary/10 text-primary font-bold text-lg rounded-2xl flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-foreground text-sm line-clamp-1">{user?.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{user?.role} Account</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all focus:outline-none ${
                      activeTab === tab.id 
                        ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/10' 
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon size={16} />
                      <span className="text-xs uppercase tracking-wider">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <ChevronRight size={14} />}
                  </button>
                ))}
              </nav>
              
              <div className="pt-4 border-t border-border/80">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-bold text-xs uppercase tracking-wider focus:outline-none"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Workspace area */}
          <main className="flex-grow w-full">
            <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm min-h-[560px]">
              
              <AnimatePresence mode="wait">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-black text-foreground">Welcome Back, {user?.name}! 👋</h2>
                      <p className="text-muted-foreground text-xs mt-1">Here is a quick look at your account activity and latest transactions.</p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="border border-border/80 bg-background rounded-2xl p-5 shadow-sm text-left">
                        <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
                          <Package size={18} />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Orders</p>
                        <p className="text-2xl font-extrabold text-foreground mt-1">{orders.length}</p>
                      </div>
                      <div className="border border-border/80 bg-background rounded-2xl p-5 shadow-sm text-left">
                        <div className="w-9 h-9 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center mb-3">
                          <Heart size={18} className="fill-current" />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">My Wishlist</p>
                        <p className="text-2xl font-extrabold text-foreground mt-1">{favourites.length} Items</p>
                      </div>
                      <div className="border border-border/80 bg-background rounded-2xl p-5 shadow-sm text-left">
                        <div className="w-9 h-9 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-3">
                          <ShieldCheck size={18} />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Account Tier</p>
                        <p className="text-2xl font-extrabold text-foreground mt-1">Gold Member</p>
                      </div>
                    </div>

                    {/* Recent Orders List */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider">Recent Orders</h3>
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : orders.length === 0 ? (
                        <p className="text-xs text-muted-foreground bg-background p-4 rounded-xl border border-border/60">You have not placed any orders yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {orders.slice(0, 3).map(order => {
                            const statusInfo = statusConfig[order.status] || statusConfig['PENDING'];
                            return (
                              <div key={order.id} className="flex justify-between items-center p-4 border border-border/80 rounded-2xl bg-background hover:shadow-sm transition-shadow">
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-foreground font-mono">#{String(order.id).slice(-8).toUpperCase()}</p>
                                  <p className="text-[10px] text-muted-foreground">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-xs font-extrabold text-primary">${order.totalAmount.toFixed(2)}</span>
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border || 'border-transparent'}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 2. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground">Order History</h2>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <EmptyState
                        icon={Package}
                        title="No Orders Yet"
                        description="You have not placed any orders. Go to the marketplace shop to buy items!"
                        actionText="Start Shopping"
                        actionLink="/shop"
                      />
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => {
                          const statusInfo = statusConfig[order.status] || statusConfig['PENDING'];
                          const StatusIcon = statusInfo.icon;
                          const isExpanded = expandedOrder === order.id;

                          // Evaluate progress for order tracking timeline
                          const currentStepIndex = statusInfo.stepIndex;

                          return (
                            <div key={order.id} className="border border-border rounded-3xl bg-background overflow-hidden transition-all hover:shadow-md">
                              {/* Header Panel */}
                              <div 
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                className="p-5 cursor-pointer flex flex-wrap items-center justify-between gap-4 select-none"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center border border-border flex-shrink-0 text-primary">
                                    <Package size={18} />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Order ID</p>
                                    <p className="font-extrabold text-foreground font-mono text-xs">#{String(order.id).slice(-8).toUpperCase()}</p>
                                  </div>
                                </div>
                                
                                <div className="hidden sm:block text-left">
                                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Date Placed</p>
                                  <p className="font-bold text-foreground text-xs">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>

                                <div className="text-left">
                                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total amount</p>
                                  <p className="font-extrabold text-foreground text-xs">${order.totalAmount.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border || 'border-transparent'}`}>
                                    <StatusIcon size={12} />
                                    {statusInfo.label}
                                  </span>
                                  <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>

                              {/* Expanded Panel Details */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-border bg-card/40"
                                  >
                                    {/* Timeline Order Tracking (Only if not cancelled) */}
                                    {currentStepIndex >= 0 && (
                                      <div className="p-6 border-b border-border/60 bg-background/50">
                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 text-left">Order Status Timeline</h4>
                                        <div className="flex justify-between items-center max-w-xl mx-auto relative px-4">
                                          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-border -z-10" />
                                          {/* Active line bar */}
                                          <div 
                                            className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-500" 
                                            style={{ 
                                              width: currentStepIndex === 0 ? '0%' :
                                                     currentStepIndex === 1 ? '33%' :
                                                     currentStepIndex === 2 ? '66%' : '100%'
                                            }}
                                          />
                                          {timelineSteps.map((step, sIdx) => {
                                            const isStepDone = currentStepIndex >= sIdx;
                                            return (
                                              <div key={step.label} className="flex flex-col items-center relative z-10">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                                  isStepDone ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'
                                                }`}>
                                                  {isStepDone ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">{sIdx + 1}</span>}
                                                </div>
                                                <span className={`text-[9px] font-extrabold uppercase mt-2 ${
                                                  isStepDone ? 'text-primary' : 'text-muted-foreground'
                                                }`}>
                                                  {step.label}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    <div className="p-5 grid md:grid-cols-2 gap-8">
                                      {/* Items Details */}
                                      <div className="space-y-4">
                                        <h4 className="font-extrabold text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Items</h4>
                                        <div className="space-y-3.5">
                                          {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4">
                                              <img 
                                                src={item.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100'} 
                                                alt={item.productName} 
                                                className="w-12 h-12 rounded-xl object-cover bg-muted border border-border"
                                              />
                                              <div className="flex-grow flex justify-between items-center text-left">
                                                <div>
                                                  <h5 className="font-bold text-xs text-foreground line-clamp-1">{item.productName}</h5>
                                                  <p className="text-[10px] text-muted-foreground mt-0.5">Quantity: {item.quantity}</p>
                                                </div>
                                                <span className="font-extrabold text-xs text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Summary details */}
                                      <div className="space-y-6 text-left">
                                        <div>
                                          <h4 className="font-extrabold text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Shipping Destination</h4>
                                          <div className="bg-background border border-border p-4 rounded-2xl flex items-start gap-2.5 text-xs text-muted-foreground font-semibold">
                                            <MapPin className="text-primary shrink-0 mt-0.5" size={14} />
                                            <p>{order.shippingAddress}</p>
                                          </div>
                                        </div>

                                        <div>
                                          <h4 className="font-extrabold text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Summary</h4>
                                          <div className="bg-background border border-border p-4 rounded-2xl space-y-2 text-xs font-semibold">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Goods Subtotal</span>
                                              <span className="text-foreground">${(order.totalAmount - (order.totalAmount < 50 ? 9.99 : 0)).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Shipping</span>
                                              <span className="text-foreground">{order.totalAmount < 50 ? '$9.99' : 'FREE'}</span>
                                            </div>
                                            <div className="border-t border-border/80 pt-2 mt-2 flex justify-between font-extrabold">
                                              <span className="text-foreground">Total Paid</span>
                                              <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                  <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground">My Wishlist</h2>
                    {favourites.length === 0 ? (
                      <EmptyState
                        icon={Heart}
                        title="Wishlist is empty"
                        description="Browse the marketplace and like items to view them here later."
                        actionText="Shop Now"
                        actionLink="/shop"
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favourites.map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. ADDRESSES TAB */}
                {activeTab === 'addresses' && (
                  <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-border/60">
                      <h2 className="text-xl font-bold text-foreground">Saved Addresses</h2>
                      <button className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors focus:outline-none">
                        + Add New
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6 text-left">
                      {/* Default Address */}
                      <div className="border-2 border-primary bg-primary/5 rounded-2xl p-5 relative">
                        <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Default</span>
                        <h4 className="font-bold text-foreground mb-1 text-sm">Home Office</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                          123 Main Street, Apt 4B<br/>New York, NY 10001<br/>United States
                        </p>
                        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 focus:outline-none">Edit</button>
                      </div>
                      
                      {/* Work Address */}
                      <div className="border border-border bg-background rounded-2xl p-5">
                        <h4 className="font-bold text-foreground mb-1 text-sm">Corporate Office</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                          456 Corporate Blvd, Suite 200<br/>San Francisco, CA 94107<br/>United States
                        </p>
                        <div className="flex gap-4">
                          <button className="text-xs font-bold text-primary hover:underline focus:outline-none">Edit</button>
                          <button className="text-xs font-bold text-destructive hover:underline focus:outline-none">Delete</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. PROFILE TAB */}
                {activeTab === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground">My Profile</h2>
                    <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6 text-left">
                      <div className="flex items-center gap-6 pb-6 border-b border-border/60">
                        <div className="w-20 h-20 bg-primary/10 text-primary font-bold text-3xl rounded-[1.5rem] flex items-center justify-center border-2 border-border shadow-md">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <button type="button" className="bg-primary hover:bg-primary/95 text-primary-foreground px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm focus:outline-none mb-1.5">
                            Upload Avatar
                          </button>
                          <p className="text-[10px] text-muted-foreground">JPEG, PNG or WEBP formats. Size max 2MB.</p>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                          <input 
                            type="text" 
                            value={profileName} 
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold" 
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                          <input 
                            type="email" 
                            defaultValue={user?.email} 
                            className="w-full bg-background/50 border border-border rounded-xl p-3 text-xs text-muted-foreground cursor-not-allowed font-semibold" 
                            disabled 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                          <input 
                            type="tel" 
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            placeholder="+1 (555) 000-0000" 
                            className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date of Birth</label>
                          <input 
                            type="date" 
                            value={profileDOB}
                            onChange={(e) => setProfileDOB(e.target.value)}
                            className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold" 
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md focus:outline-none"
                      >
                        Save Changes
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 6. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 text-left">
                    <h2 className="text-xl font-bold text-foreground">Settings</h2>
                    
                    <div className="max-w-xl space-y-8">
                      {/* Password changes */}
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground mb-4 pb-2 border-b border-border/80 uppercase tracking-wider">Change Password</h3>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Password</label>
                            <input 
                              type="password" 
                              value={passwordForm.current}
                              onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                              placeholder="••••••••" 
                              className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10" 
                              required
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                              <input 
                                type="password" 
                                value={passwordForm.new}
                                onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                                placeholder="Min. 6 characters" 
                                className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10" 
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                              <input 
                                type="password" 
                                value={passwordForm.confirm}
                                onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                                placeholder="••••••••" 
                                className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10" 
                                required
                              />
                            </div>
                          </div>
                          <button type="submit" className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md focus:outline-none">
                            Update Password
                          </button>
                        </form>
                      </div>

                      {/* Notification details */}
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground mb-4 pb-2 border-b border-border/80 uppercase tracking-wider">Email Notifications</h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3.5 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4.5 h-4.5 text-primary rounded-md border-border focus:ring-primary/20" />
                            <div className="text-xs text-left">
                              <p className="font-bold text-foreground">Order Tracking Status</p>
                              <p className="text-muted-foreground text-[10px] mt-0.5">Receive emails about confirmation, shipping, and delivery updates.</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3.5 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4.5 h-4.5 text-primary rounded-md border-border focus:ring-primary/20" />
                            <div className="text-xs text-left">
                              <p className="font-bold text-foreground">Weekly Offers & Deals</p>
                              <p className="text-muted-foreground text-[10px] mt-0.5">Receive exclusive coupons, newsletter digests, and seasonal sales info.</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
