/* Run separately from interaction checks to stay within Windows CLI limits. */
(() => {
  document.getElementById('clear-selection').click();
  document.getElementById('reset-filters').click();
  const start = performance.now();
  for (const r of window.awsExplorerData.relationships) {
    document.getElementById('clear-selection').click();
    r.participants.forEach(id => document.querySelector(`#service-list [data-service="${id}"]`).click());
    const card = document.getElementById(`relationship-${r.id}`);
    if (!card || card.querySelectorAll('dt').length !== r.participants.length || card.textContent.includes('undefined')) throw new Error(`Incomplete relationship: ${r.id}`);
  }
  document.getElementById('clear-selection').click();
  return { relationships: window.awsExplorerData.relationships.length, elapsedMs: Math.round(performance.now() - start), viewport: [innerWidth, innerHeight] };
})();
