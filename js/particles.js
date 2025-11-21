// Advanced Particle System for TGS Website

class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.animationId = null;
        this.config = {
            particleCount: 50,
            particleColor: 'rgba(26, 58, 143, 0.5)',
            lineColor: 'rgba(26, 58, 143, 0.2)',
            connectionDistance: 100,
            particleSize: { min: 1, max: 3 },
            particleSpeed: { min: 0.1, max: 0.5 },
            responsive: true
        };

        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.resizeCanvas();
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.3;
        `;

        this.container.appendChild(this.canvas);
    }

    resizeCanvas() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
            speedX: (Math.random() - 0.5) * (Math.random() * (this.config.particleSpeed.max - this.config.particleSpeed.min) + this.config.particleSpeed.min),
            speedY: (Math.random() - 0.5) * (Math.random() * (this.config.particleSpeed.max - this.config.particleSpeed.min) + this.config.particleSpeed.min),
            color: this.config.particleColor,
            originalColor: this.config.particleColor
        };
    }

    bindEvents() {
        // Mouse move interaction
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        // Mouse leave
        this.container.addEventListener('mouseleave', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });

        // Window resize
        if (this.config.responsive) {
            window.addEventListener('resize', () => {
                this.resizeCanvas();
                this.repositionParticles();
            });
        }

        // Visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    repositionParticles() {
        this.particles.forEach(particle => {
            particle.x = Math.random() * this.canvas.width;
            particle.y = Math.random() * this.canvas.height;
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.update();
        this.draw();
    }

    update() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }

            // Mouse interaction
            if (this.mouse.x !== undefined && this.mouse.y !== undefined) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    // Repel particles from mouse
                    const angle = Math.atan2(dy, dx);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;

                    particle.x += Math.cos(angle) * force * 2;
                    particle.y += Math.sin(angle) * force * 2;

                    // Change color when near mouse
                    particle.color = 'rgba(248, 183, 57, 0.8)';
                } else {
                    particle.color = particle.originalColor;
                }
            }
        });
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.drawConnections();

        // Draw particles
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);

                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.config.lineColor.replace('0.2', opacity.toFixed(2));
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    // Public methods
    addParticles(count = 1) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    removeParticles(count = 1) {
        this.particles.splice(0, count);
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }

    destroy() {
        this.pause();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Theme-aware particle system
class ThemeAwareParticleSystem extends ParticleSystem {
    constructor(container) {
        super(container);
        this.setThemeColors();
        this.bindThemeEvents();
    }

    setThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        this.config.particleColor = isDark
            ? 'rgba(248, 183, 57, 0.5)'
            : 'rgba(26, 58, 143, 0.5)';

        this.config.lineColor = isDark
            ? 'rgba(248, 183, 57, 0.2)'
            : 'rgba(26, 58, 143, 0.2)';
    }

    bindThemeEvents() {
        window.addEventListener('themeChange', (e) => {
            this.setThemeColors();
            this.updateParticleColors();
        });
    }

    updateParticleColors() {
        this.particles.forEach(particle => {
            particle.originalColor = this.config.particleColor;
            particle.color = this.config.particleColor;
        });
    }
}

// Initialize particle system
function initializeParticles() {
    const particleContainer = document.querySelector('.animated-bg');

    if (particleContainer) {
        window.particleSystem = new ThemeAwareParticleSystem(particleContainer);
    }
}

// Export for use in main.js
window.ParticleSystem = ParticleSystem;
window.ThemeAwareParticleSystem = ThemeAwareParticleSystem;
window.initializeParticles = initializeParticles;