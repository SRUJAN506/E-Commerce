import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Send, CheckCircle2, Heart, Share2, ShieldCheck, Truck, RefreshCw, Star, Info, HelpCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import { toast } from 'react-toastify';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { ProductDetailSkeleton } from '../components/common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleFavourite, isFavourite } = useFavourites();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Mock colors and sizes
  const colors = ['#0f172a', '#3b82f6', '#ef4444', '#10b981'];
  const sizes = ['S', 'M', 'L', 'XL'];

  // Resolve dynamic mock brand based on product properties
  const getBrand = (p) => {
    if (!p) return 'ShopVerse';
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

  const brandName = getBrand(product);
  const originalPrice = product ? (product.id % 3 !== 0 ? product.price * 1.25 : product.price) : 0;
  const discountPercent = product && originalPrice > product.price 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100) 
    : 0;

  // Generate dynamic mockup images for detail image gallery
  const getGalleryImages = (p) => {
    if (!p) return [];
    const base = p.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800';
    // Fallback/different mock variants based on category to simulate standard multi-image listings
    const categoryVariants = {
      'Electronics': [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
      ],
      'Clothing': [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'
      ],
      'Home & Kitchen': [
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800'
      ]
    };
    const list = categoryVariants[p.categoryName] || [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'
    ];
    return [base, ...list.slice(0, 3)];
  };

  const galleryImages = getGalleryImages(product);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setActiveImage(res.data.imageUrl);
        
        // Fetch related products (mocking by just getting all products and slicing)
        const relatedRes = await api.get('/products');
        setRelatedProducts(relatedRes.data.filter(p => p.id !== parseInt(id)).slice(0, 4));
        
      } catch {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [reviewsRes, summaryRes] = await Promise.all([
          api.get(`/reviews/${id}`),
          api.get(`/reviews/${id}/summary`),
        ]);
        setReviews(reviewsRes.data);
        setRatingSummary(summaryRes.data);

        if (user && user.role !== 'ADMIN') {
          const hasReviewedRes = await api.get(`/reviews/${id}/has-reviewed`);
          setHasReviewed(hasReviewedRes.data.hasReviewed);
        }
      } catch {
        // silent
      }
    };
    if (product) fetchReviews();
  }, [id, user, product]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      toast.info('Please log in to add items to your cart');
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

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (user) navigate('/checkout');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { toast.error('Please select a star rating'); return; }
    try {
      setSubmittingReview(true);
      await api.post(`/reviews/${id}`, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted successfully! 🌟');
      setReviewComment('');
      setReviewRating(5);
      
      const [reviewsRes, summaryRes] = await Promise.all([
        api.get(`/reviews/${id}`),
        api.get(`/reviews/${id}/summary`),
      ]);
      setReviews(reviewsRes.data);
      setRatingSummary(summaryRes.data);
      setHasReviewed(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const favourited = product ? isFavourite(product.id) : false;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) return null;

  const ratingBars = [5, 4, 3, 2, 1].map(star => {
    const starCount = reviews.filter(r => r.rating === star).length;
    const pct = reviews.length > 0 ? (starCount / reviews.length) * 100 : 0;
    return { star, count: starCount, pct };
  });

  return (
    <div className="bg-background min-h-screen pt-8 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group focus:outline-none"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Catalog
        </button>

        {/* Product Layout Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Gallery View Column */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-card border border-border/80 group">
              <img
                src={activeImage || product.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 origin-center cursor-zoom-in"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800'; }}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {discountPercent > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-3.5 z-10">
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    toggleFavourite(product); 
                    toast.info(favourited ? 'Removed from Wishlist 💔' : 'Added to Wishlist! ❤️'); 
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-colors border border-border/10 focus:outline-none ${
                    favourited ? 'bg-destructive text-white' : 'bg-background/80 text-foreground hover:bg-background'
                  }`}
                >
                  <Heart size={18} className={favourited ? 'fill-current' : ''} />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Product link copied to clipboard! 📋');
                  }}
                  className="w-10 h-10 bg-background/80 hover:bg-background text-foreground backdrop-blur-md rounded-full flex items-center justify-center shadow-md transition-colors border border-border/10 focus:outline-none"
                  title="Share Item"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            
            {/* Thumbnails list */}
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.map((imgUrl, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 bg-card/60 transition-all p-1 ${
                    activeImage === imgUrl ? 'border-primary scale-[1.03]' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Info Details Column */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full">
                  {product.categoryName || 'Category'}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mt-4 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-2">
                  Brand: {brandName}
                </p>
              </div>

              {/* Reviews Summary */}
              {ratingSummary.totalReviews > 0 ? (
                <div className="flex items-center gap-3">
                  <StarRating rating={ratingSummary.averageRating} size={16} showValue />
                  <span className="text-xs text-muted-foreground font-semibold">
                    ({ratingSummary.totalReviews} customer reviews)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Info size={14} /> No customer reviews yet.
                </div>
              )}

              {/* Pricing Display */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-black text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-lg text-muted-foreground line-through font-semibold">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Color Swatch Selector */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3">Available Colors</h3>
                <div className="flex gap-3">
                  {colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all focus:outline-none ${
                        selectedColor === idx ? 'border-primary scale-110 shadow-md' : 'border-transparent hover:scale-105'
                      }`}
                      aria-label={`Select color ${color}`}
                    >
                      <span className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: color }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Select Grid */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Select Size</h3>
                  <button className="text-xs text-primary hover:underline font-bold">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-3 max-w-sm">
                  {sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(idx)}
                      className={`py-2.5 rounded-xl border font-bold text-xs transition-all focus:outline-none ${
                        selectedSize === idx 
                          ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                          : 'border-border bg-card text-foreground hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Indicator */}
              <div className="pt-2">
                 {product.stock > 0 ? (
                   <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
                     <CheckCircle2 size={14} /> In Stock ({product.stock} units available)
                   </span>
                 ) : (
                   <span className="inline-flex items-center gap-1.5 text-destructive bg-destructive/10 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
                     <Package size={14} /> Out of Stock
                   </span>
                 )}
              </div>
            </div>

            {/* Action Panel Buttons */}
            <div className="space-y-6 pt-8 mt-8 border-t border-border/60">
              {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-border rounded-xl bg-card overflow-hidden w-full sm:w-32 h-12 flex-shrink-0">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                      className="flex-1 h-full flex items-center justify-center text-foreground hover:bg-muted font-bold transition-colors focus:outline-none"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-foreground font-mono">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                      className="flex-1 h-full flex items-center justify-center text-foreground hover:bg-muted font-bold transition-colors focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex-grow h-12 bg-card border-2 border-primary text-primary hover:bg-primary/5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors focus:outline-none"
                  >
                    <ShoppingCart size={16} />
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-grow h-12 bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all focus:outline-none"
                  >
                    Buy Now
                  </button>
                </div>
              )}

              {/* Delivery Features Banners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/40 border border-border/40">
                   <Truck className="text-primary" size={20} />
                   <div className="text-left">
                     <h4 className="text-xs font-bold text-foreground">Free Shipping</h4>
                     <p className="text-[10px] text-muted-foreground mt-0.5">Complimentary for orders over $50</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/40 border border-border/40">
                   <RefreshCw className="text-primary" size={20} />
                   <div className="text-left">
                     <h4 className="text-xs font-bold text-foreground">Simple Returns</h4>
                     <p className="text-[10px] text-muted-foreground mt-0.5">30 days return window policy</p>
                   </div>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Informative Tabs Section */}
        <div className="mb-16">
          <div className="flex border-b border-border overflow-x-auto no-scrollbar">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-6 font-bold text-sm sm:text-base capitalize whitespace-nowrap transition-colors relative focus:outline-none ${
                  activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
          
          <div className="py-6">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="text-foreground/85 leading-relaxed space-y-4 max-w-3xl text-sm"
                >
                  <p>{product.description || 'No description available.'}</p>
                  <p>Developed with durability, comfort, and premium standards in mind. This unit represents our signature commitment to aesthetics and functional performance. It has been tested comprehensively to deliver top quality.</p>
                </motion.div>
              )}
              
              {activeTab === 'specifications' && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-3xl"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ['Material', 'Premium Composite Material'],
                      ['Warranty', '1 Year Limited Manufacturer Warranty'],
                      ['Origin', 'Imported Premium Grade'],
                      ['Color Type', 'Multiswatch Optional System'],
                      ['Delivery Weight', '0.75 kg average shipping box']
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between items-center p-4 border border-border rounded-2xl bg-card text-xs">
                        <span className="text-muted-foreground font-semibold">{label}</span>
                        <span className="font-extrabold text-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="grid lg:grid-cols-12 gap-12">
                    
                    {/* Rating Stats Card */}
                    <div className="lg:col-span-4">
                      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-24 space-y-6">
                        <div>
                          <h3 className="text-base font-extrabold text-foreground mb-4">Customer Sentiment</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-5xl font-black text-foreground">{Number(ratingSummary.averageRating).toFixed(1)}</span>
                            <div>
                              <StarRating rating={ratingSummary.averageRating} size={18} />
                              <p className="text-xs text-muted-foreground mt-1">Based on {ratingSummary.totalReviews} reviews</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {ratingBars.map(({ star, count, pct }) => (
                            <div key={star} className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-foreground w-12">{star} Stars</span>
                              <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground w-8 text-right font-mono">{count}</span>
                            </div>
                          ))}
                        </div>

                        {/* Submit Review Card */}
                        {user && user.role !== 'ADMIN' && !hasReviewed ? (
                           <div className="pt-6 border-t border-border/80 space-y-4">
                             <h4 className="font-bold text-sm text-foreground">Write a Review</h4>
                             <form onSubmit={handleSubmitReview} className="space-y-4">
                               <div className="space-y-1.5">
                                 <label className="block text-xs font-semibold text-muted-foreground">Select Star Rating</label>
                                 <StarRating rating={reviewRating} onChange={setReviewRating} size={22} />
                               </div>
                               <div className="space-y-1.5">
                                 <label className="block text-xs font-semibold text-muted-foreground">Your Thoughts</label>
                                 <textarea
                                   rows={3}
                                   placeholder="What did you like or dislike about this product?"
                                   value={reviewComment}
                                   onChange={e => setReviewComment(e.target.value)}
                                   className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10"
                                   required
                                 />
                               </div>
                               <button 
                                 type="submit" 
                                 disabled={submittingReview} 
                                 className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none"
                               >
                                 <Send size={14} /> {submittingReview ? 'Submitting...' : 'Submit Review'}
                               </button>
                             </form>
                           </div>
                        ) : user && hasReviewed ? (
                          <div className="pt-6 border-t border-border/80 text-center">
                            <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold text-xs">
                              <CheckCircle2 size={14} /> Verified Review Submitted
                            </span>
                          </div>
                        ) : !user ? (
                           <div className="pt-6 border-t border-border/80 text-center space-y-3">
                             <p className="text-xs text-muted-foreground">You must be logged in to write a review.</p>
                             <Link to="/login" className="inline-block bg-primary text-primary-foreground font-bold px-5 py-2 rounded-xl text-xs hover:bg-primary/90 transition-colors shadow-sm">
                               Login to Review
                             </Link>
                           </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Customer reviews listing */}
                    <div className="lg:col-span-8">
                      {reviews.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-border rounded-3xl">
                          <HelpCircle className="mx-auto text-muted-foreground/60 mb-4" size={32} />
                          <h4 className="font-bold text-foreground text-sm">No reviews yet</h4>
                          <p className="text-xs text-muted-foreground mt-1">Be the first to share your purchase experience!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {reviews.map(review => (
                            <div key={review.id} className="bg-card p-6 rounded-3xl border border-border/80 shadow-sm space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 text-primary font-bold text-sm rounded-full flex items-center justify-center">
                                    {review.userName?.charAt(0)?.toUpperCase()}
                                  </div>
                                  <div className="text-left">
                                    <div className="flex items-center gap-1.5">
                                      <h4 className="font-bold text-sm text-foreground">{review.userName}</h4>
                                      <span className="bg-emerald-500/15 text-emerald-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                        <CheckCircle2 size={8} /> Verified
                                      </span>
                                    </div>
                                    <div className="mt-0.5">
                                      <StarRating rating={review.rating} size={11} />
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="text-foreground/85 leading-relaxed text-sm text-left">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Related/Cross-sell products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-border">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;
