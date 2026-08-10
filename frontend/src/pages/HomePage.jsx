import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Star, ShieldCheck, Truck, RefreshCw, Sparkles, TrendingUp, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import api from '../services/api';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
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

  const trendingProducts = products.slice(0, 4);
  const bestSellers = products.slice(4, 8);
  const newArrivals = products.slice(8, 12);

  const categories = [
    { name: 'Electronics', icon: '💻', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', path: '/shop?category=Electronics' },
    { name: 'Clothing', icon: '👗', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', path: '/shop?category=Clothing' },
    { name: 'Books', icon: '📚', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500', path: '/shop?category=Books' },
    { name: 'Sports', icon: '⚽', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500', path: '/shop?category=Sports' },
    { name: 'Home & Kitchen', icon: '🏠', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500', path: '/shop?category=Home%20%26%20Kitchen' },
    { name: 'Beauty & Wellness', icon: '✨', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', path: '/shop' },
  ];

  const features = [
    { icon: <Truck size={22} />, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: <ShieldCheck size={22} />, title: 'Secure Checkout', desc: 'Protected by SSL protocol' },
    { icon: <RefreshCw size={22} />, title: 'Simple Returns', desc: '30-day money back policy' },
    { icon: <Award size={22} />, title: 'Premium Support', desc: '24/7 dedicated help desk' },
  ];

  const testimonials = [
    { id: 1, name: 'Sarah Jenkins', role: 'Verified Buyer', content: 'Absolutely love the quality of products here. The delivery was incredibly fast and the packaging was premium.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Michael Chen', role: 'Verified Buyer', content: 'ShopVerse is my go-to for all tech gadgets. Their customer service is unmatched and prices are highly competitive.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Emily Rodriguez', role: 'Verified Buyer', content: 'The clothing collection is always on trend. I have bought several outfits and they all fit perfectly.', rating: 4, avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center bg-gradient-to-br from-indigo-50/70 via-slate-50 to-white dark:from-slate-900/50 dark:via-background dark:to-background overflow-hidden border-b border-border/30">
        {/* Background Decorative Blur Rings */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[700px] h-[700px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl text-left"
            >
              <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
                <Sparkles size={12} /> Live Your Best ShopVerse
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
                Discover Products <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">You'll Love</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Explore thousands of premium products with fast delivery, secure payments, and unparalleled customer service.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/shop" 
                  className="bg-primary hover:bg-primary/95 text-primary-foreground px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2 group"
                >
                  Shop Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/shop?sort=price-asc" 
                  className="bg-card hover:bg-muted text-foreground border border-border px-8 py-4 rounded-full font-bold text-base transition-all"
                >
                  Explore Deals
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-5 border-t border-border/60 pt-8 w-fit">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                     <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-9 h-9 rounded-full border-2 border-background shadow-sm object-cover" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                    <Star size={13} className="fill-current" />
                    <Star size={13} className="fill-current" />
                    <Star size={13} className="fill-current" />
                    <Star size={13} className="fill-current" />
                    <Star size={13} className="fill-current" />
                  </div>
                  <span className="font-bold text-foreground">4.9/5</span> <span className="text-muted-foreground text-xs">(from 10k+ reviews)</span>
                </div>
              </div>
            </motion.div>
            
            {/* Visual Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:block relative h-[480px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[2.5rem] blur-xl transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800" 
                alt="Premium Fashion & Tech" 
                className="w-full h-full object-cover rounded-[2.5rem] shadow-xl border border-border/40 relative z-10"
              />
              
              {/* Floating Deals Badge */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 -left-8 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4.5 z-20 border border-border"
              >
                <div className="w-11 h-11 bg-accent/15 rounded-xl flex items-center justify-center text-accent">
                  <Zap size={22} className="fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Flash Sale</p>
                  <p className="text-base font-extrabold text-foreground">Up to 60% Off</p>
                </div>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-card border border-border/80 rounded-[2rem] p-6 shadow-sm">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-4 p-2 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-left">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Collections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">Featured Categories</h2>
            <p className="text-muted-foreground text-sm mt-1">Explore our curated collections of popular goods</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((cat, idx) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={idx} 
                className="group cursor-pointer bg-card border border-border/80 rounded-3xl p-3 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Link to={cat.path}>
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3.5 bg-muted/40">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors z-10" />
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="text-3xl filter drop-shadow-md">{cat.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-center font-bold text-sm text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-secondary/40 py-16 border-y border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex justify-between items-end">
            <div className="text-left">
              <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={12} /> Popular This Week
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">Trending Products</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-primary text-sm font-bold hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
             <ProductGridSkeleton count={4} />
          ) : trendingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground text-sm">No trending products available.</p>
          )}
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary via-indigo-900 to-accent rounded-[2.5rem] overflow-hidden shadow-xl border border-primary/20">
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-16 flex flex-col justify-center text-left">
              <span className="text-accent text-xs font-extrabold tracking-widest uppercase mb-4 flex items-center gap-1.5">
                <Clock size={14} /> Limited Offer
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-[1.15]">
                Super Flash Sale <br /> Up to <span className="text-accent font-black">60% Off</span>
              </h2>
              <p className="text-white/80 mb-8 text-sm sm:text-base max-w-md leading-relaxed">
                Grab best-seller electronics and trending outfits before they run out. Offer active for a limited time!
              </p>
              
              {/* Countdown Timer Mock */}
              <div className="flex gap-3 mb-8">
                {[['02','Days'],['14','Hours'],['45','Mins'],['20','Secs']].map(([val, label]) => (
                  <div key={label} className="bg-white/10 backdrop-blur-md rounded-xl p-3 min-w-[72px] text-center border border-white/10">
                    <div className="text-xl font-bold text-white font-mono">{val}</div>
                    <div className="text-[10px] text-white/70 uppercase font-semibold mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              <div>
                <Link 
                  to="/shop?sort=price-asc" 
                  className="bg-white hover:bg-slate-100 text-primary hover:text-primary/90 font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-black/10 inline-block"
                >
                  Shop The Sale
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative h-full min-h-[400px]">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-transparent z-10" />
               <img 
                 src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" 
                 alt="Seasonal Sale" 
                 className="absolute inset-0 w-full h-full object-cover" 
               />
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-left">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Top Selling</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">Best Sellers</h2>
        </div>
        {loading ? (
           <ProductGridSkeleton count={4} />
        ) : bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <p className="text-muted-foreground text-sm">No best selling products available.</p>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-16 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">Customer Reviews</h2>
            <p className="text-muted-foreground text-sm mt-2">See what users say about their ShopVerse purchases</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-card p-8 rounded-[2rem] shadow-sm border border-border/80 flex flex-col justify-between text-left relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-6 -translate-y-1/3 text-8xl text-muted font-serif select-none pointer-events-none">“</div>
                <div>
                  <div className="flex gap-1 text-amber-500 mb-5">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={15} className={i < t.rating ? 'fill-current' : 'text-muted-foreground/20'} />
                     ))}
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">"{t.content}"</p>
                </div>
                <div className="flex items-center gap-3.5 mt-auto">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm leading-none">{t.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;
