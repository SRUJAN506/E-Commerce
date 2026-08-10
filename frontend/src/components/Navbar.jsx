import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavourites } from '../context/FavouritesContext';
import { ShoppingBag, User, LogOut, Package, Settings, Menu, X, Heart, Search, Sun, Moon, ChevronDown, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { favourites } = useFavourites();
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Search suggestions state
  const [productsList, setProductsList] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const favCount = favourites.length;

  // Listen to clicks outside of search input to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch products for search suggestions
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await api.get('/products');
        setProductsList(res.data);
      } catch {
        // silent
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const handleSuggestionClick = (query) => {
    setSearchQuery(query);
    navigate(`/shop?q=${encodeURIComponent(query)}`);
    setIsSearchFocused(false);
  };

  // Get matching suggestions
  const getSuggestions = () => {
    if (!searchQuery.trim()) {
      // Predefined default popular searches
      return {
        popular: ['Laptop', 'Casual Shirts', 'Running Shoes', 'Backpack'],
        products: productsList.slice(0, 4)
      };
    }

    const query = searchQuery.toLowerCase();
    
    // Filter matching popular search terms dynamically
    const popularMatches = productsList
      .filter(p => p.name.toLowerCase().includes(query) || p.categoryName?.toLowerCase().includes(query))
      .map(p => p.name)
      .slice(0, 4);

    // Filter matching products
    const productMatches = productsList
      .filter(p => p.name.toLowerCase().includes(query))
      .slice(0, 5);

    return {
      popular: Array.from(new Set(popularMatches)),
      products: productMatches
    };
  };

  const { popular, products: suggestedProducts } = getSuggestions();

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Deals', path: '/shop?sort=price-asc' }, // Mocking deals page by sorting low to high
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-md border-b border-border/40 py-2' 
          : 'bg-background py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-accent">
                ShopVerse
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Category Dropdown */}
              <div className="group relative">
                <button className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors flex items-center gap-1">
                  Categories <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full left-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                  <Link to="/shop?category=Electronics" className="block px-4 py-2.5 text-sm font-medium hover:bg-muted hover:text-primary rounded-xl transition-colors">💻 Electronics</Link>
                  <Link to="/shop?category=Clothing" className="block px-4 py-2.5 text-sm font-medium hover:bg-muted hover:text-primary rounded-xl transition-colors">👗 Clothing</Link>
                  <Link to="/shop?category=Books" className="block px-4 py-2.5 text-sm font-medium hover:bg-muted hover:text-primary rounded-xl transition-colors">📚 Books</Link>
                  <Link to="/shop?category=Sports" className="block px-4 py-2.5 text-sm font-medium hover:bg-muted hover:text-primary rounded-xl transition-colors">⚽ Sports</Link>
                  <Link to="/shop?category=Home%20%26%20Kitchen" className="block px-4 py-2.5 text-sm font-medium hover:bg-muted hover:text-primary rounded-xl transition-colors">🏠 Home & Kitchen</Link>
                </div>
              </div>
            </nav>
          </div>

          {/* Search Bar with Live Suggestions */}
          <div ref={searchRef} className="hidden lg:flex flex-1 max-w-md px-8 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input 
                type="text" 
                placeholder="Search products, brands, or categories..." 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/60 border border-border/80 focus:border-primary/55 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <Search size={18} />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-8 right-8 mt-2 bg-card border border-border rounded-2xl shadow-2xl p-4 overflow-hidden z-50 max-h-[420px] overflow-y-auto"
                >
                  {popular.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-primary" /> Popular Searches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {popular.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(term)}
                            className="bg-muted hover:bg-primary/10 hover:text-primary text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Matching Products
                    </h4>
                    {suggestedProducts.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">No matching products found.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {suggestedProducts.map((p) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-3 p-1.5 hover:bg-muted rounded-xl transition-colors"
                          >
                            <img
                              src={p.imageUrl || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100'}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-border bg-muted/40"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100';
                              }}
                            />
                            <div className="flex-grow text-left">
                              <p className="text-xs font-semibold text-foreground line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-muted-foreground">{p.categoryName || 'Category'}</p>
                            </div>
                            <span className="text-xs font-bold text-primary">${p.price?.toFixed(2)}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 text-foreground/80 hover:text-primary transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Favourites with anim count */}
            <Link to="/favourites" className="relative p-2 text-foreground/80 hover:text-destructive transition-colors duration-200">
              <Heart size={20} />
              <AnimatePresence>
                {favCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-destructive text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                  >
                    {favCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Shopping Cart with anim count */}
            <Link to="/cart" className="relative p-2 text-foreground/80 hover:text-primary transition-colors duration-200">
              <ShoppingBag size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <div className="h-6 w-px bg-border/80 mx-1"></div>

            {/* User Dropdown */}
            {user ? (
              <div className="group relative">
                <button className="flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors py-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                  <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-xl transition-colors">
                    <User size={16} /> Account Dashboard
                  </Link>
                  <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-xl transition-colors">
                    <Package size={16} /> Orders History
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary rounded-xl transition-colors">
                      <Settings size={16} /> Admin Panel
                    </Link>
                  )}
                  <div className="h-px bg-border my-1"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-left">
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-foreground/85 hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="text-sm font-bold bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/95 transition-all shadow-md shadow-primary/20 hover:shadow-primary/35">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-1.5 text-foreground/80 hover:text-primary transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/cart" className="relative p-1.5 text-foreground/80">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-foreground/80 hover:text-primary transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-card border-b border-border overflow-hidden shadow-lg"
          >
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/70 border border-border rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search size={18} />
                </button>
              </form>

              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className="block px-3 py-2 text-base font-semibold text-foreground hover:bg-muted rounded-xl transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold">{user.name}</span>
                    </div>
                    <Link to="/favourites" className="flex items-center gap-3 px-3 py-2 text-base font-semibold text-foreground hover:bg-muted rounded-xl transition-colors" onClick={() => setMenuOpen(false)}>
                      <Heart size={18} className={favCount > 0 ? "text-destructive fill-current" : ""} /> 
                      Wishlist {favCount > 0 && `(${favCount})`}
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-base font-semibold text-foreground hover:bg-muted rounded-xl transition-colors" onClick={() => setMenuOpen(false)}>
                      <User size={18} /> Profile & Settings
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-base font-semibold text-foreground hover:bg-muted rounded-xl transition-colors" onClick={() => setMenuOpen(false)}>
                      <Package size={18} /> My Orders
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-base font-semibold text-foreground hover:bg-muted rounded-xl transition-colors" onClick={() => setMenuOpen(false)}>
                        <Settings size={18} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-base font-semibold text-destructive hover:bg-destructive/10 rounded-xl text-left">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" className="flex justify-center px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground bg-card hover:bg-muted" onClick={() => setMenuOpen(false)}>
                      Log in
                    </Link>
                    <Link to="/register" className="flex justify-center px-4 py-2.5 border border-transparent rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90" onClick={() => setMenuOpen(false)}>
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
