import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const id = product._id || product.id;
    setCartItems(prev => {
      const existing = prev.find(item => (item._id || item.id) === id);
      if (existing) {
        return prev.map(item =>
          (item._id || item.id) === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, id, quantity }];
    });
    
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== productId));
    toast.dark("Item removed from cart");
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => ((item._id || item.id) === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
