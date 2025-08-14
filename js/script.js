// ----- LOAD FOOTER FROM FOOTER.HTML -----
fetch('components/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer-area').innerHTML = data);

// ----- LOAD FLOATING BUTTONS FROM FLOATING-BUTTONS.HTML -----
fetch('components/floating-buttons.html')
    .then(res => res.text())
    .then(data => document.getElementById('floating-buttons-area').innerHTML = data);


// ----- FOOTER CONTACT FORM -----
const APP_URL = 'https://script.google.com/macros/s/AKfycbwISDFvNWdtVPM8O7j28JvE6QbuwAq98zx92C0Q2237Jz1fitWF2ypeRnTwViFDTtyz/exec';

// Load footer, then wire up the form handler
fetch('components/footer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('footer-area').innerHTML = html;
        attachFooterFormHandler();
    });

function attachFooterFormHandler() {
    const form = document.querySelector('#footer-area #contactForm');
    if (!form) return;

    // status element
    let statusEl = form.querySelector('#formStatus');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'formStatus';
        statusEl.className = 'small mt-2';
        form.appendChild(statusEl);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusEl.textContent = '';
        const btn = form.querySelector('button[type="submit"]');
        const originalBtnHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Submitting...';

        try {
            // Build FormData (no custom headers → no CORS preflight)
            const fd = new FormData(form);
            fd.append('page', location.pathname);

            const res = await fetch(APP_URL, { method: 'POST', body: fd });
            // If JSON response is blocked for some reason, fallback safe parse:
            let data = {};
            try { data = await res.json(); } catch (_) { }

            if (res.ok && (data.ok === undefined || data.ok === true)) {
                statusEl.innerHTML = '<span class="text-success">Thanks! We’ll get back to you soon.</span>';
                form.reset();
            } else {
                throw new Error((data && data.message) || 'Submit failed');
            }
        } catch (err) {
            statusEl.innerHTML = '<span class="text-danger">Oops! Try again</span>';
            console.error(err);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalBtnHtml;
        }
    });
}