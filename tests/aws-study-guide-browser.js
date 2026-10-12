/* Run in the locally served study deck at desktop and narrow mobile widths. */
(async () => {
  const checks = [];
  const assert = (ok, message) => { if (!ok) throw new Error(message); checks.push(message); };
  const pause = () => new Promise(resolve => setTimeout(resolve, 80));
  const slide = document.getElementById('slide');
  const search = document.getElementById('topic-search');
  const collection = document.getElementById('study-collection');
  for (let i = 0; i < 100 && !document.querySelector('[data-slide-index]'); i++) await pause();
  const searchFor = query => { search.value = query; search.dispatchEvent(new Event('input', { bubbles: true })); };
  async function page(n) {
    location.hash = 'page-' + n;
    await pause();
    assert(slide.querySelector('.slide-index').textContent.includes('PDF page ' + n), 'Direct page navigation: ' + n);
    assert(document.querySelectorAll('.site-header a[aria-current="page"]').length === 2, 'Page links preserve the active study-guide menu item: ' + n);
  }
  assert(document.querySelectorAll('[data-slide-index]').length > 730, 'Complete course sequence loads');
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

  for (const n of [39, 103, 162, 188, 319, 327, 408, 490, 491, 492, 543, 715, 765]) {
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
  }

  await page(306);
  slide.querySelector('.notes-details').open = true;
  assert(slide.querySelectorAll('table tbody tr').length === 4, 'Storage comparison is a semantic table');
  await page(54);
  slide.querySelector('.notes-details').open = true;
  assert(slide.querySelector('code').textContent.includes('GROUP BY department_id'), 'Image-only SQL example is readable code');
  await page(53);
  assert(slide.querySelector('.source-reference a').href.startsWith('https://docs.aws.amazon.com/'), 'Dated correction links to primary documentation');

  const goLibrary = window.go;
  window.go = undefined;
  await page(23);
  assert(slide.querySelector('.study-diagram').hidden && !slide.querySelector('.diagram-fallback').hidden, 'Blocked diagram library has a visible fallback');
  assert(slide.querySelector('.diagram-text').open && slide.querySelectorAll('.diagram-text li').length > 5, 'Fallback includes full components and relationships');
  window.go = goLibrary;

  collection.value = 'personal';
  collection.dispatchEvent(new Event('change', { bubbles: true }));
  assert(document.querySelectorAll('[data-slide-index]').length > 100 && document.querySelectorAll('[data-slide-index]').length < 250, 'Personal working notes remain a separate collection');
  searchFor('Cardinality');
  visible = [...document.querySelectorAll('[data-slide-index]')].filter(button => !button.hidden);
  assert(visible.length === 1, 'Unfinished personal heading remains searchable');
  visible[0].click();
  assert(slide.querySelector('.empty-note'), 'Unfinished topic is labeled instead of invented');
  await page(543);
  assert(collection.value === 'course', 'Page links restore the course collection');
  const arrow = document.getElementById('overview-toggle').getBoundingClientRect();
  const stage = document.querySelector('.study-stage').getBoundingClientRect();
  assert(arrow.left >= stage.left && arrow.right <= stage.right && arrow.width >= 44, 'Sidebar arrow and touch target fit');
  assert(document.documentElement.scrollWidth <= innerWidth, 'Final viewport has no horizontal overflow');
  return { viewport: innerWidth, checks: checks.length, page: location.hash };
})();
