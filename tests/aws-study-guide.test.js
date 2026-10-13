const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const notes = fs.readFileSync('docs/aws-data-eng-associate.md', 'utf8');
const coverage = JSON.parse(fs.readFileSync('docs/aws-study-source-coverage.json', 'utf8'));
const sandbox = { window: {}, document: { getElementById: () => null }, fetch: () => new Promise(() => {}) };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('assets/js/aws-study-visuals.js', 'utf8'), sandbox);
// Exercise the production parser and render helpers without starting a browser.
const guide = fs.readFileSync('assets/js/aws-study-guide.js', 'utf8').replace('  fetch(sourcePath)',
  '  window.studyTest = { parseMarkdown, formatText, renderList, renderVisual, renderTables, splitPoints, getVisual, groupTopics, matchesTopic };\n  fetch(sourcePath)');
vm.runInContext(guide, sandbox);
const helpers = sandbox.window.studyTest;
const slides = helpers.parseMarkdown(notes);
const visuals = sandbox.window.studyVisuals;

test('all 765 physical pages are accounted for, with no material beyond the requested boundary', () => {
  assert.deepEqual(coverage.physicalPageRange, [1, 765]);
  assert.equal(coverage.pages.length, 765);
  assert.deepEqual(coverage.pages.map(p => p.page), Array.from({ length: 765 }, (_, i) => i + 1));
  const studyPages = coverage.pages.filter(p => p.status === 'study').map(p => p.page);
  assert.deepEqual(Array.from(slides.filter(s => s.sourcePage).map(s => s.sourcePage)), studyPages);
  assert.equal(new Set(studyPages).size, studyPages.length);
  assert.ok(coverage.pages.filter(p => p.status !== 'study').every(p => p.reason));
  assert.equal(slides.find(s => s.sourcePage === 765).title, 'API Gateway – Security');
});

test('original headings and prompts are integrated into one paraphrased guide without the removed introductions', () => {
  const headings = notes.replace(/\r/g, '').match(/^ {0,3}#{1,6}[^\n]*/gm);
  const counts = list => list.reduce((result, heading) => result.set(heading, (result.get(heading) || 0) + 1), new Map());
  const actual = counts(headings);
  for (const [heading, count] of counts(coverage.preservedHeadings)) assert.ok(actual.get(heading) >= count, heading);
  assert.equal(slides.filter(s => s.originalNote !== undefined).length, coverage.originalNoteMerge.length);
  assert.ok(slides.some(s => /cardinality/i.test(s.title) && s.unexpanded));
  assert.ok(slides.some(s => s.title === 'Data Lakehouses' && s.sourcePage === 27));
  assert.equal(slides.find(s => s.sourcePage === 204).title, 'RDS best practices: unexpanded source heading');
  assert.doesNotMatch(notes, /collection: personal|collection: course|# Section Study approach|# Section Course orientation|## How to use this study guide/);
  assert.match(notes, /clinical-system database records with JSON/);
  assert.match(notes, /RowCount >= 100/);
  assert.ok(slides.find(s => s.sourcePage === 22).paragraphs[0].startsWith('A warehouse brings curated'));
  for (const page of [4, 7, 8, 9, 10, 11]) assert.equal(coverage.pages[page - 1].status, 'context');
});

test('topics form ordered section sublists while numeric and text searches retain their meaning', () => {
  const topics = slides.filter(s => !s.isSection);
  const groups = helpers.groupTopics(topics);
  assert.equal(groups.length, 15);
  assert.equal(groups[0].section, 'Fundamentals');
  assert.equal(topics[0].sourcePage, 13, 'The presentation starts with substantive notes');
  assert.equal(groups.reduce((count, group) => count + group.topics.length, 0), topics.length);
  for (const group of groups) for (const topic of group.topics) {
    assert.equal(topic.slide, topics[topic.index]);
    assert.equal(topic.slide.section, group.section);
  }
  assert.ok(helpers.matchesTopic(topics.find(s => s.sourcePage === 765), '765'));
  assert.ok(!helpers.matchesTopic(topics.find(s => s.sourcePage === 764), '765'));
  assert.ok(helpers.matchesTopic(topics.find(s => s.sourcePage === 162), 'dynamodb'));
  assert.ok(helpers.matchesTopic(topics[0], 'fundamentals'));
  assert.ok(slides.find(s => s.originalNote === 110).title === 'AWS Batch', 'Indented original headings parse correctly');
});

test('every source schematic has a corresponding note, unique ID and complete graph endpoints', () => {
  const ids = new Set();
  const sourceVisuals = Object.entries(visuals).filter(([key]) => key.startsWith('pdf:'));
  assert.equal(sourceVisuals.length, coverage.pages.filter(p => p.visual).length);
  for (const [key, visual] of sourceVisuals) {
    assert.equal(key, `pdf:${visual.sourcePage}`);
    assert.ok(visual.sourcePage >= 1 && visual.sourcePage <= 765);
    assert.ok(!ids.has(visual.id), visual.id);
    ids.add(visual.id);
    const keys = new Set(visual.nodes.map(n => n.key));
    assert.equal(keys.size, visual.nodes.length, key);
    assert.ok(visual.nodes.every(n => n.text && typeof n.detail === 'string'), key);
    assert.ok(visual.links.every(l => keys.has(l.from) && keys.has(l.to) && l.label), key);
    const slide = slides.find(s => s.sourcePage === visual.sourcePage);
    assert.ok(slide, key);
    assert.equal(helpers.getVisual(slide), visual);
    const html = helpers.renderVisual(slide);
    assert.match(html, /Read diagram as text/);
    assert.ok(visual.links.every(l => html.includes(helpers.formatText(l.label))), key);
  }
  assert.ok(visuals['Data Lakehouses'] && visuals['DynamoDB Streams'], 'Existing personal-note visuals retained');
});

test('page lookup disambiguates repeated headings and structural links are not described as data delivery', () => {
  const a = { title: 'Same title', sourcePage: 162 };
  const b = { title: 'Same title', sourcePage: 163 };
  assert.notEqual(helpers.getVisual(a), helpers.getVisual(b));
  const structure = helpers.renderVisual(a);
  assert.match(structure, /Structure diagram/);
  assert.doesNotMatch(structure, / sends /);
  assert.ok(visuals['pdf:162'].links.every(l => l.relation));
});

test('source-specific diagrams retain the enrollment model and distinguish lifecycle and private-network alternatives', () => {
  assert.equal(visuals['pdf:39'].nodes[0].text, 'Fact_Enrollments');
  assert.deepEqual(Array.from(visuals['pdf:39'].links.map(l => l.label)), ['CourseID', 'StudentID', 'PaymentID']);
  const lifecycle = visuals['pdf:103'];
  const oneZone = lifecycle.nodes.find(n => n.text === 'One Zone-IA').key;
  const instant = lifecycle.nodes.find(n => n.text === 'Glacier Instant Retrieval').key;
  assert.ok(!lifecycle.links.some(l => l.from === oneZone && l.to === instant), 'One Zone-IA cannot lifecycle-transition to Glacier Instant Retrieval');
  assert.ok(visuals['pdf:319'].links.some(l => l.from === '0' && l.to === '3'), 'Hosted VM model retains the host OS');
  assert.ok(visuals['pdf:490'].nodes.some(n => /connection ENI/.test(n.text)));
  assert.ok(visuals['pdf:491'].nodes.some(n => /VPC peering/.test(n.text)));
  const alternatives = visuals['pdf:492'];
  assert.ok(alternatives.nodes.some(n => /Transit Gateway/.test(n.text)));
  assert.ok(alternatives.nodes.some(n => /PrivateLink/.test(n.text)));
  assert.ok(alternatives.links.some(l => l.label === 'VPC sharing option'));
});

test('presentation stays brief while the complete nested reference outline remains available', () => {
  const items = [0, 2, 0, 2, 0, 0, 2, 0, 2].map((indent, i) => ({ indent, text: String(i), ordered: false }));
  const split = helpers.splitPoints(items, 4);
  assert.equal(split.main.length, 4);
  assert.ok(split.main.every(i => i.indent === 0));
  assert.deepEqual(Array.from(split.rest.map(i => i.text)), items.map(i => i.text));
  assert.equal(helpers.splitPoints([], 4).main.length, 0);
  const categories = helpers.splitPoints([{ indent: 0, text: 'Characteristics:' }, { indent: 2, text: 'Queryable' }, { indent: 2, text: 'Consistent fields' }], 4);
  assert.match(categories.main[0].text, /Characteristics: Queryable; Consistent fields/);
  assert.equal(categories.rest.length, 3, 'Summaries keep the complete original outline in details');
  const sql = slides.find(s => s.sourcePage === 54);
  assert.match(sql.code[0], /WHERE join_date/);
  assert.ok(slides.find(s => s.sourcePage === 540).code[0].includes('hello >> airflow()'));
  assert.equal(slides.find(s => s.sourcePage === 306).tables[0].length, 5);
});

test('inline links, tables and code remain HTML-safe', () => {
  const text = helpers.formatText('<script>alert(1)</script> [bad](javascript:alert) [AWS](https://docs.aws.amazon.com/)');
  assert.doesNotMatch(text, /<script>|href="javascript:/);
  assert.match(text, /href="https:\/\/docs.aws.amazon.com\/"/);
  const html = helpers.renderTables([[['Field', 'Meaning'], ['<img src=x>', '**Important**']]]);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /<strong>Important<\/strong>/);
  const fixture = helpers.parseMarkdown('## Example\n<!-- pdf-page: 20 -->\n\n```sql\n# not a heading\nSELECT 1;\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |');
  assert.equal(fixture.length, 1);
  assert.equal(fixture[0].sourcePage, 20);
  assert.equal(fixture[0].tables[0].length, 2);
  assert.match(fixture[0].code[0], /# not a heading/);
});

test('selected source corrections replace the inaccurate claims in their course topics', () => {
  const pageText = n => {
    const slide = slides.find(s => s.sourcePage === n);
    return slide.paragraphs.join(' ') + ' ' + slide.listItems.map(i => i.text).join(' ');
  };
  assert.match(pageText(53), /WHERE filters input rows before grouping/);
  assert.doesNotMatch(pageText(173), /Unlimited WCU|no throttle/);
  assert.match(pageText(252), /can be configured for public accessibility/);
  assert.match(pageText(489), /blanket same-Region restriction is not universal/);
  assert.match(pageText(500), /floating point is approximate/);
  assert.match(pageText(678), /Ground Truth Plus is a separate/);
  assert.match(pageText(740), /not a requirement/);
  assert.doesNotMatch(pageText(180), /Run queries across multiple DynamoDB tables/);
  assert.match(pageText(187), /separate change-capture option/);
  assert.match(pageText(291), /Managed Instances supports up to 5,400 seconds/);
});
