(() => {
  'use strict';
  const choice = document.getElementById('website-choice');
  if (choice) {
    const summary = choice.querySelector('.lp-chosen');
    const label = document.getElementById('website-choice-label');
    const update = () => {
      const selected = choice.querySelector('input[name="need"]:checked');
      if (!selected) return;
      label.textContent = selected.dataset.label;
      summary.hidden = false;
    };
    choice.addEventListener('change', update);
    update();
  }

  const enquiry = document.getElementById('website-enquiry');
  if (!enquiry) return;
  // Only accept known choices. Never inject query-string content into the page.
  const intent = new URLSearchParams(window.location.search).get('need');
  const goals = new Map([['new', 'New website'], ['redesign', 'Website redesign']]);
  if (goals.has(intent) && !enquiry.querySelector('input[name="goal"]:checked')) {
    const goal = [...enquiry.querySelectorAll('input[name="goal"]')]
      .find(input => input.value === goals.get(intent));
    if (goal) goal.checked = true;
  }
  if (intent === 'ecommerce') {
    const details = enquiry.querySelector('[name="details"]');
    if (details && !details.value) {
      details.value = 'I’m interested in a website for online ordering and e-commerce.';
    }
  }
})();
