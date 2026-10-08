const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../assets/js/aws-explorer-data.js');
const core = require('../assets/js/aws-explorer-core.js');
const audit = require('../docs/aws-explorer-source-audit.json');

test('every distinct retrieved scope entry is represented exactly once, with useful aliases', () => {
  const scope = audit.sources.find(s => s.url === data.scope).scopeEntries.filter(s => /^(Amazon |AWS |IAM$)/.test(s));
  assert.equal(scope.length, 77);
  const distinct = [...new Set(scope)].sort();
  assert.equal(distinct.length, 75);
  assert.deepEqual(data.services.map(s => s.scopeName).sort(), distinct);
  assert.equal(new Set(data.services.map(s => s.id)).size, distinct.length);
  const repeated = [...new Set(scope.filter((s, i) => scope.indexOf(s) !== i))].sort();
  assert.deepEqual(data.scopeDuplicates.slice().sort(), repeated);
  assert.deepEqual(data.services.find(s => s.id === 'sagemaker').categories, ['Analytics', 'Machine Learning']);
  assert.ok(core.filterServices(data.services, { query: 'Kinesis Data Firehose' }).some(s => s.id === 'firehose'));
  assert.ok(core.filterServices(data.services, { query: 'QuickSight' }).some(s => s.id === 'quick'));
});

test('all cards have complete content, official sources, dates and valid task mappings', () => {
  const tasks = new Set(data.domains.flatMap(d => Object.keys(d.tasks)));
  for (const s of data.services) {
    for (const key of ['description', 'useCases', 'components', 'technical', 'considerations', 'choose', 'alternatives']) assert.ok(s[key]?.trim().length > 25, `${s.id}: ${key}`);
    assert.ok(s.recall.question && s.recall.answer, s.id);
    assert.ok(s.sources.length && s.sources.every(u => new URL(u).hostname === 'docs.aws.amazon.com'), s.id);
    assert.match(s.verified, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(s.tasks.length && s.tasks.every(t => tasks.has(t)), s.id);
  }
});

test('exam task links resolve to actual official domain anchors', () => {
  for (const d of data.domains) {
    const source = audit.sources.find(s => s.url === d.source);
    for (const task of Object.keys(d.tasks)) assert.ok(source.taskAnchors.includes(`data-engineer-associate-01-domain${d.id}-task${task.split('.')[1]}`), task);
  }
});

test('relationships retain whole participant sets, roles, directed flows and supporting details', () => {
  const ids = new Set(data.services.map(s => s.id));
  assert.equal(new Set(data.relationships.map(r => r.id)).size, data.relationships.length);
  for (const r of data.relationships) {
    assert.ok(r.participants.length >= 2, r.id);
    assert.equal(new Set(r.participants).size, r.participants.length);
    assert.ok(r.participants.every(id => ids.has(id) && r.roles[id]), r.id);
    assert.ok(r.flow.length && r.flow.every(f => r.participants.includes(f.from) && r.participants.includes(f.to) && f.label && ['data', 'control'].includes(f.type)), r.id);
    assert.ok(r.why && r.prerequisites && r.tradeoffs && r.sources.length && r.verified, r.id);
    assert.ok(r.tasks.every(t => data.domains.some(d => d.tasks[t])), r.id);
  }
  assert.ok(data.relationships.some(r => r.participants.length >= 4));
});

test('matching prioritizes all selected services and separates subsets without inventing combinations', () => {
  const result = core.matchRelationships(data.relationships, ['rds', 'redshift', 's3']);
  assert.deepEqual(result.all.map(r => r.id), ['federation-spectrum']);
  assert.ok(result.subset.some(r => r.id === 'federation'));
  assert.ok(result.subset.some(r => r.id === 'spectrum'));
  assert.ok(result.subset.every(r => !['rds', 'redshift', 's3'].every(id => r.participants.includes(id))));
  assert.deepEqual(core.matchRelationships(data.relationships, ['route53', 'databrew']), { all: [], subset: [] });
  assert.deepEqual(core.matchRelationships(data.relationships, ['s3']), { all: [], subset: [] });
  assert.deepEqual(core.matchRelationships(data.relationships, ['s3', 's3']), { all: [], subset: [] });
  const bigger = core.matchRelationships(data.relationships, ['s3', 'redshift', 'rds', 'route53']);
  assert.equal(bigger.all.length, 0);
  assert.equal(bigger.subset[0].id, 'federation-spectrum');
});

test('S3 + Redshift distinguishes Spectrum, COPY and UNLOAD, including direction', () => {
  const matches = core.matchRelationships(data.relationships, ['s3', 'redshift']).all;
  for (const id of ['spectrum', 'copy', 'unload']) assert.ok(matches.some(r => r.id === id));
  const get = id => matches.find(r => r.id === id);
  assert.deepEqual([get('copy').flow[0].from, get('copy').flow[0].to], ['s3', 'redshift']);
  assert.deepEqual([get('unload').flow[0].from, get('unload').flow[0].to], ['redshift', 's3']);
  assert.match(get('spectrum').why, /without loading/);
});

test('federation does not require S3 and explicitly scopes engines and credentials', () => {
  const r = data.relationships.find(r => r.id === 'federation');
  assert.deepEqual(r.participants.slice().sort(), ['rds', 'redshift']);
  for (const text of ['PostgreSQL', 'MySQL', 'Aurora', 'Secrets Manager', 'S3 is not required']) assert.ok(r.prerequisites.includes(text), text);
  assert.match(r.tradeoffs, /Read-only/);
  const combo = data.relationships.find(r => r.id === 'federation-spectrum');
  assert.equal(combo.flow.length, 2);
  assert.ok(combo.flow.some(f => f.from === 'rds' && /Federated/.test(f.label)));
  assert.ok(combo.flow.some(f => f.from === 's3' && /Spectrum/.test(f.label)));
  assert.ok(combo.example.sql.includes('JOIN lake.sales'));
});

test('selection toggles immutably and filters/search do not mutate it', () => {
  const old = ['s3'];
  assert.deepEqual(core.toggleSelection(old, 'redshift'), ['s3', 'redshift']);
  assert.deepEqual(core.toggleSelection(old, 's3'), []);
  assert.deepEqual(old, ['s3']);
  assert.equal(core.filterServices(data.services, { query: 'zz-no-service' }).length, 0);
  assert.ok(core.filterServices(data.services, { category: 'Storage', domain: '2' }).every(s => s.categories.includes('Storage') && s.tasks.some(t => t.startsWith('2.'))));
  assert.ok(core.filterServices(data.services, { query: '  kafka  ' }).some(s => s.id === 'msk'));
  assert.ok(core.filterServices(data.services, { query: 'CDC' }).some(s => s.id === 'dms'));
});

test('neighborhoods are one-hop across whole hyperedges', () => {
  const rs = [{ participants: ['a', 'b', 'c'] }, { participants: ['c', 'd'] }];
  assert.deepEqual([...core.neighborhood(rs, ['a'])].sort(), ['a', 'b', 'c']);
});

test('all declared sources have a substantive successful retrieval without unresolved redirects', () => {
  const urls = new Set([data.scope, ...data.domains.map(d => d.source), ...data.services.flatMap(s => s.sources), ...data.relationships.flatMap(r => r.sources)]);
  for (const url of urls) {
    const record = audit.sources.find(s => s.url === url);
    assert.ok(record && !record.error && !record.review && record.status === 200 && record.characters >= 100, url);
    assert.equal(record.finalUrl, url);
  }
});

test('new page and study navigation use local root-relative assets that exist', () => {
  for (const page of ['explorer.html', 'service-explorer.html']) {
    const html = fs.readFileSync(path.join(__dirname, '../aws-study-guide', page), 'utf8');
    for (const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) assert.ok(fs.existsSync(path.join(__dirname, '..', match[1])), match[1]);
  }
  assert.ok(fs.readFileSync(path.join(__dirname, '../aws-study-guide.html'), 'utf8').includes('/aws-study-guide/explorer.html'));
});
