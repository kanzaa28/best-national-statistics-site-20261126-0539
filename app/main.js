// NusaData router — hash routes, one page per topic. No network: every
// page is rendered from data.js by views.js.
//
//   #/                Beranda (Overview)
//   #/population      Penduduk
//   #/economy         Ekonomi
//   #/regions         Provinsi
//   #/health          Kesehatan & Pendidikan
//   #/environment     Lingkungan & Energi
//   #/sources         Sumber data
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { overview, population, economy, regions, health, environment, sources, missing, refreshTable, selectProvince, getTableState } from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

const ROUTES = {
  '': { fn: overview, title: 'NusaData — Indonesia dalam Angka' },
  population: { fn: population, title: 'Penduduk | NusaData' },
  economy: { fn: economy, title: 'Ekonomi | NusaData' },
  regions: { fn: regions, title: 'Provinsi | NusaData' },
  health: { fn: health, title: 'Kesehatan & Pendidikan | NusaData' },
  environment: { fn: environment, title: 'Lingkungan & Energi | NusaData' },
  sources: { fn: sources, title: 'Sumber Data | NusaData' },
};

function routeOf() {
  const m = location.hash.match(/^#\/([a-z-]*)/);
  return m ? m[1] : '';
}

function render() {
  window.__shotReady = false;
  const route = routeOf();
  const page = ROUTES[route] ?? null;
  document.title = page ? page.title : 'Halaman tidak ditemukan | NusaData';
  app.innerHTML = page ? page.fn() : missing();
  nav.querySelectorAll('a').forEach((a) => {
    const r = a.getAttribute('href').slice(2);
    a.classList.toggle('active', r === route);
    if (r === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// One delegated listener for every control: tabs, sort buttons, region
// chips, province rows, and the search box (input event, not a re-render
// of the whole page, so focus is never lost).
app.addEventListener('click', (ev) => {
  const tab = ev.target.closest('[data-tab]');
  if (tab) {
    document.querySelectorAll('.tab').forEach((t) => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', String(t === tab));
    });
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== tab.dataset.tab));
    return;
  }
  const sort = ev.target.closest('[data-sort]');
  if (sort) {
    const st = getTableState(sort.dataset.table);
    if (st.sort === sort.dataset.sort) st.dir *= -1;
    else { st.sort = sort.dataset.sort; st.dir = sort.dataset.sort === 'name' ? 1 : -1; }
    refreshTable(sort.dataset.table);
    return;
  }
  const chip = ev.target.closest('[data-region]');
  if (chip) {
    const st = getTableState(chip.dataset.table);
    st.region = chip.dataset.region;
    refreshTable(chip.dataset.table);
    return;
  }
  const row = ev.target.closest('[data-province]');
  if (row) {
    document.querySelectorAll('[data-province]').forEach((r) => r.classList.toggle('selected', r === row));
    selectProvince(row.dataset.province);
  }
});

app.addEventListener('input', (ev) => {
  const box = ev.target.closest('[data-search]');
  if (!box) return;
  getTableState(box.dataset.search).q = box.value.trim().toLowerCase();
  refreshTable(box.dataset.search);
});

app.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Enter' && ev.key !== ' ') return;
  const row = ev.target.closest('[data-province]');
  if (!row) return;
  ev.preventDefault();
  document.querySelectorAll('[data-province]').forEach((r) => r.classList.toggle('selected', r === row));
  selectProvince(row.dataset.province);
});

window.addEventListener('hashchange', render);
render();
