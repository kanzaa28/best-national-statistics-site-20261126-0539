// NusaData views — one function per page. Every page is reachable by a
// hash link from the header nav, every figure carries its source and year,
// and every control on the page works: tabs switch panels, the search box
// filters the province table, sort buttons reorder it, region chips filter
// it, and clicking a province row opens its detail card.

import { hbars, vbars, lineChart, donut, fmtNum, fmtInt } from './charts.js';
import {
  COUNTRY, POPULATION_TREND, AGE_GROUPS, GDP_GROWTH, GDP_SECTORS, TRADE,
  ECONOMY_KPI, HEALTH_KPI, STUNTING_TREND, ENVIRONMENT_KPI, DEFORESTATION,
  PROVINCES, REGIONS, SOURCES,
} from './data.js';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const density = (p) => (p.pop * 1e6) / p.area;

// Table state, kept per page so a search or sort survives a re-render.
const tableState = {
  population: { q: '', region: 'Semua', sort: 'pop', dir: -1 },
  regions: { q: '', region: 'Semua', sort: 'pop', dir: -1 },
};
let selectedProvince = null;

function kpiCards(items) {
  return `<div class="kpis">${items
    .map((k) => `<div class="kpi"><span class="kpi-value">${esc(k.value)}</span><span class="kpi-label">${esc(k.label)}</span><span class="kpi-sub">${esc(k.sub)}</span></div>`)
    .join('')}</div>`;
}

function sourceLine(text) {
  return `<p class="source">Sumber: ${esc(text)}</p>`;
}

function provinceRows(state) {
  let list = PROVINCES.filter(
    (p) =>
      (state.region === 'Semua' || p.region === state.region) &&
      (state.q === '' ||
        p.name.toLowerCase().includes(state.q) ||
        p.capital.toLowerCase().includes(state.q)),
  );
  const key = state.sort;
  list = [...list].sort((a, b) => {
    const va = key === 'name' ? a.name : key === 'area' ? a.area : key === 'density' ? density(a) : a.pop;
    const vb = key === 'name' ? b.name : key === 'area' ? b.area : key === 'density' ? density(b) : b.pop;
    if (va < vb) return -1 * state.dir;
    if (va > vb) return 1 * state.dir;
    return 0;
  });
  return list;
}

function provinceTable(stateKey) {
  const st = tableState[stateKey];
  const rows = provinceRows(st);
  const sortBtn = (key, label) =>
    `<button class="sort-btn${st.sort === key ? ' active' : ''}" data-sort="${key}" data-table="${stateKey}">${label}${st.sort === key ? (st.dir === 1 ? ' ▲' : ' ▼') : ''}</button>`;
  const chips = REGIONS.map(
    (r) => `<button class="chip${st.region === r ? ' active' : ''}" data-region="${esc(r)}" data-table="${stateKey}">${esc(r)}</button>`,
  ).join('');
  const body = rows
    .map(
      (p) =>
        `<tr data-province="${esc(p.name)}" tabindex="0"><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${esc(p.region)}</td>` +
        `<td class="num">${fmtNum(p.pop)}</td><td class="num">${fmtInt(p.area)}</td><td class="num">${fmtInt(density(p))}</td></tr>`,
    )
    .join('');
  return `<div class="table-tools">
      <label class="search">Cari provinsi atau ibu kota <input type="search" data-search="${stateKey}" value="${esc(st.q)}" placeholder="mis. Jawa Barat, Medan…" aria-label="Cari provinsi"></label>
      <div class="chips" role="group" aria-label="Filter pulau">${chips}</div>
    </div>
    <p class="table-count" data-count="${stateKey}">${rows.length} dari 38 provinsi ditampilkan.</p>
    <div class="table-wrap"><table class="prov-table">
      <thead><tr><th>${sortBtn('name', 'Provinsi')}</th><th>Ibu kota</th><th>Pulau</th><th>${sortBtn('pop', 'Penduduk (jt)')}</th><th>${sortBtn('area', 'Luas (km²)')}</th><th>${sortBtn('density', 'Kepadatan (/km²)')}</th></tr></thead>
      <tbody data-tbody="${stateKey}">${body || '<tr><td colspan="6">Tidak ada provinsi yang cocok. Hapus kata kunci atau filter.</td></tr>'}</tbody>
    </table></div>
    ${sourceLine('Populasi: perkiraan BPS 2024 (dibulatkan ke 0,1 juta). Luas: BIG/BPS. Kepadatan dihitung dari keduanya.')}`;
}

function provinceDetail() {
  if (!selectedProvince) {
    return `<div class="detail empty"><p>Klik salah satu baris tabel di atas untuk melihat rincian provinsi: penduduk, luas, kepadatan, dan pangsa terhadap penduduk nasional.</p></div>`;
  }
  const p = selectedProvince;
  const share = ((p.pop / COUNTRY.populationMillions) * 100).toFixed(1).replace('.', ',');
  return `<div class="detail"><h3>${esc(p.name)}</h3>
    <p>Ibu kota <strong>${esc(p.capital)}</strong> · Pulau ${esc(p.region)}</p>
    <dl class="detail-grid">
      <div><dt>Penduduk</dt><dd>${fmtNum(p.pop)} juta</dd></div>
      <div><dt>Luas</dt><dd>${fmtInt(p.area)} km²</dd></div>
      <div><dt>Kepadatan</dt><dd>${fmtInt(density(p))} jiwa/km²</dd></div>
      <div><dt>Pangsa nasional</dt><dd>${share}% penduduk Indonesia</dd></div>
    </dl>
    <p class="source">Perkiraan BPS 2024, dibulatkan.</p></div>`;
}

// ---------------------------------------------------------------- pages

export function overview() {
  const top5 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5);
  return `
  <section class="hero">
    <p class="eyebrow">Statistik resmi Indonesia · diperbarui November 2026</p>
    <h1>Indonesia dalam Angka</h1>
    <p class="lede">Satu laman untuk angka-angka penting Indonesia: <strong>283,5 juta jiwa</strong> di <strong>38 provinsi</strong> dan <strong>17.508 pulau</strong>, ekonomi <strong>US$ 1,40 triliun</strong> yang tumbuh <strong>5,03%</strong> pada 2024. Setiap angka di sini bernama sumber dan tahunnya — tidak ada angka tanpa asal.</p>
    <div class="hero-links"><a class="btn" href="#/population">Lihat penduduk</a><a class="btn ghost" href="#/economy">Lihat ekonomi</a><a class="btn ghost" href="#/regions">Jelajahi 38 provinsi</a></div>
  </section>
  ${kpiCards([
    { label: 'Penduduk', value: '283,5 jt', sub: 'Bank Dunia, 2024' },
    { label: 'Provinsi', value: '38', sub: 'sejak 2022 · 514 kab/kota' },
    { label: 'PDB nominal', value: 'US$ 1,40 T', sub: 'Rp 22.139 triliun · 2024' },
    { label: 'Pertumbuhan PDB', value: '5,03%', sub: 'tahun 2024 · BPS' },
    { label: 'Harapan hidup', value: '73,9 thn', sub: 'BPS, 2023' },
    { label: 'Kemiskinan', value: '8,57%', sub: 'September 2024 · BPS' },
  ])}
  <section class="panel"><h2>Penduduk terus tumbuh — tapi melambat</h2>
    <p>Dari 237,6 juta jiwa pada Sensus 2010 menjadi 283,5 juta pada 2024. Kenaikan 14 tahun itu sekitar 46 juta jiwa, dengan laju yang makin pelan tiap dekade.</p>
    ${lineChart(POPULATION_TREND.map((d) => ({ label: String(d.year), value: d.pop, display: fmtNum(d.pop) })), { unit: ' jt' })}
    ${sourceLine('Sensus Penduduk 2010 & 2020, SUPAS 2015 (BPS); 2024 Bank Dunia (WDI).')}
    <p><a href="#/population">Selengkapnya di halaman Penduduk →</a></p>
  </section>
  <section class="panel"><h2>Lima provinsi terpadat</h2>
    <p>Lebih dari separuh penduduk Indonesia tinggal di Jawa — tiga provinsi teratas semuanya di pulau itu.</p>
    ${hbars(top5.map((p) => ({ label: p.name, value: p.pop, display: fmtNum(p.pop) })), { unit: ' jt' })}
    ${sourceLine('Perkiraan BPS 2024.')}
    <p><a href="#/regions">Tabel lengkap 38 provinsi →</a></p>
  </section>
  <section class="panel"><h2>Ekonomi: tumbuh di atas 5% tiga tahun beruntun</h2>
    <p>Setelah kontraksi −2,07% pada 2020, ekonomi kembali tumbuh 5,31% (2022), 5,05% (2023), dan 5,03% (2024).</p>
    ${vbars(GDP_GROWTH.map((d) => ({ label: String(d.year), value: d.growth, display: fmtNum(d.growth) })), { unit: '%' })}
    ${sourceLine('Pertumbuhan PDB riil, BPS.')}
    <p><a href="#/economy">Selengkapnya di halaman Ekonomi →</a></p>
  </section>
  <section class="panel"><h2>Jelajahi berdasarkan topik</h2>
    <ul class="topic-list">
      <li><a href="#/population"><strong>Penduduk</strong> — struktur umur, tren 2010–2024, dan tabel 38 provinsi yang bisa dicari dan diurutkan.</a></li>
      <li><a href="#/economy"><strong>Ekonomi</strong> — PDB, sektor, perdagangan, inflasi, pengangguran, dan kemiskinan.</a></li>
      <li><a href="#/regions"><strong>Provinsi</strong> — perbandingan antarprovinsi dan rincian tiap provinsi.</a></li>
      <li><a href="#/health"><strong>Kesehatan &amp; Pendidikan</strong> — harapan hidup, sekolah, stunting, dan fasilitas kesehatan.</a></li>
      <li><a href="#/environment"><strong>Lingkungan &amp; Energi</strong> — hutan, deforestasi, batubara, sawit, dan beras.</a></li>
      <li><a href="#/sources"><strong>Sumber data</strong> — dari mana setiap angka di situs ini berasal.</a></li>
    </ul>
  </section>`;
}

export function population() {
  return `
  <h1>Penduduk</h1>
  <p class="lede">283,5 juta jiwa pada 2024 — terbanyak ke-4 di dunia, setelah India, Tiongkok, dan Amerika Serikat. Sekitar 68% berada di usia kerja.</p>
  ${kpiCards([
    { label: 'Penduduk 2024', value: '283,5 jt', sub: 'Bank Dunia (WDI)' },
    { label: 'Usia median', value: '30,5 thn', sub: 'Bank Dunia, 2024' },
    { label: 'Kepadatan', value: '149 /km²', sub: 'nasional · Jawa ±1.100/km²' },
    { label: 'Usia kerja (15–64)', value: '68,0%', sub: 'BPS, 2024' },
  ])}
  <section class="panel"><h2>Tren 2010–2024</h2>
    ${lineChart(POPULATION_TREND.map((d) => ({ label: String(d.year), value: d.pop, display: fmtNum(d.pop) })), { unit: ' jt' })}
    ${sourceLine('Sensus 2010 & 2020, SUPAS 2015 (BPS); 2024 Bank Dunia.')}
  </section>
  <section class="panel"><h2>Struktur umur, 2024</h2>
    <p>Indonesia masih muda: hampir seperempat penduduk berusia di bawah 15 tahun, dan kelompok 25–54 tahun adalah yang terbesar.</p>
    ${hbars(AGE_GROUPS.map((a) => ({ label: a.group, value: a.pct, display: fmtNum(a.pct) })), { unit: '%' })}
    ${sourceLine('BPS, 2024. Jumlah kelompok dibulatkan; total 100%.')}
  </section>
  <section class="panel"><h2>Semua provinsi</h2>
    <p>Cari, saring menurut pulau, atau urutkan berdasarkan penduduk, luas, dan kepadatan. Klik tajuk kolom untuk mengurutkan.</p>
    ${provinceTable('population')}
  </section>`;
}

export function economy() {
  return `
  <h1>Ekonomi</h1>
  <p class="lede">Ekonomi terbesar di Asia Tenggara: PDB US$ 1,40 triliun pada 2024, tumbuh 5,03%, dengan inflasi yang rendah (1,57%) dan pengangguran 4,91%.</p>
  ${kpiCards(ECONOMY_KPI)}
  <section class="panel"><h2>Grafik</h2>
    <div class="tabs" role="tablist" aria-label="Grafik ekonomi">
      <button class="tab active" data-tab="growth" role="tab" aria-selected="true">Pertumbuhan PDB</button>
      <button class="tab" data-tab="sectors" role="tab" aria-selected="false">Sektor ekonomi</button>
      <button class="tab" data-tab="trade" role="tab" aria-selected="false">Perdagangan</button>
    </div>
    <div class="tab-panel" data-panel="growth">
      <p>Pertumbuhan PDB riil per tahun. Kontraksi 2020 adalah dampak pandemi; sejak 2022 pertumbuhan stabil di atas 5%.</p>
      ${vbars(GDP_GROWTH.map((d) => ({ label: String(d.year), value: d.growth, display: fmtNum(d.growth) })), { unit: '%' })}
      ${sourceLine('BPS.')}
    </div>
    <div class="tab-panel hidden" data-panel="sectors">
      <p>Industri pengolahan adalah sektor terbesar (18,7% PDB), diikuti perdagangan (13,0%) dan pertanian (12,5%).</p>
      ${donut(GDP_SECTORS.map((s) => ({ label: s.sector, value: s.pct, display: `${fmtNum(s.pct)}%` })))}
      ${sourceLine('Pangsa PDB menurut lapangan usaha, BPS 2024.')}
    </div>
    <div class="tab-panel hidden" data-panel="trade">
      <p>Ekspor 2024 mencapai US$ 264,7 miliar dengan surplus US$ 31,0 miliar — tahun ketiga beruntun surplus di atas US$ 30 miliar.</p>
      <div class="table-wrap"><table class="prov-table">
        <thead><tr><th>Tahun</th><th class="num">Ekspor (US$ M)</th><th class="num">Impor (US$ M)</th><th class="num">Surplus (US$ M)</th></tr></thead>
        <tbody>${TRADE.map((t) => `<tr><td>${t.year}</td><td class="num">${fmtNum(t.exports)}</td><td class="num">${fmtNum(t.imports)}</td><td class="num">${fmtNum(t.surplus)}</td></tr>`).join('')}</tbody>
      </table></div>
      ${sourceLine('BPS.')}
    </div>
  </section>
  <section class="panel"><h2>Yang perlu diperhatikan</h2>
    <ul>
      <li><strong>Kemiskinan 8,57%</strong> (September 2024) — terendah sepanjang sejarah pencatatan BPS, turun dari 9,03% setahun sebelumnya.</li>
      <li><strong>Gini 0,379</strong> — ketimpangan relatif stabil di kisaran 0,38.</li>
      <li><strong>Inflasi 1,57%</strong> — di bawah sasaran Bank Indonesia (2,5% ±1%), memberi ruang bagi suku bunga.</li>
    </ul>
    ${sourceLine('BPS, 2024.')}
  </section>`;
}

export function regions() {
  return `
  <h1>Provinsi</h1>
  <p class="lede">38 provinsi di 7 gugus pulau. Jawa Barat adalah yang terpadat (49,9 juta jiwa); Papua Selatan yang paling jarang (0,5 juta jiwa di 127.280 km²).</p>
  <section class="panel"><h2>Perbandingan provinsi</h2>
    <p>Jawa menampung ±56% penduduk di ±7% luas daratan — kepadatan DKI Jakarta (16.100 jiwa/km²) seratus kali lipat rata-rata nasional.</p>
    ${provinceTable('regions')}
  </section>
  <section class="panel"><h2>Rincian provinsi</h2>
    ${provinceDetail()}
  </section>`;
}

export function health() {
  return `
  <h1>Kesehatan &amp; Pendidikan</h1>
  <p class="lede">Harapan hidup 73,9 tahun dan melek huruf 96,0% — tapi stunting masih 21,5% balita, dan rata-rata lama sekolah baru 8,8 tahun.</p>
  ${kpiCards(HEALTH_KPI)}
  <section class="panel"><h2>Stunting menurun, tapi pelan</h2>
    <p>Prevalensi stunting balita turun dari 27,7% (2019) ke 21,5% (2023) — masih di atas target pemerintah 14% pada 2024.</p>
    ${vbars(STUNTING_TREND.map((d) => ({ label: String(d.year), value: d.pct, display: fmtNum(d.pct) })), { unit: '%' })}
    ${sourceLine('Survei Status Gizi Indonesia (SSGI), Kemenkes.')}
  </section>
  <section class="panel"><h2>Membaca angka-angka ini</h2>
    <ul>
      <li><strong>Harapan hidup 73,9 tahun</strong> berarti bayi lahir 2023 diperkirakan hidup hingga usia itu bila kondisi kesehatan saat ini bertahan (BPS).</li>
      <li><strong>Rata-rata lama sekolah 8,8 tahun</strong> setara kelas 3 SMP — di bawah wajib belajar 12 tahun, dan jadi pekerjaan rumah terbesar pendidikan Indonesia.</li>
      <li><strong>19 kematian bayi per 1.000 kelahiran</strong> — membaik dari 27 per 1.000 pada 2010, masih di atas Thailand (±7) dan Malaysia (±6).</li>
    </ul>
    ${sourceLine('BPS dan Bank Dunia, 2023. Perbandingan ASEAN memakai angka Bank Dunia 2023.')}
  </section>`;
}

export function environment() {
  return `
  <h1>Lingkungan &amp; Energi</h1>
  <p class="lede">Negara kepulauan dengan hutan tropis terluas ketiga di dunia — dan produsen batubara, sawit, serta beras kelas dunia. Ketiganya membentuk angka-angka di halaman ini.</p>
  ${kpiCards(ENVIRONMENT_KPI)}
  <section class="panel"><h2>Deforestasi neto turun tajam — lalu naik lagi</h2>
    <p>Dari 462 ribu hektare (2018–19) menjadi sekitar 104–115 ribu hektare per tahun pada 2019–2022, sebelum naik ke 175 ribu hektare pada 2022–23.</p>
    ${vbars(DEFORESTATION.map((d) => ({ label: d.period, value: d.ha, display: String(d.ha) })), { unit: ' rb ha' })}
    ${sourceLine('Deforestasi neto, KLHK.')}
  </section>
  <section class="panel"><h2>Energi dan pangan</h2>
    <ul>
      <li><strong>Batubara 775 juta ton (2023)</strong> — rekor produksi; Indonesia eksportir batubara termal terbesar dunia.</li>
      <li><strong>CPO ±47 juta ton (2023)</strong> — produsen minyak sawit terbesar dunia, sekitar 60% pasokan global.</li>
      <li><strong>Beras 52,7 juta ton gabah kering giling (2024)</strong> — cukup untuk swasembada di tahun normal, dengan impor sebagai penyeimbang.</li>
      <li><strong>EBT ±13 GW terpasang (2023)</strong> — didominasi panas bumi dan air; surya masih kecil tapi tumbuh paling cepat.</li>
    </ul>
    ${sourceLine('ESDM, GAPKI, BPS, 2023–2024.')}
  </section>`;
}

export function sources() {
  return `
  <h1>Sumber data</h1>
  <p class="lede">Setiap angka di situs ini berasal dari publikasi resmi. Angka dibulatkan agar mudah dibaca; tahun dan sumber selalu tercantum di halaman yang menampilkan angka itu.</p>
  <section class="panel"><h2>Dari mana angka-angka ini berasal</h2>
    <p>Sumber: publikasi resmi BPS, Bank Dunia, KLHK, ESDM, Kemenkes, GAPKI, dan BIG — dirinci di bawah ini.</p>
    <dl class="source-list">${SOURCES.map((s) => `<div><dt>${esc(s.short)}</dt><dd>${esc(s.full)}</dd></div>`).join('')}</dl>
  </section>
  <section class="panel"><h2>Catatan metodologi</h2>
    <ul>
      <li>Populasi provinsi adalah perkiraan BPS 2024 yang dibulatkan ke 0,1 juta jiwa; jumlahnya bisa sedikit berbeda dari total nasional 283,5 juta (Bank Dunia) karena perbedaan metode dan pembulatan.</li>
      <li>Kepadatan dihitung dari populasi dan luas pada tabel yang sama, bukan dikutip dari sumber lain.</li>
      <li>Angka uang memakai nilai nominal tahun berjalan; PDB per kapita memakai kurs dan pembagi Bank Dunia.</li>
      <li>Angka stunting memakai Survei Status Gizi Indonesia (SSGI); survei 2020 tidak dilakukan karena pandemi.</li>
      <li>Situs ini bukan situs resmi BPS atau pemerintah — situs ini menyusun ulang angka-angka publik agar mudah dijelajahi.</li>
    </ul>
  </section>`;
}

export function missing() {
  return `<h1>Halaman tidak ditemukan</h1><p>Tidak ada halaman di alamat ini. <a href="#/">Kembali ke Beranda</a>.</p>`;
}

// Re-render only a province table's body + count after a control changes.
export function refreshTable(stateKey) {
  const st = tableState[stateKey];
  const rows = provinceRows(st);
  const tbody = document.querySelector(`[data-tbody="${stateKey}"]`);
  const count = document.querySelector(`[data-count="${stateKey}"]`);
  if (tbody) {
    tbody.innerHTML = rows
      .map(
        (p) =>
          `<tr data-province="${esc(p.name)}" tabindex="0"><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${esc(p.region)}</td>` +
          `<td class="num">${fmtNum(p.pop)}</td><td class="num">${fmtInt(p.area)}</td><td class="num">${fmtInt(density(p))}</td></tr>`,
      )
      .join('') || '<tr><td colspan="6">Tidak ada provinsi yang cocok. Hapus kata kunci atau filter.</td></tr>';
  }
  if (count) count.textContent = `${rows.length} dari 38 provinsi ditampilkan.`;
  // Keep the sort buttons and chips in sync with the state.
  document.querySelectorAll(`[data-sort][data-table="${stateKey}"]`).forEach((b) => {
    const on = b.dataset.sort === st.sort;
    b.classList.toggle('active', on);
    b.textContent = b.textContent.replace(/ [▲▼]$/, '') + (on ? (st.dir === 1 ? ' ▲' : ' ▼') : '');
  });
  document.querySelectorAll(`[data-region][data-table="${stateKey}"]`).forEach((b) => b.classList.toggle('active', b.dataset.region === st.region));
}

export function selectProvince(name) {
  selectedProvince = PROVINCES.find((p) => p.name === name) ?? null;
  const panel = document.querySelector('.detail');
  if (panel) panel.outerHTML = provinceDetail();
}

export function getTableState(key) {
  return tableState[key];
}
