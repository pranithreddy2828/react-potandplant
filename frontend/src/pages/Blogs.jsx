import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isArticleOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isArticleOpen]);

  return (
    <div className="blogs-page">
      <section className="section">
        <div className="container">
          <h1 className="section-title">Plant care &amp; styling blogs</h1>
          <p>Practical reads focusing on the significance of green spaces, fair land use, and the aesthetics of well-designed gardens.</p>
          <p>Browse thoughtful guides for Indian climates, low-maintenance plants, and ways to bring nature closer to home.</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container blog-feature-hero">
          <div className="blog-hero-image blog-hero-indoor"></div>
          <div className="blog-hero-glass">
            <p className="eyebrow">WHY INDOOR PLANTS MATTER</p>
            <h2 className="section-title">Bringing nature home</h2>
            <p>Discover how a few well-chosen plants can soften hard furniture, calm busy minds and turn any room into a lived-in, welcoming space.</p>
            <button 
              onClick={() => setIsArticleOpen(true)}
              className="btn-primary" 
              style={{ marginTop: '1.25rem' }}
            >
              Read Full Story
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container blog-grid">
          {[
            { id: 1, title: "Significance of Green Space", desc: "Green spaces improve air quality, reduce heat, and create a calming environment. They enhance everyday living by bringing nature closer to home.", meta: "4 min read • Benefits", imgClass: "blog-image-1" },
            { id: 2, title: "Fair Land Use", desc: "Thoughtful planning ensures every inch of space is used efficiently. Balancing greenery with function creates sustainable and usable environments.", meta: "5 min read • Planning", imgClass: "blog-image-2" },
            { id: 3, title: "Aesthetics of Garden", desc: "A well-designed garden blends colours, textures, and layers beautifully. It transforms any space into a visually pleasing and inviting retreat.", meta: "6 min read • Design", imgClass: "blog-image-3" },
            { id: 4, title: "How to Water Plants during Indian Summers", desc: "Understand your plant’s needs and adjust watering based on heat and sunlight. Simple routines can prevent overwatering while keeping plants healthy and hydrated.", meta: "4 min read • Care", imgClass: "blog-image-4" },
            { id: 5, title: "5 Low-Maintenance Outdoor Plants", desc: "Hardy plants that thrive in sun, heat, and changing weather with minimal care. Perfect for balconies, terraces, and gardens that need greenery without constant upkeep. 🌿", meta: "3 min read • Selection", imgClass: "blog-image-5" }
          ].map(blog => (
            <article key={blog.id} className="blog-card">
              <div className={`blog-image ${blog.imgClass}`}></div>
              <div className="blog-content">
                <h2>{blog.title}</h2>
                <p>{blog.desc}</p>
                <span className="blog-meta">{blog.meta}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Drawer / Popup */}
      <div className={`project-drawer ${isArticleOpen ? 'is-open' : ''}`}>
        <div className="drawer-backdrop" onClick={() => setIsArticleOpen(false)}></div>
        <div className="drawer-panel blog-drawer-panel" role="dialog" aria-modal="true">
          <button className="drawer-close" onClick={() => setIsArticleOpen(false)} aria-label="Close drawer">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="drawer-body blog-article">
            <article className="blog-article-body">
              <header className="blog-article-header">
                <h2 className="section-title">Why Indoor Plants Matter</h2>
                <p className="blog-article-subtitle">Bringing nature home</p>
              </header>

              <h3>Introduction</h3>
              <p>Indoor plants do much more than just sit in a corner. In our modern homes—full of hard furniture and glowing screens—a touch of greenery acts as a “natural softener.” Even a single, well-placed plant can make a living room feel warmer, fresher, and more welcoming.</p>
              <p>For many of us, indoor plants are the easiest way to bring life into a house. They fill up empty corners, balance the look of a room, and create a sense of calm that man-made decorations just can't match. The best part? You don't need a huge budget or a lot of time to make your home feel more “lived-in” and comfortable.</p>

              <h3>What Makes a Great Indoor Plant?</h3>
              <p>The most successful indoor plants share a few simple traits: they thrive in indirect light and tolerate the Indian summer. A good indoor plant understands that you have a life; it should be able to survive your occasional forgetfulness without staging a dramatic, leaf-dropping protest. It should add beauty to your home, not a list of demands to your schedule.</p>

              <h3>Our Top 5 Recommendations (And Why We Chose Them)</h3>
              <p>We often get asked why we recommend these specific five plants over hundreds of others. The answer is simple: reliability. In our local climate, these are the “survivors.” They are affordable, easily available in local nurseries, and have a high success rate even for beginners.</p>

              <div className="blog-article-gallery drawer-article-grid">
                <div className="glass-card plant-card">
                  <h4>The Snake Plant</h4>
                  <p>Bedroom’s best friend. Negotiates tight corners and purifies air at night.</p>
                </div>
                <div className="glass-card plant-card">
                  <h4>The Peace Lily</h4>
                  <p>Elegant communicator that tells you exactly when it needs water.</p>
                </div>
                <div className="glass-card plant-card">
                  <h4>The Pothos</h4>
                  <p>The versatile workhorse. High shelf waterfalls or wall climbers.</p>
                </div>
                <div className="glass-card plant-card" style={{ gridColumn: 'span 2' }}>
                  <h4>The Spider Plant: The Decorative Fast-Grower</h4>
                  <p>Our top pick for shelves, hanging pots, and small desks. It is a fast-growing, cheerful plant that produces "pups" (baby plants) that hang down like tiny stars. We chose this because its thick, tuberous roots act like a backup water tank, allowing it to survive if you forget to water it for a few days. It adds a sense of movement and energy to a room.</p>
                  <p><em><strong>Design Tip:</strong> Place this on the highest shelf of a bookshelf so the "babies" can hang down freely, creating a 3D layer of greenery.</em></p>
                  <p><em><strong>Pro Care:</strong> When the "pups" start to grow small roots of their own, you can snip them off and pot them separately to grow a brand new plant.</em></p>
                </div>
                <div className="glass-card plant-card" style={{ gridColumn: 'span 2' }}>
                  <h4>The Areca Palm: A Tropical Escape</h4>
                  <p>The perfect solution for large empty corners. Its feathery, arching fronds create an instant "tropical retreat" vibe. In our dry local climate, this palm acts as a natural humidifier, keeping your home feeling cooler. Its dense growth also works beautifully as a stylish "natural room divider."</p>
                  <p><em><strong>Design Tip:</strong> Use a large wicker or basket-style planter to enhance the "vacation-at-home" tropical look.</em></p>
                  <p><em><strong>Pro Care:</strong> It loves bright, indirect light; near a large window with a sheer curtain is its favorite spot to stay lush and bushy.</em></p>
                </div>
              </div>

              <h3 style={{ marginTop: '2.5rem' }}>Clearing Up the Air: The "NASA Myth"</h3>
              <p>The popular belief that indoor plants act as powerful air purifiers is rooted in a landmark 1989 NASA study aimed at creating "life-support" systems for space stations. NASA specifically targeted Volatile Organic Compounds (VOCs), which "off-gas" from common household items:</p>
              <ul>
                <li><strong>Formaldehyde:</strong> Emitted by pressed-wood furniture, carpets, and adhesives. Spider Plants are particularly efficient at capturing this.</li>
                <li><strong>Benzene:</strong> Found in paints, synthetic fibers, and detergents. The Peace Lily was identified as a top performer in neutralizing this.</li>
                <li><strong>Trichloroethylene (TCE):</strong> Found in varnishes and industrial cleaners. Plants like the Areca Palm help filter these toxins through their leaves.</li>
              </ul>
              <p>While the science is fascinating, it’s important to distinguish between a "sealed laboratory" and a "living room." To match a mechanical air purifier, you’d essentially need to turn your living room into a high-density tropical rainforest. A single plant isn't exactly a high-tech filtration factory.</p>
              <p>The real miracle isn't happening in your lungs—it’s in your head. While your plants are losing the microscopic battle against dust, they are successfully performing psychological warfare on your stress. They may not be oxygen tanks, but they are world-class therapists.</p>

              <h3 style={{ marginTop: '2.5rem' }}>The Final Word</h3>
              <p>When you choose the right plants and care for them simply, they become a permanent part of your home’s personality. You don’t need to be an expert to create a beautiful, sustainable indoor retreat. By focusing on plants that actually fit your lifestyle and your home’s light, you can enjoy the peace of nature every single day. All it takes is the right space and the right plant to get started.</p>

              <div className="hero-actions" style={{ marginTop: '2.5rem' }}>
                <Link to="/studio" onClick={() => setIsArticleOpen(false)} className="btn-outline">Explore studio</Link>
                <Link to="/shop" onClick={() => setIsArticleOpen(false)} className="btn-primary">Browse shop</Link>
              </div>
            </article>
          </div>
        </div>
      </div>

      <section className="section section-alt">
        <div className="container blog-featured">
          <div className="blog-featured-copy">
            <h2 className="section-title">Photo stories from real homes</h2>
            <p>Each month we visit one home we’ve styled and document how the plants have grown, how the space is used and what small tweaks made the biggest difference.</p>
            <p>These stories are filled with before/after photos, layout sketches and care notes so you can apply the same ideas to your own space.</p>
          </div>
          <div className="blog-featured-gallery">
            <div className="blog-gallery-image blog-gallery-1"></div>
            <div className="blog-gallery-image blog-gallery-2"></div>
            <div className="blog-gallery-image blog-gallery-3"></div>
          </div>
        </div>
      </section>

      <section className="section" id="subscribe">
        <div className="container blog-subscribe">
          <h2 className="section-title">Get new blogs in your inbox</h2>
          <p>Sign up to receive monthly studio stories, plant care reminders and seasonal checklists for your balcony or garden.</p>
          <form className="blog-subscribe-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" name="email" placeholder="Enter your email" required className="input" />
            <button type="submit" className="btn-primary">Notify me</button>
          </form>
          <p className="blog-subscribe-note">No spam. Just thoughtful green inspiration.</p>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
