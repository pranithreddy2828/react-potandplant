import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Phone, Mail, MapPin, Building, Hash, CreditCard, Package, ChevronRight } from 'lucide-react';

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
        address: `${formData.address}, ${formData.city}${formData.state ? ', ' + formData.state : ''} - ${formData.postalCode}`,
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity || 1,
          priceAtPurchase: item.price
        })),
        totalAmount: subtotal,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'Cash on delivery' ? 'pending' : 'paid'
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData);
      toast.success('Order placed successfully! 🌿');
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  const Field = ({ label, icon: Icon, children }) => (
    <div className="checkout-field">
      <label className="checkout-label">
        <Icon size={15} className="field-icon" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <section className="section checkout-section">
      <div className="container checkout-layout">

        {/* ── Left: Form ── */}
        <div className="checkout-form-panel">
          <div className="checkout-form-header">
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-subtitle">Fill in your details to complete your order</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="checkout-form">

            {/* Personal Info */}
            <div className="checkout-section-label">Personal Information</div>
            <Field label="Full Name" icon={User}>
              <input
                type="text"
                className="checkout-input"
                placeholder="Your full name"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </Field>

            <div className="checkout-row-2">
              <Field label="Mobile Number" icon={Phone}>
                <input
                  type="tel"
                  className="checkout-input"
                  placeholder="10-digit mobile"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </Field>
              <Field label="Email (Optional)" icon={Mail}>
                <input
                  type="email"
                  className="checkout-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </Field>
            </div>

            {/* Address */}
            <div className="checkout-section-label" style={{ marginTop: '0.5rem' }}>Delivery Address</div>
            <Field label="Street Address" icon={MapPin}>
              <input
                type="text"
                className="checkout-input"
                placeholder="House no., street, locality"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </Field>

            <div className="checkout-row-3">
              <Field label="City" icon={Building}>
                <input
                  type="text"
                  className="checkout-input"
                  placeholder="City"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </Field>
              <Field label="State" icon={MapPin}>
                <input
                  type="text"
                  className="checkout-input"
                  placeholder="State"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                />
              </Field>
              <Field label="Postal Code" icon={Hash}>
                <input
                  type="text"
                  className="checkout-input"
                  placeholder="PIN code"
                  value={formData.postalCode}
                  onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                />
              </Field>
            </div>

            {/* Payment */}
            <div className="checkout-section-label" style={{ marginTop: '0.5rem' }}>Payment Method</div>
            <div className="payment-options">
              {['UPI', 'Cash on delivery'].map(method => (
                <label
                  key={method}
                  className={`payment-option-card ${formData.paymentMethod === method ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={() => setFormData({ ...formData, paymentMethod: method })}
                  />
                  <CreditCard size={18} className="payment-icon" />
                  <span>{method}</span>
                  {formData.paymentMethod === method && (
                    <span className="payment-check">✓</span>
                  )}
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="checkout-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">Processing...</span>
              ) : (
                <>
                  Place Order — ₹{subtotal.toFixed(2)}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Right: Order Summary ── */}
        <aside className="checkout-summary-panel">
          <div className="summary-sticky">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-items">
              {cart.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item._id} className="summary-item">
                    <div className="summary-item-img">
                      <img
                        src={item.image_filename?.startsWith('http') ? item.image_filename : `/images/${item.image_filename}`}
                        alt={item.name}
                      />
                      <span className="summary-qty-badge">{item.quantity || 1}</span>
                    </div>
                    <div className="summary-item-details">
                      <p className="summary-item-name">{item.name}</p>
                      <p className="summary-item-unit">₹{item.price} each</p>
                    </div>
                    <span className="summary-item-total">₹{item.price * (item.quantity || 1)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="summary-divider" />

            <div className="summary-total-row">
              <span>Total</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-delivery-note">
              <Package size={15} />
              <span>Delivery within 2–4 business days across Telangana &amp; AP</span>
            </div>

            <div className="summary-info-list">
              <p>🔒 UPI payments are encrypted &amp; secure</p>
              <p>🌱 Specialized plant-safe packaging</p>
              <p>📞 Support: Available 9am – 6pm</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
