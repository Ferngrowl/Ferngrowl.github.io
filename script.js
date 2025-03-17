document.addEventListener('DOMContentLoaded', () => {
    // Utility functions
    const toggle = (el, cls) => el?.classList.toggle(cls);
    const select = selector => document.querySelector(selector);
    const selectAll = selector => document.querySelectorAll(selector);
    
    // Elements
    const carousel = select('.project-carousel');
    const nav = select('.navigation-bar');
    const navLinks = selectAll('.navigation-links a');
    const backToTop = select('.back-to-top');
    const sections = selectAll('section[id]');
    
    // Variables
    let isDragging = false;
    let startX, scrollLeft;
    let lastScrollTop = 0;
    let scrollTimeout;
  
    // Dark Mode
    const darkToggle = select('#darkModeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const setDark = dark => {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      localStorage.setItem('darkMode', dark);
      
      // Update icon
      const icon = darkToggle?.querySelector('.icon');
      if (icon) {
        icon.innerHTML = dark ? 
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' : 
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
      }
    };
    
    darkToggle?.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setDark(!isDark);
    });
    
    // Initialize dark mode based on localStorage or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    setDark(savedDarkMode === null ? prefersDark : savedDarkMode === 'true');
  
    // Mobile Menu Toggle
    select('.mobile-menu-toggle')?.addEventListener('click', () => {
      toggle(select('.navigation-links'), 'active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', e => {
      const mobileMenu = select('.navigation-links.active');
      const mobileToggle = select('.mobile-menu-toggle');
      
      if (mobileMenu && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
      }
    });
  
    // Project Carousel
    if (carousel) {
      const dragStart = e => {
        isDragging = true;
        carousel.classList.add('dragging');
        startX = e.pageX || e.touches?.[0].pageX;
        scrollLeft = carousel.scrollLeft;
      };
      
      const drag = e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX || e.touches?.[0].pageX;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
      };
      
      const dragEnd = () => {
        isDragging = false;
        carousel.classList.remove('dragging');
      };
      
      // Carousel navigation buttons
      const btnPrev = select('.carousel-prev');
      const btnNext = select('.carousel-next');
      
      if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
          const cardWidth = carousel.querySelector('.project-card').offsetWidth + 24; // card + gap
          carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
        
        btnNext.addEventListener('click', () => {
          const cardWidth = carousel.querySelector('.project-card').offsetWidth + 24; // card + gap
          carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
      }
      
      ['mousedown', 'touchstart'].forEach(e => carousel.addEventListener(e, dragStart));
      ['mousemove', 'touchmove'].forEach(e => carousel.addEventListener(e, drag));
      ['mouseup', 'touchend', 'mouseleave'].forEach(e => carousel.addEventListener(e, dragEnd));
    }
  
    // Smooth Scroll
    selectAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        
        // Close mobile menu if open
        const mobileMenu = select('.navigation-links.active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        
        // Scroll to section
        const targetId = anchor.getAttribute('href');
        const targetSection = select(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth', 
            block: 'start'
          });
        }
      });
    });
    
    // Hide/Show navigation on scroll
    let prevScrollPos = window.scrollY;
    
    const handleScroll = () => {
      // Back to top button visibility
      if (backToTop) {
        if (window.scrollY > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
      
      // Hide/show navigation bar
      const currentScrollPos = window.scrollY;
      if (prevScrollPos > currentScrollPos || currentScrollPos < 50) {
        nav?.classList.remove('scrolled');
        setTimeout(() => {
          nav?.classList.add('visible');
        }, 50);
      } else {
        nav?.classList.add('scrolled');
        nav?.classList.remove('visible');
      }
      prevScrollPos = currentScrollPos;
      
      // Active section highlighting
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (currentScrollPos >= sectionTop && currentScrollPos < sectionTop + sectionHeight) {
          current = `#${section.getAttribute('id')}`;
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === current) {
          link.classList.add('active');
        }
      });
      
      // Reveal animations
      selectAll('.reveal').forEach(reveal => {
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (revealTop < window.innerHeight - revealPoint) {
          reveal.classList.add('active');
        }
      });
    };
    
    // Back to top functionality
    backToTop?.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Throttled scroll event
    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 100);
      }
    });
    
    // Initial call to set active state
    handleScroll();
    
    // Add reveal class to elements
    const elementsToReveal = [
      '.about-container > *', 
      '.project-card', 
      '.skill-category', 
      '.timeline-item', 
      '.contact-method'
    ];
    
    elementsToReveal.forEach(selector => {
      selectAll(selector).forEach(el => {
        el.classList.add('reveal');
      });
    });
    
    // Resize handler for carousel
    window.addEventListener('resize', () => {
      if (carousel) {
        // Reset scroll position when switching between mobile and desktop
        carousel.scrollLeft = 0;
      }
    });
  });