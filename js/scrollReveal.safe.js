// scrollReveal.safe.js - IntersectionObserver based reveal (safer replacement)
/**
 * Initialize scroll reveal animations using IntersectionObserver.
 * @param {Object} options
 * @param {string} options.selector - selector for elements to reveal
 * @param {string} options.rootMargin - rootMargin for IntersectionObserver
 * @param {number} options.threshold - threshold for IntersectionObserver
 */
export function initScrollReveal(options = {}) {
    const selector = options.selector || '.reveal';
    const rootMargin = options.rootMargin || '0px 0px -80px 0px';
    const threshold = options.threshold ?? 0.1;

    try {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                try {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                } catch (innerErr) {
                    console.error('Error revealing element:', innerErr, entry.target);
                }
            });
        }, { rootMargin, threshold });

        document.querySelectorAll(selector).forEach(el => {
            try {
                el.classList.add('reveal-init');
                observer.observe(el);
            } catch (innerErr) {
                console.error('Error initializing reveal for element:', innerErr, el);
            }
        });
    } catch (err) {
        console.error('scrollReveal initialization failed:', err);
    }
}

export default { initScrollReveal };