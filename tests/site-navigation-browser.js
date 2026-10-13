/* Run inside each rendered page at desktop and mobile widths. */
(async () => {
  const results = [];
  const assert = (ok, message) => { if (!ok) throw new Error(message); results.push(message); };
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const expected = ['Home', 'Timeline', 'Skills', 'Case Studies', 'AWS Study Guide', 'Service Explorer'];
  assert([...header.querySelectorAll('.site-links [data-nav]')].map(a => a.textContent).join('|') === expected.join('|'), 'Shared desktop menu labels and order');
  assert([...menu.querySelectorAll('[data-nav]')].map(a => a.textContent).join('|') === expected.join('|'), 'Mobile menu contains the same destinations');
  assert([...header.querySelectorAll('a')].every(a => a.getAttribute('href').startsWith('/')), 'Header destinations are root-relative');
  assert(header.querySelectorAll('[aria-current]').length === 2, 'Current destination is marked in both menus');
  assert(menu.hidden && toggle.getAttribute('aria-expanded') === 'false', 'Mobile navigation starts closed');
  if (innerWidth < 1100) {
    const sidebarState = document.getElementById('overview-toggle')?.getAttribute('aria-expanded');
    toggle.click();
    assert(!menu.hidden && toggle.getAttribute('aria-expanded') === 'true', 'Menu opens with matching accessibility state');
    assert(document.getElementById('menu-icon-open').hasAttribute('hidden') && !document.getElementById('menu-icon-close').hasAttribute('hidden'), 'Open menu shows the close icon');
    toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    assert(menu.hidden && document.activeElement === toggle, 'Escape closes the menu and restores focus');
    assert(!document.getElementById('menu-icon-open').hasAttribute('hidden') && document.getElementById('menu-icon-close').hasAttribute('hidden'), 'Closed menu restores the hamburger icon');
    assert(document.getElementById('overview-toggle')?.getAttribute('aria-expanded') === sidebarState, 'Menu keys preserve study sidebar state');
    toggle.click();
    document.querySelector('main').click();
    assert(menu.hidden, 'Clicking outside closes the menu');
  } else {
    assert(getComputedStyle(toggle).display === 'none' && getComputedStyle(header.querySelector('.site-links')).display === 'flex', 'Desktop menu replaces hamburger');
    const links = [...header.querySelectorAll('.site-links a')];
    assert(links.every(a => a.getBoundingClientRect().top < header.getBoundingClientRect().bottom), 'Desktop links remain within the header');
  }
  const topicList = document.getElementById('topic-list');
  if (topicList) {
    for (let i = 0; i < 100 && !topicList.children.length; i++) await new Promise(resolve => setTimeout(resolve, 50));
    const buttons = [...topicList.querySelectorAll('button')];
    assert(buttons.length > 10 && buttons.every(b => b.children.length === 1 && b.children[0].matches('.topic-title')) && topicList.querySelectorAll('.topic-section > summary').length > 1, 'Study topics contain titles grouped under collapsible sections');
    assert(!topicList.querySelector('.topic-summary'), 'Topic descriptions are absent');
    const sidebarToggle = document.getElementById('overview-toggle');
    const stage = document.querySelector('.study-stage');
    sidebarToggle.scrollIntoView({ block: 'center' });
    function arrowVisible() {
      const b = sidebarToggle.getBoundingClientRect(), s = stage.getBoundingClientRect();
      return b.left >= s.left && b.right <= s.right && b.top >= s.top && b.bottom <= s.bottom && b.width >= 44 && b.height >= 44;
    }
    assert(arrowVisible(), 'Entire sidebar arrow fits inside its stage');
    sidebarToggle.click();
    await new Promise(resolve => setTimeout(resolve, 350));
    assert(arrowVisible() && document.getElementById('topic-overview').inert, 'Hidden-sidebar arrow remains visible and collapsed topics are inert');
    sidebarToggle.click();
    await new Promise(resolve => setTimeout(resolve, 350));
    buttons[2].click();
    assert(document.querySelector('#slide h2').textContent === buttons[2].querySelector('.topic-title').textContent, 'Compact topic rows still navigate to the correct slide');
    buttons[0].click();
    assert(buttons.every(b => parseFloat(getComputedStyle(b).minHeight) >= 44) && [...topicList.querySelectorAll('.topic-section > summary')].every(summary => summary.getBoundingClientRect().height >= 44), 'Topic and section touch targets remain at least 44px');
  }
  assert([...header.querySelectorAll('a, button')].filter(e => e.getClientRects().length).every(e => e.getBoundingClientRect().right <= innerWidth), 'No horizontal header overflow');
  assert(document.documentElement.scrollWidth <= innerWidth, 'No horizontal page overflow');
  if (document.body.classList.contains('case-study')) {
    assert([...document.querySelectorAll('pre')].every(pre => pre.tabIndex === 0 && pre.getBoundingClientRect().right <= innerWidth), 'Code scrolls inside keyboard-reachable article panels');
  }
  return { page: location.pathname, viewport: innerWidth, checks: results.length, contentOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth) };
})();
