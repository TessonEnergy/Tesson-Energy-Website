(() => {
    const form = document.getElementById('enquiryForm');
    if (!form) return;

    const overlay = document.getElementById('overlayLoader') || createOverlay();
    const alertBox = ensureAlertBox(form);
    const submitBtn = form.querySelector('[type="submit"]');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLTOyaEkVQaGX_2FoSK9cHevgXkJ7zi5RLSEe63o9IroZlebwYto36Y-Z2qy_pJujM/exec';

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        clearAlert();

        // Basic front-end sanity checks (optional)
        const email = form.email?.value?.trim();
        const phone = form.phone?.value?.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showAlert('Please enter a valid email address.', 'warning');
            return;
        }
        if (!/^[0-9+\-()\s]{6,20}$/.test(phone)) {
            showAlert('Please enter a valid phone number.', 'warning');
            return;
        }

        submitBtn.disabled = true;
        showLoader();

        try {
            const fd = new FormData(form);

            const res = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: fd,
                redirect: 'follow',
            });

            let ok = false;
            try {
                const data = await res.json();
                ok = !!data?.ok;
            } catch (_) {
                ok = res.ok;
            }

            if (ok) {
                showAlert('Your enquiry has been sent. We’ll contact you shortly. Thank you!', 'success');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            console.error(err);
            showAlert('Sorry, something went wrong. Please try again or email contact@tessonenergy.com', 'danger');
        } finally {
            hideLoader();
            submitBtn.disabled = false;
        }
    });

    function createOverlay() {
        const el = document.createElement('div');
        el.id = 'overlayLoader';
        el.className = 'overlay-loader d-none';
        el.innerHTML = `
        <div class="text-center">
            <div class="spinner-border" role="status" aria-hidden="true"></div>
            <p class="mt-3 mb-0 text-white fw-semibold">Submitting your enquiry…</p>
        </div>`;
        document.body.appendChild(el);
        return el;
    }

    function ensureAlertBox(form) {
        let box = document.getElementById('formAlert');
        if (!box) {
            box = document.createElement('div');
            box.id = 'formAlert';
            box.className = 'alert d-none';
            // form.prepend(box); // ❌ remove this
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.parentNode.appendChild(box); // ✅ put after submit button
        }
        return box;
    }

    function showLoader() {
        overlay.classList.remove('d-none');
        document.body.classList.add('loading');
    }
    function hideLoader() {
        overlay.classList.add('d-none');
        document.body.classList.remove('loading');
    }
    function showAlert(msg, type = 'info') {
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = msg;
    }
    function clearAlert() {
        alertBox.className = 'alert d-none';
        alertBox.textContent = '';
    }
})();