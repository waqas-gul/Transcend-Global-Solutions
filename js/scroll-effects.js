// Advanced Scroll Effects for TGS Website - Enhanced Version

class ScrollEffects {
    constructor() {
        this.scrollY = 0;
        this.lastScrollY = 0;
        this.direction = 'down';
        this.sections = [];
        this.animatedElements = [];
        this.observers = [];
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupObservers();
        this.bindEvents();
        this.updateScrollY();
        this.initializeScrollAnimations();
    }

    cacheElements() {
        this.sections = document.querySelectorAll('section');
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        this.stickyElements = document.querySelectorAll('[data-sticky]');
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.progressElements = document.querySelectorAll('[data-scroll-progress]');
    }

    setupObservers() {
        // Enhanced section observer with multiple thresholds
        this.sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const section = entry.target;
                    const progress = entry.intersectionRatio;

                    if (entry.isIntersecting) {
                        this.handleSectionEnter(section, progress);
                    } else {
                        this.handleSectionLeave(section, progress);
                    }

                    // Update section progress
                    this.updateSectionProgress(section, progress);
                });
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                rootMargin: '-50px 0px -50px 0px'
            }
        );

        // Element animation observer
        this.animationObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateOnScroll(entry.target);
                        this.animationObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        // Stagger animation observer
        this.staggerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStaggerGroup(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe all elements
        this.sections.forEach(section => this.sectionObserver.observe(section));
        this.animatedElements.forEach(element => this.animationObserver.observe(element));

        // Observe stagger groups
        document.querySelectorAll('[data-stagger-group]').forEach(group => {
            this.staggerObserver.observe(group);
        });
    }

    bindEvents() {
        // Throttled scroll handler
        this.throttledScroll = this.throttle(this.handleScroll.bind(this), 16);
        window.addEventListener('scroll', this.throttledScroll, { passive: true });

        window.addEventListener('resize', this.handleResize.bind(this));

        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                this.smoothScrollTo(link.getAttribute('href'));
            }
        });
    }

    handleScroll() {
        this.updateScrollY();
        this.updateScrollDirection();
        this.applyAdvancedParallax();
        this.applyStickyElements();
        this.updateProgressIndicators();
        this.updateScrollBasedAnimations();
        this.updateNavbarEffects();
        this.updateCursorEffects();
    }

    handleResize() {
        this.cacheElements();
        this.resetAnimations();
    }

    updateScrollY() {
        this.scrollY = window.pageYOffset;
    }

    updateScrollDirection() {
        this.direction = this.scrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = this.scrollY;
    }

    // Advanced Parallax Effects
    applyAdvancedParallax() {
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
            const direction = element.getAttribute('data-parallax-direction') || 'vertical';
            const trigger = element.getAttribute('data-parallax-trigger') || 'scroll';

            let transformValue = '';

            if (trigger === 'scroll') {
                const yPos = -(this.scrollY * speed);
                transformValue = `translateY(${yPos}px)`;
            } else if (trigger === 'mouse') {
                // Mouse-based parallax (if mouse position is tracked)
                if (this.mouseX !== undefined && this.mouseY !== undefined) {
                    const xPos = (this.mouseX - window.innerWidth / 2) * speed * 0.1;
                    const yPos = (this.mouseY - window.innerHeight / 2) * speed * 0.1;
                    transformValue = `translate(${xPos}px, ${yPos}px)`;
                }
            }

            if (direction === 'horizontal') {
                const xPos = -(this.scrollY * speed);
                transformValue = `translateX(${xPos}px)`;
            } else if (direction === 'both') {
                const xPos = -(this.scrollY * speed * 0.5);
                const yPos = -(this.scrollY * speed);
                transformValue = `translate(${xPos}px, ${yPos}px)`;
            }

            element.style.transform = transformValue;
        });
    }

    applyStickyElements() {
        this.stickyElements.forEach(element => {
            const stickyStart = parseInt(element.getAttribute('data-sticky-start')) || 0;
            const stickyEnd = parseInt(element.getAttribute('data-sticky-end')) || Infinity;
            const offset = parseInt(element.getAttribute('data-sticky-offset')) || 0;

            if (this.scrollY >= stickyStart && this.scrollY <= stickyEnd) {
                element.style.position = 'fixed';
                element.style.top = `${offset}px`;
                element.style.zIndex = '1000';
                element.classList.add('sticky-active');
            } else {
                element.style.position = '';
                element.style.top = '';
                element.style.zIndex = '';
                element.classList.remove('sticky-active');
            }
        });
    }

    // Section-based Animations
    handleSectionEnter(section, progress) {
        section.classList.add('section-visible');

        // Trigger entrance animations
        this.triggerSectionEntrance(section);

        // Update active navigation
        this.updateActiveNavigation(section.id);

        // Dispatch custom event
        section.dispatchEvent(new CustomEvent('sectionEnter', {
            detail: { progress, direction: this.direction }
        }));
    }

    handleSectionLeave(section, progress) {
        if (progress === 0) {
            section.classList.remove('section-visible');
        }

        section.dispatchEvent(new CustomEvent('sectionLeave', {
            detail: { progress, direction: this.direction }
        }));
    }

    updateSectionProgress(section, progress) {
        section.style.setProperty('--scroll-progress', progress);

        // Update any progress bars within the section
        const progressBars = section.querySelectorAll('.scroll-progress');
        progressBars.forEach(bar => {
            bar.style.width = `${progress * 100}%`;
        });
    }

    // Element Animation System
    initializeScrollAnimations() {
        // Add initial classes for CSS animations
        this.animatedElements.forEach(element => {
            const animation = element.getAttribute('data-animate');
            element.classList.add(`animate-${animation}`);
        });
    }

    animateOnScroll(element) {
        const animation = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-animate-delay') || 0;
        const duration = element.getAttribute('data-animate-duration') || '0.6s';

        element.style.animationDelay = delay;
        element.style.animationDuration = duration;
        element.classList.add('animate-in');

        // Remove animation class after completion for replay capability
        if (element.getAttribute('data-animate-repeat') === 'true') {
            element.addEventListener('animationend', () => {
                element.classList.remove('animate-in');
            }, { once: true });
        }
    }

    animateStaggerGroup(group) {
        const items = group.querySelectorAll('[data-stagger-item]');
        const staggerDelay = parseFloat(group.getAttribute('data-stagger-delay')) || 0.1;

        items.forEach((item, index) => {
            item.style.animationDelay = `${index * staggerDelay}s`;
            item.classList.add('animate-in');
        });
    }

    // Progress Indicators
    updateProgressIndicators() {
        this.progressElements.forEach(element => {
            const start = parseInt(element.getAttribute('data-scroll-start')) || 0;
            const end = parseInt(element.getAttribute('data-scroll-end')) || document.documentElement.scrollHeight;
            const progress = (this.scrollY - start) / (end - start);
            const clampedProgress = Math.max(0, Math.min(1, progress));

            element.style.width = `${clampedProgress * 100}%`;
            element.setAttribute('data-progress', clampedProgress);
        });
    }

    // Scroll-based Dynamic Animations
    updateScrollBasedAnimations() {
        // Scale elements based on scroll
        document.querySelectorAll('[data-scale-on-scroll]').forEach(element => {
            const startScale = parseFloat(element.getAttribute('data-scale-start')) || 1;
            const endScale = parseFloat(element.getAttribute('data-scale-end')) || 0.5;
            const startScroll = parseInt(element.getAttribute('data-scale-scroll-start')) || 0;
            const endScroll = parseInt(element.getAttribute('data-scale-scroll-end')) || 1000;

            const progress = (this.scrollY - startScroll) / (endScroll - startScroll);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            const scale = startScale + (endScale - startScale) * clampedProgress;

            element.style.transform = `scale(${scale})`;
        });

        // Rotate elements based on scroll
        document.querySelectorAll('[data-rotate-on-scroll]').forEach(element => {
            const rotation = (this.scrollY * 0.1) % 360;
            element.style.transform = `rotate(${rotation}deg)`;
        });

        // Fade elements based on scroll
        document.querySelectorAll('[data-fade-on-scroll]').forEach(element => {
            const startScroll = parseInt(element.getAttribute('data-fade-start')) || 0;
            const endScroll = parseInt(element.getAttribute('data-fade-end')) || 500;

            const progress = (this.scrollY - startScroll) / (endScroll - startScroll);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            const opacity = 1 - clampedProgress;

            element.style.opacity = opacity;
        });
    }

    // Navigation Effects
    updateNavbarEffects() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        // Background opacity based on scroll
        const opacity = Math.min(this.scrollY / 200, 0.95);
        navbar.style.backgroundColor = `rgba(18, 18, 18, ${opacity})`;

        // Scale down logo on scroll
        const logo = navbar.querySelector('.nav-logo');
        if (logo) {
            const scale = Math.max(0.8, 1 - (this.scrollY / 1000));
            logo.style.transform = `scale(${scale})`;
        }

        // Hide/show navbar based on scroll direction
        if (this.scrollY > 100) {
            if (this.direction === 'down' && this.scrollY > this.lastScrollY + 50) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    }

    // Cursor/Scroll Effects
    updateCursorEffects() {
        // Tilt effect on elements with mouse movement
        document.querySelectorAll('[data-tilt]').forEach(element => {
            if (this.mouseX !== undefined && this.mouseY !== undefined) {
                const rect = element.getBoundingClientRect();
                const x = (this.mouseX - rect.left) / rect.width - 0.5;
                const y = (this.mouseY - rect.top) / rect.height - 0.5;

                const tiltX = y * 10; // Vertical mouse movement affects horizontal tilt
                const tiltY = x * -10; // Horizontal mouse movement affects vertical tilt

                element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            }
        });
    }

    // Smooth Scroll Functionality
    smoothScrollTo(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80; // Offset for navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Easing function
            const ease = this.easeOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    // Utility Functions
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    updateActiveNavigation(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    resetAnimations() {
        // Re-observe elements after resize
        this.animatedElements.forEach(element => {
            this.animationObserver.observe(element);
        });
    }

    // Mouse tracking for parallax
    trackMouse() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    // Public methods
    scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        this.smoothScrollToPosition(elementPosition);
    }

    smoothScrollToPosition(position) {
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    }

    getScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        return this.scrollY / (documentHeight - windowHeight);
    }

    // Destroy and cleanup
    destroy() {
        window.removeEventListener('scroll', this.throttledScroll);
        window.removeEventListener('resize', this.handleResize);

        if (this.sectionObserver) {
            this.sections.forEach(section => {
                this.sectionObserver.unobserve(section);
            });
        }

        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }

        if (this.staggerObserver) {
            this.staggerObserver.disconnect();
        }
    }
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.scrollEffects = new ScrollEffects();
        window.scrollEffects.trackMouse(); // Enable mouse tracking

        console.log('Scroll effects initialized successfully');
    } catch (error) {
        console.error('Failed to initialize scroll effects:', error);
    }
});

// Export for use in other modules
window.ScrollEffects = ScrollEffects;