import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiPackage, FiTag } from 'react-icons/fi';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      toast.info('Please login to add items to cart');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart! 🛒`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div className="spinner-border" style={{ color: 'var(--primary)', width: 56, height: 56 }} role="status" />
        <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>Loading product...</p>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="page-container">
      <button
        onClick={() => navigate(-1)}
        className="d-flex align-items-center gap-2 mb-4"
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, fontSize: '0.9rem', transition: 'color 0.2s' }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <FiArrowLeft /> Back to Products
      </button>

      <div className="row g-4">
        {/* Image */}
        <div className="col-lg-6">
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600'}
              alt={product.name}
              style={{ width: '100%', height: 460, objectFit: 'cover' }}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600'; }}
            />
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span className="badge-primary">{product.categoryName}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="col-lg-6">
          <div style={{ padding: '8px 0' }}>
            <div className="d-flex align-items-center gap-2 mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <FiTag size={14} style={{ color: 'var(--primary)' }} />
              {product.categoryName}
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
              {product.name}
            </h1>

            <div style={{
              fontSize: '2.5rem', fontWeight: 800, marginBottom: 20,
              background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              ${product.price.toFixed(2)}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 24, fontSize: '0.95rem' }}>
              {product.description}
            </p>

            {/* Stock status */}
            <div className="d-flex align-items-center gap-2 mb-4 p-3"
              style={{ background: product.stock > 0 ? 'rgba(46,204,113,0.08)' : 'rgba(231,76,60,0.08)', borderRadius: 10, border: `1px solid ${product.stock > 0 ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)'}` }}>
              <FiPackage style={{ color: product.stock > 0 ? '#2ecc71' : '#e74c3c' }} size={18} />
              <span style={{ color: product.stock > 0 ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>
                {product.stock > 0 ? `In Stock — ${product.stock} units available` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Cart */}
            {product.stock > 0 && (
              <div className="d-flex align-items-center gap-3">
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value" style={{ fontSize: '1.1rem' }}>{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="btn-gradient d-flex align-items-center gap-2"
                  style={{ flex: 1, padding: '14px 24px', fontSize: '1rem', justifyContent: 'center' }}
                >
                  <FiShoppingCart size={18} />
                  {adding ? 'Adding...' : `Add ${quantity > 1 ? `(${quantity})` : ''} to Cart`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
