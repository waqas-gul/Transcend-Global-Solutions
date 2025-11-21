// Atomic Animations JavaScript

function initAtomicAnimations() {
    createParticles();
    initOrbitalAnimations();
    initFloatingAnimations();
    initConnectionAnimations();
}

// Create background particles
function createParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: var(--primary);
            border-radius: 50%;
            opacity: ${Math.random() * 0.3 + 0.1};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 20 + 10}s infinite linear;
        `;

        heroParticles.appendChild(particle);
    }

    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: ${Math.random() * 0.3 + 0.1};
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                opacity: ${Math.random() * 0.5 + 0.2};
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                opacity: ${Math.random() * 0.3 + 0.1};
            }
            75% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                opacity: ${Math.random() * 0.5 + 0.2};
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
                opacity: ${Math.random() * 0.3 + 0.1};
            }
        }
    `;
    document.head.appendChild(style);
}

// Orbital animations for atoms
function initOrbitalAnimations() {
    const atoms = document.querySelectorAll('.atom');

    atoms.forEach((atom, index) => {
        const electrons = atom.querySelectorAll('.electron');

        electrons.forEach((electron, i) => {
            const delay = i * 2;
            electron.style.animationDelay = `${delay}s`;
        });

        // Add interactive rotation on mouse move
        document.addEventListener('mousemove', function (e) {
            const rect = atom.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const angleX = (e.clientY - centerY) / 50;
            const angleY = (e.clientX - centerX) / 50;

            atom.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
    });
}

// Floating animations for cards and elements
function initFloatingAnimations() {
    const floatingCards = document.querySelectorAll('.float-card');
    const valueOrbs = document.querySelectorAll('.value-orb');

    floatingCards.forEach((card, index) => {
        const delay = index * 0.5;
        card.style.animationDelay = `${delay}s`;

        // Add hover interaction
        card.addEventListener('mouseenter', function () {
            this.style.animationPlayState = 'paused';
        });

        card.addEventListener('mouseleave', function () {
            this.style.animationPlayState = 'running';
        });
    });

    valueOrbs.forEach((orb, index) => {
        const delay = index * 0.3;
        orb.style.animationDelay = `${delay}s`;
    });
}

// Connection animations for globe dots
function initConnectionAnimations() {
    const dots = document.querySelectorAll('.dot');
    const globe = document.querySelector('.globe');

    if (!globe) return;

    // Create connecting lines between dots
    dots.forEach((dot, index) => {
        const nextDot = dots[(index + 1) % dots.length];

        const line = document.createElement('div');
        line.className = 'connection-line';
        line.style.cssText = `
            position: absolute;
            background: var(--gradient);
            height: 2px;
            transform-origin: 0 0;
            z-index: -1;
        `;

        globe.appendChild(line);

        // Update line position
        function updateLine() {
            const dotRect = dot.getBoundingClientRect();
            const nextDotRect = nextDot.getBoundingClientRect();
            const globeRect = globe.getBoundingClientRect();

            const dotX = dotRect.left + dotRect.width / 2 - globeRect.left;
            const dotY = dotRect.top + dotRect.height / 2 - globeRect.top;
            const nextDotX = nextDotRect.left + nextDotRect.width / 2 - globeRect.left;
            const nextDotY = nextDotRect.top + nextDotRect.height / 2 - globeRect.top;

            const distance = Math.sqrt(Math.pow(nextDotX - dotX, 2) + Math.pow(nextDotY - dotY, 2));
            const angle = Math.atan2(nextDotY - dotY, nextDotX - dotX) * 180 / Math.PI;

            line.style.width = `${distance}px`;
            line.style.left = `${dotX}px`;
            line.style.top = `${dotY}px`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.opacity = '0.3';
        }

        // Update on scroll and resize
        window.addEventListener('scroll', updateLine);
        window.addEventListener('resize', updateLine);
        updateLine();
    });
}

// Initialize connection animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initConnectionAnimations, 1000);
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAtomicAnimations,
        createParticles,
        initOrbitalAnimations,
        initFloatingAnimations,
        initConnectionAnimations
    };
}