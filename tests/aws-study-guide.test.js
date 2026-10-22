const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const notes = fs.readFileSync('docs/aws-data-eng-associate.md', 'utf8');
const sandbox = { window: { addEventListener() {} }, document: { getElementById: () => null }, fetch: () => new Promise(() => {}) };
vm.createContext(sandbox);
const guide = fs.readFileSync('assets/js/aws-study-guide.js', 'utf8').replace('  fetch(sourcePath',
  '  window.studyTest = { parseMarkdown, formatText, renderList, renderVisual, renderTables, renderContent, groupTopics, matchesTopic };\n  fetch(sourcePath');
vm.runInContext(guide, sandbox);
const helpers = sandbox.window.studyTest;
const slides = helpers.parseMarkdown(notes);

test('study notes have no document attribution or page annotations', () => {
  assert.doesNotMatch(notes, /supplemented and paraphrased from|<!-- [\w-]*page:/i);
  assert.ok(slides.length > 700);
});

test('topics are grouped and searchable by section and title', () => {
  const topics = slides.filter(slide => !slide.isSection);
  const groups = helpers.groupTopics(topics);
  assert.equal(groups.length, slides.filter(slide => slide.isSection).length);
  assert.equal(groups[0].section, 'Fundamentals');
  assert.equal(groups.reduce((count, group) => count + group.topics.length, 0), topics.length);
  assert.ok(helpers.matchesTopic(topics.find(slide => /DynamoDB/i.test(slide.title)), 'dynamodb'));
  assert.ok(helpers.matchesTopic(topics[0], 'fundamentals'));
  assert.equal(slides.find(slide => slide.originalNote === 110).title, 'AWS Batch');
});

test('all migrated visuals are owned by their Markdown topics', () => {
  const diagrams = slides.flatMap(slide => slide.visuals).filter(visual => visual.type === 'mermaid');
  const images = slides.flatMap(slide => slide.visuals).filter(visual => visual.type === 'image');
  assert.ok(diagrams.length >= 336);
  assert.ok(images.length <= 1);
  assert.equal(diagrams.filter(visual => visual.source.startsWith('architecture-beta')).length, 4);
  assert.ok(diagrams.every(visual => visual.source));
  assert.ok(slides.length >= 764);
  assert.equal(fs.existsSync('assets/js/aws-study-visuals.js'), false);
  assert.doesNotMatch(fs.readFileSync('aws-study-guide.html', 'utf8'), /gojs|aws-study-visuals/i);
  const keyConcepts = slides.find(slide => ['Key Concepts', 'Data Engineering Lifecycle'].includes(slide.title) && slide.visuals.length).visuals[0];
  assert.match(keyConcepts.source, /^flowchart LR/);
  assert.doesNotMatch(keyConcepts.source, /\(\(|layout:\s*(elk\.(force|radial)|circular)/);
  for (const stage of ['Generation', 'Storage', 'Ingestion', 'Transformation', 'Serving']) assert.ok(keyConcepts.source.includes('["' + stage + '"]'));
});

test('every JOIN overview and SQL example uses a Mermaid Venn diagram', () => {
  const titles = [
    /^INNER JOIN$/,
    /^INNER JOIN(?:: SQL Example| worked example)$/,
    /^LEFT OUTER JOIN$/,
    /^LEFT JOIN(?:: SQL Example| worked example)$/,
    /^RIGHT OUTER JOIN$/,
    /^RIGHT JOIN(?:: SQL Example| worked example)$/,
    /^FULL OUTER JOIN$/,
    /^CROSS JOIN$/,
    /^CROSS JOIN(?:: SQL Example| worked example)$/
  ];
  for (const title of titles) {
    const slide = slides.find(item => title.test(item.title));
    assert.ok(slide, 'Missing JOIN slide: ' + title);
    assert.equal(slide.visuals.filter(visual => visual.type === 'mermaid' && visual.source.startsWith('venn-beta')).length, 1, slide.title);
    if (/^CROSS JOIN/.test(slide.title)) assert.doesNotMatch(slide.visuals.find(visual => visual.type === 'mermaid').source, /\bunion\b/);
  }
});

test('Mermaid fences and captions stay attached to their own repeated headings', () => {
  const fixture = helpers.parseMarkdown('## Same\nIntro\n\n```mermaid\nflowchart LR\n A["# heading inside diagram"] --> B["Second"]\n```\n\n> First caption\n\n## Same\n```mermaid\narchitecture-beta\n service store(database)[Store]\n```\n\n> Second caption');
  assert.equal(fixture.length, 2);
  assert.equal(fixture[0].paragraphs.join(''), 'Intro');
  assert.equal(fixture[0].visuals[0].caption, 'First caption');
  assert.equal(fixture[1].visuals[0].caption, 'Second caption');
  assert.match(fixture[0].visuals[0].source, /# heading inside diagram/);
  const html = helpers.renderVisual(fixture[0]);
  assert.match(html, /tabindex="0" role="region"/);
  const prose = helpers.parseMarkdown('## Prose\nFirst paragraph.\n\nSecond paragraph.\n\n> Quoted example.');
  assert.deepEqual(Array.from(prose[0].paragraphs), ['First paragraph.', 'Second paragraph.', 'Quoted example.']);
  assert.match(html, /data-diagram-fit disabled/);
  assert.match(html, /<figcaption>First caption<\/figcaption>/);
  assert.doesNotMatch(html, /diagram-text|<canvas/);
});

test('network architecture preserves AZ containment and outbound direction', () => {
  const source = slides.find(slide => slide.title === 'Internet Gateway & NAT Gateways').visuals[0].source;
  assert.match(source, /^architecture-beta/);
  assert.match(source, /group az\(cloud\)\[AZ - Availability Zone\]/);
  for (const id of ['public', 'nat', 'private']) assert.match(source, new RegExp('service ' + id + '.* in az'));
  assert.match(source, /www:B <--> T:igw/);
  assert.match(source, /private:T --> B:nat/);
  assert.doesNotMatch(source, /service (www|igw).* in az/);
});

test('Markdown images use safe paths and captions cannot inject markup', () => {
  const fixture = helpers.parseMarkdown('## Image\n![Diagram description](/assets/images/lakehouse-databricks.png)\n\n> <script>bad()</script>\n\n## Invalid\n![Unsafe](javascript:alert)\n\n## Detailed\n### Detailed notes\n```mermaid\nflowchart LR\n A --> B\n```\n> Nested caption');
  assert.equal(fixture[0].visuals[0].type, 'image');
  assert.equal(fixture[1].visuals.length, 0);
  assert.doesNotMatch(helpers.renderVisual(fixture[0]), /<script>/);
  assert.match(helpers.renderVisual(fixture[0]), /alt="Diagram description"/);
  assert.equal(fixture[2].visuals.length, 0);
  assert.equal(fixture[2].detailedNotes.visuals[0].caption, 'Nested caption');
});

test('all top-level list items render and tables and links remain safe', () => {
  const items = Array.from({ length: 8 }, (_, index) => ({ indent: 0, text: String(index), ordered: false }));
  assert.match(helpers.renderList(items), /<li>7<\/li>/);
  const text = helpers.formatText('<script>alert(1)</script> [bad](javascript:alert) [AWS](https://docs.aws.amazon.com/)');
  assert.doesNotMatch(text, /<script>|href="javascript:/);
  assert.match(text, /href="https:\/\/docs.aws.amazon.com\//);
  const html = helpers.renderTables([[['Field', 'Meaning'], ['<img src=x>', '**Important**']]]);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /<strong>Important<\/strong>/);
});

test('mixed Markdown blocks render in their source order', () => {
  const fixture = helpers.parseMarkdown('## Ordered\nBefore the query.\n\n```sql\nSELECT 1;\n```\n\n| Field | Meaning |\n|---|---|\n| id | Identifier |\n\nAfter the table.')[0];
  assert.deepEqual(Array.from(fixture.blocks.map(block => block.type)), ['paragraph', 'code', 'table', 'paragraph']);
  const html = helpers.renderContent(fixture.blocks, fixture.title);
  assert.ok(html.indexOf('Before the query.') < html.indexOf('<pre'));
  assert.ok(html.indexOf('<pre') < html.indexOf('<div class="study-table"'));
  assert.ok(html.indexOf('<div class="study-table"') < html.indexOf('After the table.'));
});

test('detailed material renders only under an explicit nested heading', () => {
  const fixture = helpers.parseMarkdown('## Topic\n- Summary point\n- Hidden unless expanded\n\n### Detailed notes\n- Expanded point\n\n## Another topic\n- Another summary');
  assert.equal(fixture.length, 2);
  assert.deepEqual(Array.from(fixture[0].listItems.map(item => item.text)), ['Summary point', 'Hidden unless expanded']);
  assert.deepEqual(Array.from(fixture[0].detailedNotes.listItems.map(item => item.text)), ['Expanded point']);
  assert.equal(fixture[1].detailedNotes, undefined);
});
