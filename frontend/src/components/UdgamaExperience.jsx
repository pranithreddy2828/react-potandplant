import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Waves, Trees, Sun, Compass, Layout, Maximize2, Move, Ruler, Layers, Link2 } from 'lucide-react';

import introBg from '../assets/udgama/intro_bg.png';
import waterImg from '../assets/udgama/water.png';
import stoneImg from '../assets/udgama/stone.png';
import lightImg from '../assets/udgama/light.png';
import foliageImg from '../assets/udgama/foliage.png';
import treesImg from '../assets/udgama/trees.png';
import outdoorImg from '../assets/udgama/outdoor.png';

const UdgamaExperience = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bgY = useTransform(scrollYProgress, [0, 0.2], ["0%", "15%"]);
  const introScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  return (
    <div ref={containerRef} className="udgama-experience">
      {/* Intro Section */}
      <section className="udgama-intro">
        <motion.div 
          className="udgama-intro-bg"
          style={{ 
            backgroundImage: `url(${introBg})`,
            y: bgY,
            scale: introScale
          }}
        />
        <div className="udgama-overlay-dark" />
        <motion.div 
          className="udgama-intro-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="udgama-intro-number">01 / 02</div>
          <span className="udgama-eyebrow">Luxury Landscapes</span>
          <h1 className="udgama-title-main">Bespoke luxury landscapes crafted for timeless living</h1>
          <p className="udgama-subtext">
            UDGAMA landscapes are designed beyond what is seen. They are experienced through sound, texture, light, and movement—creating spaces that feel alive, immersive, and timeless.
          </p>
          <div className="udgama-design-elements">
            <span>Sound</span> • <span>Texture</span> • <span>Light</span> • <span>Movement</span>
          </div>
          <motion.div 
            className="udgama-scroll-indicator"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="scroll-line" />
          </motion.div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="udgama-vision">
        <div className="container">
          <motion.div 
            className="udgama-vision-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <span className="udgama-eyebrow">Vision Of Our Brand</span>
            <h2 className="udgama-vision-text">
              To redefine outdoor living by creating landscapes where nature, design, and experience exist in perfect harmony—timeless, immersive, and deeply connected to life.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Immersive Experience Blocks */}
      <div className="udgama-blocks">
        <ExperienceBlock 
          id="sound"
          title="Sound (Water)"
          badge={<Waves size={24} />}
          description="A gentle, continuous flow that softens the surroundings, creating a tranquil rhythm that soothes the senses and brings a quiet sense of calm."
          mood="Peaceful & Immersive"
          image={waterImg}
          animation="flow"
        />
        
        <ExperienceBlock 
          id="texture"
          title="Texture (Stone)"
          badge={<Compass size={24} />}
          description="Natural stone introduces depth and permanence, its rich textures grounding the space with a refined balance of strength and organic elegance."
          mood="Grounded & Timeless"
          image={stoneImg}
          animation="depth"
        />

        <ExperienceBlock 
          id="light"
          title="Light (Ambience)"
          badge={<Sun size={24} />}
          description="Soft, thoughtfully placed light shapes the mood, revealing layers and casting a warm, inviting glow that transforms the space into an intimate experience."
          mood="Intimate & Premium"
          image={lightImg}
          animation="glow"
        />

        <ExperienceBlock 
          id="movement"
          title="Movement"
          badge={<Trees size={24} />}
          description="Movement is designed, not accidental. Seen in gentle flows and evolving light, bringing a refined sense of rhythm to the landscape."
          mood="Alive & Elegant"
          image={foliageImg}
          animation="parallax"
        />
      </div>

      {/* Seamless Flow Section */}
      <section className="udgama-horizontal">
        <div className="container">
          <div className="udgama-horizontal-header">
            <span className="udgama-eyebrow">Seamless Flow</span>
            <h2 className="udgama-title-lg">Composed Through Nature, Defined by Flow</h2>
            <p className="udgama-horizontal-desc">Our approach begins with understanding how spaces connect and transition. Pathways, greens, and open areas are designed to guide movement naturally—linking indoor comfort with outdoor openness.</p>
          </div>
          <div className="udgama-horizontal-grid">
            {[
              { title: "SEAMLESS FLOW", desc: "Every view is intentional, every transition is effortless.", icon: <Move size={24} /> },
              { title: "SPATIAL HARMONY", desc: "A singular design language that connects the interior with the exterior.", icon: <Maximize2 size={24} /> },
              { title: "UNIFIED EXPERIENCE", desc: "Designing for growth and evolution, ensuring beauty across seasons.", icon: <Layout size={24} /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="udgama-glass-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 1 }}
              >
                <div className="udgama-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Language Section */}
      <section className="udgama-visual-language">
        <div className="container">
          <div className="udgama-language-header">
            <span className="udgama-eyebrow">Language of Luxury</span>
            <h2 className="udgama-title-lg">Brand Guidelines</h2>
          </div>
          <div className="udgama-language-grid">
            {[
              { title: "Precision", letter: "Aa", fontClass: "font-precision", desc: "UDGAMA expresses design through clarity and restraint, where every element is intentional and refined. Simplicity becomes the foundation of elegance.", icon: <Ruler size={20} /> },
              { title: "Depth", letter: "Aa", fontClass: "font-depth", desc: "Subtle details add depth and character, creating a quiet sense of sophistication. Each layer is thoughtfully composed to enhance the overall experience.", icon: <Layers size={20} /> },
              { title: "Cohesion", letter: "Aa", fontClass: "font-cohesion", desc: "Together, every element works in harmony to create a cohesive and seamless expression. The result is a design language that feels natural and complete.", icon: <Link2 size={20} /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="udgama-lang-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="lang-header">
                  <span className={`lang-letter ${item.fontClass}`}>{item.letter}</span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.desc}</p>
                <div className="lang-footer">
                  <div className="lang-icon">{item.icon}</div>
                  <span className="lang-label">Visual Cohesion</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Refined Greenery Showcase */}
      <section className="udgama-gallery">
        <div className="container">
          <div className="udgama-asymmetric-layout">
            <div className="udgama-gallery-text">
              <span className="udgama-eyebrow">Visual Style Direction</span>
              <h2 className="udgama-title-lg">Refined Greenery</h2>
              <p>At UDGAMA, plants are not added—they are composed. Each selection is made to enhance the visual depth, structure, and mood of a space, creating landscapes that feel complete, balanced, and effortlessly refined.</p>
              <div className="udgama-quote-box">
                <p>Sculptural plants act as focal points, drawing attention and giving the space a strong visual identity.</p>
              </div>
            </div>
            <div className="udgama-gallery-masonry">
               <div className="masonry-main">
                  <motion.div 
                    className="masonry-img-wrap"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img src={treesImg} alt="Sculptural Trees" />
                  </motion.div>
               </div>
               <div className="masonry-side">
                  <motion.div 
                    className="masonry-img-wrap small"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={foliageImg} alt="Layered Plantation" />
                  </motion.div>
                  <motion.div 
                    className="masonry-img-wrap small"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={outdoorImg} alt="Luxury Garden" />
                  </motion.div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business & Personality Section */}
      <section className="udgama-about-business">
        <div className="container">
          <div className="about-grid">
            <motion.div 
              className="about-block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span className="udgama-eyebrow">About Our Business</span>
              <p>From concept to completion, we offer a seamless and detail-driven process. Every project is approached with precision, care, and a deep understanding of the client’s vision. The result is not just a landscape, but a space that enhances lifestyle, creates connection, and leaves a lasting impression.</p>
            </motion.div>
            <motion.div 
              className="about-block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="udgama-eyebrow">Tone Of Voice & Personality</span>
              <p>UDGAMA reflects a personality that is refined, grounded, and deeply connected to nature. It is calm yet expressive, minimal yet rich in detail. Every space we create carries a sense of quiet luxury—where elegance is not loud, but felt through balance, texture, and experience.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Outdoor Living Experience */}
      <section className="udgama-final">
        <div className="udgama-final-bg" style={{ backgroundImage: `url(${outdoorImg})` }} />
        <div className="udgama-overlay-gradient" />
        <div className="container udgama-final-content">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8 }}
          >
            <span className="udgama-eyebrow">Outdoor Living Experience</span>
            <p className="final-main-text">Every landscape is designed as a journey—where each space unfolds with purpose, comfort, and quiet luxury. From open outdoor settings to intimate retreats, the experience is shaped to feel natural, immersive, and effortlessly refined.</p>
            <div className="final-sub-text">
               <p>Enclosed greens and shaded seating areas offer a more personal experience. Surrounded by layered planting and soft light, these spaces create a sense of privacy and tranquility.</p>
            </div>
            <h2 className="udgama-title-xl">DESIGNED FOR HOW IT FEELS, NOT JUST HOW IT LOOKS</h2>
            <div className="udgama-final-divider" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const ExperienceBlock = ({ id, title, badge, description, mood, image, animation }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <section ref={ref} className={`udgama-block udgama-block-${id}`}>
      <div className="udgama-block-inner container">
        <div className="udgama-block-content">
          <motion.div 
            className="udgama-block-badge"
            animate={isInView ? { scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {badge}
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {description}
          </motion.p>
          <div className="udgama-mood">
            <span className="mood-label">Mood:</span>
            <span className="mood-value">{mood}</span>
          </div>
        </div>
        <div className="udgama-block-visual">
          <motion.div 
            className="udgama-visual-container"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.img 
              src={image} 
              alt={title}
              animate={animation === 'flow' ? {
                scale: [1, 1.03, 1],
                filter: ["brightness(0.9)", "brightness(1.1)", "brightness(0.9)"]
              } : animation === 'glow' ? {
                filter: ["brightness(0.7) contrast(1.1)", "brightness(1.1) contrast(1.2)", "brightness(0.7) contrast(1.1)"]
              } : {}}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="udgama-visual-overlay" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UdgamaExperience;
