(() => {
  'use strict';
  document.querySelectorAll('[data-youtube-id]').forEach((container) => {
    const id = container.dataset.youtubeId;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return;
    const button = container.querySelector('[data-load-video]');
    if (!button) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      const player = document.createElement('iframe');
      player.src = `https://www.youtube-nocookie.com/embed/${id}`;
      player.title = container.dataset.videoTitle || 'YouTube video';
      player.allow = 'encrypted-media; picture-in-picture; fullscreen';
      player.allowFullscreen = true;
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      const frame = document.createElement('div');
      frame.className = 'youtube-frame';
      frame.append(player);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'button button-dark';
      remove.textContent = 'Unload video';
      const placeholder = container.querySelector('.youtube-placeholder');
      if (!placeholder) return;
      placeholder.hidden = true;
      container.append(frame, remove);
      player.focus();
      remove.addEventListener('click', () => {
        frame.remove();
        remove.remove();
        placeholder.hidden = false;
        button.focus();
      }, { once: true });
    });
  });
})();
