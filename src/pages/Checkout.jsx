import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems: cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'UPI'
  });

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.postalCode}`,
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity || 1,
          priceAtPurchase: item.price
        })),
        totalAmount: subtotal,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'Cash on delivery' ? 'pending' : 'paid' // Simulate payment for Demo
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData);
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  return (
    <section className="section">
      <div className="container checkout-grid">
        <div className="form-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h1>Checkout</h1>
          <form onSubmit={handlePlaceOrder} style={{ marginTop: '1.5rem' }}>
            <div className="form-row">
              <label>Full Name</label>
              <input type="text" className="input" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required />
            </div>
            <div className="form-row-inline" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Mobile Number</label>
                <input type="tel" className="input" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required />
              </div>
              <div>
                <label>Email (Optional)</label>
                <input type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '1rem' }}>
              <label>Street Address</label>
              <input type="text" className="input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            </div>
            <div className="form-row-inline" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>City</label>
                <input type="text" className="input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              </div>
              <div>
                <label>Postal Code</label>
                <input type="text" className="input" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} required />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '1rem' }}>
              <label>Payment Method</label>
              <select className="input" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} required>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Cash on delivery">Cash on delivery</option>
              </select>
            </div>
            <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: '#f0fdf4', color: '#166534', borderRadius: '12px', textAlign: 'center' }}>
              <strong style={{ fontSize: '1.2rem' }}>Total Amount: ₹{subtotal.toFixed(2)}</strong>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
              {loading ? 'Processing...' : 'Complete Booking'}
            </button>
          </form>
        </div>
        <aside className="checkout-info" style={{ padding: '2rem' }}>
          <h2>Booking Instructions</h2>
          <p style={{ marginTop: '1rem', color: '#666' }}>Your order will be processed immediately. For plant safety, we ensure specialized packaging for all deliveries within Telangana & AP.</p>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '1.5rem', color: '#444' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>UPI</strong>: Encrypted and secure.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Card</strong>: All major cards accepted.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Delivery</strong>: Usually within 2-4 business days.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
