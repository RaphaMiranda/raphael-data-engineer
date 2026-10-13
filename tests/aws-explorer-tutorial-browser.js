/* Run on a fresh page after removing aws-explorer-tutorial-v1 from localStorage. */
(() => {
  const $ = id => document.getElementById(id);
  const checks = [];
  const assert = (ok, label) => { if (!ok) throw new Error(label); checks.push(label); };
  const tour = $('explorer-tutorial');
  const selected = () => [...$('selection-chips').querySelectorAll('[data-remove]')].map(button => button.dataset.remove).sort().join(',');
  const choose = id => document.querySelector(`#service-list [data-service="${id}"]`).click();
  const change = (id, value, type = 'change') => { $(id).value = value; $(id).dispatchEvent(new Event(type, { bubbles: true })); };
  const geometry = target => {
    const box = $('tutorial-card').getBoundingClientRect(), item = target.getBoundingClientRect();
    const spot = document.querySelector('.tutorial-spotlight').getBoundingClientRect();
    assert(box.left >= 8 && box.top >= 8 && box.right <= innerWidth - 8 && box.bottom <= innerHeight - 8, `Step ${tour.dataset.step} callout fits viewport`);
    assert(spot.left <= item.left && spot.top <= item.top && spot.right >= item.right && spot.bottom >= item.bottom, `Step ${tour.dataset.step} spotlight surrounds its target`);
    if (target.matches('button') || innerHeight >= 600) {
      assert(box.top >= spot.bottom || box.bottom <= spot.top || box.left >= spot.right || box.right <= spot.left, `Step ${tour.dataset.step} callout leaves its target visible`);
    } else {
      const skip = $('tutorial-skip').getBoundingClientRect();
      assert(skip.top >= 8 && skip.bottom <= innerHeight - 8, 'Short information step keeps Skip visible');
    }
    if (target.matches('button')) assert(document.elementFromPoint(item.left + item.width / 2, item.top + item.height / 2)?.closest('[data-service]') === target, `Step ${tour.dataset.step} actual target receives pointer hits`);
  };
  assert(!tour.hidden && tour.dataset.step === '1', 'First visit opens step one automatically');
  assert(document.querySelector('main').getAttribute('role') === 'dialog' && document.querySelector('main').getAttribute('aria-modal') === 'true', 'Walkthrough exposes a named modal dialog');
  assert(document.querySelector('.site-header').inert && $('service-search').closest('[inert]'), 'Background navigation and search are inert');
  assert(document.elementFromPoint(4, 4).classList.contains('tutorial-shade'), 'Dark backdrop intercepts clicks outside the target');
  assert(document.activeElement === $('tutorial-title'), 'First step starts with its explanation focused');
  assert($('service-picker').open && !document.querySelector('#service-list [data-service="athena"]').inert, 'Athena is visible and available to choose');
  geometry(document.querySelector('#service-list [data-service="athena"]'));
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
  assert(document.activeElement === $('tutorial-action'), 'Shift+Tab from the explanation reaches the last tour control');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
  assert(document.activeElement.dataset.service === 'athena', 'Tab wraps to the actual Athena target');
  choose('athena');
  assert(tour.dataset.step === '2' && selected() === 'athena', 'Choosing Athena advances to its connections');
  const expected = [...new Set(window.awsExplorerData.relationships.filter(r => r.participants.includes('athena')).flatMap(r => r.participants))].filter(id => id !== 'athena').sort();
  const actual = [...$('related-service-list').querySelectorAll('[data-service]')].map(button => button.dataset.service).sort();
  assert(actual.join(',') === expected.join(',') && actual.includes('quick'), 'Related list contains the documented co-participants, including Amazon Quick');
  assert($('related-services').inert, 'Information step waits for Continue before enabling a connection');
  geometry($('related-services'));
  $('tutorial-action').click();
  assert(tour.dataset.step === '3' && $('tutorial-text').textContent.includes('QuickSuite / QuickSight'), 'Third step explains the Quick naming and visualization role');
  const quick = $('related-service-list').querySelector('[data-service="quick"]');
  assert(!quick.inert && $('related-service-list').querySelector('[data-service="s3"]').inert, 'Only the requested related-service target is enabled');
  geometry(quick);
  quick.click();
  assert(tour.hidden && selected() === 'athena,quick', 'Selecting Quick finishes and retains the real learning example');
  assert(document.querySelector('.notebook-summary').textContent.includes('Lake BI with Amazon Quick') && document.querySelectorAll('.junction').length === 1, 'Completion displays the documented Athena/Quick connection in notebook and map');
  assert(localStorage.getItem('aws-explorer-tutorial-v1') === 'complete', 'Completion is remembered for future visits');
  assert(!document.querySelector('.site-header').inert && !document.querySelector('main').hasAttribute('aria-modal') && !document.documentElement.classList.contains('tutorial-active'), 'Completion releases background interaction and scrolling');
  assert(document.activeElement === $('details-heading'), 'Completion focuses the relationship notebook');

  $('clear-selection').click();
  choose('s3'); choose('redshift');
  change('graph-pattern', 'spectrum');
  change('service-search', 'Athena', 'input');
  change('category-filter', 'Analytics');
  $('focus-neighborhood').checked = false;
  $('focus-neighborhood').dispatchEvent(new Event('change'));
  $('service-picker').open = false;
  $('show-tutorial').focus();
  $('show-tutorial').click();
  assert(!tour.hidden && tour.dataset.step === '1' && selected() === '', 'Replay starts a clean example without the previous working set');
  choose('athena');
  $('tutorial-skip').click();
  assert(tour.hidden && selected() === 'redshift,s3', 'Skipping midway restores the previous working set');
  assert($('service-search').value === 'Athena' && $('category-filter').value === 'Analytics' && $('graph-pattern').value === 'spectrum' && !$('focus-neighborhood').checked && !$('service-picker').open, 'Skipping restores search, filters, relationship and map options');
  assert(document.activeElement === $('show-tutorial') && localStorage.getItem('aws-explorer-tutorial-v1') === 'skipped', 'Skipping restores focus and is remembered');
  $('show-tutorial').click();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  assert(tour.hidden && selected() === 'redshift,s3', 'Escape skips without losing the previous selection');
  const setItem = Storage.prototype.setItem;
  try {
    Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    $('show-tutorial').click();
    $('tutorial-skip').click();
    assert(tour.hidden && !document.querySelector('.site-header').inert, 'Unavailable storage never traps the user in the tour');
  } finally { Storage.prototype.setItem = setItem; }
  $('clear-selection').click();
  $('reset-filters').click();
  choose('athena');
  $('related-service-list').querySelector('[data-service="quick"]').click();
  const heading = $('details-heading').getBoundingClientRect();
  assert(selected() === 'athena,quick' && document.activeElement === $('details-heading') && heading.top >= 0 && heading.bottom <= innerHeight, 'Related-service selection outside the tour focuses a visible notebook');
  $('clear-selection').click();
  $('focus-neighborhood').checked = true;
  $('focus-neighborhood').dispatchEvent(new Event('change'));
  $('service-picker').open = false;
  assert(document.documentElement.scrollWidth <= innerWidth, 'Walkthrough leaves no horizontal overflow');
  return { checks: checks.length, viewport: [innerWidth, innerHeight], results: checks };
})();
