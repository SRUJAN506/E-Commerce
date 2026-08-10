import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import { Filter, SlidersHorizontal, ChevronDown, Search as SearchIcon, X, Tag, Star, PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filters state
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOption, setSortOption] = useState('newest');
  
  // Local active filters
  const [priceRange, setPriceRange] = useState('all');
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');

  const observer = useRef();
  
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Sync category param from URL
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Sync search param from URL
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [selectedCategory, sortOption, searchParams.get('q'), priceRange, excludeOutOfStock, selectedBrand]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, false);
    }
  }, [page]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch { /* silent */ }
  };

  const fetchProducts = async (pageNum, reset) => {
    try {
      setLoading(true);
      const limit = 12; // items per page
      const params = new URLSearchParams();
      
      const activeSearch = searchParams.get('q');
      
      // Let's resolve the category database id from categories list
      if (selectedCategory) {
        const catObj = categories.find(c => c.name === selectedCategory || String(c.id) === selectedCategory);
        if (catObj) {
          params.append('categoryId', catObj.id);
        } else {
          // If not loaded yet, just append name/id
          params.append('categoryId', selectedCategory);
        }
      }
      if (activeSearch) params.append('search', activeSearch);
      
      const url = params.toString() ? `/products?${params}` : '/products';
      const res = await api.get(url);
      
      let data = res.data;
      
      // --- Client-side filters ---
      // 1. Filter by Availability
      if (excludeOutOfStock) {
        data = data.filter(p => p.stock > 0);
      }
      
      // 2. Filter by Price Range
      if (priceRange !== 'all') {
        if (priceRange === 'under-50') data = data.filter(p => p.price < 50);
        else if (priceRange === '50-150') data = data.filter(p => p.price >= 50 && p.price <= 150);
        else if (priceRange === '150-500') data = data.filter(p => p.price >= 150 && p.price <= 500);
        else if (priceRange === 'over-500') data = data.filter(p => p.price > 500);
      }

      // 3. Filter by Brand Mock (since brand is client-mocked in card)
      if (selectedBrand !== 'all') {
        const getBrandName = (p) => {
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
        data = data.filter(p => getBrandName(p) === selectedBrand);
      }
      
      // --- Client-side sort ---
      if (sortOption === 'price-asc') {
        data.sort((a, b) => a.price - b.price);
      } else if (sortOption === 'price-desc') {
        data.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'rating-desc') {
        // Mock sorting by reviews average (using id hash to mock)
        data.sort((a, b) => ((b.id % 3) + 3) - ((a.id % 3) + 3));
      } else {
        // default newest
        data.sort((a, b) => b.id - a.id);
      }
      
      const startIndex = (pageNum - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = data.slice(startIndex, endIndex);

      setProducts(prev => reset ? paginatedData : [...prev, ...paginatedData]);
      setHasMore(endIndex < data.length);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchParams.set('q', searchQuery.trim());
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const handleCategorySelect = (name) => {
    setSelectedCategory(name);
    if (name) {
      searchParams.set('category', name);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange('all');
    setExcludeOutOfStock(false);
    setSelectedBrand('all');
    setSearchParams({});
  };

  const brandOptions = [
    'Apple', 'Sony', 'Bose', 'Nike', 'Adidas', 'Puma', 'Philips', 'Ikea'
  ];

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">Categories</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group text-sm">
            <input 
              type="radio" 
              name="category"
              checked={selectedCategory === ''}
              onChange={() => handleCategorySelect('')}
              className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 rounded-full"
            />
            <span className={selectedCategory === '' ? 'font-bold text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'}>
              All Categories
            </span>
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group text-sm">
              <input 
                type="radio" 
                name="category"
                checked={selectedCategory === cat.name || selectedCategory === String(cat.id)}
                onChange={() => handleCategorySelect(cat.name)}
                className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 rounded-full"
              />
              <span className={selectedCategory === cat.name || selectedCategory === String(cat.id) ? 'font-bold text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-border/60 pt-5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">Price Range</h4>
        <div className="space-y-2 text-sm">
          {[
            { label: 'All Prices', value: 'all' },
            { label: 'Under $50', value: 'under-50' },
            { label: '$50 to $150', value: '50-150' },
            { label: '$150 to $500', value: '150-500' },
            { label: 'Over $500', value: 'over-500' }
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="priceRange"
                checked={priceRange === opt.value}
                onChange={() => setPriceRange(opt.value)}
                className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 rounded-full"
              />
              <span className={priceRange === opt.value ? 'font-bold text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-border/60 pt-5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">Stock Status</h4>
        <label className="flex items-center gap-3 cursor-pointer text-sm">
          <input 
            type="checkbox" 
            checked={excludeOutOfStock}
            onChange={(e) => setExcludeOutOfStock(e.target.checked)}
            className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 rounded-lg"
          />
          <span className={excludeOutOfStock ? 'font-bold text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}>
            In Stock Only
          </span>
        </label>
      </div>

      {/* Brand Filters */}
      <div className="border-t border-border/60 pt-5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">Brands</h4>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="brand"
              checked={selectedBrand === 'all'}
              onChange={() => setSelectedBrand('all')}
              className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 rounded-full"
            />
            <span className={selectedBrand === 'all' ? 'font-bold text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}>
              All Brands
            </span>
          </label>
          {brandOptions.map(b => (
            <label key={b} className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                name="brand"
                checked={selectedBrand === b}
                onChange={() => setSelectedBrand(b)}
                className="w-4.5 h-4.5 text-primary border-border focus:ring-primary/20 rounded-full"
              />
              <span className={selectedBrand === b ? 'font-bold text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}>
                {b}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={clearFilters}
        className="w-full py-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/10 rounded-xl transition-all uppercase tracking-wider"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header Banner */}
      <div className="bg-muted/40 py-8 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4 text-left">
            {queryParam ? `Search Results for "${queryParam}"` : 'All Shop Products'}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
              <input 
                type="text" 
                placeholder="Narrow down searches..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border focus:border-primary/50 rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm shadow-sm transition-all"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => {
                    setSearchQuery('');
                    searchParams.delete('q');
                    setSearchParams(searchParams);
                  }} 
                  className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <SearchIcon size={16} />
              </button>
            </form>
            
            {/* Action Bar Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm"
              >
                <Filter size={16} /> Filters
              </button>
              
              <div className="relative flex-1 sm:flex-none">
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none bg-card border border-border px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filters Panel */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-24 text-left">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold pb-4 border-b border-border">
                <SlidersHorizontal size={16} className="text-primary" /> Shop Filters
              </div>
              {filterContent}
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isFilterOpen && (
              <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="relative w-80 max-w-full bg-card h-full p-6 shadow-2xl overflow-y-auto flex flex-col text-left z-10"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                    <span className="font-extrabold text-foreground flex items-center gap-2">
                      <SlidersHorizontal size={16} /> Filters
                    </span>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {filterContent}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Product Grid Area */}
          <div className="flex-grow">
            {products.length === 0 && !loading ? (
              <div className="py-12">
                <EmptyState
                  icon={PackageOpen}
                  title="No Products Found"
                  description="We couldn't find any products matching your selected query or filters. Try adjusting your tags or searching again."
                  actionText="Clear Filters"
                  onActionClick={clearFilters}
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {products.map((product, index) => {
                    const isLast = products.length === index + 1;
                    return (
                      <div 
                        ref={isLast ? lastProductElementRef : null} 
                        key={product.id}
                      >
                        <ProductCard product={product} />
                      </div>
                    );
                  })}
                </div>
                
                {/* Scroll Loader Skeletons */}
                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pt-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <ProductSkeleton key={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
