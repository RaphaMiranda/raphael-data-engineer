(function () {
  'use strict';
  const data = window.awsExplorerData;
  const core = window.awsExplorerCore;
  const byId = new Map(data.services.map(s => [s.id, s]));
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let selected = [], pattern = '', zoom = 1, pan = { x: 0, y: 0 }, bounds = { width: 1000, height: 800 };
  const shortName = id => byId.get(id).name.replace(/^(Amazon|AWS) /, '').replace('Managed Service for Apache Flink', 'Managed Flink').replace('Managed Streaming for Apache Kafka', 'MSK').replace('Managed Workflows for Apache Airflow', 'MWAA').replace('Identity and Access Management', 'IAM').replace('Application Discovery Service', 'App Discovery').replace('Application Migration Service', 'App Migration');
  const categoryNames = [...new Set(data.services.flatMap(s => s.categories))];
  $('category-filter').insertAdjacentHTML('beforeend', categoryNames.map(c => `<option>${esc(c)}</option>`).join(''));
  $('domain-filter').insertAdjacentHTML('beforeend', data.domains.map(d => `<option value="${d.id}">${d.id}. ${esc(d.name)}</option>`).join(''));
  $('coverage').textContent = `${data.services.length} services & features · ${data.relationships.length} relationships`;
  function filters() { return { query: $('service-search').value, category: $('category-filter').value, domain: $('domain-filter').value }; }
  function relevantRelationships() {
    if (selected.length === 1) return data.relationships.filter(r => r.participants.includes(selected[0])).sort((a, b) => a.participants.length - b.participants.length || a.name.localeCompare(b.name));
    const matched = core.matchRelationships(data.relationships, selected);
    return [...matched.all, ...matched.subset];
  }
  function sources(urls, date) {
    const title = url => {
      const record = data.sourceTitles?.[url];
      return record || decodeURIComponent(url.split('/').pop().replace('.html', '').replace(/[-_]/g, ' '));
    };
    return `<h4>Official documentation</h4><ul class="sources">${urls.map(u => `<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(title(u))} ↗</a></li>`).join('')}</ul><p class="mono">Verified ${esc(date)}</p>`;
  }
  function taskTags(tasks) {
    return `<div class="exam-tags" aria-label="Editorial exam task mappings">${tasks.map(task => { const d = data.domains.find(d => d.id === task[0]); return `<a href="${d.source}#data-engineer-associate-01-domain${d.id}-task${task.split('.')[1]}">${task} · ${esc(d.tasks[task])}</a>`; }).join('')}</div>`;
  }
  function serviceCard(s) {
    const section = (title, content) => `<section class="card-section"><h3>${title}</h3><p>${esc(content)}</p></section>`;
    return `<p class="eyebrow">${esc(s.categories.join(' / '))}</p><h3 class="service-title">${esc(s.name)}</h3><p>${esc(s.description)}</p>${s.aliases.length ? `<p class="alias-line">Search aliases: ${esc(s.aliases.join(' · '))}</p>` : ''}${taskTags(s.tasks)}${section('Primary use cases', s.useCases)}${section('Own capabilities & components', s.components)}${section('Technical characteristics', s.technical)}${section('Security, performance & cost', s.considerations)}<section class="choose-box"><h3>Choose this when…</h3><p>${esc(s.choose)}</p></section>${section('Compare with', s.alternatives)}<section class="card-section recall-box"><p class="eyebrow">Active recall</p><p>${esc(s.recall.question)}</p><details><summary>Reveal answer</summary><p>${esc(s.recall.answer)}</p></details></section>${sources(s.sources, s.verified)}`;
  }
  function relationshipCard(r) {
    const extra = r.participants.filter(id => !selected.includes(id));
    const roles = Object.entries(r.roles).map(([id, role]) => `<dt>${esc(byId.get(id).name)}</dt><dd>${esc(role)}</dd>`).join('');
    const flow = r.flow.map(f => `<li>${esc(shortName(f.from))} → ${esc(shortName(f.to))}: ${esc(f.label)}${f.type === 'control' ? ' (control / metadata)' : ''}</li>`).join('');
    return `<article class="relationship-card" id="relationship-${r.id}"><p class="eyebrow">${esc(r.kind)}</p><h3>${esc(r.name)}</h3>${extra.length ? `<p class="additional">Additional participants needed: ${extra.map(id => esc(byId.get(id).name)).join(', ')}.</p>` : ''}<dl>${roles}</dl><h4>Data & control flow</h4><ol class="flow-list">${flow}</ol><h4>When to use it / exam connection</h4><p>${esc(r.why)}</p><h4>Prerequisites & supporting services</h4><p>${esc(r.prerequisites)}</p><h4>Limitations & tradeoffs</h4><p>${esc(r.tradeoffs)}</p>${r.example ? `<section class="sql-example"><h4>Illustrative query</h4><p>${esc(r.example.note)}</p><pre><code>${esc(r.example.sql)}</code></pre></section>` : ''}${taskTags(r.tasks)}${sources(r.sources, r.verified)}</article>`;
  }
  function renderDetails() {
    const panel = $('study-details');
    $('details-heading').textContent = selected.length === 1 ? 'Service flashcard' : selected.length > 1 ? 'Connections notebook' : 'Explore a service';
    if (!selected.length) {
      panel.innerHTML = `<div class="empty-state"><h3>Start with a question.</h3><p>What stores your data? What transforms it? What governs access?</p><p>Select one service for capabilities, tradeoffs and a recall question. Select more to compare documented connections.</p></div><section class="card-section"><h3>Four exam lenses</h3>${data.domains.map(d => `<p><a href="${d.source}">${d.id}. ${esc(d.name)}</a> <span class="mono">${d.weight}</span></p>`).join('')}</section><p class="small muted">Historical names remain searchable. SageMaker AI and S3 Tables appear more than once in the official list and are deduplicated here. Relationships are curated; absence of a result does not prove that integration is impossible.</p>`;
    } else if (selected.length === 1) panel.innerHTML = serviceCard(byId.get(selected[0]));
    else {
      const matches = core.matchRelationships(data.relationships, selected);
      panel.innerHTML = `<h3>Involving all ${selected.length} selected services</h3><p class="small muted">Results may need additional participants or supporting services, identified in each card.</p>${matches.all.length ? matches.all.map(relationshipCard).join('') : `<div class="empty-state"><p>No verified relationship involving all selected services is recorded in this dataset.</p><p>Try a smaller working set or review the official documentation. We do not infer connections from shared categories.</p></div>`}${matches.subset.length ? `<h3 class="subset-heading">Relationships involving a subset</h3><p class="small muted">These results include at least two of your selected services, but do not connect the entire working set.</p>${matches.subset.map(relationshipCard).join('')}` : ''}`;
    }
    panel.parentElement.scrollTop = 0;
  }
  function renderSelections() {
    $('selection-chips').innerHTML = selected.length ? selected.map(id => `<button class="chip" type="button" data-remove="${id}" aria-label="Remove ${esc(byId.get(id).name)}">${esc(shortName(id))}<span aria-hidden="true">×</span></button>`).join('') : '<span class="muted">No services selected</span>';
    $('clear-selection').disabled = !selected.length;
    $('selection-status').textContent = selected.length ? `${selected.length} selected: ${selected.map(id => byId.get(id).name).join(', ')}. ${selected.length === 1 ? 'Service flashcard' : 'Relationships'} updated in study notebook.` : 'Selection cleared. Choose a service.';
    const relevant = relevantRelationships();
    if (!relevant.some(r => r.id === pattern)) pattern = '';
    $('graph-pattern').innerHTML = '<option value="">Relevant relationships (up to 3)</option>' + relevant.map(r => `<option value="${r.id}">${esc(r.name)}</option>`).join('');
    $('graph-pattern').value = pattern;
    $('graph-pattern').disabled = !relevant.length;
    renderDetails();
    renderServices();
  }
  function setSelection(ids, focusId) {
    selected = [...new Set(ids)].filter(id => byId.has(id));
    renderSelections();
    if (focusId) document.querySelector(focusId)?.focus({ preventScroll: true });
  }
  function renderServices() {
    const active = document.activeElement;
    const listFocus = active?.closest('#service-list') ? active.dataset.service : null;
    const visible = core.filterServices(data.services, filters());
    $('list-count').textContent = `${visible.length} / ${data.services.length}`;
    $('service-list').innerHTML = visible.length ? visible.map(s => `<button class="service-option" type="button" data-service="${s.id}" aria-pressed="${selected.includes(s.id)}"><span>${esc(s.name)}</span><small>${esc(s.categories.join(' / '))}</small></button>`).join('') : '<p class="empty-state">No services match. Try another search or reset filters.</p>';
    renderGraph(visible);
    if (listFocus) document.querySelector(`#service-list [data-service="${listFocus}"]`)?.focus({ preventScroll: true });
  }
  function svg(tag, attrs = {}, value) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, val]) => el.setAttribute(key, val));
    if (value !== undefined) el.textContent = value;
    return el;
  }
  function lines(group, value, x, y, width, className, size = 14) {
    const words = value.split(' '), rows = [''];
    words.forEach(word => { const last = rows.length - 1; if ((rows[last] + ' ' + word).trim().length > width) rows.push(word); else rows[last] = `${rows[last]} ${word}`.trim(); });
    const text = svg('text', { x, y, class: className });
    rows.forEach((row, i) => text.append(svg('tspan', { x, dy: i ? size + 3 : 0 }, row)));
    group.append(text);
    return rows.length;
  }
  function renderGraph(filtered) {
    const graphFocus = document.activeElement?.closest('.graph-node')?.dataset.service;
    const world = $('graph-world');
    world.replaceChildren();
    const relevant = relevantRelationships();
    const connections = pattern ? relevant.filter(r => r.id === pattern) : relevant.slice(0, 3);
    let visible = filtered;
    if (selected.length && $('focus-neighborhood').checked) {
      const neighbors = new Set(connections.flatMap(r => r.participants));
      selected.forEach(id => neighbors.add(id));
      visible = filtered.filter(s => neighbors.has(s.id));
    }
    visible = [...visible, ...selected.filter(id => !visible.some(s => s.id === id)).map(id => byId.get(id))];
    const positions = new Map();
    const compact = $('graph-viewport').clientWidth < 500;
    if (selected.length) {
      visible.sort((a, b) => Number(selected.includes(b.id)) - Number(selected.includes(a.id)) || a.name.localeCompare(b.name));
      visible.forEach((s, i) => positions.set(s.id, { x: 24, y: 30 + i * 70 }));
      bounds = compact ? { width: 340, height: visible.length * 70 + connections.length * 100 + 100 } : { width: 740, height: Math.max(visible.length * 70 + 60, connections.length * 130 + 90) };
      connections.forEach((r, i) => {
        const junction = compact ? { x: 50, y: visible.length * 70 + 65 + i * 100 } : { x: 460, y: 65 + i * 130 };
        r.participants.filter(id => positions.has(id)).forEach(id => {
          const point = positions.get(id), y = point.y + 23;
          const outgoing = r.flow.filter(f => f.from === id), incoming = r.flow.filter(f => f.to === id);
          const controls = [...outgoing, ...incoming].every(f => f.type === 'control');
          const curve = compact ? `M${point.x},${y} C0,${y} 0,${junction.y} ${junction.x - 13},${junction.y}` : `M${point.x + 235},${y} C340,${y} 365,${junction.y} ${junction.x - 13},${junction.y}`;
          const path = svg('path', { d: curve, class: `edge${controls ? ' control' : ''}`, ...(outgoing.length ? { 'marker-end': 'url(#arrow-data)' } : {}), ...(incoming.length ? { 'marker-start': 'url(#arrow-data)' } : {}) });
          world.append(path);
          // Full labels/roles are available in the notebook; numbered labels
          // connect spokes to the matching junction without false pairwise links.
          if (!compact) world.append(svg('text', { x: point.x + 250 + i * 28, y: y - 6, class: 'edge-label' }, `R${i + 1}`));
        });
        const group = svg('g', { class: 'junction' });
        group.append(svg('polygon', { points: `${junction.x},${junction.y - 13} ${junction.x + 13},${junction.y} ${junction.x},${junction.y + 13} ${junction.x - 13},${junction.y}` }));
        group.append(svg('title', {}, `${r.name}. ${r.participants.map(id => `${byId.get(id).name}: ${r.roles[id]}`).join('; ')}`));
        lines(group, `R${i + 1} · ${r.name}`, junction.x + 24, junction.y - 4, 25, '', 12);
        world.append(group);
      });
    } else {
      const groups = categoryNames.map(c => ({ name: c, services: visible.filter(s => s.categories[0] === c) })).filter(g => g.services.length);
      const columns = groups.length > 3 ? 3 : Math.max(1, groups.length);
      const heights = Array(columns).fill(20);
      groups.forEach((g, i) => {
        const column = i % columns, x = 20 + column * 285, y = heights[column], height = g.services.length * 60 + 70;
        world.append(svg('rect', { x, y, width: 265, height, rx: 16, class: 'category-surface' }));
        lines(world, g.name, x + 16, y + 25, 29, 'category-label', 12);
        g.services.forEach((s, n) => positions.set(s.id, { x: x + 15, y: y + 50 + n * 60 }));
        heights[column] += height + 20;
      });
      bounds = { width: columns * 285 + 20, height: Math.max(...heights) };
    }
    visible.forEach(s => {
      const point = positions.get(s.id);
      const node = svg('g', { transform: `translate(${point.x} ${point.y})`, role: 'button', tabindex: 0, 'aria-label': s.name, 'aria-pressed': selected.includes(s.id), 'data-service': s.id, class: `graph-node${selected.includes(s.id) ? ' selected' : ''}` });
      node.append(svg('rect', { width: 235, height: 46, rx: 12 }));
      const text = shortName(s.id);
      lines(node, text, 12, text.length > 27 ? 17 : 28, 27, '', 13);
      node.append(svg('title', {}, `${s.name}: ${s.description}`));
      world.append(node);
    });
    $('graph-empty').hidden = !!visible.length;
    const hiddenParticipants = new Set(connections.flatMap(r => r.participants).filter(id => !positions.has(id))).size;
    $('graph-count').textContent = `${visible.length} nodes · ${connections.length} junctions${hiddenParticipants ? ` · ${hiddenParticipants} filtered participants` : ''}`;
    fitGraph();
    if (!selected.length && zoom < .72) { zoom = .72; pan = { x: 12, y: 12 }; transform(); }
    if (graphFocus) world.querySelector(`[data-service="${graphFocus}"]`)?.focus({ preventScroll: true });
  }
  function transform() {
    $('graph-world').setAttribute('transform', `translate(${pan.x} ${pan.y}) scale(${zoom})`);
    $('zoom-level').textContent = `${Math.round(zoom * 100)}%`;
  }
  function fitGraph() {
    const viewport = $('graph-viewport').getBoundingClientRect();
    zoom = Math.min(1.35, (viewport.width - 28) / bounds.width, (viewport.height - 28) / bounds.height);
    pan = { x: (viewport.width - bounds.width * zoom) / 2, y: (viewport.height - bounds.height * zoom) / 2 };
    transform();
  }
  function zoomBy(factor, anchor) {
    const rect = $('graph-viewport').getBoundingClientRect();
    const center = anchor || { x: rect.width / 2, y: rect.height / 2 };
    const next = Math.min(3, Math.max(.12, zoom * factor));
    pan = { x: center.x - (center.x - pan.x) * next / zoom, y: center.y - (center.y - pan.y) * next / zoom };
    zoom = next;
    transform();
  }
  document.addEventListener('click', event => {
    const service = event.target.closest('[data-service]');
    if (service) { setSelection(core.toggleSelection(selected, service.dataset.service)); return; }
    const remove = event.target.closest('[data-remove]');
    if (remove) {
      const index = selected.indexOf(remove.dataset.remove);
      setSelection(selected.filter(id => id !== remove.dataset.remove));
      const next = $('selection-chips').querySelectorAll('button')[Math.min(index, selected.length - 1)];
      (next || $('service-search')).focus({ preventScroll: true });
      return;
    }
    const preset = event.target.closest('[data-preset]');
    if (preset) {
      $('service-search').value = ''; $('category-filter').value = ''; $('domain-filter').value = ''; pattern = '';
      $('focus-neighborhood').checked = true;
      setSelection(preset.dataset.preset.split(','));
    }
  });
  $('clear-selection').addEventListener('click', () => setSelection([], '#service-search'));
  $('service-search').addEventListener('input', renderServices);
  ['category-filter', 'domain-filter', 'focus-neighborhood'].forEach(id => $(id).addEventListener('change', renderServices));
  $('graph-pattern').addEventListener('change', () => { pattern = $('graph-pattern').value; renderServices(); });
  $('reset-filters').addEventListener('click', () => { $('service-search').value = ''; $('category-filter').value = ''; $('domain-filter').value = ''; renderServices(); });
  $('zoom-in').addEventListener('click', () => zoomBy(1.25));
  $('zoom-out').addEventListener('click', () => zoomBy(.8));
  $('fit-graph').addEventListener('click', fitGraph);
  const viewport = $('graph-viewport');
  viewport.addEventListener('focusin', event => {
    const node = event.target.closest('.graph-node');
    if (!node) return;
    const rect = node.getBoundingClientRect(), area = viewport.getBoundingClientRect();
    if (rect.left < area.left || rect.right > area.right || rect.top < area.top || rect.bottom > area.bottom) {
      pan.x += area.left + area.width / 2 - rect.left - rect.width / 2;
      pan.y += area.top + area.height / 2 - rect.top - rect.height / 2;
      transform();
    }
  });
  viewport.addEventListener('keydown', event => {
    const node = event.target.closest('.graph-node');
    if (node && ['Enter', ' '].includes(event.key)) { event.preventDefault(); setSelection(core.toggleSelection(selected, node.dataset.service)); return; }
    const moves = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] };
    if (moves[event.key]) { event.preventDefault(); pan.x += moves[event.key][0]; pan.y += moves[event.key][1]; transform(); }
    else if (['+', '=', '-', '0'].includes(event.key)) { event.preventDefault(); if (event.key === '0') fitGraph(); else zoomBy(event.key === '-' ? .8 : 1.25); }
  });
  let drag = null;
  viewport.addEventListener('pointerdown', event => {
    if (event.target.closest('.graph-node') || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, pan: { ...pan } };
    viewport.setPointerCapture(event.pointerId);
    $('service-graph').classList.add('dragging');
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    pan = { x: drag.pan.x + event.clientX - drag.x, y: drag.pan.y + event.clientY - drag.y };
    transform();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => viewport.addEventListener(type, () => { drag = null; $('service-graph').classList.remove('dragging'); }));
  viewport.addEventListener('wheel', event => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault(); const rect = viewport.getBoundingClientRect();
    zoomBy(event.deltaY < 0 ? 1.1 : 1 / 1.1, { x: event.clientX - rect.left, y: event.clientY - rect.top });
  }, { passive: false });
  let lastWidth = viewport.clientWidth;
  new ResizeObserver(() => { if (viewport.clientWidth !== lastWidth) { lastWidth = viewport.clientWidth; renderServices(); } }).observe(viewport);
  renderSelections();
})();
