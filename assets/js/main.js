/**
 * Eshaan Sood - Personal Website
 * Main JavaScript - Animations, Navigation, and Interactions
 */

(function() {
    'use strict';

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Cursor Glow Effect
     */
    function initCursorGlow() {
        if (prefersReducedMotion) return;
        
        const glow = document.querySelector('.cursor-glow');
        if (!glow) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            const ease = 0.1;
            currentX += (mouseX - currentX) * ease;
            currentY += (mouseY - currentY) * ease;
            glow.style.left = currentX + 'px';
            glow.style.top = currentY + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        // Hide on mobile
        if (window.innerWidth < 768) {
            glow.style.display = 'none';
        }
    }

    /**
     * Mobile Navigation
     */
    function initMobileNav() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.getElementById('nav-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            menu.classList.toggle('active');
            document.body.style.overflow = expanded ? '' : 'hidden';
        });

        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Smooth Scroll
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                    
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    /**
     * Active Navigation
     */
    function initActiveNav() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            const href = link.getAttribute('href');
            if (href === filename || (filename === '' && href === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Scroll-triggered Animations
     */
    function initScrollAnimations() {
        if (prefersReducedMotion) {
            document.querySelectorAll('.animate-in').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.highlight-card, .project-card, .currently-card, .case-study, .resume-block, .album-card, .philosophy-point').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
            observer.observe(el);
        });

        const style = document.createElement('style');
        style.textContent = `.highlight-card, .project-card, .currently-card, .case-study, .resume-block, .album-card, .philosophy-point { &:nth-child(n) { } }`;
        document.head.appendChild(style);

        // Trigger animation when observed
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    animObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.highlight-card, .project-card, .currently-card, .case-study, .resume-block, .philosophy-point').forEach(el => {
            animObserver.observe(el);
        });
    }

    /**
     * Card Tilt Effect
     */
    function initCardTilt() {
        if (prefersReducedMotion || window.innerWidth < 768) return;

        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * Contact Form
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('This form is a placeholder. Please email me directly at eshaan@example.com');
        });
    }

    /**
     * Header scroll effect
     */
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.background = 'rgba(10, 10, 11, 0.95)';
            } else {
                header.style.background = 'rgba(10, 10, 11, 0.8)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Initialize
     */
    function init() {
        initCursorGlow();
        initMobileNav();
        initSmoothScroll();
        initActiveNav();
        initScrollAnimations();
        initCardTilt();
        initContactForm();
        initHeaderScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
