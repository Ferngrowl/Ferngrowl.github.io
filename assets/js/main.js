document.addEventListener('DOMContentLoaded', () => {
    // Utility functions
    const toggle = (el, cls) => el?.classList.toggle(cls);
    const select = selector => document.querySelector(selector);
    const selectAll = selector => document.querySelectorAll(selector);
    
    // Initialize navigation
    const initNavigation = () => {
        const nav = select('.navigation-bar');
        const backToTop = select('.back-to-top');
        const mobileMenuToggle = select('.mobile-menu-toggle');
        const navigationLinks = select('#navigation-links-ul');
        
        // Define SVG icons for hamburger and close
        const hamburgerIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        const closeIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

        // Mobile menu handling
        mobileMenuToggle?.addEventListener('click', () => {
            const isOpen = navigationLinks.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            // Change icon based on menu state
            if (isOpen) {
                mobileMenuToggle.innerHTML = closeIconSVG;
            } else {
                mobileMenuToggle.innerHTML = hamburgerIconSVG;
            }
        });
        
        document.addEventListener('click', e => {
            if (navigationLinks?.classList.contains('active') && 
                !navigationLinks.contains(e.target) && 
                !mobileMenuToggle?.contains(e.target)) {
                navigationLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.innerHTML = hamburgerIconSVG; // Reset icon when closing by clicking outside
            }
        });

        // Scroll handling
        let lastScrollTop = 0;
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            
            // Back to top button
            if (backToTop) {
                backToTop.classList.toggle('visible', currentScroll > 300);
            }
            
            // Navigation bar
            if (nav) {
                if (currentScroll <= 0) {
                    nav.classList.remove('scrolled');
                } else if (currentScroll > lastScrollTop && !nav.classList.contains('scrolled')) {
                    nav.classList.add('scrolled');
                } else if (currentScroll < lastScrollTop && nav.classList.contains('scrolled')) {
                    nav.classList.remove('scrolled');
                }
            }
            
            lastScrollTop = currentScroll;
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleScroll);
        });

        // Back to top click handler
        backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // Initialize theme handling
    const initTheme = () => {
        const desktopToggle = select('#darkModeToggleDesktop');
        const mobileToggle = select('#darkModeToggleMobile');
        const allToggles = [desktopToggle, mobileToggle].filter(Boolean); // Filter out nulls if one doesn't exist

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const setDark = dark => {
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
            localStorage.setItem('theme', dark ? 'dark' : 'light');
            
            // Update icons for both toggles
            allToggles.forEach(toggleButton => {
                const icon = toggleButton.querySelector('.icon');
                if (icon) {
                    icon.innerHTML = dark ? 
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' :
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
                }
            });
        };
        
        allToggles.forEach(toggleButton => {
            toggleButton.addEventListener('click', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                setDark(!isDark);
            });
        });
        
        // Set initial theme
        const savedTheme = localStorage.getItem('theme');
        setDark(savedTheme === null ? prefersDark : savedTheme === 'dark');

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                setDark(e.matches);
            }
        });
    };

    // Initialize form handling
    const initForms = () => {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Let the form submit naturally to Formsubmit
                // Formsubmit will handle the redirect
            });
        }
    };

    // Initialize all components
    initNavigation();
    initTheme();
    initForms();
});