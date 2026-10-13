/* Run in the locally served study deck at desktop and narrow mobile widths. */
(async () => {
  const checks = [];
  const assert = (ok, message) => { if (!ok) throw new Error(message); checks.push(message); };
  const pause = () => new Promise(resolve => setTimeout(resolve, 80));
  const slide = document.getElementById('slide');
  const search = document.getElementById('topic-search');
  for (let i = 0; i < 100 && !document.querySelector('[data-slide-index]'); i++) await pause();
  const searchFor = query => { search.value = query; search.dispatchEvent(new Event('input', { bubbles: true })); };
  async function page(n) {
    location.hash = 'page-' + n;
    await pause();
    assert(slide.querySelector('.slide-index').textContent.includes('PDF page ' + n), 'Direct page navigation: ' + n);
    assert(document.querySelectorAll('.site-header a[aria-current="page"]').length === 2, 'Page links preserve the active study-guide menu item: ' + n);
    assert(document.querySelector('[data-slide-index][aria-current="true"]').closest('.topic-section').open, 'Navigation expands the selected section: ' + n);
  }
  assert(document.querySelectorAll('[data-slide-index]').length > 724, 'Merged source topics and original review prompts load together');
  assert(!document.getElementById('study-collection'), 'There is one merged guide without separate collections');
  assert(slide.querySelector('h2').textContent === 'Types of Data', 'The guide opens directly with substantive notes');
  const groups = [...document.querySelectorAll('.topic-section')];
  assert(groups.length === 15 && groups.every(group => group.querySelector(':scope > summary') && group.querySelector(':scope > ul')), 'Each section has an expandable sublist');
  assert(groups.filter(group => group.open).length === 1 && groups[0].open, 'Only the active section starts expanded');
  assert([...document.querySelectorAll('[data-slide-index]')].every(button => button.children.length === 1 && button.firstElementChild.matches('.topic-title') && !/\bp\.\s*\d/i.test(button.textContent)), 'Topic rows contain only a title, without repeated sections or page numbers');
  const databases = groups.find(group => group.dataset.section === 'Databases');
  databases.querySelector('summary').click();
  assert(databases.open && databases.querySelector('button').checkVisibility(), 'Expanding a section reveals its topics');
  databases.querySelector('summary').click();
  assert(!databases.open && !databases.querySelector('button').checkVisibility(), 'Collapsing a section hides its topics');
  const storage = groups.find(group => group.dataset.section === 'Storage');
  storage.querySelector('summary').click();
  await pause();
  const expandedBefore = groups.filter(group => group.open).map(group => group.dataset.section).join('|');
  searchFor('DynamoDB');
  assert(databases.open && groups.filter(group => !group.hidden).every(group => group.open && [...group.querySelectorAll('button')].some(button => !button.hidden && /dynamodb/i.test(button.textContent))) && groups.some(group => group.hidden), 'Search opens matching sections and hides unrelated sections');
  await pause();
  searchFor('');
  assert(groups.filter(group => group.open).map(group => group.dataset.section).join('|') === expandedBefore, 'Clearing search restores section expansion choices');
  searchFor('no-such-study-topic');
  assert(groups.every(group => group.hidden) && document.getElementById('topic-results').textContent.startsWith('No matching'), 'Search has an explicit empty state');
  searchFor('');
  searchFor('765');
  let visible = [...document.querySelectorAll('[data-slide-index]')].filter(button => !button.hidden);
  assert(visible.length === 1 && visible[0].textContent.includes('API Gateway'), 'Exact physical-page search');
  visible[0].click();
  assert(document.getElementById('next').disabled, 'Page 765 is the end of the course sequence');
  search.focus();
  const sidebarBefore = document.getElementById('overview-toggle').getAttribute('aria-expanded');
  search.dispatchEvent(new KeyboardEvent('keydown', { key: 'o', bubbles: true }));
  assert(document.getElementById('overview-toggle').getAttribute('aria-expanded') === sidebarBefore, 'Typing in search does not trigger presentation shortcuts');
  searchFor('DynamoDB');
  visible = [...document.querySelectorAll('[data-slide-index]')].filter(button => !button.hidden);
  assert(visible.length > 10 && visible.every(button => /dynamodb/i.test(button.textContent)), 'Service-name search filters topic titles');

  for (const n of [39, 103, 162, 188, 319, 327, 408, 490, 491, 492, 543, 595, 715, 765]) {
    await page(n);
    const host = slide.querySelector('.study-diagram');
    const model = go.Diagram.fromDiv(host);
    for (let i = 0; i < 25 && !model.documentBounds.width; i++) await pause();
    const visual = window.studyVisuals['pdf:' + n];
    assert(model && model.nodes.count === visual.nodes.length && model.links.count === visual.links.length, 'Complete rendered model: ' + n);
    assert(model.documentBounds.width > 0 && model.scale > 0, 'Diagram lays out: ' + n);
    assert(!model.animationManager.isEnabled || !matchMedia('(prefers-reduced-motion: reduce)').matches, 'Reduced-motion setting respected: ' + n);
    const scale = model.scale;
    slide.querySelector('[data-diagram-zoom="in"]').click();
    assert(model.scale > scale, 'Button-operated zoom: ' + n);
    slide.querySelector('[data-diagram-fit]').click();
    const text = slide.querySelector('.diagram-text');
    text.open = true;
    assert(text.querySelectorAll('li').length === visual.nodes.length + visual.links.length, 'Complete readable diagram alternative: ' + n);
    const shapeArrows = [];
    model.links.each(link => shapeArrows.push(link.elt(1).toArrow));
    if (visual.kind === 'structure') assert(shapeArrows.every(arrow => arrow === ''), 'Structural relations omit flow arrowheads');
    assert(document.documentElement.scrollWidth <= innerWidth, 'No horizontal overflow: ' + n);
    assert(slide.querySelectorAll(':scope > div > .note-list > li').length <= 4, 'Presentation shows at most four key points: ' + n);
    if (n === 595) {
      const az = model.findNodeForKey('az');
      const node = key => model.findNodeForKey(key);
      assert(az instanceof go.Group && az.elt(0).strokeDashArray.join(',') === '8,6', 'AZ renders as a dashed container');
      assert(['public', 'nat', 'private'].every(key => node(key).containingGroup === az && az.actualBounds.containsRect(node(key).actualBounds)), 'AZ encloses both subnets and NAT');
      assert(['www', 'igw'].every(key => !node(key).containingGroup && node(key).actualBounds.bottom < az.actualBounds.top), 'WWW and IGW remain above and outside the AZ');
      const order = ['www', 'igw', 'public', 'nat', 'private'].map(key => node(key).location.y);
      assert(order.every((y, index) => !index || y > order[index - 1]), 'Network layout runs vertically with WWW first');
      const links = [...model.links];
      assert(links.filter(link => link.elt(2).fromArrow === 'Backward' && link.elt(1).toArrow === 'Standard').length === 3, 'Three connections have arrows at both ends');
      const outbound = links.find(link => link.data.from === 'private' && link.data.to === 'nat');
      assert(outbound && outbound.elt(2).fromArrow === '' && outbound.elt(1).toArrow === 'Standard', 'Private subnet points only toward NAT');
    }
  }

  await page(521);
  const fanOutPoints = [...slide.querySelectorAll(':scope > div > .note-list > li')].map(point => point.textContent);
  const fanOutDetails = slide.querySelector('.notes-details');
  assert(fanOutPoints.length === 4, 'Fan-out card shows four key points');
  assert(fanOutDetails.querySelectorAll('li').length === 1 && fanOutDetails.textContent.includes('destination queue policy'), 'Fan-out details contain the additional queue-policy point');
  assert(fanOutPoints.every(point => !fanOutDetails.textContent.includes(point)), 'Fan-out details do not repeat the card points');

  await page(306);
  slide.querySelector('.notes-details').open = true;
  assert(slide.querySelectorAll('table tbody tr').length === 4, 'Storage comparison is a semantic table');
  await page(54);
  slide.querySelector('.notes-details').open = true;
  assert(slide.querySelector('code').textContent.includes('GROUP BY department_id'), 'Image-only SQL example is readable code');
  await page(351);
  slide.querySelector('.notes-details').open = true;
  assert(slide.querySelector('code').textContent.includes('RowCount >= 100'), 'Original DQDL example is merged into the related PDF topic');
  await page(53);
  assert(slide.querySelector('.source-reference a').href.startsWith('https://docs.aws.amazon.com/'), 'Dated correction links to primary documentation');

  const goLibrary = window.go;
  window.go = undefined;
  await page(23);
  assert(slide.querySelector('.study-diagram').hidden && !slide.querySelector('.diagram-fallback').hidden, 'Blocked diagram library has a visible fallback');
  assert(slide.querySelector('.diagram-text').open && slide.querySelectorAll('.diagram-text li').length > 5, 'Fallback includes full components and relationships');
  await page(595);
  assert(slide.querySelector('.diagram-text').open && slide.querySelector('.diagram-text').textContent.includes('inside AZ') && slide.querySelector('.diagram-text').textContent.includes('↔'), 'Network fallback preserves containment and bidirectional relationships');
  window.go = goLibrary;

  searchFor('Cardinality');
  visible = [...document.querySelectorAll('[data-slide-index]')].filter(button => !button.hidden);
  assert(visible.length === 1, 'Unfinished personal heading remains searchable');
  visible[0].click();
  assert(slide.querySelector('.empty-note'), 'Unfinished topic is labeled instead of invented');
  location.hash = 'note-81';
  await pause();
  assert(slide.querySelector('h2').textContent === 'Database review prompt 1' && slide.querySelector('.empty-note'), 'Blank original headings remain labeled review prompts');
  await page(543);
  const arrow = document.getElementById('overview-toggle').getBoundingClientRect();
  const stage = document.querySelector('.study-stage').getBoundingClientRect();
  assert(arrow.left >= stage.left && arrow.right <= stage.right && arrow.width >= 44, 'Sidebar arrow and touch target fit');
  assert(document.documentElement.scrollWidth <= innerWidth, 'Final viewport has no horizontal overflow');
  return { viewport: innerWidth, checks: checks.length, page: location.hash };
})();
