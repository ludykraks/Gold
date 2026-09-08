(() => {
  const form = document.getElementById('presence-check');
  if (!form) return;
  const initialStage = new URLSearchParams(window.location.search).get('stage');
  if (['none', 'dated', 'active'].includes(initialStage)) form.elements.stage.value = initialStage;
  const result = document.getElementById('check-result');
  const recommendations = document.getElementById('recommendations');
  const advice = {
    stage: {
      none: 'Build a focused first website: explain who you help, show your services and make it easy to contact you. Start with one clear goal for the page.',
      dated: 'Review your existing website on a phone. List unclear information, broken links and steps that make contacting you difficult, then prioritise those fixes.',
      active: 'Strengthen trust on your key pages. Add current service details, real examples of your work and customer feedback you have permission to share.'
    },
    goal: {
      leads: 'Make enquiries simple. Give each service page one clear contact action and tell visitors what information to include and what happens next.',
      sales: 'Plan a small, clear product catalogue. Prepare useful product photos, prices, delivery information and a straightforward payment and checkout process.',
      visibility: 'Make your business easier to find. Use the words your customers search for in useful page titles and service descriptions, and keep your business listings accurate.'
    },
    challenge: {
      clarity: 'Write a one-sentence promise: who you help, what you do and why it matters. Put it near the top of your homepage, supported by a concrete example.',
      mobile: 'Check your most important customer journey on a phone. Make text readable, buttons easy to tap and forms short; compress unnecessarily large images.',
      measurement: 'Choose one meaningful outcome, such as enquiries or completed orders. Set up suitable measurement with the necessary privacy choices, then review it regularly.'
    }
  };
  let plan = [];
  form.addEventListener('submit', event => {
    event.preventDefault();
    const answers = new FormData(form);
    plan = ['stage', 'goal', 'challenge'].map(key => advice[key][answers.get(key)]);
    recommendations.replaceChildren(...plan.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
    form.hidden = true; result.hidden = false; result.focus();
  });
  document.getElementById('reset-check').addEventListener('click', () => { result.hidden = true; form.hidden = false; document.getElementById('stage').focus(); });
  document.getElementById('download-plan').addEventListener('click', () => {
    const text = 'YOUR DIGITAL ACTION PLAN\nGoldChest Technologies\n\n' + plan.map((item, index) => `${index + 1}. ${item}`).join('\n\n') + '\n\nBased on your self-reported answers, not an automated website audit.\n\nGet help: https://goldchestgh.com/contact/\nCall: +233 20 761 5706\n';
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'goldchest-digital-action-plan.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
