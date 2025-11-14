/**
 * Form validation module
 * Provides client-side form validation with error display
 */
export function initFormValidation(selector = '#contactForm') {
    const form = document.querySelector(selector);
    if (!form) {
        console.warn(`Form not found: ${selector}`);
        return;
    }

    function showError(input, message) {
        let err = input.nextElementSibling;
        if (!err || !err.classList.contains('form-error')) {
            err = document.createElement('div');
            err.className = 'form-error';
            input.parentNode.insertBefore(err, input.nextSibling);
        }
        err.textContent = message;
        input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
        const err = input.nextElementSibling;
        if (err && err.classList.contains('form-error')) err.textContent = '';
        input.removeAttribute('aria-invalid');
    }

    function validateEmail(value) {
        return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
    }

    form.addEventListener('submit', (e) => {
        const required = form.querySelectorAll('[data-required]');
        let valid = true;

        required.forEach(input => {
            clearError(input);
            const val = input.value.trim();
            if (!val) {
                valid = false;
                showError(input, 'Ce champ est requis.');
            } else if (input.type === 'email' && !validateEmail(val)) {
                valid = false;
                showError(input, 'Adresse e-mail invalide.');
            }
        });

        if (!valid) {
            e.preventDefault();
            const firstError = form.querySelector('[aria-invalid="true"]');
            if (firstError) firstError.focus();
        }
    });

    // live validation
    form.querySelectorAll('[data-required]').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
}

export default { initFormValidation };
