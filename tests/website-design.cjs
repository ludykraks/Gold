const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync('public/website-design/index.html', 'utf8');
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert(html.includes('class="studio-header"'));
assert(html.includes('class="studio-footer"'));
assert(html.includes('action="/start-a-project/" method="get"'));
assert.equal((html.match(/name="need"/g) || []).length, 3);
assert.equal((html.match(/<details class="lp-faq"/g) || []).length, 3);
assert(!/KraftGurus|interior|DCLogic|onClick|\{\{/.test(html));
for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
  assert(fs.existsSync(path.join('public', url.endsWith('/') ? url + 'index.html' : url)), url);
}
for (const slug of ['cheezzy-pizza', 'odotastic']) {
  assert(html.includes(`/images/work/${slug}-desktop.jpg`));
  assert(html.includes(`/work/${slug}/`));
}
assert(!fs.readFileSync('public/index.html','utf8').includes('/css/website-design.css'));

const script = fs.readFileSync('src/js/website-design.js', 'utf8');
function prefill(search, {checked = '', details = ''} = {}) {
  const radios = ['New website','Website redesign','More customer enquiries'].map(value => ({value, checked:value===checked}));
  const field = {value:details};
  const form = {
    querySelector: selector => selector.includes(':checked') ? radios.find(r=>r.checked) : field,
    querySelectorAll: () => radios
  };
  vm.runInNewContext(script, {document:{getElementById:id=>id==='website-enquiry'?form:null},window:{location:{search}},URLSearchParams});
  return {radios, field};
}
assert(prefill('?need=new').radios[0].checked);
assert(prefill('?need=redesign').radios[1].checked);
assert(prefill('?need=ecommerce').field.value.includes('e-commerce'));
assert.equal(prefill('?need=ecommerce',{details:'My existing brief'}).field.value,'My existing brief');
assert(prefill('?need=new',{checked:'Website redesign'}).radios[1].checked);
for(const query of ['', '?need=unknown', '?need=%3Cscript%3Ealert(1)%3C%2Fscript%3E', '?need=__proto__']) {
  const result=prefill(query);
  assert(!result.radios.some(r=>r.checked));
  assert.equal(result.field.value,'');
}
let handler;
const summary={hidden:true}, label={textContent:''};
const chosen={dataset:{label:'A website that sells'}};
vm.runInNewContext(script, {document:{getElementById:id=>id==='website-choice'?{
  querySelector:s=>s==='.lp-chosen'?summary:chosen,
  addEventListener:(_,fn)=>{handler=fn;}
}:id==='website-choice-label'?label:null}});
assert.equal(label.textContent,'A website that sells');
assert.equal(summary.hidden,false);
chosen.dataset.label='A new website'; handler();
assert.equal(label.textContent,'A new website');
console.log('Passed: landing routes/assets, shared navigation, native choices/FAQs, scoped styles, safe intent handoff and preservation of existing answers.');
