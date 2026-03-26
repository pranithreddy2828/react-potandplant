import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

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
            <Link to="/cart" className="header-cart" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge vibrate">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="profile-container" ref={profileMenuRef}>
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
              className={`nav-toggle ${isOpen ? 'is-open' : ''}`} 
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

      <div className={`mobile-nav-overlay ${isOpen ? 'is-open' : ''}`} onClick={() => setIsOpen(false)}>
        <nav className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-nav-header">
            <span className="mobile-nav-label">Navigation</span>
            <button className="mobile-nav-close" onClick={() => setIsOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="mobile-nav-links">
            {navLinks.map((link, index) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                style={{ '--index': index }}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="mobile-nav-footer">
            {user ? (
               <div className="mobile-nav-profile">
                 <div className="mobile-user-info">
                   <p className="mobile-user-name">{user.name}</p>
                   <p className="mobile-user-phone">{user.phoneNumber}</p>
                 </div>
                 {isAdmin && (
                   <Link to="/admin" className="btn-outline full-width">Admin Dashboard</Link>
                 )}
                 <button onClick={logout} className="btn-primary full-width">Logout</button>
               </div>
            ) : (
              <div className="mobile-nav-auth">
                <Link to="/login" className="btn-outline full-width">Login</Link>
                <Link to="/register" className="btn-primary full-width">Sign up</Link>
              </div>
            )}
            
            <div className="mobile-nav-contact" style={{ marginTop: '2rem' }}>
              <p>Greenery for your modern lifestyle.</p>
              <div className="social-links-minimal">
                <a href="https://www.instagram.com/pot_and_plants6?utm_source=qr&igsh=MWJta2V4dDk1ZjAweQ==" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.youtube.com/@PotPlants-w9r" target="_blank" rel="noopener noreferrer">YouTube</a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
