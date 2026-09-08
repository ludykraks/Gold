const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

async function main() {
  const pages = ['/', '/services/', '/work/', '/about/', '/contact/', '/action-plan/'];
  for (const route of pages) {
    const html = fs.readFileSync(path.join('public', route, 'index.html'), 'utf8');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${route}: one main heading`);
    assert(html.includes('studio-header'), `${route}: shared fixed header`);
    for (const match of html.matchAll(/(?:href|src)="(\/[^" ]*)"/g)) {
      const url = new URL(match[1], 'https://goldchestgh.com');
      const target = path.join('public', url.pathname, url.pathname.endsWith('/') ? 'index.html' : '');
      assert(fs.existsSync(target), `${route}: missing ${url.pathname}`);
      if (url.hash) assert(fs.readFileSync(target, 'utf8').includes(`id="${url.hash.slice(1)}"`), `${route}: missing anchor ${url.hash}`);
    }
  }
  for (const font of ['manrope-variable.ttf', 'inter-variable.ttf']) {
    const data = fs.readFileSync('public/fonts/' + font);
    assert.equal(data.readUInt32BE(0), 0x00010000, `Valid TrueType font: ${font}`);
  }
  const header = fs.readFileSync('src/_includes/partials/studio-header.html', 'utf8');
  assert(!/href="(?:#|\/#)/.test(header), 'Header uses individual pages');
  assert(fs.existsSync('public/blog/index.html'), 'Blog retained');

  const source = fs.readFileSync('src/js/home.js', 'utf8');
  let answers, downloaded, downloadedBlob;
  const elements = Object.fromEntries(['presence-check', 'check-result', 'recommendations', 'reset-check', 'stage', 'download-plan'].map(id => [id, {
    handlers: {}, hidden: id === 'check-result', elements: { stage: { value: 'none' } },
    addEventListener(event, handler) { this.handlers[event] = handler; },
    focus() { this.focused = true; }, replaceChildren(...items) { this.items = items; }
  }]));
  const context = {
    window: { location: { search: '?stage=dated' } }, URLSearchParams,
    document: { getElementById: id => elements[id], createElement: () => ({ click() { downloaded = this.download; }, remove() {} }), body: { append() {} } },
    FormData: class { get(key) { return answers[key]; } }, Blob,
    URL: { createObjectURL(blob) { downloadedBlob = blob; return 'blob:test'; }, revokeObjectURL() {} },
    setTimeout(callback) { callback(); }
  };
  vm.runInNewContext(source, context);
  assert.equal(elements['presence-check'].elements.stage.value, 'dated', 'Homepage choice carries into planner');
  for (const stage of ['none', 'dated', 'active']) for (const goal of ['leads', 'sales', 'visibility']) for (const challenge of ['clarity', 'mobile', 'measurement']) {
    answers = { stage, goal, challenge };
    elements['presence-check'].handlers.submit({ preventDefault() {} });
    assert.equal(elements.recommendations.items.length, 3);
    assert(elements.recommendations.items.every(item => typeof item.textContent === 'string' && item.textContent.length > 50));
    assert.equal(elements['check-result'].hidden, false);
    assert.equal(elements['presence-check'].hidden, true);
    assert(elements['check-result'].focused);
    elements['download-plan'].handlers.click();
    assert.equal(downloaded, 'goldchest-digital-action-plan.txt');
    const content = await downloadedBlob.text();
    for (const item of elements.recommendations.items) assert(content.includes(item.textContent));
    elements['reset-check'].handlers.click();
    assert.equal(elements['presence-check'].hidden, false);
    assert.equal(elements['check-result'].hidden, true);
    assert(elements.stage.focused);
  }
  vm.runInNewContext(source, { document: { getElementById() { return null; } } });

  const documentEvents = {}, menuEvents = {};
  let mediaHandler;
  const trigger = { attributes: {}, setAttribute(k, v) { this.attributes[k] = v; }, focus() { this.focused = true; } };
  const link = { addEventListener(_, handler) { this.handler = handler; } };
  const menu = { open: false, querySelector() { return trigger; }, querySelectorAll() { return [link]; }, contains(target) { return target === trigger; }, addEventListener(event, handler) { menuEvents[event] = handler; } };
  vm.runInNewContext(fs.readFileSync('src/js/studio.js', 'utf8'), {
    document: { querySelector() { return menu; }, addEventListener(event, handler) { documentEvents[event] = handler; } },
    window: { matchMedia() { return { addEventListener(_, handler) { mediaHandler = handler; } }; } }
  });
  menu.open = true; menuEvents.toggle(); assert.equal(trigger.attributes['aria-expanded'], 'true');
  documentEvents.keydown({ key: 'Escape' }); assert.equal(menu.open, false); assert(trigger.focused);
  menu.open = true; documentEvents.click({ target: {} }); assert.equal(menu.open, false);
  menu.open = true; link.handler(); assert.equal(menu.open, false);
  menu.open = true; mediaHandler({ matches: true }); assert.equal(menu.open, false);
  console.log('Passed: 6 routes and local links/anchors, both fonts, separate navigation, 27 planner combinations and downloaded content, planner handoff/reset/focus, mobile menu handlers.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
