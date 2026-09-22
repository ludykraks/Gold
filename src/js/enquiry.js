(() => {
  'use strict';
  const form = document.getElementById('website-enquiry');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const error = document.getElementById('enquiry-error');
  const originalLabel = button.textContent;
  let sending = false;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    error.hidden = true;
    // Netlify removes this attribute when it registers the form during deployment.
    // Avoid treating a generic static-host response as a saved enquiry.
    if (form.hasAttribute('data-netlify')) {
      error.textContent = 'This form is temporarily unavailable. Please call +233 20 761 5706 so we can help.';
      error.hidden = false;
      return;
    }
    sending = true;
    button.disabled = true;
    button.textContent = 'Sending your brief…';
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission not accepted');
      window.location.assign('/enquiry-received/');
    } catch {
      error.textContent = 'We couldn’t confirm your submission. Your answers are still here. Please check your connection and try again, or call +233 20 761 5706.';
      error.hidden = false;
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = originalLabel;
      form.removeAttribute('aria-busy');
    }
  });
})();
