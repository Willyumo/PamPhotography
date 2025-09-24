document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scroll-container');
  const strips = scrollContainer.querySelectorAll('.strip, .strip-portrait');
  const maxScale = 1.5;
  const minScale = 0.5;
  const centerLeeway = scrollContainer.offsetWidth / 1.8;

  // --- Carousel Dots ---
  const dotsContainer = document.getElementById('carousel-dots');
  const totalStrips = strips.length;


// Clear container first 
dotsContainer.innerHTML = '';

// Pre-create dots
// Create dots for middle items only (skip first and last)
for (let i = 0; i < totalStrips - 1; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dotsContainer.appendChild(dot);
}
  const dots = dotsContainer.querySelectorAll('.dot');

  if (dots.length > 0) {
    dots[0].remove(); // remove first dot
  }
  // --- End Carousel Dots ---

  // --- Update center focus & dots ---
  function updateCenterFocus() {
    const containerRect = scrollContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    strips.forEach((strip, i) => {
      const rect = strip.getBoundingClientRect();
      const stripCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - stripCenter);

      // Scale calculation
      let scale = maxScale - (distance / centerLeeway) * (maxScale - minScale);
      scale = Math.min(Math.max(scale, minScale), maxScale);
      strip.style.transform = `scale(${scale})`;
      strip.style.zIndex = scale > 1.3 ? 10 : 1;

      // Track closest image for dots
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    // Update dots efficiently
    dots.forEach((dot, i) => dot.classList.toggle('active', i === closestIndex));
  }

  // --- Throttle scroll updates ---
  let ticking = false;
  scrollContainer.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateCenterFocus();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial update
  updateCenterFocus();

  // --- Arrow buttons ---
  const leftArrow = document.querySelector('.carousel-arrow.left');
  const rightArrow = document.querySelector('.carousel-arrow.right');
  const scrollAmount = 300;

  leftArrow.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // --- Optional wheel scrolling ---
  scrollContainer.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY;
    }
  }, { passive: false });



  
  // --- Contact message randomizer ---
  const messages = [
    "Interested in working together or have a question? Feel free to reach out with any inquiries, collaboration ideas, or booking requests — I’d love to hear from you.",
    "Whether you're ready to book a session, explore a creative collaboration, or simply want to connect — don't hesitate to get in touch. I look forward to hearing from you!",
    "Have a project in mind or a question to ask? Let’s connect. I’m always open to new ideas, collaborations, and creative conversations.",
  ];

  function randomizeMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const messageEl = document.getElementById("contact-message");
    if (messageEl) {
      messageEl.textContent = messages[randomIndex];
    } else {
      console.error("Element with ID 'contact-message' not found.");
    }
  }

  randomizeMessage();

  const messageEl = document.getElementById("contact-message");
  if (messageEl) {
    messageEl.addEventListener("click", randomizeMessage);
  }
  // --- End Contact message randomizer ---

  // Move title outside container on mobile
  function moveTitleOnMobile() {
    const title = document.getElementById('scroll-title');
    const section = document.getElementById('scroll-section');
    if (!title || !section) return;

    if (window.innerWidth <= 767) {
      if (title.parentElement !== section) {
        section.insertBefore(title, section.firstChild);
      }
    } else {
      const carouselContainer = document.querySelector('.carousel-container');
      if (carouselContainer && title.parentElement !== carouselContainer) {
        carouselContainer.insertBefore(title, carouselContainer.firstChild);
      }
    }
  }

  moveTitleOnMobile();
  window.addEventListener('resize', moveTitleOnMobile);

});
