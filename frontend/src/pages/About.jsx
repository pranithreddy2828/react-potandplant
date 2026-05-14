import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      <section className="section">
        <div className="container blog-article about-bg">
          <div className="blog-article-body">
            <header className="blog-article-header">
              <p className="eyebrow">About us</p>
              <h1 className="section-title">A calmer, greener way to live.</h1>
              <p className="blog-article-subtitle">
                Bringing nature closer to everyday spaces<br/>
                Pot & Plants is a landscaping and garden service for homes and commercial spaces, creating customized green spaces for homes where every detail is thoughtfully chosen.<br/>
                <strong>Make your home feels lighter, fresher, and more alive.</strong>
              </p>
              <div className="hero-actions" style={{ marginTop: '1.5rem' }}>
                <Link to="/shop" className="btn-primary btn-lg">Shop plants</Link>
                <Link to="/studio" className="btn-outline">Explore studio</Link>
              </div>
            </header>

            <h3>Our Story</h3>
            <p>
              We started Pot & Plants with a simple idea: to make it easier to bring greenery into everyday life—without the guesswork. 
              From small corners to backyards, terraces, farmhouses, and villas, we design spaces with thoughtfully chosen elements to create beautiful, functional gardens.
            </p>

            <h3>What We Do:</h3>
            <ul>
              <li><strong>Curated plants and pots</strong> chosen for beauty, health, and suitability for Indian homes and climates.</li>
              <li><strong>Every element is selected with attention to detail</strong>, balancing aesthetics with practicality.</li>
              <li><strong>We transform any space</strong> into a living, thriving green environment designed to grow with you.</li>
            </ul>

            <h3>What We Believe</h3>
            <div className="testimonial-grid" style={{ marginTop: '0.9rem' }}>
              <article className="testimonial-card">
                <p><strong>Simplicity</strong></p>
                <span>Thoughtful recommendations that align with your light, space, and everyday routine.</span>
              </article>
              <article className="testimonial-card">
                <p><strong>Sustainability</strong></p>
                <span>Conscious choices, long-lasting setups, and a mindful approach to materials and packaging.</span>
              </article>
              <article className="testimonial-card">
                <p><strong>Craft</strong></p>
                <span>Designs that feel calm, balanced, and intentionally created to grow with you over time.</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="blog-featured">
            <div className="blog-featured-copy">
              <h2 className="section-title">Need help creating your outdoor haven?</h2>
              <p>
                Tell us about your space, layout, and how you plan to use it and we’ll guide you with the right plants and elements to bring it to life.
              </p>
              <p>
                Explore ideas, get inspired, and take the first step toward a space that feels naturally yours.
              </p>
              <div className="hero-actions" style={{ marginTop: '1.5rem' }}>
                <Link to="/shop" className="btn-primary">Browse shop</Link>
                <Link to="/studio" className="btn-outline">Consult us</Link>
              </div>
            </div>
            <div className="blog-featured-gallery" aria-hidden="true">
              <div className="blog-gallery-image blog-gallery-1"></div>
              <div className="blog-gallery-image blog-gallery-2"></div>
              <div className="blog-gallery-image blog-gallery-3"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
