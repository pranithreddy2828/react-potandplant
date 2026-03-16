document.addEventListener("DOMContentLoaded", () => {
  const flashContainer = document.querySelector(".flash-container");
  if (flashContainer) {
    setTimeout(() => {
      flashContainer.style.opacity = "0";
      flashContainer.style.transform = "translateY(-4px)";
    }, 3200);
  }

  // Scroll reveal animations
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: make all visible
    revealEls.forEach(el => el.classList.add("visible"));
  }

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
});

