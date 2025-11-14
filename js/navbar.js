// Exported navbar helpers for ES module usage
export function initNavbar() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    // Accessibility: aria-expanded and keyboard support
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'primary-navigation');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    }

    if (navToggle && navLinks) {
        navLinks.id = navLinks.id || 'primary-navigation';

        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(!expanded));
        });

        // Close menu on link activation and ensure keyboard accessibility
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') link.click();
            });
        });
    }
}

export function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');

        if (!currentPage || currentPage === 'index2.html' || currentPage === '') {
            if (link.getAttribute('data-page') === 'home' || link.getAttribute('href') === '#accueil') {
                link.classList.add('active');
            }
        } else if (link.getAttribute('href') && link.getAttribute('href').includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Lightweight default export for backwards compatibility
export default { initNavbar, setActiveNavLink };