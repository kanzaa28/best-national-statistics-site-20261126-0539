// NusaData — Indonesia dalam Angka. Every figure below is a real published
// figure, rounded honestly and labelled with its source and year on the page
// that shows it. Sources: BPS (Statistics Indonesia), World Bank (WDI),
// KLHK (Ministry of Environment and Forestry), ESDM, Kemenkes, GAPKI.
// Provincial populations are BPS 2024 estimates, rounded to 0.1 million;
// their sum differs slightly from the national total because the national
// total comes from the World Bank series. Areas are rounded km2 (BIG/BPS).

export const COUNTRY = {
  name: 'Indonesia',
  tagline: 'Indonesia dalam Angka',
  populationMillions: 283.5,
  populationSource: 'Bank Dunia (WDI), 2024',
  populationNote: 'Penduduk terbanyak ke-4 di dunia.',
  landAreaKm2: 1904569,
  islands: 17508,
  provinces: 38,
  regenciesCities: 514,
  density: 149,
  capital: 'Jakarta (Ibu Kota Nusantara / IKN sedang dibangun)',
  gdpUsdTrillion: 1.4,
  gdpRpTrillion: 22139,
  gdpPerCapitaUsd: 4925,
  gdpSource: 'Bank Dunia / BPS, 2024',
  medianAge: 30.5,
};

// Population (millions) by census / estimate — the long trend.
export const POPULATION_TREND = [
  { year: 2010, pop: 237.6, note: 'Sensus 2010' },
  { year: 2015, pop: 255.5, note: 'SUPAS 2015' },
  { year: 2020, pop: 270.2, note: 'Sensus 2020' },
  { year: 2024, pop: 283.5, note: 'Bank Dunia 2024' },
];

// Age structure, 2024 (BPS, % of population).
export const AGE_GROUPS = [
  { group: '0–14 tahun', pct: 24.3, note: 'anak' },
  { group: '15–24 tahun', pct: 16.8, note: 'remaja & dewasa muda' },
  { group: '25–54 tahun', pct: 41.4, note: 'usia kerja utama' },
  { group: '55–64 tahun', pct: 9.8, note: 'pra-lansia' },
  { group: '65+ tahun', pct: 7.7, note: 'lansia' },
];

// Real GDP growth, % per year (BPS).
export const GDP_GROWTH = [
  { year: 2019, growth: 5.02 },
  { year: 2020, growth: -2.07 },
  { year: 2021, growth: 3.7 },
  { year: 2022, growth: 5.31 },
  { year: 2023, growth: 5.05 },
  { year: 2024, growth: 5.03 },
];

// Share of GDP by sector, 2024 (BPS, %).
export const GDP_SECTORS = [
  { sector: 'Industri pengolahan', pct: 18.7 },
  { sector: 'Perdagangan', pct: 13.0 },
  { sector: 'Pertanian, kehutanan & perikanan', pct: 12.5 },
  { sector: 'Konstruksi', pct: 9.9 },
  { sector: 'Pertambangan & penggalian', pct: 9.1 },
  { sector: 'Transportasi & pergudangan', pct: 5.0 },
  { sector: 'Lainnya', pct: 31.8 },
];

// Foreign trade, US$ billion (BPS).
export const TRADE = [
  { year: 2022, exports: 291.9, imports: 237.5, surplus: 54.5 },
  { year: 2023, exports: 258.8, imports: 221.9, surplus: 36.9 },
  { year: 2024, exports: 264.7, imports: 233.7, surplus: 31.0 },
];

export const ECONOMY_KPI = [
  { label: 'PDB nominal', value: 'US$ 1,40 triliun', sub: 'Rp 22.139 triliun · BPS / Bank Dunia 2024' },
  { label: 'PDB per kapita', value: 'US$ 4.925', sub: '≈ Rp 78,6 juta · Bank Dunia 2024' },
  { label: 'Pertumbuhan ekonomi', value: '5,03%', sub: 'tahun 2024 · BPS' },
  { label: 'Inflasi', value: '1,57%', sub: 'tahun 2024 (yoy) · BPS' },
  { label: 'Pengangguran terbuka', value: '4,91%', sub: 'Agustus 2024 · BPS' },
  { label: 'Kemiskinan', value: '8,57%', sub: 'September 2024 · BPS' },
  { label: 'Ekspor', value: 'US$ 264,7 M', sub: 'tahun 2024 · BPS' },
  { label: 'Surplus perdagangan', value: 'US$ 31,0 M', sub: 'tahun 2024 · BPS' },
];

export const HEALTH_KPI = [
  { label: 'Harapan hidup', value: '73,9 tahun', sub: 'BPS, 2023' },
  { label: 'Melek huruf (15+)', value: '96,0%', sub: 'BPS, 2023' },
  { label: 'Rata-rata lama sekolah', value: '8,8 tahun', sub: 'BPS, 2023' },
  { label: 'Stunting balita', value: '21,5%', sub: 'SSGI, 2023' },
  { label: 'Puskesmas', value: '≈ 10.500', sub: 'Kemenkes, 2023' },
  { label: 'Rumah sakit', value: '≈ 3.100', sub: 'Kemenkes, 2023' },
  { label: 'Kematian bayi', value: '19 / 1.000', sub: 'kelahiran hidup · Bank Dunia, 2023' },
  { label: 'Gini ratio', value: '0,379', sub: 'September 2024 · BPS' },
];

// Stunting prevalence among children under five, % (SSGI / Riskesdas).
export const STUNTING_TREND = [
  { year: 2019, pct: 27.7 },
  { year: 2021, pct: 24.4 },
  { year: 2022, pct: 21.6 },
  { year: 2023, pct: 21.5 },
];

export const ENVIRONMENT_KPI = [
  { label: 'Tutupan hutan', value: '± 95,6 jt ha', sub: 'KLHK, 2023' },
  { label: 'Deforestasi neto', value: '175 ribu ha', sub: '2022–2023 · KLHK' },
  { label: 'Taman nasional', value: '54', sub: 'KLHK' },
  { label: 'Produksi batubara', value: '775 jt ton', sub: 'ESDM, 2023' },
  { label: 'Produksi CPO', value: '± 47 jt ton', sub: 'GAPKI, 2023' },
  { label: 'Produksi beras', value: '52,7 jt ton', sub: 'GKG · BPS, 2024' },
  { label: 'Kapasitas EBT terpasang', value: '± 13 GW', sub: 'ESDM, 2023' },
  { label: 'Pulau', value: '17.508', sub: 'BIG / BPS' },
];

// Net deforestation, thousand ha per period (KLHK).
export const DEFORESTATION = [
  { period: '2018–19', ha: 462 },
  { period: '2019–20', ha: 115 },
  { period: '2020–21', ha: 113 },
  { period: '2021–22', ha: 104 },
  { period: '2022–23', ha: 175 },
];

// All 38 provinces. pop = millions (BPS 2024 estimate, rounded to 0.1);
// area = km2 (rounded). Density is computed from these two.
export const PROVINCES = [
  { name: 'Aceh', region: 'Sumatra', capital: 'Banda Aceh', pop: 5.5, area: 57956 },
  { name: 'Sumatera Utara', region: 'Sumatra', capital: 'Medan', pop: 16.0, area: 72981 },
  { name: 'Sumatera Barat', region: 'Sumatra', capital: 'Padang', pop: 6.0, area: 42013 },
  { name: 'Riau', region: 'Sumatra', capital: 'Pekanbaru', pop: 6.9, area: 87024 },
  { name: 'Jambi', region: 'Sumatra', capital: 'Jambi', pop: 3.7, area: 50058 },
  { name: 'Sumatera Selatan', region: 'Sumatra', capital: 'Palembang', pop: 9.0, area: 91592 },
  { name: 'Bengkulu', region: 'Sumatra', capital: 'Bengkulu', pop: 2.1, area: 19919 },
  { name: 'Lampung', region: 'Sumatra', capital: 'Bandar Lampung', pop: 9.4, area: 34624 },
  { name: 'Kep. Bangka Belitung', region: 'Sumatra', capital: 'Pangkal Pinang', pop: 1.5, area: 16424 },
  { name: 'Kepulauan Riau', region: 'Sumatra', capital: 'Tanjung Pinang', pop: 2.3, area: 8202 },
  { name: 'DKI Jakarta', region: 'Jawa', capital: 'Jakarta', pop: 10.7, area: 664 },
  { name: 'Jawa Barat', region: 'Jawa', capital: 'Bandung', pop: 49.9, area: 35378 },
  { name: 'Jawa Tengah', region: 'Jawa', capital: 'Semarang', pop: 37.9, area: 32801 },
  { name: 'DI Yogyakarta', region: 'Jawa', capital: 'Yogyakarta', pop: 3.9, area: 3133 },
  { name: 'Jawa Timur', region: 'Jawa', capital: 'Surabaya', pop: 41.8, area: 47803 },
  { name: 'Banten', region: 'Jawa', capital: 'Serang', pop: 12.4, area: 9663 },
  { name: 'Bali', region: 'Bali & Nusa Tenggara', capital: 'Denpasar', pop: 4.4, area: 5780 },
  { name: 'Nusa Tenggara Barat', region: 'Bali & Nusa Tenggara', capital: 'Mataram', pop: 5.7, area: 18572 },
  { name: 'Nusa Tenggara Timur', region: 'Bali & Nusa Tenggara', capital: 'Kupang', pop: 5.7, area: 48718 },
  { name: 'Kalimantan Barat', region: 'Kalimantan', capital: 'Pontianak', pop: 5.8, area: 147307 },
  { name: 'Kalimantan Tengah', region: 'Kalimantan', capital: 'Palangka Raya', pop: 2.8, area: 153564 },
  { name: 'Kalimantan Selatan', region: 'Kalimantan', capital: 'Banjarmasin', pop: 4.3, area: 38744 },
  { name: 'Kalimantan Timur', region: 'Kalimantan', capital: 'Samarinda', pop: 4.0, area: 129067 },
  { name: 'Kalimantan Utara', region: 'Kalimantan', capital: 'Tanjung Selor', pop: 0.8, area: 75467 },
  { name: 'Sulawesi Utara', region: 'Sulawesi', capital: 'Manado', pop: 2.7, area: 13892 },
  { name: 'Sulawesi Tengah', region: 'Sulawesi', capital: 'Palu', pop: 3.1, area: 61841 },
  { name: 'Sulawesi Selatan', region: 'Sulawesi', capital: 'Makassar', pop: 9.4, area: 46717 },
  { name: 'Sulawesi Tenggara', region: 'Sulawesi', capital: 'Kendari', pop: 2.8, area: 38068 },
  { name: 'Gorontalo', region: 'Sulawesi', capital: 'Gorontalo', pop: 1.3, area: 11257 },
  { name: 'Sulawesi Barat', region: 'Sulawesi', capital: 'Mamuju', pop: 1.6, area: 16787 },
  { name: 'Maluku', region: 'Maluku & Papua', capital: 'Ambon', pop: 2.0, area: 46914 },
  { name: 'Maluku Utara', region: 'Maluku & Papua', capital: 'Sofifi', pop: 1.4, area: 31983 },
  { name: 'Papua', region: 'Maluku & Papua', capital: 'Jayapura', pop: 1.1, area: 82680 },
  { name: 'Papua Barat', region: 'Maluku & Papua', capital: 'Manokwari', pop: 0.6, area: 60275 },
  { name: 'Papua Selatan', region: 'Maluku & Papua', capital: 'Merauke', pop: 0.5, area: 127280 },
  { name: 'Papua Tengah', region: 'Maluku & Papua', capital: 'Nabire', pop: 1.4, area: 66130 },
  { name: 'Papua Pegunungan', region: 'Maluku & Papua', capital: 'Wamena', pop: 1.5, area: 51213 },
  { name: 'Papua Barat Daya', region: 'Maluku & Papua', capital: 'Sorong', pop: 0.6, area: 39167 },
];

export const REGIONS = ['Semua', 'Sumatra', 'Jawa', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];

export const SOURCES = [
  { short: 'BPS', full: 'Badan Pusat Statistik — Sensus Penduduk 2010 & 2020, SUPAS 2015, Statistik Indonesia 2024, dan rilis indikator 2024.' },
  { short: 'Bank Dunia', full: 'World Bank, World Development Indicators 2024 — penduduk, PDB, PDB per kapita, kematian bayi.' },
  { short: 'KLHK', full: 'Kementerian Lingkungan Hidup dan Kehutanan — tutupan hutan, deforestasi neto, taman nasional.' },
  { short: 'ESDM', full: 'Kementerian Energi dan Sumber Daya Mineral — produksi batubara dan kapasitas energi baru terbarukan.' },
  { short: 'Kemenkes', full: 'Kementerian Kesehatan — SSGI 2023 (stunting), jumlah puskesmas dan rumah sakit 2023.' },
  { short: 'GAPKI', full: 'Gabungan Pengusaha Kelapa Sawit Indonesia — produksi minyak sawit mentah (CPO) 2023.' },
  { short: 'BIG', full: 'Badan Informasi Geospasial — jumlah pulau dan luas wilayah.' },
];
