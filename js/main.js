// Fate命定指冠 Main JavaScript
// Theme toggle, animations, and interactive features

(function() {
    'use strict';

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initThemeToggle();
        initScrollEffects();
        initMobileNav();
        initDynamicBackground();
    });

    /**
     * Dynamic Background - PC vs Android adaptive
     */
    function initDynamicBackground() {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const baseUrl = isAndroid ? 'https://pic2.rkn.cc.cd/' : 'https://pic.rkn.cc.cd/';
        // Add timestamp to get a random image each time
        const bgUrl = `${baseUrl}?t=${Date.now()}`;
        document.body.style.backgroundImage = `url('${bgUrl}')`;
    }

    /**
     * Theme Toggle Functionality
     */
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Get saved theme or use system preference
        const savedTheme = localStorage.getItem('Fate命定指冠-theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        // Toggle on click
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('Fate命定指冠-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const sunIcon = document.querySelector('.icon-sun');
        const moonIcon = document.querySelector('.icon-moon');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = theme === 'light' ? 'inline-block' : 'none';
            moonIcon.style.display = theme === 'dark' ? 'inline-block' : 'none';
        }
    }

    /**
     * Scroll Effects
     */
    function initScrollEffects() {
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    /**
     * Mobile Navigation (simple toggle)
     */
    function initMobileNav() {
        // For future mobile menu implementation
    }

    /**
     * Utility Functions
     */
    
    // Format date
    window.formatDate = function(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Scroll to top
    window.scrollToTop = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Copy to clipboard
    window.copyToClipboard = function(text, element) {
        navigator.clipboard.writeText(text).then(function() {
            const originalText = element.textContent;
            element.textContent = '已复制!';
            setTimeout(function() {
                element.textContent = originalText;
            }, 2000);
        });
    };

})();
