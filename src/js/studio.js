(() => {
  const menu = document.querySelector('.mobile-navigation');
  if (!menu) return;
  const trigger = menu.querySelector('summary');
  menu.addEventListener('toggle', () => trigger.setAttribute('aria-expanded', String(menu.open)));
  trigger.setAttribute('aria-expanded', String(menu.open));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { menu.open = false; trigger.focus(); }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
  window.matchMedia('(min-width: 821px)').addEventListener('change', event => { if (event.matches) menu.open = false; });
})();
