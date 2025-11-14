/**
 * Testimonials carousel
 * @module carousel
 * @param {Object} options
 * @param {string} options.selector - CSS selector for carousel containers
 * @param {boolean} options.autoplay - whether to autoplay
 * @param {number} options.interval - autoplay interval in ms
 */
export function initCarousel(options = {}) {
    const selector = options.selector || '.testimonials-carousel';
    const autoplay = options.autoplay ?? true;
    const interval = options.interval || 4500;

    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((carousel) => {
        try {
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
            const prev = carousel.querySelector('.carousel-prev');
            const next = carousel.querySelector('.carousel-next');
            let index = 0;
            let timer = null;

            function goTo(i) {
                index = (i + slides.length) % slides.length;
                const offset = -index * 100;
                if (track) track.style.transform = `translateX(${offset}%)`;
                carousel.setAttribute('data-index', String(index));
            }

            function nextSlide() { goTo(index + 1); }
            function prevSlide() { goTo(index - 1); }

            if (next) next.addEventListener('click', () => { nextSlide(); resetTimer(); });
            if (prev) prev.addEventListener('click', () => { prevSlide(); resetTimer(); });

            // keyboard
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') nextSlide();
                if (e.key === 'ArrowLeft') prevSlide();
            });

            function resetTimer() {
                if (!autoplay) return;
                clearInterval(timer);
                timer = setInterval(nextSlide, interval);
            }

            // init styles
            if (track) {
                track.style.display = 'flex';
                track.style.transition = 'transform 0.6s ease';
                track.style.willChange = 'transform';
            }

            slides.forEach(s => s.setAttribute('role', 'group'));

            goTo(0);
            if (autoplay) timer = setInterval(nextSlide, interval);

            // pause on hover/focus
            carousel.addEventListener('mouseenter', () => clearInterval(timer));
            carousel.addEventListener('focusin', () => clearInterval(timer));
            carousel.addEventListener('mouseleave', resetTimer);
            carousel.addEventListener('focusout', resetTimer);
        } catch (err) {
            // Catch and log per-carousel initialization errors to avoid breaking other carousels
            console.error('Carousel instance init error:', err, carousel);
        }
    });
}

export default { initCarousel };
