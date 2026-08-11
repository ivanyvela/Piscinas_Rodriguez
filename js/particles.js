"use strict";

export function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let bokehCircles = [];
    let animationFrameId;
    let isVisible = true;
    
    // Mouse interaction state
    const mouse = { x: -1000, y: -1000 };
    const REPULSION_RADIUS = 100;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function createParticles() {
        particles = [];
        const numParticles = 150;
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 0.8 + 0.2,
                opacity: Math.random() * 0.5 + 0.1,
                driftPhase: Math.random() * Math.PI * 2,
                driftSpeed: Math.random() * 0.02 + 0.01
            });
        }

        bokehCircles = [];
        const numBokeh = 8;
        for (let i = 0; i < numBokeh; i++) {
            bokehCircles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 15 + 15,
                speed: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.05 + 0.03,
                driftPhase: Math.random() * Math.PI * 2,
                driftSpeed: Math.random() * 0.01 + 0.005
            });
        }
    }

    function update() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, width, height);

        // Update and draw bokeh
        bokehCircles.forEach(p => {
            if (!prefersReducedMotion) {
                p.y -= p.speed;
                p.x += Math.sin(p.driftPhase) * 0.5;
                p.driftPhase += p.driftSpeed;

                if (p.y + p.radius < 0) {
                    p.y = height + p.radius;
                    p.x = Math.random() * width;
                }
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
        });

        // Update and draw particles
        particles.forEach(p => {
            if (!prefersReducedMotion) {
                p.y -= p.speed;
                p.x += Math.sin(p.driftPhase) * 0.5;
                p.driftPhase += p.driftSpeed;

                // Mouse repulsion
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < REPULSION_RADIUS) {
                    const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;
                    p.x += (dx / dist) * force * 2;
                    p.y += (dy / dist) * force * 2;
                }

                if (p.y + p.radius < 0) {
                    p.y = height + p.radius;
                    p.x = Math.random() * width;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            // Light blue/white variation based on CSS custom properties theme
            const colorR = Math.floor(200 + Math.random() * 55);
            const colorG = Math.floor(230 + Math.random() * 25);
            ctx.fillStyle = `rgba(${colorR}, ${colorG}, 255, ${p.opacity})`;
            ctx.fill();
        });

        if (!prefersReducedMotion) {
            animationFrameId = requestAnimationFrame(update);
        }
    }

    // Event listeners
    window.addEventListener('resize', () => {
        // debounce resize
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            resize();
            createParticles();
            if (prefersReducedMotion) {
                update();
            }
        }, 200);
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if(e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        }
    }, {passive: true});

    document.addEventListener('visibilitychange', () => {
        isVisible = document.visibilityState === 'visible';
        if (isVisible && !prefersReducedMotion) {
            update();
        }
    });

    // Init
    canvas.parentElement.style.willChange = 'transform, opacity';
    resize();
    createParticles();
    update();
}
