import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import aboutGarden from '../assets/about-garden.png';
import yogaDeck1 from '../assets/yoga-deck-1.png';
import yogaDeck2 from '../assets/yoga-deck-2.png';

const Home = () => {
  const [activeService, setActiveService] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  // Lotus Sprinkles Logic
  useEffect(() => {
    const lotusWrap = document.querySelector("[data-lotus-sprinkles]");
    if (lotusWrap) {
      const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const count = 12;
      const rand = (min, max) => Math.random() * (max - min) + min;

      lotusWrap.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        el.className = "lotus";
        const top = rand(6, 92);
        const left = rand(4, 96);
        const size = rand(26, 58);
        const rot = rand(-18, 18);
        const opacity = rand(0.08, 0.18);
        const floatDur = rand(6, 12);
        const floatDelay = rand(0, 3.5);

        el.style.top = `${top}%`;
        el.style.left = `${left}%`;
        el.style.setProperty("--lotus-size", `${size}px`);
        el.style.setProperty("--lotus-rot", `${rot}deg`);
        el.style.setProperty("--lotus-opacity", opacity.toFixed(2));

        if (!prefersReduce) {
          el.animate(
            [
              { transform: `translateZ(0) rotate(${rot}deg) translateY(0px)` },
              { transform: `translateZ(0) rotate(${rot}deg) translateY(-10px)` },
              { transform: `translateZ(0) rotate(${rot}deg) translateY(0px)` },
            ],
            { duration: floatDur * 1000, delay: floatDelay * 1000, iterations: Infinity, easing: "ease-in-out" }
          );
        }
        lotusWrap.appendChild(el);
      }
    }
  }, []);

  // Auto-scroll for projects
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId;
    let paused = false;

    const step = () => {
      if (!el || paused) return;
      
      const halfWidth = el.scrollWidth / 2;
      el.scrollLeft += 0.5;
      
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    
    const pause = () => { paused = true; cancelAnimationFrame(rafId); };
    const resume = () => { paused = false; rafId = requestAnimationFrame(step); };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, []);

  // Lock body scroll when modal/drawer is open
  useEffect(() => {
    if (activeService || activeProject) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [activeService, activeProject]);

  const services = [
    {
      id: "pergola",
      title: "Pergola",
      badge: "⛱",
      description: "A pergola creates a shaded seating area while adding architectural beauty to the garden.",
      images: ["/images/pergola1.jpg", "/images/pergola2.png", "/images/pergola 3.png"]
    },
    {
      id: "yoga",
      title: "Yoga Deck",
      badge: "🧘",
      description: "A peaceful space for relaxation, yoga, or outdoor seating using wood or HPL decking.",
      images: [yogaDeck1, yogaDeck2]
    },
    {
      id: "firepit",
      title: "Fire Pit Seating Area",
      badge: "🔥",
      description: "A warm and inviting space perfect for evening relaxation and social gatherings.",
      images: ["/images/fire1.png", "/images/fire 2.png"]
    },
    {
      id: "pathways",
      title: "Pathways",
      badge: "🪨",
      description: "Stone, tile, and pebble pathways that guide movement through the garden.",
      images: ["/images/path1212.png", "/images/path2.png"]
    },
    {
      id: "water",
      title: "Water Features",
      badge: "💧",
      description: "Fountains or mini ponds that add calming sound and natural cooling.",
      images: ["/images/water.png", "/images/water2.png", "/images/water3.png"]
    },
    {
      id: "plants",
      title: "Plants & Layered Landscaping",
      badge: "🌿",
      description: "Thoughtfully selected plants and trees that bring life, color, and structure to the space.",
      images: ["/images/layergarden 1.jpg", "/images/layergarden2.jpg"]
    }
  ];

  const projects = [
    {
      title: "Backyard garden transformations",
      description: "We design full makeovers for backyards using structured seating, diverse greens, pebble pathways, and elegant lighting to maximize your private outdoor sanctuary.",
      images: ["/images/Backyard garden transformations.jpg"],
      imgClass: "project-img-1"
    },
    {
      title: "Villa landscape designs",
      description: "Premium exterior setups that match the scale of your villa. We offer curated stonework, layered planting, and bespoke features to elevate your home's architecture.",
      images: ["/images/Villa landscape designs.jpg"],
      imgClass: "project-img-2"
    },
    {
      title: "Compact space optimization",
      description: "No space is too small. We introduce clever zoning, vertical gardens, and space-saving furniture to bring a sense of nature to small outdoor areas.",
      images: ["/images/Compact space optimization.jpg"],
      imgClass: "project-img-3"
    },
    {
      title: "Balcony garden setups",
      description: "Transform neglected balconies into your favorite daily retreat. Using specialized planters, vertical greens, and cozy textures to form a quiet nook.",
      images: ["/images/balcony garden setup.jpg"],
      imgClass: "project-img-4"
    },
    {
      title: "Terrace gardens",
      description: "Layered planting beds, wooden pergolas, and deck zones to completely transform your roof or terrace. Built to endure weather while remaining low maintenance.",
      images: ["/images/terrace garden.jpg"],
      imgClass: "project-img-5"
    }
  ];

  const processSteps = [
    { title: "Consultation", desc: "We understand your space, needs, style, and budget." },
    { title: "Design Planning", desc: "Layouts, zoning, and plant + feature planning." },
    { title: "Material Selection", desc: "Decking, stones, features, planters, and lighting choices." },
    { title: "Execution", desc: "On-site build with clean timelines and quality checks." },
    { title: "Final Styling", desc: "Plant placement, finishing touches, and a ready-to-live space." }
  ];

  return (
    <div className="home-page">
      <div className="lotus-sprinkles lotus-sprinkles--page" aria-hidden="true" data-lotus-sprinkles></div>

      <section className="hero hero-landscape" id="top">
        <div className="hero-bg" role="img" aria-label="Beautiful garden landscape background"></div>
        <div className="hero-overlay"></div>
        <div className="container hero-landscape-inner">
          <div className="hero-landscape-copy">
            <h1>Transform Your Space into a Living Garden</h1>
            <div className="hero-frosted">
              <p className="hero-subheading">
                Custom Landscaping • Yoga Decks • Pergolas • Fire Pits • Water Features • Pathways • Plant Styling
              </p>
              <p className="hero-description">
                Create a space that feels calm, beautiful, and truly yours. We design and build gardens that are not just visually appealing but also functional and meaningful.
              </p>
            </div>
            <div className="hero-actions">
              <a href="#consultation" className="btn-primary btn-lg">Get Free Consultation</a>
              <a href="https://wa.me/917095722973" className="btn-outline btn-lg btn-whatsapp" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Call / WhatsApp
              </a>
            </div>
          </div>
          <div className="hero-landscape-card">
            <div className="hero-mini-grid">
              <div className="hero-mini">
                <div className="hero-mini-title">Designed for your space</div>
                <div className="hero-mini-text">Villa • Backyard • Balcony • Terrace</div>
              </div>
              <div className="hero-mini">
                <div className="hero-mini-title">End-to-end execution</div>
                <div className="hero-mini-text">Plan • Materials • Build • Styling</div>
              </div>
              <div className="hero-mini">
                <div className="hero-mini-title">Nature-Centric Designs</div>
                <div className="hero-mini-text">
                  Plants • Textures • Natural Elements<br/>
                  Balanced greenery that feels calm, fresh, and real
                </div>
              </div>
              <div className="hero-mini">
                <div className="hero-mini-title">Detail-Driven Execution</div>
                <div className="hero-mini-text">
                  Clean finishes • Thoughtful planning • Quality work<br/>
                  Every element placed with care and precision
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container split-grid">
          <div className="split-copy">
            <h2 className="section-title">A calmer, greener way to live.</h2>
            <p className="section-lead">Bringing nature closer to everyday spaces.</p>
            <p>Pot & Plants is a landscaping and garden service for homes and commercial spaces, creating customized green spaces where every detail is thoughtfully chosen. From small corners to backyards, terraces, farmhouses, and villas, we design spaces that feel lighter, fresher, and more alive.</p>
            <Link to="/about" className="btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>Read our story</Link>
          </div>
          <div className="split-visual">
            <img className="rounded-image" src={aboutGarden} alt="Designed garden with seating" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section section-alt" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Services</h2>
            <p className="section-subtitle">Build a garden that looks beautiful and lives beautifully.</p>
          </div>
          <div className="cards-grid">
            {services.map(service => (
              <article 
                key={service.id} 
                className="icon-card icon-card--bg service-card" 
                onClick={() => setActiveService(service)}
                role="button"
                tabIndex="0"
                style={{ '--service-bg': `url("${service.images[0]}")` }}
              >
                <div className="icon-badge" aria-hidden="true">{service.badge}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: "🧩", title: "Custom-designed gardens tailored to your space", desc: "Every layout is planned around your light, flow, and lifestyle." },
              { icon: "📐", title: "Smart and efficient space utilization", desc: "We make compact spaces feel larger and more functional." },
              { icon: "💚", title: "Budget-friendly solutions without compromising quality", desc: "We balance materials, durability, and aesthetics." },
              { icon: "🛠", title: "End-to-end service from design to execution", desc: "One team from concept to final styling." },
              { icon: "✨", title: "Focus on both aesthetics and functionality", desc: "Beautiful spaces that are easy to use and maintain." }
            ].map((item, i) => (
              <div key={i} className="why-item">
                <div className="why-icon" aria-hidden="true">{item.icon}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="projects">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Projects / What We Specialize In</h2>
            <p className="section-subtitle">A few of our most-loved transformations.</p>
          </div>
          <div 
            className="project-grid project-grid--scroll" 
            ref={scrollRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              const half = el.scrollWidth / 2;
              const currentX = el.scrollLeft % half;
              const progress = (currentX / (half - el.clientWidth)) * 100;
              setScrollProgress(Math.min(100, Math.max(0, progress)));
            }}
          >
            {[...projects, ...projects].map((project, i) => (
              <article 
                key={i} 
                className="project-card" 
                onClick={() => setActiveProject(project)}
                role="button"
                tabIndex="0"
              >
                <div className={`project-image ${project.imgClass}`} role="img" aria-hidden="true"></div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description.substring(0, 60)}...</p>
                </div>
              </article>
            ))}
          </div>

          <div className="plant-scroll-container">
            <div className="plant-scroll-track">
              <div 
                className="plant-scroll-items"
                style={{ transform: `translateX(${-scrollProgress / 2}%)` }}
              >
                {['🌿', '🌸', '🌵', '🌻', '🌱', '🌷', '🪴', '🌹'].map((p, i) => (
                  <div key={i} className="plant-scroll-item">{p}</div>
                ))}
                {/* Loopable set */}
                {['🌿', '🌸', '🌵', '🌻', '🌱', '🌷', '🪴', '🌹'].map((p, i) => (
                  <div key={i + 10} className="plant-scroll-item">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Process</h2>
          </div>
          <ol className="timeline">
            {processSteps.map((step, i) => (
              <li key={i} className="timeline-step">
                <div className="timeline-dot" aria-hidden="true"></div>
                <div className="timeline-card">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section cta-section" id="consultation">
        <div className="container">
          <div className="cta-card">
            <div className="cta-copy">
              <h2>Ready to Transform Your Space?</h2>
              <p>Let us design a beautiful garden that brings peace and life to your home.</p>
              <div className="hero-actions">
                <a href="#top" className="btn-primary btn-lg">Get Free Consultation</a>
                <a href="https://wa.me/917095722973" className="btn-outline btn-lg btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contact Us
                </a>
              </div>
            </div>
            <div className="cta-visual" role="img" aria-label="Garden seating with greenery"></div>
          </div>
        </div>
      </section>

      {/* Service Modal */}
      {activeService && (
        <div className={`modal ${activeService ? 'is-open' : ''}`}>
          <div className="modal-backdrop" onClick={() => setActiveService(null)}></div>
          <div className="modal-dialog" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setActiveService(null)} aria-label="Close">×</button>
            <div className="modal-grid--split">
              <div className="modal-media">
                <div className="modal-media-main">
                  <img src={activeService.images[0]} alt={activeService.title} />
                  <div className="modal-media-overlay"></div>
                  <div className="modal-badge-floating">{activeService.badge}</div>
                </div>
                {activeService.images.length > 1 && (
                  <div className="modal-media-gallery">
                    {activeService.images.map((img, i) => (
                      <div 
                        key={i} 
                        className={`modal-gallery-item ${i === 0 ? 'is-active' : ''}`}
                        onClick={(e) => {
                          const mainImg = e.currentTarget.closest('.modal-media').querySelector('.modal-media-main img');
                          if (mainImg) mainImg.src = img;
                          e.currentTarget.parentElement.querySelectorAll('.modal-gallery-item').forEach(el => el.classList.remove('is-active'));
                          e.currentTarget.classList.add('is-active');
                        }}
                      >
                        <img src={img} alt="" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-content">
                <div className="modal-header">
                  <span className="modal-eyebrow">Professional Garden Care</span>
                  <h3>{activeService.title}</h3>
                </div>
                <div className="modal-body">
                  <p>{activeService.description}</p>
                  <div className="modal-features">
                    <div className="modal-feature">
                      <div className="feature-icon">✨</div>
                      <span>Premium Quality</span>
                    </div>
                    <div className="modal-feature">
                      <div className="feature-icon">🌿</div>
                      <span>Expert Styling</span>
                    </div>
                    <div className="modal-feature">
                      <div className="feature-icon">🛠</div>
                      <span>Full Execution</span>
                    </div>
                    <div className="modal-feature">
                      <div className="feature-icon">📅</div>
                      <span>On-time Delivery</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <a 
                    href={`https://wa.me/917095722973?text=Hi, I'm interested in your ${activeService.title} service.`} 
                    className="btn-primary w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Inquire on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Drawer */}
      {activeProject && (
        <div className="project-drawer is-open">
          <div className="drawer-backdrop" onClick={() => setActiveProject(null)}></div>
          <div className="drawer-panel" role="dialog" aria-modal="true">
            <button className="drawer-close" onClick={() => setActiveProject(null)} aria-label="Close drawer">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="drawer-header">
              <h3>{activeProject.title}</h3>
              <p>{activeProject.description}</p>
            </div>
            <div className="drawer-gallery">
              {activeProject.images.map((img, i) => (
                <div key={i} className="drawer-item">
                  <img src={img} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
