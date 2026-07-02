import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

import logoImg from '../assets/udgama/logo.png';

const Layout = () => {
  const location = useLocation();
  const isUdgama = location.pathname === '/udgama';
  const [showIntro, setShowIntro] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);

  useEffect(() => {
    if (isUdgama) {
      document.body.classList.add('theme-udgama');
      setShowIntro(true);
      setIsContentVisible(false);
      
      // Show intro for 2.5s, then fade in content
      const timer = setTimeout(() => {
        setShowIntro(false);
        setIsContentVisible(true);
      }, 2500);
      
      return () => {
        clearTimeout(timer);
        document.body.classList.remove('theme-udgama');
      };
    } else {
      document.body.classList.remove('theme-udgama');
      setIsContentVisible(true);
      setShowIntro(false);
    }
  }, [isUdgama]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div 
            key="udgama-intro"
            className="udgama-page-intro"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className="intro-logo"
              initial={{ scale: 0.7, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 2, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={logoImg} alt="Udgama Logo" className="udgama-main-logo" />
              <motion.div 
                className="logo-text-wrapper"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                <span className="logo-text">UDGAMA</span>
                <span className="logo-tagline">where nature takes form</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ opacity: isContentVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
      </motion.div>
    </>
  );
};

export default Layout;
