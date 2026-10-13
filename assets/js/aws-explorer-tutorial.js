(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const main = document.querySelector('main');
  const overlay = $('explorer-tutorial');
  const card = $('tutorial-card');
  const storageKey = 'aws-explorer-tutorial-v1';
  const steps = [
    { selector: '#service-list [data-service="athena"]', title: 'Choose a service to study', text: 'Start with Amazon Athena. Selecting one service opens its study notes and reveals the documented connections around it.', action: 'Choose Athena' },
    { selector: '#related-services', title: 'Explore Athena’s connections', text: 'Here are the services that share documented patterns with Athena. Spot the storage, catalog, governance and BI roles to understand how an architecture fits together.', action: 'Try a connection' },
    { selector: '#related-service-list [data-service="quick"]', title: 'Add the visualization layer', text: 'Select Amazon Quick (QuickSuite / QuickSight) to explore its connection with Athena. The notebook explains how query results feed charts and dashboards.', action: 'Choose Amazon Quick' }
  ];
  let step = -1, target = null, snapshot, frame, inertNodes = [];

  function releaseInert() {
    inertNodes.forEach(([element, value]) => { element.inert = value; });
    inertNodes = [];
  }
  function isolate(element) {
    [...element.children].forEach(child => {
      if (child === target || child === overlay) return;
      if (child.contains(target) || child.contains(overlay)) isolate(child);
      else { inertNodes.push([child, child.inert]); child.inert = true; }
    });
  }
  function place() {
    if (step < 0) return;
    const current = document.querySelector(steps[step].selector);
    if (!current) { finish(false); return; }
    if (current !== target) {
      releaseInert();
      target = current;
      isolate(document.body);
      if (step === 1) { inertNodes.push([target, target.inert]); target.inert = true; }
    }
    const rect = target.getBoundingClientRect();
    const width = document.documentElement.clientWidth, height = window.innerHeight;
    const left = Math.max(8, rect.left - 6), top = Math.max(8, rect.top - 6);
    const right = Math.min(width - 8, rect.right + 6), bottom = Math.min(height - 8, rect.bottom + 6);
    Object.entries({ 'spot-left': left, 'spot-top': top, 'spot-right': right, 'spot-bottom': bottom, 'spot-width': Math.max(0, right - left), 'spot-height': Math.max(0, bottom - top) }).forEach(([name, value]) => overlay.style.setProperty(`--${name}`, `${value}px`));
    const box = card.getBoundingClientRect();
    let x = Math.max(16, Math.min(width - box.width - 16, (left + right - box.width) / 2));
    let y = bottom + 18, side = 'below';
    if (y + box.height > height - 16) {
      y = top - box.height - 18;
      side = 'above';
      if (y < 16) {
        y = Math.max(16, Math.min(height - box.height - 16, (top + bottom - box.height) / 2));
        if (right + 18 + box.width <= width - 16) { x = right + 18; side = 'right'; }
        else if (left - 18 - box.width >= 16) { x = left - 18 - box.width; side = 'left'; }
        else { y = Math.max(16, height - box.height - 16); side = ''; }
      }
    }
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    const arrow = $('tutorial-arrow');
    arrow.hidden = !side;
    arrow.dataset.side = side;
    if (side === 'right' || side === 'left') {
      arrow.style.left = `${side === 'right' ? x - 6 : x + box.width - 6}px`;
      arrow.style.top = `${Math.max(y + 20, Math.min(y + box.height - 32, (top + bottom) / 2 - 6))}px`;
    } else {
      arrow.style.left = `${Math.max(x + 20, Math.min(x + box.width - 32, (left + right) / 2 - 6))}px`;
      arrow.style.top = `${side === 'below' ? y - 6 : y + box.height - 6}px`;
    }
  }
  function schedule() {
    if (step < 0) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(place);
  }
  function showStep(index) {
    releaseInert();
    step = index;
    target = null;
    overlay.dataset.step = String(index + 1);
    $('tutorial-progress').textContent = `Step ${index + 1} of ${steps.length}`;
    $('tutorial-title').textContent = steps[index].title;
    $('tutorial-text').textContent = steps[index].text;
    $('tutorial-action').textContent = steps[index].action;
    const next = document.querySelector(steps[index].selector);
    if (!next) { finish(false); return; }
    next.scrollIntoView({ block: 'center', behavior: 'instant' });
    window.scrollBy({ top: next.getBoundingClientRect().top - 96, behavior: 'instant' });
    place();
    $('tutorial-title').focus({ preventScroll: true });
  }
  function start() {
    if (step >= 0) return;
    snapshot = {
      ids: [...$('selection-chips').querySelectorAll('[data-remove]')].map(button => button.dataset.remove),
      query: $('service-search').value, category: $('category-filter').value, domain: $('domain-filter').value,
      pattern: $('graph-pattern').value, neighborhood: $('focus-neighborhood').checked,
      picker: $('service-picker').open, scroll: window.scrollY, listScroll: $('service-list').scrollTop, focus: document.activeElement
    };
    $('reset-filters').click();
    $('clear-selection').click();
    $('focus-neighborhood').checked = true;
    $('focus-neighborhood').dispatchEvent(new Event('change'));
    $('service-picker').open = true;
    main.setAttribute('role', 'dialog');
    main.setAttribute('aria-modal', 'true');
    main.setAttribute('aria-labelledby', 'tutorial-title');
    main.setAttribute('aria-describedby', 'tutorial-progress tutorial-text');
    overlay.hidden = false;
    document.documentElement.classList.add('tutorial-active');
    showStep(0);
  }
  function finish(completed) {
    if (step < 0) return;
    step = -1;
    overlay.hidden = true;
    releaseInert();
    document.documentElement.classList.remove('tutorial-active');
    ['role', 'aria-modal', 'aria-labelledby', 'aria-describedby'].forEach(name => main.removeAttribute(name));
    try { localStorage.setItem(storageKey, completed ? 'complete' : 'skipped'); } catch (_) { /* Storage can be unavailable in private or restricted browsers. */ }
    if (completed) {
      $('service-picker').open = false;
      $('details-heading').focus({ preventScroll: true });
      $('details-heading').scrollIntoView({ block: 'start', behavior: 'instant' });
      return;
    }
    $('reset-filters').click();
    $('clear-selection').click();
    snapshot.ids.forEach(id => document.querySelector(`#service-list [data-service="${id}"]`)?.click());
    $('service-search').value = snapshot.query;
    $('category-filter').value = snapshot.category;
    $('domain-filter').value = snapshot.domain;
    $('focus-neighborhood').checked = snapshot.neighborhood;
    $('service-search').dispatchEvent(new Event('input', { bubbles: true }));
    $('graph-pattern').value = snapshot.pattern;
    $('graph-pattern').dispatchEvent(new Event('change'));
    $('service-picker').open = snapshot.picker;
    $('service-list').scrollTop = snapshot.listScroll;
    const focus = snapshot.focus?.isConnected && snapshot.focus !== document.body ? snapshot.focus : $('show-tutorial');
    focus.focus({ preventScroll: true });
    window.scrollTo({ top: snapshot.scroll, behavior: 'instant' });
  }
  $('show-tutorial').addEventListener('click', start);
  $('tutorial-skip').addEventListener('click', () => finish(false));
  $('tutorial-action').addEventListener('click', () => { if (step === 1) showStep(2); else target?.click(); });
  document.addEventListener('click', event => {
    const id = event.target.closest('[data-service]')?.dataset.service;
    if (step === 0 && id === 'athena') showStep(1);
    else if (step === 2 && id === 'quick') finish(true);
  });
  document.addEventListener('keydown', event => {
    if (step < 0) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); finish(false); }
    if (event.key === 'Tab') {
      event.preventDefault();
      const controls = [step !== 1 && target, $('tutorial-skip'), $('tutorial-action')].filter(Boolean);
      const index = controls.indexOf(document.activeElement);
      const next = index < 0 ? (event.shiftKey ? controls.length - 1 : 0) : (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      controls[next].focus({ preventScroll: true });
    }
  }, true);
  window.addEventListener('resize', schedule);
  document.addEventListener('scroll', schedule, true);
  [$('service-list'), $('related-service-list')].forEach(list => new MutationObserver(schedule).observe(list, { childList: true }));
  let seen = false;
  try { seen = !!localStorage.getItem(storageKey); } catch (_) { /* The tour still works without persistent storage. */ }
  if (!seen) start();
})();
