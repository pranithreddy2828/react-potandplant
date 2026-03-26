import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Studio from './pages/Studio';
import Blogs from './pages/Blogs';
import About from './pages/About';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import { CartProvider } from './context/CartContext';

import ScrollToTop from './components/ScrollToTop';

import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <ScrollToTop />
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="studio" element={<Studio />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="about" element={<About />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
