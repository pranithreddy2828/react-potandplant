import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending: {
    label: 'Order Placed',
    color: '#f59e0b',
    bg: '#fffbeb',
    icon: Clock,
    step: 1,
  },
  processing: {
    label: 'Processing',
    color: '#3b82f6',
    bg: '#eff6ff',
    icon: Package,
    step: 2,
  },
  shipped: {
    label: 'Shipped',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    icon: Truck,
    step: 3,
  },
  delivered: {
    label: 'Delivered',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: CheckCircle,
    step: 4,
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ef4444',
    bg: '#fef2f2',
    icon: XCircle,
    step: -1,
  },
};

const steps = ['pending', 'processing', 'shipped', 'delivered'];

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const isCancelled = order.status === 'cancelled';
  const currentStep = isCancelled ? -1 : steps.indexOf(order.status);

  return (
    <div className="my-order-card">
      {/* Card Header */}
      <div className="order-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="order-card-meta">
          <div className="order-id-badge">
            ORD-{order._id.substring(18).toUpperCase()}
          </div>
          <span className="order-date">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </span>
        </div>
        <div className="order-card-right">
          <span
            className="order-status-pill"
            style={{ color: config.color, background: config.bg }}
          >
            <StatusIcon size={14} />
            {config.label}
          </span>
          <span className="order-total-amt">₹{order.totalAmount}</span>
          <button className="order-expand-btn">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Order Progress Bar */}
      {!isCancelled && (
        <div className="order-progress-track">
          {steps.map((step, idx) => {
            const sc = statusConfig[step];
            const StepIcon = sc.icon;
            const isActive = idx <= currentStep;
            const isCurrentStep = idx === currentStep;
            return (
              <React.Fragment key={step}>
                <div className={`progress-step ${isActive ? 'active' : ''} ${isCurrentStep ? 'current' : ''}`}>
                  <div className="step-icon-wrap" style={{ background: isActive ? sc.color : '#e2e8f0', color: isActive ? 'white' : '#94a3b8' }}>
                    <StepIcon size={14} />
                  </div>
                  <span className="step-label" style={{ color: isActive ? sc.color : '#94a3b8' }}>{sc.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`progress-connector ${idx < currentStep ? 'active' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {isCancelled && (
        <div className="cancelled-banner">
          <XCircle size={16} />
          This order has been cancelled.
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="order-expanded-body">
          <div className="order-details-grid">
            <div className="order-detail-section">
              <h4 className="detail-section-title">Delivery Address</h4>
              <p className="detail-text">{order.address}</p>
            </div>
            <div className="order-detail-section">
              <h4 className="detail-section-title">Payment Info</h4>
              <div className="payment-info-row">
                <span className="payment-method-tag">{order.paymentMethod || 'UPI'}</span>
                <span
                  className="payment-status-tag"
                  style={{
                    color: order.paymentStatus === 'paid' ? '#16a34a' : '#f59e0b',
                    background: order.paymentStatus === 'paid' ? '#f0fdf4' : '#fffbeb'
                  }}
                >
                  {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="order-items-list">
            <h4 className="detail-section-title">Items Ordered</h4>
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item-row">
                <div className="order-item-img-wrap">
                  {item.product?.image_filename ? (
                    <img
                      src={item.product.image_filename?.startsWith('http')
                        ? item.product.image_filename
                        : `/images/${item.product.image_filename}`}
                      alt={item.product?.name}
                    />
                  ) : (
                    <div className="order-item-img-placeholder"><Package size={20} /></div>
                  )}
                </div>
                <div className="order-item-info">
                  <p className="order-item-name">{item.product?.name || 'Product'}</p>
                  <p className="order-item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="order-item-price">₹{item.priceAtPurchase * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="order-total-row">
            <span>Total Amount</span>
            <strong>₹{order.totalAmount}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

const MyOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/my-orders`);
      setOrders(res.data);
    } catch (err) {
      setError('Could not load your orders. Please try again.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
          <div className="orders-loading-spinner"></div>
          <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading your orders...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
          <AlertCircle size={56} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2>Something went wrong</h2>
          <p style={{ color: '#64748b' }}>{error}</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={fetchOrders}>Try Again</button>
        </div>
      </section>
    );
  }

  return (
    <section className="section my-orders-section">
      <div className="container">
        {/* Header */}
        <div className="my-orders-header">
          <div>
            <h1 className="my-orders-title">My Orders</h1>
            <p className="my-orders-subtitle">
              Track all your Pot &amp; Plants deliveries in real-time
            </p>
          </div>
          <Link to="/shop" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty-state">
            <div className="empty-state-icon">
              <ShoppingBag size={48} />
            </div>
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here for you to track.</p>
            <Link to="/shop" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Browse Plants <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="my-orders-list">
            <p className="orders-count">{orders.length} order{orders.length > 1 ? 's' : ''} found</p>
            {orders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
