const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('public/start-a-project/index.html', 'utf8');
assert(html.includes('name="website-enquiry"'));
assert(html.includes('method="POST"'));
assert(html.includes('data-netlify="true"'));
assert(html.includes('netlify-honeypot="bot-field"'));
assert.equal((html.match(/type="radio"/g) || []).length, 3);
for (const name of ['goal', 'business', 'details', 'name', 'email']) {
  assert(new RegExp('<(?:input|textarea)[^>]*name="' + name + '"[^>]*required').test(html));
}
for (const name of ['website', 'country', 'timing', 'budget']) {
  assert(!new RegExp('<(?:input|select)[^>]*name="' + name + '"[^>]*required').test(html));
}
assert(fs.readFileSync('public/enquiry-received/index.html', 'utf8').includes('noindex, follow'));
assert(fs.readFileSync('public/privacy/index.html', 'utf8').includes('id="project-enquiries"'));

async function scenario({ registered = true, valid = true, fetchResult, fetchError } = {}) {
  let handler, destination, calls = 0, request;
  const button = { textContent: 'Send my project brief', disabled: false };
  const error = { hidden: true, textContent: '' };
  const form = {
    querySelector: () => button,
    reportValidity: () => valid,
    hasAttribute: () => !registered,
    setAttribute() {}, removeAttribute() {},
    addEventListener: (_, fn) => { handler = fn; }
  };
  vm.runInNewContext(fs.readFileSync('src/js/enquiry.js', 'utf8'), {
    document: { getElementById: id => id === 'website-enquiry' ? form : error },
    window: { location: { assign: url => { destination = url; } } },
    FormData: class { *[Symbol.iterator]() { yield ['form-name', 'website-enquiry']; yield ['details', '<script>alert(1)</script> & goals']; } },
    URLSearchParams, AbortController, setTimeout, clearTimeout,
    fetch: async (_, options) => { calls++; request = options; if (fetchError) throw fetchError; return fetchResult || { ok: true }; }
  });
  await Promise.all([handler({ preventDefault() {} }), handler({ preventDefault() {} })]);
  return { button, error, destination, calls, request };
}
(async () => {
  let result = await scenario();
  assert.equal(result.calls, 1, 'Duplicate submit is blocked');
  assert.equal(result.destination, '/enquiry-received/');
  assert.equal(new URLSearchParams(result.request.body).get('details'), '<script>alert(1)</script> & goals');
  for (const options of [{ fetchResult: { ok: false } }, { fetchError: new Error('offline') }, { fetchError: new Error('timeout') }]) {
    result = await scenario(options);
    assert.equal(result.destination, undefined);
    assert.equal(result.error.hidden, false);
    assert.equal(result.button.disabled, false);
  }
  for (const options of [{ registered: false }, { valid: false }]) {
    result = await scenario(options);
    assert.equal(result.calls, 0, 'Unregistered or invalid forms must not submit');
  }
  console.log('Passed: enquiry fields, registration, privacy anchor, duplicate prevention, encoding, success, HTTP/network failures and unregistered-host protection.');
})().catch(error => { console.error(error); process.exitCode = 1; });
