/* Run in the locally served study deck at desktop and narrow mobile widths. */
(async () => {
  const checks = [];
  const assert = (ok, message) => { if (!ok) throw new Error(message); checks.push(message); };
  const pause = () => new Promise(resolve => setTimeout(resolve, 80));
  const slide = document.getElementById('slide');
  const search = document.getElementById('topic-search');
  for (let i = 0; i < 100 && !document.querySelector('[data-slide-index]'); i++) await pause();
  const searchFor = query => { search.value = query; search.dispatchEvent(new Event('input', { bubbles: true })); };
  const sectionFor = key => key.slice('topic:'.length).split('::')[0];
  const titleFor = key => key.slice(key.indexOf('::') + 2).replace(/ \[\d+\]$/, '');
  async function topic(key) {
    const group = [...document.querySelectorAll('.topic-section')].find(item => item.dataset.section === sectionFor(key));
    const button = [...group.querySelectorAll('.topic-button')].find(item => item.textContent.trim() === titleFor(key));
    button.click();
    await pause();
    assert(slide.querySelector('.slide-index').textContent === 'Study notes', 'Slide has no source-page label');
    assert(slide.querySelector('h2').textContent === titleFor(key), 'Topic navigation selects the requested heading');
    assert(group.open, 'Navigation expands the selected topic section');
    assert(!slide.querySelector('.notes-details'), 'Detailed notes stay hidden without an explicit nested heading');
  }
  assert(document.querySelectorAll('[data-slide-index]').length > 700, 'Personal study topics load');
  assert(!document.getElementById('study-collection'), 'There is one study guide');
  assert(slide.querySelector('h2').textContent === 'Types of Data', 'The guide opens at the first substantive topic');
  assert(slide.querySelector('.slide-index').textContent === 'Study notes', 'Slides use a neutral index label');

  const groups = [...document.querySelectorAll('.topic-section')];
  assert(groups.length === 15 && groups.every(group => group.querySelector(':scope > summary') && group.querySelector(':scope > ul')), 'Sections have expandable topic lists');
  const databases = groups.find(group => group.dataset.section === 'Databases');
  databases.querySelector('summary').click();
  assert(databases.open && databases.querySelector('button').checkVisibility(), 'Expanding a section reveals topics');
  databases.querySelector('summary').click();
  assert(!databases.open && !databases.querySelector('button').checkVisibility(), 'Collapsing a section hides topics');
  const expandedBefore = groups.filter(group => group.open).map(group => group.dataset.section).join('|');
  searchFor('DynamoDB');
  assert(groups.some(group => !group.hidden) && groups.some(group => group.hidden), 'Search shows matching sections and hides unrelated sections');
  searchFor('no-such-study-topic');
  assert(groups.every(group => group.hidden) && document.getElementById('topic-results').textContent.startsWith('No matching'), 'Search has an explicit empty state');
  searchFor('');
  assert(groups.filter(group => group.open).map(group => group.dataset.section).join('|') === expandedBefore, 'Clearing search restores section expansion choices');

  const entries = Object.entries(window.studyVisuals).filter(([key, visual]) => key.startsWith('topic:') && visual.type === 'diagram');
  const sample = entries.slice(0, 8).concat(entries.filter(([key]) => key.includes('Internet Gateway & NAT Gateways')));
  for (const [key, visual] of sample) {
    await topic(key);
    const host = slide.querySelector('.study-diagram');
    const model = go.Diagram.fromDiv(host);
    for (let i = 0; i < 25 && model && !model.documentBounds.width; i++) await pause();
    assert(model && model.nodes.count === visual.nodes.length && model.links.count === visual.links.length, 'Diagram renders its complete model');
    assert(model.documentBounds.width > 0 && model.scale > 0, 'Diagram lays out');
    assert(!model.animationManager.isEnabled || !matchMedia('(prefers-reduced-motion: reduce)').matches, 'Reduced-motion setting is respected');
    const scale = model.scale;
    slide.querySelector('[data-diagram-zoom="in"]').click();
    assert(model.scale > scale, 'Diagram zoom button works');
    slide.querySelector('[data-diagram-fit]').click();
    assert(!slide.querySelector('.diagram-text'), 'Diagram text disclosure is absent');
    assert(document.documentElement.scrollWidth <= innerWidth, 'No horizontal overflow');
    if (key.includes('Internet Gateway & NAT Gateways')) {
      const az = model.findNodeForKey('az');
      assert(az instanceof go.Group && az.elt(0).strokeDashArray.join(',') === '8,6', 'AZ renders as a dashed container');
      assert(['public', 'nat', 'private'].every(id => model.findNodeForKey(id).containingGroup === az), 'AZ contains its subnets and NAT');
    }
  }

  searchFor('DynamoDB');
  const first = [...document.querySelectorAll('[data-slide-index]')].find(button => !button.hidden);
  first.click();
  document.getElementById('next').click();
  assert(slide.querySelector('h2').textContent !== first.textContent.trim(), 'Next advances to another topic');
  assert(document.documentElement.scrollWidth <= innerWidth, 'Final viewport has no horizontal overflow');
  return { viewport: innerWidth, checks: checks.length, page: location.hash };
})();
