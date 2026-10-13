/* Run separately from interaction checks to stay within Windows CLI limits. */
(() => {
  if (!document.getElementById('explorer-tutorial').hidden) document.getElementById('tutorial-skip').click();
  document.getElementById('clear-selection').click();
  document.getElementById('reset-filters').click();
  const start = performance.now();
  for (const r of window.awsExplorerData.relationships) {
    document.getElementById('clear-selection').click();
    r.participants.forEach(id => document.querySelector(`#service-list [data-service="${id}"]`).click());
    const card = document.getElementById(`relationship-${r.id}`);
    if (!card || card.querySelectorAll('dt').length !== r.participants.length || card.textContent.includes('undefined')) throw new Error(`Incomplete relationship: ${r.id}`);
    const selector = document.getElementById('graph-pattern');
    selector.value = r.id;
    selector.dispatchEvent(new Event('change', { bubbles: true }));
    const preview = document.querySelector('.notebook-summary').textContent;
    if (!preview.includes(r.name) || !preview.includes(r.tradeoffs)) throw new Error(`Incorrect relationship preview: ${r.id}`);
  }
  document.getElementById('clear-selection').click();
  return { relationships: window.awsExplorerData.relationships.length, elapsedMs: Math.round(performance.now() - start), viewport: [innerWidth, innerHeight] };
})();
