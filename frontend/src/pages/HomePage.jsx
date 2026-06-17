import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { toast } from 'react-toastify';

const categoryIcons = {
  'Electronics': '💻',
  'Clothing': '👕',
  'Books': '📚',
  'Sports': '⚽',
  'Home & Kitchen': '🏠',
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch { /* silent */ }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      const url = params.toString() ? `/products?${params}` : '/products';
      const res = await api.get(url);
      setProducts(res.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    setSearchQuery('');
    setSearchInput('');
  };

  const activeCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.name
    : 'All Products';

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="badge-primary mb-3" style={{ display: 'inline-block' }}>
                ✨ 13 Premium Products Available
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                Discover{' '}
                <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Premium
                </span>{' '}
                Products
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 32, lineHeight: 1.8 }}>
                Shop the latest in electronics, fashion, books, sports &amp; more — all in one place with secure checkout.
              </p>
              <form onSubmit={handleSearch} className="d-flex gap-2" style={{ maxWidth: 520 }}>
                <div className="flex-grow-1 position-relative">
                  <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    style={{ paddingLeft: 42 }}
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-gradient" style={{ whiteSpace: 'nowrap', padding: '0 24px' }}>
                  Search
                </button>
              </form>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-center align-items-center">
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 280, height: 280, borderRadius: '50%',
                  background: 'var(--gradient)', opacity: 0.12, filter: 'blur(50px)',
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                }} />
                <div style={{ fontSize: '9rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(108,99,255,0.3))' }}>
                  🛍️
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="page-container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="filter-sidebar">
              <div className="filter-title">Browse by Category</div>
              <div
                className={`filter-item ${!selectedCategory ? 'active' : ''}`}
                onClick={() => handleCategorySelect('')}
              >
                🏪 All Products
              </div>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className={`filter-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {categoryIcons[cat.name] || '🏷️'} {cat.name}
                </div>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 2 }}>{activeCategoryName}</h2>
                {searchQuery && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                    Results for: "<span style={{ color: 'var(--primary)' }}>{searchQuery}</span>"
                    <button onClick={() => { setSearchQuery(''); setSearchInput(''); }}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginLeft: 8, fontSize: '0.8rem' }}>
                      ✕ Clear
                    </button>
                  </p>
                )}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', background: 'rgba(108,99,255,0.1)', padding: '4px 12px', borderRadius: 20 }}>
                {products.length} results
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: 'var(--primary)', width: 48, height: 48 }} role="status" />
                <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
                <h4 style={{ color: 'var(--text-secondary)' }}>No products found</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Try a different search or category</p>
              </div>
            ) : (
              <div className="row g-3">
                {products.map(product => (
                  <div key={product.id} className="col-sm-6 col-xl-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
