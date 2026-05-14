import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, ShoppingBag, ShoppingCart, User, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const MobileBottomNav = ({ toggleMobileMenu }) => {
  const { cartCount } = useCart();
  const location = useLocation();
  const isUdgama = location.pathname === '/udgama';

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Udgama', path: '/udgama', icon: <Sparkles size={20} /> },
    { name: 'Shop', path: '/shop', icon: <ShoppingBag size={20} /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart size={20} />, badge: cartCount },
    { name: 'Menu', path: '#menu', icon: <Menu size={20} />, action: toggleMobileMenu },
  ];

  return (
    <div className={`mobile-bottom-nav ${isUdgama ? 'theme-udgama' : ''}`}>
      <div className="bottom-nav-container">
        {navItems.map((item, index) => (
          item.action ? (
            <button key={index} onClick={item.action} className="bottom-nav-item">
              <div className="icon-wrapper">
                {item.icon}
              </div>
              <span>{item.name}</span>
            </button>
          ) : (
            <NavLink 
              key={index} 
              to={item.path} 
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="icon-wrapper">
                {item.icon}
                {item.badge > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="nav-badge"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>
              <span>{item.name}</span>
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="nav-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </NavLink>
          )
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
