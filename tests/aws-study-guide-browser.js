/* Run in the locally served study deck at desktop and narrow mobile widths. */
(async () => {
  const checks = [];
  const assert = (ok, message) => { if (!ok) throw new Error(message); checks.push(message); };
  async function waitFor(condition) {
    for (let i = 0; i < 300; i++) {
      if (condition()) return;
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    throw new Error('Timed out waiting for study UI');
  }
  const slide = document.getElementById('slide');
  const search = document.getElementById('topic-search');
  await waitFor(() => document.querySelectorAll('.topic-button').length === 749);
  function select(section, title) {
    const group = [...document.querySelectorAll('.topic-section')].find(item => item.dataset.section === section);
    const button = [...group.querySelectorAll('.topic-button')].find(item => item.textContent.trim() === title);
    assert(!!button, 'Topic exists: ' + title);
    button.click();
    assert(slide.querySelector('h2').textContent === title && group.open, 'Topic selection expands its section');
  }
  async function diagram(section, title) {
    select(section, title);
    await waitFor(() => slide.querySelector('.study-diagram > svg'));
    const host = slide.querySelector('.study-diagram');
    const svg = host.querySelector(':scope > svg');
    assert(host.getAttribute('aria-busy') === 'false', 'Diagram leaves its loading state');
    assert(host.tabIndex === 0 && svg.getAttribute('role') === 'img' && svg.getAttribute('aria-label'), 'Diagram has keyboard access and an SVG label');
    assert(!slide.querySelector('.diagram-text, .notes-details'), 'No diagram text disclosure or implicit detailed notes');
    assert(svg.viewBox.baseVal.width > 0 && svg.viewBox.baseVal.height > 0, 'SVG geometry is finite');
    const width = parseFloat(svg.style.width);
    slide.querySelector('[data-diagram-zoom="in"]').click();
    assert(parseFloat(svg.style.width) > width, 'Zoom in enlarges the SVG');
    slide.querySelector('[data-diagram-zoom="out"]').click();
    assert(Math.abs(parseFloat(svg.style.width) - width) < 1, 'Zoom out restores its previous scale');
    slide.querySelector('[data-diagram-fit]').click();
    assert(svg.getBoundingClientRect().width <= host.clientWidth + 1 && svg.getBoundingClientRect().height <= host.clientHeight + 1, 'Fit keeps the entire diagram inside its region');
    host.focus();
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    assert(slide.querySelector('h2').textContent === title, 'Diagram arrow keys do not navigate away');
    assert(document.documentElement.scrollWidth <= innerWidth, 'Diagram causes no page overflow');
    return svg;
  }
  assert(slide.querySelector('h2').textContent === 'Key Concepts', 'The deck opens at Key Concepts');
  assert(!window.go && !window.studyVisuals, 'The page has no GoJS or visual sidecar dependency');
  const groups = [...document.querySelectorAll('.topic-section')];
  assert(groups.length === 15, 'All sections are preserved');
  const searchFor = query => { search.value = query; search.dispatchEvent(new Event('input', { bubbles: true })); };
  const expandedBefore = groups.filter(group => group.open).map(group => group.dataset.section).join('|');
  searchFor('DynamoDB');
  assert(groups.some(group => !group.hidden) && groups.some(group => group.hidden), 'Topic search filters sections');
  searchFor('no-such-study-topic');
  assert(groups.every(group => group.hidden) && document.getElementById('topic-results').textContent.startsWith('No matching'), 'Search has an empty state');
  searchFor('');
  assert(groups.filter(group => group.open).map(group => group.dataset.section).join('|') === expandedBefore, 'Clearing search restores expanded sections');

  for (const [section, title, nodeCount] of [
    ['Fundamentals', 'Key Concepts', null],
    ['Fundamentals', 'Data Mesh', 5],
    ['Fundamentals', 'Data Modelling', 4],
    ['Fundamentals', 'Capturing Spark lineage', 5],
    ['Databases', 'Redshift architecture', 4],
    ['Application integration', 'Amazon MWAA Architecture', 10]
  ]) {
    const svg = await diagram(section, title);
    assert(svg.querySelectorAll('.node').length > 0 && (!nodeCount || svg.querySelectorAll('.node').length === nodeCount), 'Flowchart renders its nodes: ' + title);
    assert(getComputedStyle(svg.querySelector('.node rect')).fill === 'rgb(45, 52, 73)', 'Flowchart uses the page palette');
  }
  for (const [title, serviceCount] of [['VPC & Subnets Primer', 4], ['VPC Diagram', 3], ['Internet Gateway & NAT Gateways', 5]]) {
    const svg = await diagram('Networking and delivery', title);
    const services = [...svg.querySelectorAll('.architecture-service')];
    assert(services.length === serviceCount && svg.querySelectorAll('.architecture-groups > rect').length === 1, 'Architecture keeps its services and container');
    const boxes = services.map(service => service.getBoundingClientRect());
    assert(boxes.every((a, i) => boxes.every((b, j) => i === j || Math.min(a.right, b.right) - Math.max(a.left, b.left) <= 1 || Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) <= 1)), 'Architecture service labels do not overlap');
    assert(getComputedStyle(svg.querySelector('.architecture-service svg rect')).fill === 'rgb(34, 42, 61)', 'Architecture icons use navy backgrounds');
  }

  select('Fundamentals', 'Data Lakehouses');
  assert(slide.querySelector('img')?.getAttribute('src') === '/assets/images/lakehouse-databricks.png', 'Markdown image stays attached to its topic');
  assert(slide.querySelector('img').alt && slide.querySelector('figcaption').textContent, 'Image retains its description and caption');
  select('Fundamentals', 'Data Mesh');
  select('Fundamentals', 'Key Concepts');
  await diagram('Networking and delivery', 'VPC Diagram');
  await new Promise(resolve => setTimeout(resolve, 100));
  assert(slide.querySelectorAll('.study-diagram > svg').length === 1 && slide.querySelectorAll('.architecture-service').length === 3, 'Rapid topic changes discard stale renders');

  const loadedMermaid = window.mermaid;
  window.mermaid = undefined;
  window.studyMermaidError = true;
  select('Fundamentals', 'Key Concepts');
  assert(slide.querySelector('.diagram-status').textContent.includes('could not be loaded'), 'Library failure has a visible message');
  assert(slide.querySelectorAll('.diagram-controls button:disabled').length === 3, 'Failed diagrams keep controls disabled');
  window.mermaid = loadedMermaid;
  window.studyMermaidError = false;
  window.dispatchEvent(new Event('study-mermaid-ready'));
  await waitFor(() => slide.querySelector('.study-diagram > svg'));
  assert(!slide.querySelector('.diagram-status'), 'Library-ready event recovers the diagram');
  const originalRender = mermaid.render;
  mermaid.render = async () => { throw new Error('Expected render failure fixture'); };
  select('Fundamentals', 'Data Mesh');
  await waitFor(() => slide.querySelector('.study-diagram').textContent.includes('could not be rendered'));
  assert(slide.querySelector('figcaption').textContent.length > 0, 'A render error retains the study caption');
  mermaid.render = originalRender;
  await diagram('Fundamentals', 'Key Concepts');
  document.getElementById('next').click();
  assert(slide.querySelector('h2').textContent === 'Types of Data' && document.activeElement === slide, 'Next moves focus to the next topic');
  document.getElementById('previous').click();
  assert(slide.querySelector('h2').textContent === 'Key Concepts', 'Previous returns to the original topic');
  assert(document.documentElement.scrollWidth <= innerWidth, 'Final viewport has no horizontal overflow');
  return { viewport: innerWidth, checks: checks.length };
})();
