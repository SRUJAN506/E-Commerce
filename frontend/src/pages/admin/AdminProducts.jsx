import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

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

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
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
      categoryId: p.categoryId,
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      await fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>Product Management</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{products.length} products total</p>
        </div>
        <button onClick={openAdd} className="btn-gradient d-flex align-items-center gap-2" style={{ padding: '10px 20px' }}>
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Table */}
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
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={p.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=50'}
                          alt={p.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=50'; }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', maxWidth: 200 }}>
                            {p.description?.slice(0, 50)}{p.description?.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-primary" style={{ fontSize: '0.75rem' }}>{p.categoryName}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                      ${p.price.toFixed(2)}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: p.stock > 10 ? '#2ecc71' : p.stock > 0 ? '#f39c12' : '#e74c3c'
                      }}>
                        {p.stock > 10 ? `✓ ${p.stock}` : p.stock > 0 ? `⚠ ${p.stock}` : `✗ 0`}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => openEdit(p)}
                          style={{ background: 'rgba(52,152,219,0.15)', border: '1px solid rgba(52,152,219,0.3)', color: '#3498db', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Edit">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)}
                          style={{ background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Delete">
                          <FiTrash2 size={14} />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
        >
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 700, margin: 0 }}>{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h5>
              <button onClick={() => setShowModal(false)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px 10px', borderRadius: 8 }}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Product Name *</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Laptop Pro 15" required />
                </div>
                <div className="col-12">
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Description</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." style={{ resize: 'vertical' }} />
                </div>
                <div className="col-6">
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Price ($) *</label>
                  <input type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" required />
                </div>
                <div className="col-6">
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Stock *</label>
                  <input type="number" min="0" className="form-control" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" required />
                </div>
                <div className="col-12">
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Image URL</label>
                  <input type="url" className="form-control" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." />
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                </div>
                <div className="col-12">
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Category *</label>
                  <select className="form-select" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                    <option value="">Select a category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-gradient d-flex align-items-center justify-content-center gap-2" style={{ flex: 1, padding: 12 }}>
                  <FiCheck /> {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
