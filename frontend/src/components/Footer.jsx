import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>Pot &amp; Plants</h3>
          <p>Landscaping and garden service for homes and commercial spaces, creating customized green spaces where every detail is thoughtfully chosen.</p>
        </div>
        <div>
          <h4>Services</h4>
          <p>
            <Link to="/#services">Pergola</Link><br />
            <Link to="/#services">Yoga Deck</Link><br />
            <Link to="/#services">Fire Pit Seating</Link><br />
            <Link to="/#services">Pathways</Link><br />
            <Link to="/#services">Water Features</Link><br />
            <Link to="/#services">Plants &amp; Landscaping</Link>
          </p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: <a href="mailto:haripriya.potandplants@gmail.com">haripriya.potandplants@gmail.com</a></p>
          <p>
            Phone / WhatsApp:
            <a href="https://wa.me/917095722973" target="_blank" rel="noopener noreferrer">+91 70957 22973</a>
          </p>
          <div className="social-row" aria-label="Social links">
            <a className="social-icon" href="https://www.instagram.com/pot_and_plants6?utm_source=qr&igsh=MWJta2V4dDk1ZjAweQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z"></path>
                <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>
                <path d="M17.5 6.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"></path>
              </svg>
            </a>
            <a className="social-icon" href="https://www.facebook.com/share/18G9TmERJA/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.6V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H8v3h2.4v8h3.1z"></path>
              </svg>
            </a>
            <a className="social-icon" href="https://www.youtube.com/@PotPlants-w9r" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div>&copy; {new Date().getFullYear()} Pot &amp; Plants. All rights reserved.</div>
        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', opacity: 0.7 }}>
          Designed and Developed by <a href="mailto:praneethreddy2828@gmail.com" style={{ textDecoration: 'underline' }}>praneethreddy2828@gmail.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
