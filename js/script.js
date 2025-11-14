/**
 * Main application entry point
 * Initializes all UI modules and handles component injection
 */
import { initNavbar, setActiveNavLink } from './navbar.js';
import { initFormValidation } from './formValidation.js';
import { initCursor } from './cursor.js';

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Inject navbar from components if header placeholder exists
        const headerContainer = document.getElementById('header');
        if (headerContainer) {
            try {
                const resp = await fetch('components/navbar.html');
                if (resp.ok) {
                    const html = await resp.text();
                    headerContainer.innerHTML = html;
                }
            } catch (err) {
                console.error('Navbar injection failed', err);
            }
        }

        // Inject footer component into placeholder(s)
        document.querySelectorAll('#footer, .footer-placeholder').forEach(async (placeholder) => {
            try {
                const r = await fetch('components/footer.html');
                if (r.ok) placeholder.innerHTML = await r.text();
            } catch (e) {
                console.error('Footer injection failed', e);
            }
        });

        // Wait a bit for DOM to update after injection
        await new Promise(resolve => setTimeout(resolve, 50));

        // Initialize modules with error handling
        try {
            initNavbar();
            setActiveNavLink();
        } catch (err) {
            console.error('Navbar initialization failed:', err);
        }

        // Non-critical modules: load on idle or on demand to improve performance
        try {
            initFormValidation('#contactForm');
        } catch (err) {
            console.error('Form validation initialization failed:', err);
        }

        try {
            initCursor();
        } catch (err) {
            console.error('Cursor initialization failed:', err);
        }

        // Use requestIdleCallback to defer heavy or non-critical module loading
        const schedule = window.requestIdleCallback || function (fn) { return setTimeout(fn, 200); };
        schedule(async () => {
            try {
                if (document.querySelector('.testimonials-carousel')) {
                    const mod = await import('./carousel.js');
                    mod.initCarousel({ selector: '.testimonials-carousel', autoplay: true, interval: 4500 });
                }
            } catch (err) {
                console.error('Lazy carousel load failed:', err);
            }

            try {
                if (document.querySelector('.reveal')) {
                    const mod = await import('./scrollReveal.js');
                    mod.initScrollReveal({ selector: '.reveal' });
                }
            } catch (err) {
                console.error('Lazy scrollReveal load failed:', err);
            }

            try {
                if (document.querySelector('.counter')) {
                    const mod = await import('./counters.js');
                    mod.initCounters('.counter');
                }
            } catch (err) {
                console.error('Lazy counters load failed:', err);
            }
        });

        // Modal: lazy-load on first user interaction with a trigger (delegated)
        (function setupModalDeferred() {
            let modalLoaded = false;
            document.addEventListener('click', async (e) => {
                const trigger = e.target.closest('[data-modal-trigger]');
                if (!trigger) return;
                e.preventDefault();
                if (!modalLoaded) {
                    try {
                            const mod = await import('./modal.js');
                            mod.initModal({ trigger: '[data-modal-trigger]', modal: '.modal', close: '[data-modal-close]' });
                        modalLoaded = true;
                        // Open was prevented; trigger the open now
                        trigger.click();
                    } catch (err) {
                        console.error('Lazy modal load failed:', err);
                    }
                } else {
                    // modal already loaded; let its event handlers run
                    trigger.click();
                }
            }, { once: false });
        }());

        // Smooth internal anchor scrolling with offset
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            });
        });

        // Handle window resize with debounce
        const handleResize = debounce(() => {
            if (window.innerWidth !== window.lastWidth) {
                window.lastWidth = window.innerWidth;
            }
        }, 250);

        window.addEventListener('resize', handleResize);
        window.lastWidth = window.innerWidth;

    } catch (err) {
        console.error('Application initialization error:', err);
    }
});
