import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 850); // Matching the cumulative animation delay
  };

  if (cartItems.length === 0 && !isClearing) {
    return (
      <section className="section">
        <div className="container cart-empty">
          <div className="cart-empty-icon">🌱</div>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added any green companions to your collection yet.</p>
          <Link to="/shop" className="btn-primary btn-lg">Browse Shop</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
        </div>
        
        <div className="cart-grid">
          <div className="cart-items-wrapper">
            <div className={`cart-items ${isClearing ? 'clearing' : ''}`}>
              {cartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="cart-item" 
                  style={{ '--index': index }}
                >
                  <Link to={`/product/${item.id}`} className="cart-item-image">
                    {item.image_filename ? (
                      <img src={item.image_filename.startsWith('http') ? item.image_filename : `/images/${item.image_filename}`} alt={item.name} />
                    ) : (
                      <div className="image-placeholder">{item.name[0]}</div>
                    )}
                  </Link>
                  <div className="cart-item-details">
                    <h3><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                    <p className="price">₹{item.price.toFixed(2)}</p>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className="quantity-val">{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="cart-item-remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2.5rem', textAlign: 'left' }}>
              <button 
                onClick={handleClearCart} 
                className={`btn-danger ${isClearing ? 'disabled' : ''}`}
                disabled={isClearing}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.6rem' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                {isClearing ? 'Clearing Cart...' : 'Clear All Items'}
              </button>
            </div>
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span className="total-price">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary btn-lg w-full" style={{ marginTop: '2rem' }}>
              Proceed to Checkout
            </Link>
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              Secure Checkout • 100% Satisfaction Guarantee
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;
