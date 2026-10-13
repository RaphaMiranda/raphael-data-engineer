/* Pure state/matching helpers shared by the page and Node's built-in tests. */
(function (root) {
  'use strict';
  function toggleSelection(selected, id) {
    return selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id];
  }
  function matchRelationships(relationships, selected) {
    const ids = [...new Set(selected)];
    if (ids.length < 2) return { all: [], subset: [] };
    const all = [], subset = [];
    relationships.forEach(r => {
      const overlap = ids.filter(id => r.participants.includes(id)).length;
      if (overlap === ids.length) all.push(r);
      else if (overlap >= 2) subset.push(r);
    });
    const rank = (a, b) => {
      const overlap = r => ids.filter(id => r.participants.includes(id)).length;
      return overlap(b) - overlap(a) || a.participants.length - b.participants.length || a.name.localeCompare(b.name);
    };
    return { all: all.sort(rank), subset: subset.sort(rank) };
  }
  function filterServices(services, { query = '', category = '', domain = '' } = {}) {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return services.filter(s => (!category || s.categories.includes(category)) &&
      (!domain || s.tasks.some(task => task.startsWith(`${domain}.`))) &&
      terms.every(term => [s.name, ...s.aliases, s.description, s.useCases, s.components, s.technical].join(' ').toLocaleLowerCase().includes(term)));
  }
  function neighborhood(relationships, selected) {
    const ids = new Set(selected);
    relationships.filter(r => r.participants.some(id => ids.has(id))).forEach(r => r.participants.forEach(id => ids.add(id)));
    return ids;
  }
  const api = { toggleSelection, matchRelationships, filterServices, neighborhood };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.awsExplorerCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
