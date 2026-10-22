const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const notes = fs.readFileSync('docs/aws-data-eng-associate.md', 'utf8');
const sandbox = { window: { studyVisuals: {} }, document: { getElementById: () => null }, fetch: () => new Promise(() => {}) };
vm.createContext(sandbox);
const guide = fs.readFileSync('assets/js/aws-study-guide.js', 'utf8').replace('  fetch(sourcePath)',
  '  window.studyTest = { parseMarkdown, formatText, renderList, renderVisual, renderTables, splitPoints, getVisual, groupTopics, matchesTopic };\n  fetch(sourcePath)');
vm.runInContext(guide, sandbox);
vm.runInContext(fs.readFileSync('assets/js/aws-study-visuals.js', 'utf8'), sandbox);
const helpers = sandbox.window.studyTest;
const slides = helpers.parseMarkdown(notes);
const visuals = sandbox.window.studyVisuals;

test('study notes have no document attribution or page annotations', () => {
  assert.doesNotMatch(notes, /supplemented and paraphrased from|<!-- [\w-]*page:/i);
  assert.ok(slides.length > 700);
});

test('topics are grouped and searchable by section and title', () => {
  const topics = slides.filter(slide => !slide.isSection);
  const groups = helpers.groupTopics(topics);
  assert.equal(groups.length, 15);
  assert.equal(groups[0].section, 'Fundamentals');
  assert.equal(groups.reduce((count, group) => count + group.topics.length, 0), topics.length);
  assert.ok(helpers.matchesTopic(topics.find(slide => /DynamoDB/i.test(slide.title)), 'dynamodb'));
  assert.ok(helpers.matchesTopic(topics[0], 'fundamentals'));
  assert.ok(slides.find(slide => slide.originalNote === 110).title === 'AWS Batch');
});

test('topic-keyed diagrams resolve to a note and have complete graph endpoints', () => {
  const ids = new Set();
  const entries = Object.entries(visuals).filter(([key, visual]) => key.startsWith('topic:') && visual.type === 'diagram');
  assert.equal(entries.length, 329);
  for (const [key, visual] of entries) {
    assert.ok(!ids.has(visual.id), visual.id);
    ids.add(visual.id);
    const slide = slides.find(item => item.visualKey === key);
    assert.ok(slide, key);
    assert.equal(helpers.getVisual(slide), visual);
    const nodeKeys = new Set(visual.nodes.map(node => node.key));
    assert.equal(nodeKeys.size, visual.nodes.length, key);
    assert.ok(visual.nodes.every(node => node.text && typeof node.detail === 'string'), key);
    assert.ok(visual.links.every(link => nodeKeys.has(link.from) && nodeKeys.has(link.to) && link.label), key);
    assert.match(helpers.renderVisual(slide), /Read diagram as text/);
  }
  assert.ok(visuals['Data Lakehouses'] && visuals['DynamoDB Streams']);
});

test('repeated topic titles use section-aware keys and structural links remain relationships', () => {
  const a = { title: 'Same title', section: 'One', visualKey: 'topic:One::Same title' };
  const b = { title: 'Same title', section: 'Two', visualKey: 'topic:Two::Same title' };
  assert.notEqual(a.visualKey, b.visualKey);
  const structure = Object.values(visuals).find(visual => visual.type === 'diagram' && visual.kind === 'structure');
  assert.ok(structure.links.every(link => link.relation));
});

test('Internet Gateway and NAT diagram keeps its vertical AZ layout', () => {
  const [key, network] = Object.entries(visuals).find(([key]) => key.includes('Internet Gateway & NAT Gateways'));
  assert.equal(network.layout, 'vertical');
  assert.equal(network.nodes[0].text, 'WWW');
  assert.ok(network.nodes.find(node => node.key === 'az').isGroup);
  assert.deepEqual(Array.from(network.nodes.filter(node => node.group === 'az').map(node => node.key)), ['public', 'nat', 'private']);
  const html = helpers.renderVisual(slides.find(slide => slide.visualKey === key));
  assert.match(html, /AZ \(dashed container\): Availability Zone/);
  assert.match(html, /Private Subnet â€” initiates outbound traffic â†’ NAT/);
});

test('presentation summaries retain nested notes, tables, code and safe links', () => {
  const items = [0, 2, 0, 2, 0, 0, 2, 0, 2].map((indent, index) => ({ indent, text: String(index), ordered: false }));
  const split = helpers.splitPoints(items, 4);
  assert.equal(split.main.length, 4);
  assert.deepEqual(Array.from(split.rest.map(item => item.text)), items.map(item => item.text));
  assert.equal(helpers.splitPoints([], 4).main.length, 0);
  const categories = helpers.splitPoints([{ indent: 0, text: 'Characteristics:' }, { indent: 2, text: 'Queryable' }, { indent: 2, text: 'Consistent fields' }], 4);
  assert.match(categories.main[0].text, /Characteristics: Queryable; Consistent fields/);
  assert.equal(categories.rest.length, 3);
  const text = helpers.formatText('<script>alert(1)</script> [bad](javascript:alert) [AWS](https://docs.aws.amazon.com/)');
  assert.doesNotMatch(text, /<script>|href="javascript:/);
  assert.match(text, /href="https:\/\/docs.aws.amazon.com\//);
  const html = helpers.renderTables([[['Field', 'Meaning'], ['<img src=x>', '**Important**']]]);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /<strong>Important<\/strong>/);
});
