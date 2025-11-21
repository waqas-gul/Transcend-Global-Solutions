// Main JavaScript file for TGS Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeWebsite();
    setupEventListeners();
    initializeComponents();
});

// Website Initialization
function initializeWebsite() {
    // Initialize theme
    initializeTheme();

    // Initialize loading screen
    initializeLoadingScreen();

    // Initialize counters
    initializeCounters();

    // Initialize forms
    initializeForms();
}

// Event Listeners Setup
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Scroll to top button
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        scrollToTop.addEventListener('click', scrollToTopHandler);
    }

    // Service tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Scroll events
    window.addEventListener('scroll', handleScroll);

    // Resize events
    window.addEventListener('resize', handleResize);
}

// Component Initialization
function initializeComponents() {
    // Initialize particle system
    if (typeof initializeParticles === 'function') {
        initializeParticles();
    }

    // Initialize scroll animations
    if (typeof initializeScrollAnimations === 'function') {
        initializeScrollAnimations();
    }

    // Initialize mobile navigation
    initializeMobileNavigation();
}

// Mobile Navigation - SINGLE VERSION
function initializeMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    console.log('Mobile nav elements:', { navToggle, navMenu });

    if (!navToggle || !navMenu) {
        console.error('Mobile navigation elements not found');
        return;
    }

    // Toggle mobile menu
    navToggle.addEventListener('click', function (e) {
        e.stopPropagation();

        const isActive = navMenu.classList.contains('active');

        if (isActive) {
            // Close menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = '';
        } else {
            // Open menu
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            body.style.overflow = 'hidden';
        }
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.querySelector('.loading-progress');

    if (loadingScreen && loadingProgress) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
            loadingProgress.style.width = `${progress}%`;
        }, 100);
    }
}

// Counters Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function startCounter(counter) {
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

// Service Tabs
function switchTab(event) {
    event.preventDefault();

    const tabButton = event.currentTarget;
    const tabId = tabButton.getAttribute('data-tab');

    // Update active tab button
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    tabButton.classList.add('active');

    // Update active tab content
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));

    const activePane = document.getElementById(tabId);
    if (activePane) {
        activePane.classList.add('active');
    }
}

// Contact Form Handling
function initializeForms() {
    // Add floating label functionality
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (input) {
            // Check if input has value on load
            if (input.value) {
                group.classList.add('focused');
            }

            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    group.classList.remove('focused');
                }
            });
        }
    });
}

function handleContactForm(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.querySelector('span').textContent;

    // Simulate form submission
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'Sending...';

    // In a real application, you would send the data to a server here
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! We will get back to you soon.', 'success');

        // Reset form
        form.reset();

        // Reset button
        submitButton.disabled = false;
        submitButton.querySelector('span').textContent = originalText;

        // Remove focused class from form groups
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('focused'));
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-secondary);
        border-left: 4px solid var(--${type});
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Scroll Handling
function handleScroll() {
    // Update navigation
    updateNavbarOnScroll();
    updateActiveNavLink();

    // Show/hide scroll to top button
    toggleScrollToTop();

    // Trigger scroll animations
    triggerScrollAnimations();
}

function updateNavbarOnScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function toggleScrollToTop() {
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        if (window.scrollY > 500) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    }
}

function scrollToTopHandler() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function triggerScrollAnimations() {
    // This would trigger your scroll-based animations
    // You can integrate with your scroll-effects.js here
}

// Resize Handling
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 1024) {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Reinitialize components if needed
    initializeComponents();
}

// Export functions for use in other modules
window.TGS = {
    toggleTheme,
    showNotification,
    initializeCounters
};