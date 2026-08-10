import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, X, Check, Search, Package, BarChart2, ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableSkeleton } from '../../components/common/Skeleton';
import ConfirmModal from '../../components/common/ConfirmModal';

const defaultForm = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal targets
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      // silently fail if categories fail
    }
  };

  const openAdd = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl || '',
      categoryId: p.categoryId || (p.category?.id) || '',
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, data);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', data);
        toast.success('Product created successfully!');
      }
      await fetchProducts();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const triggerDelete = (id, name) => {
    setDeleteTarget({ id, name });
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      toast.success(`"${deleteTarget.name}" deleted successfully.`);
      await fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleteTarget(null);
      setIsDeleteOpen(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin', active: false, icon: BarChart2 },
    { label: 'Products', path: '/admin/products', active: true, icon: Package },
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

          {/* Catalog Workspace */}
          <main className="flex-grow w-full space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground">Products Catalog</h1>
                <p className="text-xs text-muted-foreground mt-1">{products.length} products total in database</p>
              </div>
              <button 
                onClick={openAdd} 
                className="bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-primary/20"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Filter Search Bar */}
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                className="w-full bg-card border border-border focus:border-primary/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Products Table container */}
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-6">
                  <TableSkeleton rows={5} cols={5} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-xs">
                  No products matched the search filter term.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider bg-muted/20">
                        <th className="py-3 px-4">Product Details</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Stock Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filtered.map(p => (
                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100'}
                                alt={p.name}
                                className="w-11 h-11 rounded-xl object-cover bg-muted/40 border border-border shrink-0"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100'; }}
                              />
                              <div className="text-left">
                                <p className="font-extrabold text-foreground text-sm line-clamp-1">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[280px] mt-0.5">{p.description || 'No description added'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">
                              {p.categoryName || p.category?.name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-foreground">
                            ${p.price.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 font-bold">
                            {p.stock > 10 ? (
                              <span className="text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">In Stock ({p.stock})</span>
                            ) : p.stock > 0 ? (
                              <span className="text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Low Stock ({p.stock})</span>
                            ) : (
                              <span className="text-destructive bg-destructive/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => openEdit(p)}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all focus:outline-none"
                                title="Edit Product"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={() => triggerDelete(p.id, p.name)}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all focus:outline-none"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </main>
        </div>

        {/* Dynamic Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto z-10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-wider">
                    {editingId ? 'Edit Product Details' : 'Add New Catalog Product'}
                  </h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Product Title</label>
                    <input 
                      type="text" 
                      required 
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })} 
                      className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold" 
                      placeholder="e.g. Wireless Headphones"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Description Details</label>
                    <textarea 
                      rows={3} 
                      value={form.description} 
                      onChange={e => setForm({ ...form, description: e.target.value })} 
                      className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold" 
                      placeholder="Enter specific features and technical specs..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Price ($)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={form.price} 
                        onChange={e => setForm({ ...form, price: e.target.value })} 
                        className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold font-mono" 
                        placeholder="99.99"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Stock Quantity</label>
                      <input 
                        type="number" 
                        required 
                        value={form.stock} 
                        onChange={e => setForm({ ...form, stock: e.target.value })} 
                        className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold font-mono" 
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Category Select</label>
                    <select 
                      required 
                      value={form.categoryId} 
                      onChange={e => setForm({ ...form, categoryId: e.target.value })} 
                      className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold"
                    >
                      <option value="">Choose Catalog Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Image Asset URL</label>
                    <input 
                      type="url" 
                      value={form.imageUrl} 
                      onChange={e => setForm({ ...form, imageUrl: e.target.value })} 
                      className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold" 
                      placeholder="https://images.unsplash.com/..."
                    />
                    {/* Live Image Preview */}
                    {form.imageUrl && (
                      <div className="pt-2 text-left">
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-1.5">Asset Preview:</p>
                        <div className="w-20 h-20 rounded-xl border border-border overflow-hidden bg-muted/40">
                          <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} /> {saving ? 'Saving...' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal Overlay */}
        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Catalog Product"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? All reviews and associations will be permanently removed.`}
          confirmText="Delete Product"
          type="danger"
        />

      </div>
    </div>
  );
};

export default AdminProducts;
