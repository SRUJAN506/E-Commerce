import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useFavourites } from '../context/FavouritesContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Heart, Plus, Minus, Tag, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import EmptyState from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Skeleton';

const CartPage = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const items = cart?.items || [];
  
  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18; // 18% GST standard
  const shipping = subtotal > 0 && subtotal < 50 ? 9.99 : 0;
  const total = subtotal + gst + shipping - discount;

  const freeShippingThreshold = 50.00;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountNeededForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(subtotal * 0.20);
      toast.success('Coupon Applied: 20% Discount! 🏷️');
    } else {
      setDiscount(0);
      toast.error('Invalid coupon code');
    }
  };

  const handleSaveForLater = (item) => {
    if (!isFavourite(item.productId)) {
      toggleFavourite({ 
        id: item.productId, 
        name: item.productName, 
        price: item.price, 
        imageUrl: item.imageUrl 
      });
    }
    removeItem(item.id);
    toast.success('Item saved to your Wishlist!');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Shopping Cart</h1>
        <TableSkeleton rows={3} cols={4} />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/shop')}
            className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors focus:outline-none"
            aria-label="Back to shop"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Shopping Cart</h1>
          <span className="bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-bold">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Explore thousands of products, check top deals, and add items you like to the checkout cart."
              actionText="Start Shopping"
              actionLink="/shop"
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Shipping Indicator */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-sm">
                  {subtotal >= freeShippingThreshold ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle size={16} /> You qualify for free shipping!
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-semibold">
                      Add <span className="font-extrabold text-foreground">${amountNeededForFreeShipping.toFixed(2)}</span> more to unlock <span className="font-bold text-primary">Free Shipping</span>
                    </span>
                  )}
                  <span className="text-xs font-bold text-muted-foreground">${subtotal.toFixed(2)} / $50.00</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 rounded-full" 
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-6 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-full sm:w-28 aspect-square rounded-2xl overflow-hidden bg-muted/40 border border-border flex-shrink-0 relative">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200'}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200'; }}
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <Link to={`/product/${item.productId}`} className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">
                            {item.productName}
                          </Link>
                          <p className="text-xs text-muted-foreground font-semibold">Unit Price: ${item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-base font-extrabold text-foreground text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden h-9.5 w-30">
                          <button 
                            onClick={() => updateItem(item.id, item.quantity - 1)} 
                            disabled={item.quantity <= 1}
                            className="flex-1 h-full flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 transition-colors focus:outline-none"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="flex-1 text-center font-bold text-xs text-foreground font-mono">{item.quantity}</span>
                          <button 
                            onClick={() => updateItem(item.id, item.quantity + 1)} 
                            className="flex-1 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors focus:outline-none"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        {/* Actions buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors px-3 py-2 rounded-xl hover:bg-primary/5"
                          >
                            <Heart size={14} /> Wishlist
                          </button>
                          <div className="w-px h-4 bg-border/60" />
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs font-bold text-destructive hover:text-destructive/80 flex items-center gap-1.5 transition-colors px-3 py-2 rounded-xl hover:bg-destructive/10"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <div className="flex justify-between items-center py-4">
                <Link to="/shop" className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Summary Panel */}
            <div className="lg:col-span-4">
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-24 space-y-6">
                <h2 className="text-lg font-extrabold text-foreground pb-4 border-b border-border/80">Order Summary</h2>
                
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated GST (18%)</span>
                    <span className="text-foreground">${gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? <span className="text-emerald-500 font-extrabold">FREE</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Promo Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">Total Payable</span>
                    <span className="text-xl font-black text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">VAT/GST calculated on checkout</p>
                </div>

                {/* Coupon Input Box */}
                <div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-grow">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-background border border-border focus:border-primary/50 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 uppercase font-bold"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={!couponCode.trim()}
                      className="bg-secondary hover:bg-secondary/90 text-foreground border border-border px-4 py-2 rounded-xl text-xs font-extrabold disabled:opacity-50 transition-colors focus:outline-none"
                    >
                      Apply
                    </button>
                  </form>
                  <p className="text-[10px] text-muted-foreground mt-1.5 text-left">Try code <span className="font-bold text-primary">SAVE20</span> for 20% off subtotal</p>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 focus:outline-none"
                >
                  <ShieldCheck size={18} /> Proceed to Checkout
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-semibold">
                  <Clock size={12} /> Standard Delivery: <span className="text-foreground">3-5 days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
