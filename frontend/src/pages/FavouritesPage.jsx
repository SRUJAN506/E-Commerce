import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, HeartOff } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/common/EmptyState';

const FavouritesPage = () => {
  const { favourites } = useFavourites();
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Heart className="fill-destructive text-destructive" size={26} /> My Wishlist
          </h1>
          {favourites.length > 0 && (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold ml-auto sm:ml-4">
              {favourites.length} {favourites.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {favourites.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={HeartOff}
              title="Your Wishlist is Empty"
              description="Tap the heart icon on any products in the shop catalog to save them for later."
              actionText="Start Shopping"
              actionLink="/shop"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {favourites.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;
