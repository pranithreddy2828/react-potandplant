import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LayoutGrid, ShoppingBag, Plus, Trash2, LogOut, X, Upload, Check, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const Admin = () => {
  const { isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [orderFilter, setOrderFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOrderDeleteConfirm, setShowOrderDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearCountdown, setClearCountdown] = useState(5);
  const [productToDelete, setProductToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    care_instructions: '',
    category_id: 1,
    image_filename: '',
    stock: 100,
    is_featured: false,
    is_best_seller: false
  });

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pRes = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(pRes.data);
      
      if (activeTab === 'orders') {
        const oRes = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
        setOrders(oRes.data);
      }
    } catch (err) {
      toast.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('care_instructions', newProduct.care_instructions);
    formData.append('category_id', newProduct.category_id);
    formData.append('stock', newProduct.stock);
    formData.append('is_featured', newProduct.is_featured);
    formData.append('is_best_seller', newProduct.is_best_seller);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Product added successfully!');
      setShowAddForm(false);
      fetchData();
      setNewProduct({ 
        name: '', price: '', description: '', care_instructions: '', 
        category_id: 1, image_filename: '', stock: 100, 
        is_featured: false, is_best_seller: false 
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}`, { status });
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productToDelete._id}`);
      toast.success('Product removed');
      fetchData();
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowOrderDeleteConfirm(true);
  };

  const confirmOrderDelete = async () => {
    if (!orderToDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${orderToDelete._id}`);
      toast.success('Booking removed');
      fetchData();
      setShowOrderDeleteConfirm(false);
      setOrderToDelete(null);
    } catch (err) {
      toast.error('Failed to delete booking');
    }
  };

  useEffect(() => {
    let timer;
    if (showClearConfirm && clearCountdown > 0) {
      timer = setInterval(() => {
        setClearCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showClearConfirm, clearCountdown]);

  const handleClearOrders = () => {
    setClearCountdown(5);
    setShowClearConfirm(true);
  };

  const confirmClear = async () => {
    if (clearCountdown > 0) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders`);
      toast.success('All bookings cleared');
      setShowClearConfirm(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to clear bookings');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending') return order.status === 'pending';
    if (orderFilter === 'completed') return order.status === 'delivered';
    return true;
  });

  const getChartData = () => {
    // Sales over time (Last 7 days or all time)
    const salesMap = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      salesMap[date] = (salesMap[date] || 0) + order.totalAmount;
    });
    const salesData = Object.keys(salesMap).map(date => ({ date, amount: salesMap[date] })).slice(-7);

    // Status Distribution
    const statusMap = { 'Pending': 0, 'Completed': 0, 'Cancelled': 0, 'Other': 0 };
    orders.forEach(order => {
      if (order.status === 'pending') statusMap['Pending']++;
      else if (order.status === 'delivered') statusMap['Completed']++;
      else if (order.status === 'cancelled') statusMap['Cancelled']++;
      else statusMap['Other']++;
    });
    const pieData = Object.keys(statusMap)
      .filter(key => statusMap[key] > 0)
      .map(name => ({ name, value: statusMap[name] }));

    return { salesData, pieData };
  };

  const { salesData, pieData } = getChartData();
  const COLORS = ['#94a3b8', '#16a34a', '#ef4444', '#3b82f6'];

  const stats = {
    totalRevenue: orders.reduce((acc, order) => acc + (order.paymentStatus === 'paid' ? order.totalAmount : 0), 0),
    totalOrders: orders.length,
    pendingValue: orders.reduce((acc, order) => acc + (order.paymentStatus === 'pending' ? order.totalAmount : 0), 0),
    avgOrder: orders.length > 0 ? (orders.reduce((acc, o) => acc + o.totalAmount, 0) / orders.length).toFixed(0) : 0
  };

  if (!isAdmin) {
    // ... same ...
    return (
      <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
        <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
        <h1>Access Denied</h1>
        <p style={{ color: '#64748b' }}>Unauthorized access. Please login as an administrator.</p>
      </div>
    );
  }

  return (
    <section className="admin-section">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-row">
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
            <p style={{ color: '#64748b' }}>Manage your inventory and track customer bookings.</p>
          </div>
          <div className="admin-tab-group">
            <button 
              className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <LayoutGrid size={18} /> Inventory
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} /> Bookings
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={18} /> Insights
            </button>
            <button onClick={logout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Current Stock</h2>
              <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                <Plus size={18} /> New Product
              </button>
            </div>
            {/* ... table remains same ... */}

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Status</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="admin-table-row">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                            <img 
                              src={product.image_filename?.startsWith('http') ? product.image_filename : `/images/${product.image_filename}`} 
                              alt="" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          <div>
                            <p style={{ fontWeight: '600' }}>{product.name}</p>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {product._id.substring(18)}</p>
                          </div>
                        </div>
                      </td>
                      <td data-label="Status">
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {product.is_featured && <span className="status-badge status-featured">Featured</span>}
                          {product.is_best_seller && <span className="status-badge status-best">Best Seller</span>}
                          {!product.is_featured && !product.is_best_seller && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Standard</span>}
                        </div>
                      </td>
                      <td data-label="Stock">
                        <span style={{ fontWeight: '500', color: product.stock < 10 ? '#ef4444' : 'inherit' }}>
                          {product.stock} units
                        </span>
                      </td>
                      <td data-label="Price"><span style={{ fontWeight: '700', color: 'var(--green)' }}>₹{product.price}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleDeleteProduct(product)} className="btn-danger" style={{ padding: '0.5rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="admin-orders">
             <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', background: '#f1f5f9', padding: '0.4rem', borderRadius: '14px', width: 'fit-content' }}>
                  <button 
                    onClick={() => setOrderFilter('all')}
                    style={{ 
                      padding: '0.5rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: orderFilter === 'all' ? 'white' : 'transparent',
                      color: orderFilter === 'all' ? 'var(--green)' : '#64748b',
                      fontWeight: '600',
                      boxShadow: orderFilter === 'all' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >All</button>
                  <button 
                    onClick={() => setOrderFilter('pending')}
                    style={{ 
                      padding: '0.5rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: orderFilter === 'pending' ? 'white' : 'transparent',
                      color: orderFilter === 'pending' ? 'var(--green)' : '#64748b',
                      fontWeight: '600',
                      boxShadow: orderFilter === 'pending' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >Pending</button>
                  <button 
                    onClick={() => setOrderFilter('completed')}
                    style={{ 
                      padding: '0.5rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: orderFilter === 'completed' ? 'white' : 'transparent',
                      color: orderFilter === 'completed' ? 'var(--green)' : '#64748b',
                      fontWeight: '600',
                      boxShadow: orderFilter === 'completed' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >Completed</button>
                </div>
                {orders.length > 0 && (
                  <button 
                    onClick={handleClearOrders}
                    className="btn-danger" 
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Trash2 size={16} /> Clear All Bookings
                  </button>
                )}
             </div>

             <div className="orders-grid">
               {filteredOrders.length === 0 ? (
                 <div className="admin-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                   <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                   <p>No bookings found for this category.</p>
                 </div>
               ) : (
                 filteredOrders.map(order => (
                    <div key={order._id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <button 
                        onClick={() => handleDeleteOrder(order)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#fef2f2', border: 'none', color: '#ef4444', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={14} />
                      </button>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center', paddingRight: '1.5rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '99px', color: '#64748b', fontWeight: '600' }}>
                          ORD-{order._id.substring(18).toUpperCase()}
                        </span>
                        <div style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.5rem', 
                          color: order.paymentStatus === 'paid' ? '#16a34a' : '#ef4444', 
                          fontSize: '0.85rem', fontWeight: '700' 
                        }}>
                          {order.paymentStatus === 'paid' ? <Check size={16} /> : <AlertCircle size={16} />}
                          {order.paymentStatus?.toUpperCase() || 'PENDING'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ margin: '0' }}>{order.customerName}</h3>
                        <select 
                          className="premium-input" 
                          style={{ width: '130px', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div style={{ display: 'grid', gap: '0.75rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        <p><strong>📞 Phone:</strong> {order.phoneNumber}</p>
                        <p><strong>📍 Address:</strong> {order.address}</p>
                      </div>
                      
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Items Ordered</p>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ color: '#1e293b' }}>{item.product?.name || 'Deleted Product'} x {item.quantity}</span>
                              <span style={{ fontWeight: '600' }}>₹{item.priceAtPurchase * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1.5px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Total Amount</span>
                         <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--green)' }}>₹{order.totalAmount}</span>
                      </div>
                    </div>
                 ))
               )}
             </div>
          </div>
        ) : (
          <div className="admin-analytics">
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="admin-card" style={{ marginBottom: 0, padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.05em' }}>TOTAL REVENUE</span>
                  <div style={{ padding: '0.6rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '14px' }}><DollarSign size={24} /></div>
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>₹{stats.totalRevenue}</h2>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.85rem' }}>+12%</span>
                   <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>vs last month</span>
                </div>
              </div>

              <div className="admin-card" style={{ marginBottom: 0, padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.05em' }}>TOTAL BOOKINGS</span>
                  <div style={{ padding: '0.6rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '14px' }}><ShoppingBag size={24} /></div>
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>{stats.totalOrders}</h2>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span style={{ color: '#3b82f6', fontWeight: '700', fontSize: '0.85rem' }}>{pieData.length}</span>
                   <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Active categories</span>
                </div>
              </div>

              <div className="admin-card" style={{ marginBottom: 0, padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.05em' }}>AVG ORDER VALUE</span>
                  <div style={{ padding: '0.6rem', background: '#fef2f2', color: '#ef4444', borderRadius: '14px' }}><TrendingUp size={24} /></div>
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>₹{stats.avgOrder}</h2>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Per conversion</span>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
               <div className="admin-card">
                 <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <TrendingUp size={20} color="var(--green)" /> Sales Revenue Tracker
                 </h3>
                 <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#chartGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
               </div>

               <div className="admin-card">
                 <h3 style={{ marginBottom: '2rem' }}>Booking Segments</h3>
                 <div style={{ width: '100%', height: '350px', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ 
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                      textAlign: 'center', pointerEvents: 'none' 
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stats.totalOrders}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Orders</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {pieData.map((item, id) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: COLORS[id % COLORS.length] }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>{item.name}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* --- PREMIUM ADD PRODUCT MODAL --- */}
        {showAddForm && (
          <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
            <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Premium Product</h2>
                <button className="modal-close-btn" onClick={() => setShowAddForm(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <form id="add-product-form" onSubmit={handleAddProduct}>
                  <div className="add-product-grid">
                    {/* Left Side: Basic Info */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      <div className="premium-input-group">
                        <label>Product Name</label>
                        <input 
                          type="text" 
                          className="premium-input" 
                          placeholder="e.g. Fiddle Leaf Fig"
                          value={newProduct.name} 
                          onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                          required 
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="premium-input-group">
                          <label>Price (₹)</label>
                          <input 
                            type="number" 
                            className="premium-input" 
                            value={newProduct.price} 
                            onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                            required 
                          />
                        </div>
                        <div className="premium-input-group">
                          <label>Initial Stock</label>
                          <input 
                            type="number" 
                            className="premium-input" 
                            value={newProduct.stock} 
                            onChange={e => setNewProduct({...newProduct, stock: e.target.value})} 
                          />
                        </div>
                      </div>
                      <div className="premium-input-group">
                        <label>Care Instructions</label>
                        <input 
                          type="text" 
                          className="premium-input" 
                          placeholder="e.g. Water once a week"
                          value={newProduct.care_instructions} 
                          onChange={e => setNewProduct({...newProduct, care_instructions: e.target.value})} 
                        />
                      </div>
                    </div>

                    {/* Right Side: Media & Settings */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      <div className="premium-input-group">
                        <label>Product Image</label>
                        <label className="image-upload-preview">
                          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                          {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="image-preview-img" />
                          ) : (
                            <div className="upload-placeholder">
                              <Upload size={32} />
                              <p style={{ fontWeight: '500' }}>Click to upload</p>
                              <p style={{ fontSize: '0.75rem' }}>JPG, PNG or WEBP (Max 5MB)</p>
                            </div>
                          )}
                        </label>
                      </div>

                      <div className="premium-input-group">
                        <label>Status & Tags</label>
                        <div className="toggle-group">
                          <div 
                            className={`toggle-item ${newProduct.is_featured ? 'active' : ''}`}
                            onClick={() => setNewProduct({...newProduct, is_featured: !newProduct.is_featured})}
                          >
                            <div className="toggle-switch"></div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Featured</span>
                          </div>
                          <div 
                            className={`toggle-item ${newProduct.is_best_seller ? 'active' : ''}`}
                            onClick={() => setNewProduct({...newProduct, is_best_seller: !newProduct.is_best_seller})}
                          >
                            <div className="toggle-switch"></div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Best Seller</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Description */}
                    <div className="form-group-full premium-input-group">
                      <label>Product Description</label>
                      <textarea 
                        className="premium-input premium-textarea" 
                        placeholder="Tell about the plant's beauty and benefits..."
                        value={newProduct.description} 
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowAddForm(false)}>Discard</button>
                <button type="submit" form="add-product-form" className="btn-primary" style={{ padding: '0.9rem 2.5rem' }}>
                  Create Product
                </button>
              </div>
            </div>
          </div>
        )}
        {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => { setShowDeleteConfirm(false); setProductToDelete(null); }}>
             <div className="admin-modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '1rem' }} onClick={e => e.stopPropagation()}>
                <div className="modal-body" style={{ padding: '2rem' }}>
                  <div style={{ width: '64px', height: '64px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Trash2 size={32} />
                  </div>
                  <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Are you sure?</h2>
                  <p style={{ color: '#64748b', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    You are about to delete <strong>{productToDelete?.name}</strong>. This action cannot be undone.
                  </p>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <button 
                      className="btn-danger" 
                      style={{ width: '100%', padding: '0.9rem' }}
                      onClick={confirmDelete}
                    >
                      Delete Forever
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ width: '100%', padding: '0.9rem' }}
                      onClick={() => { setShowDeleteConfirm(false); setProductToDelete(null); }}
                    >
                      Keep it
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}
        {/* --- CUSTOM ORDER DELETE CONFIRMATION MODAL --- */}
        {showOrderDeleteConfirm && (
          <div className="modal-overlay" onClick={() => { setShowOrderDeleteConfirm(false); setOrderToDelete(null); }}>
             <div className="admin-modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '1rem' }} onClick={e => e.stopPropagation()}>
                <div className="modal-body" style={{ padding: '2rem' }}>
                  <div style={{ width: '64px', height: '64px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Trash2 size={32} />
                  </div>
                  <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Delete Booking?</h2>
                  <p style={{ color: '#64748b', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    Remove <strong>{orderToDelete?.customerName}</strong>'s booking (Order: {orderToDelete?._id.substring(18)})?
                  </p>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <button 
                      className="btn-danger" 
                      style={{ width: '100%', padding: '0.9rem' }}
                      onClick={confirmOrderDelete}
                    >
                      Remove Booking
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ width: '100%', padding: '0.9rem' }}
                      onClick={() => { setShowOrderDeleteConfirm(false); setOrderToDelete(null); }}
                    >
                      Keep Booking
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* --- CUSTOM CLEAR ALL CONFIRMATION MODAL --- */}
        {showClearConfirm && (
          <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
             <div className="admin-modal-content" style={{ maxWidth: '450px', border: '2px solid #ef4444' }} onClick={e => e.stopPropagation()}>
                <div className="modal-body" style={{ padding: '2.5rem', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '4px solid white', boxShadow: '0 0 0 4px #fef2f2' }}>
                    <AlertCircle size={40} />
                  </div>
                  <h2 style={{ color: '#991b1b', fontSize: '1.75rem', marginBottom: '0.75rem' }}>Extreme Danger!</h2>
                  <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '2rem' }}>
                    This will delete <strong>ALL</strong> customer bookings from your database forever. This action is <strong>irreversible</strong>.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button 
                      className="btn-outline" 
                      style={{ padding: '0.9rem' }}
                      onClick={() => setShowClearConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className={`btn-danger ${clearCountdown > 0 ? 'disabled' : ''}`} 
                      disabled={clearCountdown > 0}
                      style={{ 
                        padding: '0.9rem', 
                        opacity: clearCountdown > 0 ? 0.6 : 1,
                        cursor: clearCountdown > 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onClick={confirmClear}
                    >
                      {clearCountdown > 0 ? `Wait ${clearCountdown}s` : 'CLEAR ALL NOW'}
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Admin;
