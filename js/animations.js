// Advanced Animations for TGS Website

// Initialize scroll animations
function initializeScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(element => {
        const animation = element.getAttribute('data-animation');
        element.classList.add(animation);
    });
}

// Initialize Intersection Observer for scroll animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class for basic animations
                entry.target.classList.add('visible');

                // Handle specific animation types
                handleSpecificAnimations(entry.target);

                // Stop observing after animation triggers
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const elementsToObserve = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .text-reveal, .stagger-item'
    );

    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// Handle specific animation types
function handleSpecificAnimations(element) {
    const animationType = Array.from(element.classList).find(className =>
        className.includes('fade-in') ||
        className.includes('slide-in') ||
        className.includes('scale-in') ||
        className.includes('text-reveal')
    );

    switch (animationType) {
        case 'text-reveal':
            animateTextReveal(element);
            break;
        case 'stagger-item':
            animateStaggerItem(element);
            break;
    }
}

// Text reveal animation
function animateTextReveal(element) {
    const text = element.textContent;
    element.innerHTML = '';

    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.animationDelay = `${i * 0.05}s`;
        element.appendChild(span);
    }
}

// Stagger item animation
function animateStaggerItem(element) {
    const delay = Array.from(element.parentNode.children).indexOf(element) * 100;
    element.style.animationDelay = `${delay}ms`;
}

// Parallax scrolling effect
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Magnetic button effect
function initializeMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            const strength = 10;

            button.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Gradient animation for elements
function initializeGradientAnimations() {
    const gradientElements = document.querySelectorAll('.animated-gradient-text');

    gradientElements.forEach(element => {
        // Already handled by CSS, but we can add additional JS controls if needed
        element.addEventListener('mouseenter', () => {
            element.style.animationDuration = '1s';
        });

        element.addEventListener('mouseleave', () => {
            element.style.animationDuration = '3s';
        });
    });
}

// Typewriter effect
function initializeTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');

    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '3px solid var(--primary)';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Blinking cursor after typing
                setInterval(() => {
                    element.style.borderRightColor = element.style.borderRightColor === 'transparent' ? 'var(--primary)' : 'transparent';
                }, 500);
            }
        };

        // Start typing when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(element);
    });
}

// Counter animation with intersection observer
function initializeAnimatedCounters() {
    const counterElements = document.querySelectorAll('.countup');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Hover reveal animations
function initializeHoverReveals() {
    const hoverReveals = document.querySelectorAll('.hover-reveal');

    hoverReveals.forEach(reveal => {
        reveal.addEventListener('mouseenter', () => {
            reveal.classList.add('active');
        });

        reveal.addEventListener('mouseleave', () => {
            reveal.classList.remove('active');
        });
    });
}

// Glitch effect on hover
function initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('glitching');
            setTimeout(() => {
                element.classList.remove('glitching');
            }, 500);
        });
    });
}

// Ripple effect for buttons
function initializeRippleEffects() {
    const rippleButtons = document.querySelectorAll('.ripple');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation to styles
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Page transition animations
function initializePageTransitions() {
    // Add transition class to body for page load
    document.body.classList.add('page-loaded');

    // Handle link clicks for smooth transitions
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();

                // Add transition class
                document.body.classList.add('page-transition');

                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
}

// Background pattern animation
function initializeBackgroundPattern() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.animated-bg');

    if (!container) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';

    container.appendChild(canvas);

    let particles = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `rgba(26, 58, 143, ${Math.random() * 0.3})`
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(26, 58, 143, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize all animations
function initializeAllAnimations() {
    initializeScrollAnimations();
    initializeIntersectionObserver();
    initializeParallax();
    initializeMagneticButtons();
    initializeGradientAnimations();
    initializeTypewriter();
    initializeAnimatedCounters();
    initializeHoverReveals();
    initializeGlitchEffects();
    initializeRippleEffects();
    initializePageTransitions();
    initializeBackgroundPattern();
}

// Export for use in main.js
window.Animations = {
    initializeAllAnimations,
    initializeScrollAnimations,
    initializeIntersectionObserver
};