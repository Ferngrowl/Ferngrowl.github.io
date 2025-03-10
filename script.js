// Carousel functionality and animations
document.addEventListener("DOMContentLoaded", function() {
  // ----- CAROUSEL IMPLEMENTATION -----
  const carouselElement = document.querySelector('.project-carousel');
  if (!carouselElement) return;

  // State variables
  let isDragging = false;
  let startPosition = 0;
  let scrollLeftStart = 0;
  let velocity = 0;
  let lastPosition = 0;
  let lastTime = 0;
  let animationFrame = null;

  // Constants
  const DRAG_SENSITIVITY = 1.2;
  const MOMENTUM_DECAY = 0.95;
  const MOMENTUM_THRESHOLD = 2;

  // Mouse events
  carouselElement.addEventListener('mousedown', startDrag);
  carouselElement.addEventListener('mousemove', drag);
  carouselElement.addEventListener('mouseup', endDrag);
  carouselElement.addEventListener('mouseleave', endDrag);
  
  // Touch events
  carouselElement.addEventListener('touchstart', handleTouchStart);
  carouselElement.addEventListener('touchmove', handleTouchMove);
  carouselElement.addEventListener('touchend', endDrag);
  carouselElement.addEventListener('touchcancel', endDrag);

  // Functions
  function startDrag(event) {
    isDragging = true;
    carouselElement.classList.add('dragging');
    startPosition = getPositionX(event);
    scrollLeftStart = carouselElement.scrollLeft;
    cancelMomentumTracking();
  }

  function drag(event) {
    if (!isDragging) return;
    event.preventDefault();
    
    const currentPosition = getPositionX(event);
    const delta = (currentPosition - startPosition) * DRAG_SENSITIVITY;
    carouselElement.scrollLeft = scrollLeftStart - delta;
    applyRubberBandEffect();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    carouselElement.classList.remove('dragging');
    initiateMomentumTracking();
    snapToNearestCard();
  }

  function handleTouchStart(event) {
    startDrag({
      preventDefault: () => {},
      pageX: event.touches[0].pageX
    });
  }

  function handleTouchMove(event) {
    drag({
      preventDefault: () => {},
      pageX: event.touches[0].pageX
    });
  }

  function getPositionX(event) {
    return event.pageX - carouselElement.offsetLeft;
  }

  // Physics helpers
  function trackMomentum() {
    const now = Date.now();
    const elapsed = now - lastTime;
    
    if (elapsed > 0) {
      const position = carouselElement.scrollLeft;
      velocity = (position - lastPosition) / elapsed;
      lastPosition = position;
      lastTime = now;
    }
    
    animationFrame = requestAnimationFrame(trackMomentum);
  }

  function applyMomentum() {
    if (Math.abs(velocity) < MOMENTUM_THRESHOLD) return;
    
    carouselElement.scrollLeft += velocity * 15;
    velocity *= MOMENTUM_DECAY;
    
    if (Math.abs(velocity) > 0.5) {
      requestAnimationFrame(applyMomentum);
    }
  }

  function initiateMomentumTracking() {
    lastTime = Date.now();
    lastPosition = carouselElement.scrollLeft;
    animationFrame = requestAnimationFrame(trackMomentum);
    setTimeout(applyMomentum, 10);
  }

  function cancelMomentumTracking() {
    cancelAnimationFrame(animationFrame);
    velocity = 0;
  }

  function applyRubberBandEffect() {
    const maxScroll = carouselElement.scrollWidth - carouselElement.clientWidth;
    const currentScroll = carouselElement.scrollLeft;
    const resistance = 0.3;

    if (currentScroll < 0) {
      carouselElement.scrollLeft = currentScroll * resistance;
    } else if (currentScroll > maxScroll) {
      carouselElement.scrollLeft = maxScroll + (currentScroll - maxScroll) * resistance;
    }
  }

  function snapToNearestCard() {
    const cards = Array.from(carouselElement.children).filter(
      el => el.classList.contains('project-card')
    );
    
    if (cards.length === 0) return;
    
    const carouselCenter = carouselElement.scrollLeft + (carouselElement.offsetWidth / 2);
    const carouselRect = carouselElement.getBoundingClientRect();

    let closest = {
      distance: Infinity,
      element: cards[0]
    };

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width/2 - carouselRect.left;
      const distance = Math.abs(carouselCenter - cardCenter);
      
      if (distance < closest.distance) {
        closest = { distance, element: card };
      }
    });

    const targetScroll = closest.element.offsetLeft - 
      (carouselElement.offsetWidth/2 - closest.element.offsetWidth/2);

    carouselElement.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }

  // Window blur safety
  window.addEventListener('blur', () => {
    if (isDragging) {
      isDragging = false;
      carouselElement.classList.remove('dragging');
      cancelMomentumTracking();
    }
  });

  // ----- SCROLL ANIMATIONS -----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // ----- NAVIGATION ENHANCEMENT -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const navHeight = document.querySelector('.navigation-bar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});