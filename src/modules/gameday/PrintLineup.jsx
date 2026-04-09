/**
 * PrintLineup — Opens a print-ready lineup card in a new window.
 *
 * Extracted from the monolithic App.jsx `printLineupCard` function
 * and adapted to work with the unified GameDay data model.
 */

export default function printLineupCard(teamName, date, opponent, homeAway, battingOrder) {
  const rows = battingOrder
    .map(
      (b, i) =>
        `<tr><td>${i + 1}</td><td>${b.name}</td><td>${b.position || ''}</td><td></td></tr>`,
    )
    .join('\n');

  const pitcherRows = [1, 2, 3]
    .map(
      (n) =>
        `<tr><td style="height:28px;">P${n}</td>${[1, 2, 3, 4, 5, 6].map(() => '<td></td>').join('')}</tr>`,
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html><head><title>Lineup Card - ${teamName}</title>
<style>
  @page { size: landscape; margin: 0.4in; }
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }
  body { color: #000; background: #fff; padding: 16px; }
  h1 { font-size: 22px; text-align: center; margin-bottom: 2px; }
  .meta { text-align: center; font-size: 14px; margin-bottom: 12px; color: #333; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  th, td { border: 1px solid #000; padding: 4px 8px; font-size: 13px; text-align: left; }
  th { background: #eee; font-weight: 700; }
  .section-title { font-size: 15px; font-weight: 700; margin: 10px 0 4px 0; }
  .notes-box { border: 1px solid #000; width: 100%; height: 80px; margin-top: 4px; }
</style></head><body>
<h1>${teamName}</h1>
<div class="meta">${opponent ? 'vs ' + opponent : ''} &bull; ${date || 'TBD'} &bull; ${(homeAway || 'home').toUpperCase()}</div>

<div class="section-title">Batting Order</div>
<table>
  <thead><tr><th>#</th><th>Name</th><th>Position</th><th>Sub</th></tr></thead>
  <tbody>${rows}</tbody>
</table>

<div class="section-title">Pitcher Tracking</div>
<table>
  <thead><tr><th>Pitcher</th><th>Inn 1</th><th>Inn 2</th><th>Inn 3</th><th>Inn 4</th><th>Inn 5</th><th>Inn 6</th></tr></thead>
  <tbody>${pitcherRows}</tbody>
</table>

<div class="section-title">Notes</div>
<div class="notes-box"></div>
</body></html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }
}
