// Theme Manager JavaScript for TGS Website

document.addEventListener('DOMContentLoaded', function () {
    initThemeManager();
    console.log('TGS theme manager initialized');
});

// Theme management functionality
function initThemeManager() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    setTheme(currentTheme);

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Set theme function
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
}

// Get current theme
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
}

// Theme change listener for other components
window.addEventListener('themeChange', function (e) {
    console.log(`Theme changed to: ${e.detail.theme}`);

    // You can add additional theme change handlers here
    // For example, update charts, maps, or other theme-dependent components
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initThemeManager,
        setTheme,
        getCurrentTheme
    };
}