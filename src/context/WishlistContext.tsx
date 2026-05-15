import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('ksf_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('ksf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => prev.find(p => p.product_id === product.product_id) ? prev : [...prev, product]);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(p => p.product_id !== productId));
  };

  const isWishlisted = (productId: string) => wishlist.some(p => p.product_id === productId);

  const toggleWishlist = (product: Product) => {
    if (isWishlisted(product.product_id!)) removeFromWishlist(product.product_id!);
    else addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist,
      count: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
