// modal.js - accessible modal component
export function initModal(options = {}) {
    const triggerSelector = options.trigger || '[data-modal-trigger]';
    const modalSelector = options.modal || '.modal';
    const closeSelector = options.close || '[data-modal-close]';

    try {
        const triggers = Array.from(document.querySelectorAll(triggerSelector));
        const modal = document.querySelector(modalSelector);
        if (!modal) return;
        const closeButtons = Array.from(modal.querySelectorAll(closeSelector));

        let lastFocused = null;

        function openModal() {
            try {
                lastFocused = document.activeElement;
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
                modal.style.display = 'block';
                trapFocus(modal);
            } catch (err) {
                console.error('Error opening modal:', err, modal);
            }
        }

        function closeModal() {
            try {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
                releaseFocus();
                if (lastFocused) lastFocused.focus();
            } catch (err) {
                console.error('Error closing modal:', err, modal);
            }
        }

        triggers.forEach(t => t.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
        closeButtons.forEach(b => b.addEventListener('click', closeModal));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });

        // Focus trap
        let focusables = [];
        function trapFocus(root) {
            try {
                focusables = Array.from(root.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(x => !x.hasAttribute('disabled'));
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                first && first.focus();

                root.addEventListener('keydown', handleTrap);

                function handleTrap(e) {
                    if (e.key !== 'Tab') return;
                    if (focusables.length === 0) return;
                    if (e.shiftKey) {
                        if (document.activeElement === first) {
                            e.preventDefault(); last.focus();
                        }
                    } else {
                        if (document.activeElement === last) {
                            e.preventDefault(); first.focus();
                        }
                    }
                }
            } catch (err) {
                console.error('Error setting up focus trap:', err, root);
            }
        }

        function releaseFocus() {
            // no-op for now; keydown handler bound to root will be garbage-collected with element
        }
    } catch (err) {
        console.error('Modal initialization failed:', err);
    }
}

export default { initModal };
