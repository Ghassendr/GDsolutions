/**
 * Animated counters module
 * Animates numeric counters when they become visible
 */
export function initCounters(selector = '.counter') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target') || el.textContent || '0');
                const decimals = (el.getAttribute('data-decimals') || '0') | 0;
                let current = 0;
                const steps = 60;
                const increment = target / steps;
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        clearInterval(interval);
                        el.textContent = formatValue(target, decimals, el.getAttribute('data-suffix'));
                    } else {
                        el.textContent = formatValue(current, decimals, el.getAttribute('data-suffix'));
                    }
                }, 16);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.6 });

    function formatValue(val, decimals, suffix) {
        const n = decimals > 0 ? val.toFixed(decimals) : Math.ceil(val);
        return suffix ? `${n}${suffix}` : n;
    }

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

export default { initCounters };
