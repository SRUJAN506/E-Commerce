import { createContext, useContext, useState, useEffect } from 'react';

const FavouritesContext = createContext();

// Build a user-specific storage key so each user's favourites
// are completely isolated on this device, even from other users
// who log in on the same browser. Guests share a 'guest' key.
const getStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.userId
      ? `shopverse_fav_${user.userId}`
      : 'shopverse_fav_guest';
  } catch {
    return 'shopverse_fav_guest';
  }
};

export const FavouritesProvider = ({ children }) => {
  // Derive the key lazily so it reflects current login state
  const [storageKey, setStorageKey] = useState(getStorageKey);

  const [favourites, setFavourites] = useState(() => {
    try {
      const key = getStorageKey();
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Re-load favourites whenever the logged-in user changes
  // (e.g. one user logs out and another logs in on the same device)
  useEffect(() => {
    const key = getStorageKey();
    setStorageKey(key);
    try {
      const stored = localStorage.getItem(key);
      setFavourites(stored ? JSON.parse(stored) : []);
    } catch {
      setFavourites([]);
    }

    // Listen for storage events (cross-tab sync for same user)
    const onStorage = (e) => {
      if (e.key === key) {
        try { setFavourites(e.newValue ? JSON.parse(e.newValue) : []); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Persist to localStorage under the user-specific key on every change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favourites));
  }, [favourites, storageKey]);

  const addFavourite = (product) => {
    setFavourites(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFavourite = (productId) => {
    setFavourites(prev => prev.filter(p => p.id !== productId));
  };

  const toggleFavourite = (product) => {
    if (favourites.find(p => p.id === product.id)) {
      removeFavourite(product.id);
      return false; // removed
    } else {
      addFavourite(product);
      return true; // added
    }
  };

  const isFavourite = (productId) => !!favourites.find(p => p.id === productId);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite, removeFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => useContext(FavouritesContext);
