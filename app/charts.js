// NusaData charts — hand-drawn SVG, no libraries, no network. Each builder
// takes plain data and returns an SVG string with labelled values, so a
// chart is readable even before any interaction.

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const PALETTE = ['#0b6b57', '#e8a33d', '#b4552d', '#3e7ca6', '#7a5ea3', '#4d8a4f', '#96507a'];

// Horizontal bars: [{label, value, display}] — value drives the width.
export function hbars(rows, { unit = '', max = null, color = 0 } = {}) {
  const top = max ?? Math.max(...rows.map((r) => r.value));
  const body = rows
    .map((r, i) => {
      const w = Math.max(2, (r.value / top) * 100);
      const c = PALETTE[(color + i) % PALETTE.length];
      return `<div class="hbar-row"><span class="hbar-label">${esc(r.label)}</span>` +
        `<span class="hbar-track"><span class="hbar-fill" style="width:${w.toFixed(1)}%;background:${c}"></span></span>` +
        `<span class="hbar-value">${esc(r.display ?? r.value)}${unit}</span></div>`;
    })
    .join('');
  return `<div class="hbars" role="img" aria-label="Diagram batang">${body}</div>`;
}

// Vertical bar chart as SVG: [{label, value, display}].
export function vbars(rows, { height = 180, unit = '', color = 0 } = {}) {
  const W = 640;
  const H = height;
  const padL = 8;
  const padB = 30;
  const padT = 24;
  const max = Math.max(...rows.map((r) => r.value), 0.0001);
  const min = Math.min(0, ...rows.map((r) => r.value));
  const span = max - min;
  const n = rows.length;
  const slot = (W - padL * 2) / n;
  const bw = Math.min(64, slot * 0.62);
  const y0 = padT + ((max - 0) / span) * (H - padT - padB);
  const yOf = (v) => padT + ((max - v) / span) * (H - padT - padB);
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="chart-svg" role="img" aria-label="Diagram batang tegak">`;
  svg += `<line x1="${padL}" y1="${y0}" x2="${W - padL}" y2="${y0}" stroke="#94a39e" stroke-width="1"/>`;
  rows.forEach((r, i) => {
    const x = padL + slot * i + (slot - bw) / 2;
    const y = yOf(Math.max(r.value, 0));
    const yNeg = yOf(Math.min(r.value, 0));
    const top = Math.min(y, yNeg);
    const h = Math.max(2, Math.abs(yNeg - y));
    const c = r.value < 0 ? '#b4552d' : PALETTE[(color + i) % PALETTE.length];
    svg += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${c}"><title>${esc(r.label)}: ${esc(r.display ?? r.value)}${unit}</title></rect>`;
    svg += `<text x="${(x + bw / 2).toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle" class="svg-val">${esc(r.display ?? r.value)}${unit}</text>`;
    svg += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle" class="svg-lab">${esc(r.label)}</text>`;
  });
  svg += '</svg>';
  return svg;
}

// Line chart as SVG: [{label, value, display}] — points joined, values labelled.
export function lineChart(rows, { height = 200, unit = '', color = '#0b6b57' } = {}) {
  const W = 640;
  const H = height;
  const padL = 68;
  const padR = 16;
  const padB = 30;
  const padT = 26;
  const vals = rows.map((r) => r.value);
  let max = Math.max(...vals);
  let min = Math.min(...vals);
  if (max === min) { max += 1; min -= 1; }
  const pad = (max - min) * 0.15;
  max += pad;
  min -= pad;
  const xOf = (i) => padL + (i * (W - padL - padR)) / (rows.length - 1);
  const yOf = (v) => padT + ((max - v) / (max - min)) * (H - padT - padB);
  const pts = rows.map((r, i) => `${xOf(i).toFixed(1)},${yOf(r.value).toFixed(1)}`).join(' ');
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="chart-svg" role="img" aria-label="Diagram garis">`;
  for (let g = 0; g <= 4; g++) {
    const v = min + ((max - min) * g) / 4;
    const y = yOf(v);
    svg += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="#e3e0d6" stroke-width="1"/>`;
    svg += `<text x="${padL - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="svg-lab">${fmtNum(v)}${unit}</text>`;
  }
  svg += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  rows.forEach((r, i) => {
    svg += `<circle cx="${xOf(i).toFixed(1)}" cy="${yOf(r.value).toFixed(1)}" r="5" fill="#faf7f0" stroke="${color}" stroke-width="3"><title>${esc(r.label)}: ${esc(r.display ?? r.value)}${unit}</title></circle>`;
    const lx = Math.min(Math.max(xOf(i), 34), W - 34);
    svg += `<text x="${lx.toFixed(1)}" y="${(yOf(r.value) - 11).toFixed(1)}" text-anchor="middle" class="svg-val">${esc(r.display ?? r.value)}${unit}</text>`;
    svg += `<text x="${xOf(i).toFixed(1)}" y="${H - 10}" text-anchor="middle" class="svg-lab">${esc(r.label)}</text>`;
  });
  svg += '</svg>';
  return svg;
}

// Donut chart as SVG with a legend: [{label, value, display}].
export function donut(rows, { size = 240 } = {}) {
  const total = rows.reduce((n, r) => n + r.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 8;
  const r = R * 0.62;
  let a0 = -Math.PI / 2;
  let paths = '';
  rows.forEach((row, i) => {
    const frac = row.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + R * Math.cos(a0);
    const y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1);
    const y1 = cy + R * Math.sin(a1);
    const xi1 = cx + r * Math.cos(a1);
    const yi1 = cy + r * Math.sin(a1);
    const xi0 = cx + r * Math.cos(a0);
    const yi0 = cy + r * Math.sin(a0);
    const c = PALETTE[i % PALETTE.length];
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${r} ${r} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${c}"><title>${esc(row.label)}: ${esc(row.display ?? row.value)}</title></path>`;
    a0 = a1;
  });
  const legend = rows
    .map((row, i) => `<li><span class="dot" style="background:${PALETTE[i % PALETTE.length]}"></span>${esc(row.label)} — <strong>${esc(row.display ?? row.value)}</strong></li>`)
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" class="donut-svg" role="img" aria-label="Diagram lingkaran">${paths}<text x="${cx}" y="${cy + 5}" text-anchor="middle" class="donut-sub">PDB 2024</text></svg><ul class="legend">${legend}</ul></div>`;
}

// Indonesian-style number: 1 decimal with a comma, e.g. 5,03.
export function fmtNum(v) {
  return String(Number(v).toFixed(2).replace(/\.?0+$/, '')).replace('.', ',');
}

// Thousands with dots: 283.487.931 style for the big counts.
export function fmtInt(v) {
  return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
