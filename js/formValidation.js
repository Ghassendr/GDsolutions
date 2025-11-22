 
export function initFormValidation(selector = '#contactForm') {
    const form = document.querySelector(selector);
    if (!form) {
        console.warn(`Form not found: ${selector}`);
        return;
    } 
    function trackClick() { 
        fetch('php/click_counter.php') 
            .then(response => response.json())
            .then(data => {
                console.log("Compteur de clics incrémenté : " + data.clicks);
            })
            .catch(error => console.error("Erreur compteur :", error));
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
        e.preventDefault();

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
            const firstError = form.querySelector('[aria-invalid="true"]');
            if (firstError) firstError.focus();
            return;
        }
 
        trackClick();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn && submitBtn.innerHTML;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Envoi...';
        }

        const fd = new FormData(form); 
        fetch(form.action || 'php/contact.php', {
            method: 'POST',
            body: fd,
            headers: {
                'Accept': 'application/json'
            }
        }).then(async (res) => {
            let data = {};
            try { data = await res.json(); } catch (err) {}
            
            if (res.ok && data && (data.success || !data.error)) {
                alert(data.success || 'Message envoyé avec succès !');
                form.reset();
            } else {
                const errMsg = data && data.error ? data.error : 'Erreur lors de l\'envoi.';
                alert(errMsg);
            }
        }).catch((err) => {
            console.error('Erreur envoi formulaire', err);
            alert('Erreur réseau. Vérifiez votre connexion.');
        }).finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                if (originalBtnHtml) submitBtn.innerHTML = originalBtnHtml;
            }
        });
    });
 
    form.querySelectorAll('[data-required]').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
}
 
export default { initFormValidation };