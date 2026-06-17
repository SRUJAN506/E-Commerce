import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      toast.info('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart! 🛒`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="text-decoration-none h-100">
      <div className="product-card h-100">
        <div style={{ overflow: 'hidden', height: 220 }}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400'}
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400';
            }}
          />
        </div>
        <div className="product-card-body">
          <div className="product-category">{product.categoryName}</div>
          <div className="product-name">{product.name}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4, marginBottom: 12,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="product-price">${product.price.toFixed(2)}</div>
              <div className="product-stock">
                {product.stock > 0
                  ? <span style={{ color: '#2ecc71' }}>✓ In Stock ({product.stock})</span>
                  : <span style={{ color: '#e74c3c' }}>✗ Out of Stock</span>}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="btn-gradient d-flex align-items-center gap-1"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              disabled={product.stock === 0}
              title="Add to Cart"
            >
              <FiShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
