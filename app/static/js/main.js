document.addEventListener("DOMContentLoaded", () => {


  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
    });

    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
      });
    });
  }

  // Services modal (home page)
  const modal = document.querySelector("#service-modal");
  const modalTitle = document.querySelector("#service-modal-title");
  const modalDesc = document.querySelector("#service-modal-description");
  const modalImg = document.querySelector("#service-modal-image");
  const modalThumbs = document.querySelector("#service-modal-thumbs");
  const modalPrev = document.querySelector("[data-modal-prev]");
  const modalNext = document.querySelector("[data-modal-next]");
  const serviceCards = document.querySelectorAll(".service-card");
  let lastActiveEl = null;
  let activeImages = [];
  let activeIndex = 0;

  function parseImages(card) {
    const raw = (card.dataset.serviceImages || "").trim();
    const list = raw
      ? raw.split(",").map(s => s.trim()).filter(Boolean)
      : [];
    if (list.length) return list;
    return card.dataset.serviceImage ? [card.dataset.serviceImage] : [];
  }

  function setActiveImage(url, title) {
    if (!modalImg) return;
    modalImg.src = url || "";
    modalImg.alt = title ? `${title} preview` : "Service preview";
  }

  function syncThumbActive(idx) {
    if (!modalThumbs) return;
    const thumbs = Array.from(modalThumbs.querySelectorAll(".modal-thumb"));
    thumbs.forEach((el, i) => el.classList.toggle("is-active", i === idx));
  }

  function updateNavButtons() {
    const enabled = activeImages.length > 1;
    if (modalPrev) modalPrev.disabled = !enabled;
    if (modalNext) modalNext.disabled = !enabled;
  }

  function goToIndex(idx, title) {
    if (!activeImages.length) return;
    activeIndex = (idx + activeImages.length) % activeImages.length;
    setActiveImage(activeImages[activeIndex], title);
    syncThumbActive(activeIndex);
    updateNavButtons();
  }

  function renderThumbs(images, title) {
    if (!modalThumbs) return;
    modalThumbs.innerHTML = "";
    if (!images || images.length <= 1) {
      modalThumbs.style.display = "none";
      return;
    }
    modalThumbs.style.display = "flex";

    images.forEach((url, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "modal-thumb";
      btn.setAttribute("aria-label", `${title || "Service"} image ${idx + 1}`);
      btn.dataset.thumbUrl = url;

      const img = document.createElement("img");
      img.src = url;
      img.alt = "";
      img.loading = "lazy";
      btn.appendChild(img);

      btn.addEventListener("click", () => {
        goToIndex(idx, title);
      });

      if (idx === 0) btn.classList.add("is-active");
      modalThumbs.appendChild(btn);
    });
  }

  function openModal({ title, description, images }) {
    if (!modal || !modalTitle || !modalDesc || !modalImg) return;
    lastActiveEl = document.activeElement;
    modalTitle.textContent = title || "";
    modalDesc.textContent = description || "";
    activeImages = Array.isArray(images) ? images.filter(Boolean) : [];
    activeIndex = 0;
    renderThumbs(activeImages, title);
    goToIndex(0, title);

    if (modalPrev) {
      modalPrev.onclick = () => goToIndex(activeIndex - 1, title);
    }
    if (modalNext) {
      modalNext.onclick = () => goToIndex(activeIndex + 1, title);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const closeBtn = modal.querySelector("[data-modal-close]");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (modalImg) modalImg.src = "";
    if (modalThumbs) modalThumbs.innerHTML = "";
    activeImages = [];
    activeIndex = 0;
    updateNavButtons();
    if (lastActiveEl && typeof lastActiveEl.focus === "function") lastActiveEl.focus();
    lastActiveEl = null;
  }

  if (modal) {
    modal.querySelectorAll("[data-modal-close]").forEach(el => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", e => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") {
        const title = modalTitle ? modalTitle.textContent : "";
        if (activeImages.length > 1) goToIndex(activeIndex - 1, title);
      }
      if (e.key === "ArrowRight") {
        const title = modalTitle ? modalTitle.textContent : "";
        if (activeImages.length > 1) goToIndex(activeIndex + 1, title);
      }
    });
  }

  serviceCards.forEach(card => {
    const handler = () => {
      const images = parseImages(card);
      openModal({
        title: card.dataset.serviceTitle,
        description: card.dataset.serviceDescription,
        images,
      });
    };

    card.addEventListener("click", handler);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    });
  });

  // Projects auto-scroll (home page)
  const projectsRow = document.querySelector("#projects-scroll");
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (projectsRow && !prefersReducedMotion) {
    let rafId = null;
    let paused = false;

    const step = () => {
      if (!projectsRow) return;
      if (paused) {
        rafId = null;
        return;
      }
      const maxScroll = projectsRow.scrollWidth - projectsRow.clientWidth;
      if (maxScroll <= 0) {
        // Not scrollable yet (layout not settled) — keep trying.
        rafId = window.requestAnimationFrame(step);
        return;
      }

      // Move a tiny bit per frame
      projectsRow.scrollLeft += 0.5;

      // Loop back seamlessly
      if (projectsRow.scrollLeft >= maxScroll - 1) {
        projectsRow.scrollLeft = 0;
      }

      rafId = window.requestAnimationFrame(step);
    };

    const start = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(step);
    };

    const stop = () => {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = null;
    };

    const pause = () => {
      paused = true;
      stop();
    };

    const resume = () => {
      paused = false;
      start();
    };

    projectsRow.addEventListener("mouseenter", pause);
    projectsRow.addEventListener("mouseleave", resume);
    projectsRow.addEventListener("focusin", pause);
    projectsRow.addEventListener("focusout", resume);
    projectsRow.addEventListener("touchstart", pause, { passive: true });
    projectsRow.addEventListener("touchend", resume);

    start();
  }

  // Lakshmi Kamalam (lotus) sprinkles on home hero
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

  // Project Drawer Logic
  const drawer = document.querySelector("#project-drawer");
  if (drawer) {
    const drawerTitle = document.querySelector("#drawer-title");
    const drawerDesc = document.querySelector("#drawer-description");
    const drawerGallery = document.querySelector("#drawer-gallery");
    const drawerTriggers = document.querySelectorAll(".project-drawer-trigger");
    const closeBtns = drawer.querySelectorAll("[data-drawer-close]");
    let lastActiveBeforeDrawer = null;

    function parseProjectImages(card) {
      const raw = (card.dataset.projectImages || "").trim();
      return raw ? raw.split(",").map(s => s.trim()).filter(Boolean) : [];
    }

    function openDrawer(title, desc, images) {
      if (!drawer) return;
      lastActiveBeforeDrawer = document.activeElement;
      
      if (drawerTitle) drawerTitle.textContent = title || "";
      if (drawerDesc) drawerDesc.textContent = desc || "";
      
      if (drawerGallery) {
        drawerGallery.innerHTML = "";
        images.forEach(url => {
          const div = document.createElement("div");
          div.className = "drawer-item";
          const img = document.createElement("img");
          img.src = url;
          img.alt = "";
          img.loading = "lazy";
          div.appendChild(img);
          drawerGallery.appendChild(div);
        });
      }

      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("drawer-open");
      
      const firstClose = drawer.querySelector(".drawer-close");
      if (firstClose) firstClose.focus();
    }

    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("drawer-open");
      
      // Clear gallery after animation ends
      setTimeout(() => {
        if (!drawer.classList.contains("is-open") && drawerGallery) {
          drawerGallery.innerHTML = "";
        }
      }, 500);

      if (lastActiveBeforeDrawer && typeof lastActiveBeforeDrawer.focus === "function") {
        lastActiveBeforeDrawer.focus();
      }
      lastActiveBeforeDrawer = null;
    }

    closeBtns.forEach(btn => btn.addEventListener("click", closeDrawer));

    document.addEventListener("keydown", e => {
      if (drawer.classList.contains("is-open") && e.key === "Escape") {
        closeDrawer();
      }
    });

    drawerTriggers.forEach(card => {
      const handler = () => {
        const title = card.dataset.projectTitle;
        const desc = card.dataset.projectDescription;
        const images = parseProjectImages(card);
        openDrawer(title, desc, images);
      };
      card.addEventListener("click", handler);
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handler();
        }
      });
    });
  }

  // Add to cart AJAX
  document.querySelectorAll('form.ajax-cart-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      try {
        btn.textContent = 'Adding...';
        btn.disabled = true;
        
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            showToast(data.message, 'success');
            
            // Update cart badges
            document.querySelectorAll('.cart-badge').forEach(badge => {
              badge.textContent = data.cart_count;
              badge.style.display = data.cart_count > 0 ? 'inline-block' : 'none';
              
              // Trigger vibrate animation
              badge.classList.remove('vibrate');
              void badge.offsetWidth; // trigger reflow to restart animation
              badge.classList.add('vibrate');
            });
          }
        } else {
          showToast('Failed to add to cart.', 'error');
        }
      } catch (err) {
        showToast('Error connecting to server.', 'error');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  });

  // Global Toast function
  window.showToast = function(message, category) {
    let container = document.querySelector(".flash-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "flash-container";
      document.body.appendChild(container);
    }
    
    // Ensure container is visible
    container.style.opacity = "1";
    container.style.transform = "none";
    
    const flash = document.createElement("div");
    flash.className = `flash flash-${category}`;
    flash.textContent = message;
    container.appendChild(flash);
    
    scheduleToastFading(flash);
  };

  // Bind existing flashes for fade out
  document.querySelectorAll(".flash").forEach(flash => {
    scheduleToastFading(flash);
  });

  function scheduleToastFading(flash) {
    setTimeout(() => {
      flash.style.opacity = "0";
      flash.style.transform = "translateX(20px)";
      setTimeout(() => flash.remove(), 400);
    }, 3200);
  }
});
