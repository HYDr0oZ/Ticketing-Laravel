document.addEventListener('DOMContentLoaded', () => {

    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        // ajout des messages d'erreur
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'submit' && input.type !== 'button' && input.type !== 'hidden') {
                let errorSpan = input.parentNode.querySelector('.error-message');
                if (!errorSpan) {
                    errorSpan = document.createElement('span');
                    errorSpan.className = 'error-message';
                    input.parentNode.insertBefore(errorSpan, input.nextSibling);
                }

                input.addEventListener('blur', () => {
                    validateInput(input);
                });

                input.addEventListener('input', () => {
                    // enleve le message d'erreur si l'utilisateur corrige le champ
                    if (input.classList.contains('input-error')) {
                        validateInput(input);
                    }
                });
            }
        });

        form.addEventListener('submit', (e) => {
            let isValid = true;
            inputs.forEach(input => {
                if (input.type !== 'submit' && input.type !== 'button' && input.type !== 'hidden') {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    function validateInput(input) {
        let isValid = true;
        let errorMessage = '';

        const errorSpan = input.parentNode.querySelector('.error-message');
        if (!errorSpan) return true;

        // Reset
        input.classList.remove('input-error');
        errorSpan.classList.remove('visible');
        errorSpan.textContent = '';

        // liste des champs requis
        const requiredFields = ['username', 'password', 'email', 'firstname', 'lastname', 'confirm_password', 'title', 'project-name', 'price'];
        const isRequired = input.hasAttribute('required') || requiredFields.includes(input.name);

        // verification des champs requis
        if (isRequired && !input.value.trim()) {
            isValid = false;
            errorMessage = 'Ce champ est requis.';
        }

        // Check email
        else if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
                errorMessage = "L'adresse email n'est pas valide.";
            }
        }

        // Check password taille (example: min 8 chars)
        else if (input.type === 'password' && input.value.trim().length > 0 && input.value.trim().length < 8) {
            isValid = false;
            errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
        }

        // Check generic minlength
        else if (input.hasAttribute('minlength') && input.value.trim().length < input.getAttribute('minlength')) {
            isValid = false;
            errorMessage = `Le champ doit contenir au moins ${input.getAttribute('minlength')} caractères.`;
        }


        // Confirm password check (specific logic)
        if (input.name === 'confirm_password' || (input.id && input.id.includes('confirm'))) {
            const passwordInput = input.closest('form').querySelector('input[type="password"][name="password"]') ||
                input.closest('form').querySelector('input[type="password"][id="password"]');
            if (passwordInput && input.value !== passwordInput.value) {
                isValid = false;
                errorMessage = 'Les mots de passe ne correspondent pas.';
            }
        }

        if (!isValid) {
            input.classList.add('input-error');
            errorSpan.textContent = errorMessage;
            errorSpan.classList.add('visible');
        }

        return isValid;
    }
});
