import React from 'react';

const Studio = () => {
  return (
    <div className="studio-page">
      <section className="section">
        <div className="container">
          <h1 className="section-title">Pot &amp; Plants Studio</h1>
          <p>Peek into our styling studio where we design balcony makeovers, desk setups and cozy plant corners for Indian homes.</p>
          <p>From first sketch to final leaf, every space we create is photographed, documented and refined so you can imagine what your own home could become.</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container studio-grid">
          <article className="studio-card">
            <div className="studio-image studio-image-1"></div>
            <div className="studio-overlay"></div>
            <div className="studio-content">
              <h2>🌿 Built Like Nature</h2>
              <p>Layered planting with trees, shrubs, and ground cover. Designed to create depth, shade, and natural balance. A landscape that feels organic and full.</p>
            </div>
          </article>
          <article className="studio-card">
            <div className="studio-image studio-image-2"></div>
            <div className="studio-overlay"></div>
            <div className="studio-content">
              <h2>🪵 Made for Living Outdoors</h2>
              <p>Decks, pathways, and functional outdoor zones. Spaces planned for seating, movement, and comfort. Designed to be used, not just seen.</p>
            </div>
          </article>
          <article className="studio-card">
            <div className="studio-image studio-image-3"></div>
            <div className="studio-overlay"></div>
            <div className="studio-content">
              <h2>Calm in Every Corner</h2>
              <p>Curated water features and layered greenery. Cooling textures that enhance comfort and stillness. Spaces designed to slow down and breathe.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container studio-process">
          <h2 className="section-title">How customization works</h2>
          <div className="process-steps">
            <div className="process-step">
              <span className="step-number">01</span>
              <h3>Understand Your Space</h3>
              <p>We carefully assess your layout, light, and needs. This helps us create a strong foundation for a well-balanced outdoor space.</p>
            </div>
            <div className="process-step">
              <span className="step-number">02</span>
              <h3>Customize the Concept</h3>
              <p>We design a plan tailored to your style and environment. Every plant, material, and element is chosen with purpose.</p>
            </div>
            <div className="process-step">
              <span className="step-number">03</span>
              <h3>Build Your Space</h3>
              <p>Our team brings the design to life with precision and care. We focus on quality execution and attention to every detail.</p>
            </div>
            <div className="process-step">
              <span className="step-number">04</span>
              <h3>Maintain &amp; Evolve</h3>
              <p>We guide you on care to keep your space thriving. Ongoing support ensures it stays fresh, healthy, and growing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container studio-showcase">
          <h2 className="section-title">Before &amp; after stories</h2>
          <div className="studio-before-after-grid">
            <article className="before-after-card">
              <div className="before-after-images">
                <div className="ba-image ba-before studio-image-4">
                  <span className="ba-label">Before</span>
                </div>
                <div className="ba-image ba-after studio-image-5">
                  <span className="ba-label">After</span>
                </div>
              </div>
              <div className="before-after-copy">
                <h3>From empty balcony to weekend retreat</h3>
                <p>A 60 sq ft balcony in a Bengaluru apartment turned into a cozy retreat with weather-proof flooring, railing planters, climbers and layered lighting.</p>
              </div>
            </article>
            <article className="before-after-card">
              <div className="before-after-images">
                <div className="ba-image ba-before studio-image-6">
                  <span className="ba-label">Before</span>
                </div>
                <div className="ba-image ba-after studio-image-7">
                  <span className="ba-label">After</span>
                </div>
              </div>
              <div className="before-after-copy">
                <h3>Where Spaces Turn Green & Profitable 🌿</h3>
                <p>Green corners turn everyday spaces into experiences people want to stay in.
                        They draw people in, slow them down, and make your place unforgettable 🌿
</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Studio;
