"use strict";

export function initParallax() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 1. Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Handle counters
                    if (entry.target.hasAttribute('data-count-to') && !entry.target.classList.contains('counted')) {
                        animateCounter(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 2. Navbar Scroll Detection
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    // 3. Parallax Elements
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    let ticking = false;

    function onScroll() {
        lastScrollY = window.scrollY;

        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollEffects();
                ticking = false;
            });
            ticking = true;
        }
    }

    function updateScrollEffects() {
        // Navbar
        if (navbar) {
            if (lastScrollY > 50) {
                navbar.classList.add('navbar--scrolled');
            } else {
                navbar.classList.remove('navbar--scrolled');
            }
        }

        // Parallax
        if (!prefersReducedMotion) {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.3;
                const rect = el.getBoundingClientRect();
                
                // Only animate if in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Calculate offset based on center of viewport
                    const centerY = rect.top + (rect.height / 2);
                    const viewportCenter = window.innerHeight / 2;
                    const offset = (centerY - viewportCenter) * speed;
                    
                    el.style.transform = `translateY(${offset}px)`;
                }
            });
        }
    }

    function animateCounter(element) {
        element.classList.add('counted');
        if (prefersReducedMotion) {
            element.innerText = element.getAttribute('data-count-to');
            return;
        }

        const target = parseInt(element.getAttribute('data-count-to'), 10);
        const duration = 2000; // ms
        const start = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            element.innerText = Math.floor(easeProgress * target);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.innerText = target;
            }
        }

        requestAnimationFrame(updateCount);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial check
    updateScrollEffects();
}
