import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, X, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import { toast } from 'react-toastify';
import StarRating from './StarRating';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleFavourite, isFavourite } = useFavourites();
  const navigate = useNavigate();
  
  const [ratingSummary, setRatingSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const favourited = isFavourite(product.id);
  
  // Custom mock brand helper
  const getBrand = (p) => {
    const brands = {
      'Electronics': ['Apple', 'Sony', 'Dell', 'Logitech', 'Bose'],
      'Clothing': ['Nike', 'Adidas', 'Levi\'s', 'Puma', 'Zara'],
      'Books': ['Penguin', 'HarperCollins', 'Macmillan', 'Scholastic'],
      'Sports': ['Spalding', 'Decathlon', 'Wilson', 'Under Armour'],
      'Home & Kitchen': ['Philips', 'Dyson', 'Ikea', 'Tefal', 'Cuisinart']
    };
    const list = brands[p.categoryName] || ['ShopVerse Premium'];
    return list[p.id % list.length];
  };

  const brand = getBrand(product);
  
  // Custom mock original price to show discount percentage
  const originalPrice = product.id % 3 !== 0 ? product.price * 1.25 : product.price;
  const discountPercent = originalPrice > product.price 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100) 
    : 0;

  useEffect(() => {
    api.get(`/reviews/${product.id}/summary`)
      .then(res => setRatingSummary(res.data))
      .catch(() => {});
  }, [product.id]);

  const handleAddToCart = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      navigate('/login');
      toast.info('Please log in to add items to your cart');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, showQuickView ? quickViewQuantity : 1);
      toast.success(`${product.name} added to cart! 🛒`);
      if (showQuickView) setShowQuickView(false);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleFavourite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavourite(product);
    if (added) {
      toast.success(`Added to Wishlist! ❤️`);
    } else {
      toast.info(`Removed from Wishlist 💔`);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        className="group relative bg-card border border-border/80 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      >
        {/* Invisible Link covering the card */}
        <Link to={`/product/${product.id}`} className="absolute inset-0 z-0" aria-label={`View details for ${product.name}`} />
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400';
            }}
          />
          
          {/* Discount/New Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <span className="bg-destructive text-destructive-foreground text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                -{discountPercent}%
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                Low Stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-slate-700 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                Out of Stock
              </span>
            )}
          </div>

          {/* Hover Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleFavourite}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-colors border border-border/10 focus:outline-none ${
                favourited 
                  ? 'bg-destructive text-white' 
                  : 'bg-background/80 text-foreground hover:bg-background'
              }`}
              title="Add to Wishlist"
            >
              <Heart size={16} className={favourited ? 'fill-current' : ''} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickView(true);
              }}
              className="w-9 h-9 rounded-full bg-background/80 text-foreground hover:bg-background flex items-center justify-center shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border/10 focus:outline-none"
              title="Quick View"
            >
              <Eye size={16} />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow z-10 pointer-events-none">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {product.categoryName || 'Category'}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              {brand}
            </span>
          </div>
          
          <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors text-left">
            {product.name}
          </h3>
          
          {/* Review star summary */}
          <div className="flex items-center gap-1 mb-3">
            <StarRating rating={ratingSummary.averageRating} size={12} />
            <span className="text-[10px] text-muted-foreground font-semibold">
              ({ratingSummary.totalReviews})
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between pointer-events-auto">
            <div className="flex flex-col text-left">
              {discountPercent > 0 && (
                <span className="text-xs text-muted-foreground line-through font-medium">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-base font-extrabold text-foreground leading-tight">
                ${product.price?.toFixed(2)}
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors focus:outline-none ${
                product.stock === 0 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-primary/20'
              }`}
              title="Add to Cart"
            >
              {adding ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <ShoppingCart size={16} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick View Dialog Overlay */}
      <AnimatePresence>
        {showQuickView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickView(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-8"
            >
              <button 
                onClick={() => setShowQuickView(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-20"
                aria-label="Close panel"
              >
                <X size={20} />
              </button>

              {/* Product Visual */}
              <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden border border-border/40 bg-muted/20 relative flex-shrink-0">
                <img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Product Info details */}
              <div className="flex-grow flex flex-col text-left justify-between py-2">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.categoryName || 'Category'}</span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-foreground mt-1 leading-tight">{product.name}</h2>
                    <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">Brand: {brand}</p>
                  </div>

                  {/* Rating summary */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < Math.round(ratingSummary.averageRating) ? 'fill-current' : 'text-muted-foreground/20'} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-foreground">{ratingSummary.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-xs text-muted-foreground">({ratingSummary.totalReviews} customer reviews)</span>
                  </div>

                  {/* Pricing details */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-foreground">${product.price?.toFixed(2)}</span>
                    {discountPercent > 0 && (
                      <span className="text-sm font-semibold text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {product.description || 'No description available for this premium item.'}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Availability:</span>
                    {product.stock > 0 ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        In Stock ({product.stock} units)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Actions */}
                <div className="pt-6 border-t border-border/60 mt-6 flex items-center gap-4">
                  {product.stock > 0 && (
                    <div className="flex items-center border border-border rounded-xl px-2">
                      <button 
                        onClick={() => setQuickViewQuantity(prev => Math.max(1, prev - 1))}
                        className="p-2 text-muted-foreground hover:text-foreground font-bold"
                        disabled={quickViewQuantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-bold text-foreground font-mono">{quickViewQuantity}</span>
                      <button 
                        onClick={() => setQuickViewQuantity(prev => Math.min(product.stock, prev + 1))}
                        className="p-2 text-muted-foreground hover:text-foreground font-bold"
                        disabled={quickViewQuantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || adding}
                    className="flex-grow bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {adding ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
