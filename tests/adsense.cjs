const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const publisher = 'ca-pub-2484041035631135';
const source = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + publisher;
let articles = 0;
function check(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) check(file);
    else if (entry.name.endsWith('.html')) {
      const html = fs.readFileSync(file, 'utf8');
      const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']*adsbygoogle\.js[^"']*)["'][^>]*>/g)];
      const article = html.includes('class="blog-article"');
      assert.equal(scripts.length, article ? 1 : 0, file + ': correct AdSense scope and count');
      if (article) {
        articles++;
        assert.equal(scripts[0][1], source, file + ': original publisher');
        assert(/\basync(?:\s|>)/.test(scripts[0][0]), file + ': non-blocking loader');
        assert(/crossorigin="anonymous"/.test(scripts[0][0]), file + ': cross-origin attribute');
        assert(html.indexOf(scripts[0][0]) < html.indexOf('</head>'), file + ': loader in head');
      }
    }
  }
}
check('public');
assert(articles > 0, 'Built blog articles must exist');
assert(fs.readFileSync('public/ads.txt', 'utf8').includes('google.com, pub-2484041035631135, DIRECT, f08c47fec0942fa0'));
console.log('Passed: original AdSense loader exactly once in ' + articles + ' article heads; absent elsewhere; ads.txt matches.');
