import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings, LayoutDashboard, Palette, BookOpen, Info, ArrowRight, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileBottomNav from './MobileBottomNav';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  // Handle click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Udgama', path: '/udgama' },
    { name: 'Shop', path: '/shop' },
    { name: 'Studio', path: '/studio' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="logo">
            Pot <span>&amp;</span> Plants
          </Link>

          <nav className="nav-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="nav-group">
            <Link to="/cart" className="header-cart desktop-only" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge vibrate">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="profile-container desktop-only" ref={profileMenuRef}>
                <button
                  className="profile-trigger"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="Profile Menu"
                >
                  <div className="profile-avatar">
                    <User size={20} />
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <p className="user-name">{user.name}</p>
                      <p className="user-phone">{user.phoneNumber}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item">
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    <Link to="/my-orders" className="dropdown-item">
                      <ShoppingBag size={16} /> My Orders
                    </Link>
                    <Link to="/profile" className="dropdown-item">
                      <Settings size={16} /> Edit Profile
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={logout} className="dropdown-item logout-btn">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-desktop">
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/register" className="btn-primary">Sign up</Link>
              </div>
            )}

            <button
              className={`nav-toggle ${isOpen ? 'is-open' : ''} mobile-only-hamburger`}
              type="button"
              aria-label="Toggle navigation"
              onClick={toggleMenu}
            >
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <div className="mobile-popup-overlay" onClick={() => setIsOpen(false)}>
            <motion.div
              className="simple-mobile-popup"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-header">
                <h3 className="popup-title">Menu</h3>
                <button className="popup-close-btn" onClick={() => setIsOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="popup-navigation">
                <NavLink to="/studio" className="popup-nav-item">
                  <Palette size={20} /> <span>Design Studio</span>
                </NavLink>
                <NavLink to="/blogs" className="popup-nav-item">
                  <BookOpen size={20} /> <span>Nature Blogs</span>
                </NavLink>
                <NavLink to="/about" className="popup-nav-item">
                  <Info size={20} /> <span>About Us</span>
                </NavLink>
              </div>

              <div className="popup-divider" />

              <div className="popup-footer">
                {user ? (
                  <div className="popup-user-info">
                    <p className="user-name">{user.name}</p>
                    <div className="user-actions">
                      {isAdmin && <Link to="/admin">Admin</Link>}
                      <Link to="/my-orders">My Orders</Link>
                      <Link to="/profile">Profile</Link>
                      <button onClick={logout} className="logout-btn">Logout</button>
                    </div>
                  </div>
                ) : (
                  <div className="popup-auth-actions">
                    <Link to="/login" className="auth-btn">Login</Link>
                    <Link to="/register" className="auth-btn primary">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MobileBottomNav toggleMobileMenu={toggleMenu} />
    </>
  );
};

export default Navbar;
