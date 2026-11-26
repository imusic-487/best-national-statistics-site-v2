// Japan in Numbers — the nine pages. Each view is a function that returns
// an HTML string for one hash route; main.js picks the view and drops it
// into #view. All figures come from DATA (data.js); all charts from
// charts.js. Nothing is fetched: the pages are built on the spot.

function srcLine(source, year) {
  return '<p class="source-note">Source: <b>' + esc(source) + '</b>, ' + year + '.</p>';
}

function kpiCards() {
  return '<div class="kpi-grid">' + DATA.headlines.map(function (k) {
    return '<div class="kpi"><div class="kpi-label">' + esc(k.label) + '</div>' +
      '<div class="kpi-value">' + esc(k.value) + '</div>' +
      '<p class="kpi-detail">' + esc(k.detail) + ' · ' + esc(k.source) + ' ' + k.year + '</p></div>';
  }).join('') + '</div>';
}

function releaseList() {
  return '<ul class="release-list">' + DATA.recentReleases.map(function (r) {
    return '<li><span class="rel-date">' + esc(r.date) + '</span>' +
      '<p class="rel-title">' + esc(r.title) + '</p>' +
      '<p class="rel-detail">' + esc(r.detail) + '</p></li>';
  }).join('') + '</ul>';
}

function simpleTable(heads, rows, numericCols) {
  let html = '<div class="table-wrap"><table class="data-table"><thead><tr>';
  heads.forEach(function (h, i) {
    html += '<th' + (numericCols && numericCols.indexOf(i) !== -1 ? ' class="num"' : '') + '>' + esc(h) + '</th>';
  });
  html += '</tr></thead><tbody>';
  rows.forEach(function (row) {
    html += '<tr>';
    row.forEach(function (cell, i) {
      html += '<td' + (numericCols && numericCols.indexOf(i) !== -1 ? ' class="num"' : '') + '>' + esc(cell) + '</td>';
    });
    html += '</tr>';
  });
  return html + '</tbody></table></div>';
}

const VIEWS = {};

// ---- Overview -------------------------------------------------------------
VIEWS.overview = function () {
  return '' +
    '<section class="hero"><h1>Japan in numbers</h1>' +
    '<p>One page for the figures people actually look up: how many people live in Japan, how big its economy is, what work pays, what things cost, and who it trades with — each number with the office that published it and the year it covers.</p>' +
    '<p class="hero-figures">123.8 million people · $4.03 trillion of GDP · 2.5% unemployment · 84.0 years of life</p></section>' +
    kpiCards() +
    '<div class="two-col">' +
    '<section class="panel"><h3>Population is shrinking, slowly</h3>' +
    barChart(DATA.populationTrend, 'Millions, 1 October', 'alt') +
    srcLine('Statistics Bureau', 2024) + '</section>' +
    '<section class="panel"><h3>The economy in dollars</h3>' +
    barChart(DATA.gdpTrend, 'US$ trillion, nominal', '') +
    srcLine('IMF World Economic Outlook', 2024) + '</section>' +
    '</div>' +
    '<section class="panel"><h3>Just published</h3>' + releaseList() + '</section>' +
    '<p class="source-note">Every figure on this site is a published statistic. See <a href="#/sources">Sources &amp; method</a> for the full list of publishers and the notes on rounding.</p>';
};

// ---- Population -----------------------------------------------------------
VIEWS.population = function () {
  const bandRows = DATA.ageBands.map(function (b) { return { label: b.band, value: b.value }; });
  return '' +
    '<h1>Population</h1>' +
    '<p class="lede">Japan’s population peaked at <strong>128.1 million in 2008</strong> and has fallen every year since. The 2024 estimate is <strong>123.8 million</strong>, down 0.44% on the year — and nearly three in ten residents are now 65 or older.</p>' +
    '<section class="panel"><h3>Total population, 2019–2024</h3>' +
    barChart(DATA.populationTrend, 'Millions, 1 October', 'alt') +
    srcLine('Statistics Bureau, population estimates', 2024) + '</section>' +
    '<div class="two-col">' +
    '<section class="panel"><h3>Who lives here, by age</h3>' +
    donutChart(DATA.ageMix, 'Age mix') +
    legend(DATA.ageMix.map(function (a, i) {
      return { label: a.label + ' — ' + a.value + '%', colour: ['#1e3d33', '#c2410c', '#0f766e'][i] };
    })) +
    srcLine('Statistics Bureau', 2024) + '</section>' +
    '<section class="panel"><h3>Median age: 49.5 years</h3>' +
    '<p>Japan has the oldest population of any large country. The median age — half the population older, half younger — was <strong>49.5 years</strong> in 2024 (UN World Population Prospects). The fertility rate was <strong>1.15 children per woman</strong> and there were <strong>720,988 births</strong> in 2024, both from the Ministry of Health, Labour and Welfare.</p>' +
    '<p>Life expectancy at birth reached <strong>84.0 years</strong> in 2023, among the highest in the world.</p>' +
    srcLine('UN WPP 2024; MHLW vital statistics', 2024) + '</section>' +
    '</div>' +
    '<section class="panel"><h3>Population by five-year age band</h3>' +
    hbarChart(bandRows, 'million', 9) +
    srcLine('Statistics Bureau, 2024 estimate', 2024) + '</section>' +
    '<h2>Where people live</h2>' +
    '<p>The ten largest prefectures hold more than half the country. Tokyo alone has 14.1 million residents — more than the whole of Tohoku.</p>' +
    simpleTable(['Prefecture', 'Population (millions)'], DATA.bigPrefectures.map(function (p) { return [p.name, p.value.toFixed(1)]; }), [1]) +
    srcLine('Statistics Bureau', 2024);
};

// ---- Economy --------------------------------------------------------------
VIEWS.economy = function () {
  return '' +
    '<h1>Economy</h1>' +
    '<p class="lede">Japan is the world’s <strong>fourth-largest economy</strong> by nominal GDP: <strong>$4.03 trillion</strong> in 2024, or about <strong>$32,500 per person</strong> (IMF). In yen terms the economy kept growing; in dollars it shrank, because the yen weakened — the annual average was about ¥151 to the dollar.</p>' +
    '<section class="panel"><h3>Nominal GDP, US$ trillion</h3>' +
    barChart(DATA.gdpTrend, 'US$ trillion', '') +
    srcLine('IMF World Economic Outlook', 2024) + '</section>' +
    '<section class="panel"><h3>Real growth, % year on year</h3>' +
    lineChart(DATA.growthTrend, '% change in real GDP') +
    '<p class="source-note">Real GDP fell 4.2% in the pandemic year 2020, rebounded 2.7% in 2021, and was essentially flat in 2024 (−0.1%).</p>' +
    srcLine('Cabinet Office / IMF', 2024) + '</section>' +
    '<div class="two-col">' +
    '<section class="panel"><h3>What the economy makes</h3>' +
    donutChart(DATA.valueAdded, 'Value added') +
    legend(DATA.valueAdded.map(function (s, i) {
      return { label: s.label + ' — ' + s.value + '%', colour: ['#1e3d33', '#c2410c', '#0f766e'][i] };
    })) +
    srcLine('World Bank, World Development Indicators', 2023) + '</section>' +
    '<section class="panel"><h3>Public debt</h3>' +
    '<p>General government gross debt stood at about <strong>237% of GDP</strong> in 2024 (IMF) — the highest ratio of any advanced economy, and a figure visitors ask about almost as often as GDP itself.</p>' +
    '<p>Most of that debt is held at home, by Japanese banks, insurers and the Bank of Japan, which is why the ratio has not produced a funding crisis.</p>' +
    srcLine('IMF World Economic Outlook', 2024) + '</section>' +
    '</div>' +
    '<h2>Year by year</h2>' +
    simpleTable(['Year', 'Nominal GDP ($tr)', 'Real growth (%)'], DATA.gdpTrend.map(function (g, i) {
      return [String(g.year), g.value.toFixed(2), DATA.growthTrend[i].value.toFixed(1)];
    }), [1, 2]) +
    srcLine('IMF WEO; Cabinet Office', 2024);
};

// ---- Labour ---------------------------------------------------------------
VIEWS.labour = function () {
  return '' +
    '<h1>Labour</h1>' +
    '<p class="lede">Japan’s labour market is tight by world standards: unemployment averaged <strong>2.5%</strong> in 2024, the labour force was <strong>69.4 million</strong> people, and <strong>67.7 million</strong> were in work (Statistics Bureau).</p>' +
    '<section class="panel"><h3>Unemployment, % annual average</h3>' +
    lineChart(DATA.joblessTrend, 'Unemployment rate, %') +
    srcLine('Statistics Bureau, Labour Force Survey', 2024) + '</section>' +
    '<div class="two-col">' +
    '<section class="panel"><h3>Where people work</h3>' +
    donutChart(DATA.jobsBySector, 'Employment') +
    legend(DATA.jobsBySector.map(function (s, i) {
      return { label: s.label + ' — ' + s.value + '%', colour: ['#1e3d33', '#c2410c', '#0f766e'][i] };
    })) +
    srcLine('Statistics Bureau', 2024) + '</section>' +
    '<section class="panel"><h3>What work pays</h3>' +
    '<p>Average monthly cash earnings were about <strong>¥318,000</strong> in 2024 (MHLW Monthly Labour Survey), covering regular pay plus overtime and bonuses averaged across the year.</p>' +
    '<p>With unemployment near 2.5%, employers in construction, care work and hospitality report the sharpest shortages — the flip side of a shrinking working-age population.</p>' +
    srcLine('MHLW, Monthly Labour Survey', 2024) + '</section>' +
    '</div>' +
    '<h2>Unemployment by year</h2>' +
    simpleTable(['Year', 'Unemployment (%)'], DATA.joblessTrend.map(function (u) { return [String(u.year), u.value.toFixed(1)]; }), [1]) +
    srcLine('Statistics Bureau', 2024);
};

// ---- Prices ---------------------------------------------------------------
VIEWS.prices = function () {
  const catRows = DATA.cpiByCategory.slice(1).map(function (c) { return { label: c.label, value: c.value }; });
  return '' +
    '<h1>Prices</h1>' +
    '<p class="lede">Consumer prices rose <strong>2.7%</strong> in 2024 — the third straight year above 2%, after decades in which prices barely moved. The CPI index (2020 = 100) stood at <strong>108.3</strong>.</p>' +
    '<section class="panel"><h3>Inflation, % change year on year</h3>' +
    lineChart(DATA.cpiTrend, 'CPI, all items, %') +
    '<p class="source-note">Prices were flat or falling from 2019 to 2021, then jumped with the global energy shock: +2.5% in 2022 and +3.3% in 2023.</p>' +
    srcLine('Statistics Bureau, Consumer Price Index', 2024) + '</section>' +
    '<section class="panel"><h3>What got dearer since 2020</h3>' +
    hbarChart(catRows, 'index, 2020 = 100', 115) +
    '<p class="source-note">Fuel, light and water charges (113.6) and food (112.6) rose fastest; medical care (101.9) and education (102.8) barely moved.</p>' +
    srcLine('Statistics Bureau, 2024 annual average', 2024) + '</section>' +
    '<h2>CPI by category, 2024</h2>' +
    simpleTable(['Category', 'Index (2020 = 100)'], DATA.cpiByCategory.map(function (c) { return [c.label, c.value.toFixed(1)]; }), [1]) +
    srcLine('Statistics Bureau', 2024);
};

// ---- Trade ----------------------------------------------------------------
VIEWS.trade = function () {
  const rows = DATA.tradeTrend.map(function (t) { return { year: t.year, a: t.exports, b: t.imports }; });
  const marketRows = DATA.exportMarkets.map(function (m) { return { label: m.name, value: m.value }; });
  return '' +
    '<h1>Trade</h1>' +
    '<p class="lede">Japan exported <strong>¥107.9 trillion</strong> of goods in 2024 and imported <strong>¥113.2 trillion</strong>, a deficit of <strong>¥5.3 trillion</strong> — the fourth straight year in the red, after decades of surplus (Ministry of Finance).</p>' +
    '<section class="panel"><h3>Exports vs imports, ¥ trillion</h3>' +
    groupedChart(rows, ['Exports', 'Imports']) +
    legend([{ label: 'Exports', colour: '#1e3d33' }, { label: 'Imports', colour: '#c2410c' }]) +
    '<p class="source-note">Imports surged in 2022 as energy prices spiked (¥118.2 trillion); exports have grown every year since 2020.</p>' +
    srcLine('Ministry of Finance, customs statistics', 2024) + '</section>' +
    '<section class="panel"><h3>Where exports go</h3>' +
    hbarChart(marketRows, '% of exports', 21) +
    '<p class="source-note">The United States took 20.7% of exports in 2024, just ahead of China at 17.7%. Together the top ten markets take about 71%.</p>' +
    srcLine('Ministry of Finance', 2024) + '</section>' +
    '<h2>Trade in goods, ¥ trillion</h2>' +
    simpleTable(['Year', 'Exports', 'Imports', 'Balance'], DATA.tradeTrend.map(function (t) {
      return [String(t.year), t.exports.toFixed(1), t.imports.toFixed(1), (t.exports - t.imports).toFixed(1)];
    }), [1, 2, 3]) +
    srcLine('Ministry of Finance', 2024);
};

// ---- Regions --------------------------------------------------------------
VIEWS.regions = function () {
  const cards = DATA.regions.map(function (r) {
    return '<article class="region-card"><h3>' + esc(r.name) + '</h3>' +
      '<div class="region-pop">' + r.population.toFixed(1) + 'm</div>' +
      '<p>Largest city: <strong>' + esc(r.hub) + '</strong><br>' + esc(r.prefectures) + '</p></article>';
  }).join('');
  const total = DATA.regions.reduce(function (s, r) { return s + r.population; }, 0);
  return '' +
    '<h1>Regions</h1>' +
    '<p class="lede">Japan’s eight regions range from Kanto’s <strong>44.6 million</strong> people — more than a third of the country — to Shikoku’s <strong>3.8 million</strong>. Together the eight regions hold ' + total.toFixed(1) + ' million people in the 2020 Census count.</p>' +
    '<div class="region-grid">' + cards + '</div>' +
    '<h2>Region populations</h2>' +
    simpleTable(['Region', 'Population (millions)', 'Largest city'], DATA.regions.map(function (r) {
      return [r.name, r.population.toFixed(1), r.hub];
    }), [1]) +
    srcLine('Statistics Bureau, 2020 Census', 2020);
};

// ---- Data explorer --------------------------------------------------------
VIEWS.data = function () {
  return '' +
    '<h1>Data explorer</h1>' +
    '<p class="lede">Every headline figure on this site in one table — <strong>24 indicators</strong>. Type to filter, click a column heading to sort, or download the whole table as a CSV file for your own spreadsheet.</p>' +
    '<div class="toolbar">' +
    '<input type="search" id="explorer-search" placeholder="Search indicators, e.g. GDP or fertility…" aria-label="Search indicators">' +
    '<button class="btn" id="explorer-csv" type="button">Download CSV</button>' +
    '</div>' +
    '<div class="table-wrap"><table class="data-table" id="explorer-table"><thead><tr>' +
    '<th class="sortable" data-col="0">Indicator</th>' +
    '<th class="sortable" data-col="1">Value</th>' +
    '<th class="sortable num" data-col="2">Year</th>' +
    '<th class="sortable" data-col="3">Source</th>' +
    '</tr></thead><tbody id="explorer-body"></tbody></table></div>' +
    '<p class="count-line" id="explorer-count"></p>' +
    '<p class="source-note">Values are rounded for display. Full publisher details are on the <a href="#/sources">Sources &amp; method</a> page.</p>';
};

// ---- Sources & method -----------------------------------------------------
VIEWS.sources = function () {
  const rows = DATA.publishers.map(function (p) {
    return '<tr><td><strong>' + esc(p.name) + '</strong></td><td>' + esc(p.covers) + '</td><td>' + esc(p.site) + '</td></tr>';
  }).join('');
  return '' +
    '<h1>Sources &amp; method</h1>' +
    '<p class="lede">This site republishes figures from Japan’s official statistics and the international bodies that standardise them. Every number on the site names its publisher and year where it appears; this page is the complete list.</p>' +
    '<h2>Publishers</h2>' +
    '<div class="table-wrap"><table class="data-table"><thead><tr><th>Publisher</th><th>What it supplies</th><th>Portal</th></tr></thead><tbody>' +
    rows + '</tbody></table></div>' +
    '<h2>How the figures were chosen</h2>' +
    '<ul>' +
    '<li><strong>Latest year first.</strong> Headline figures use the most recent annual value available when the site was built (mostly 2024; life expectancy 2023; sector shares 2023).</li>' +
    '<li><strong>Rounded, not invented.</strong> Values are rounded to one decimal or the nearest whole number for display; the underlying published figures are not altered.</li>' +
    '<li><strong>Named, not linked.</strong> This site works with no network, so publishers are named in text rather than linked out. Search any name above to reach the original release.</li>' +
    '<li><strong>Estimates labelled.</strong> Population and GDP figures are estimates or preliminary values and are revised by their publishers; the release dates on the Overview page say which vintage each number is.</li>' +
    '</ul>' +
    '<h2>About this site</h2>' +
    '<p>“Japan in Numbers” is an independent, original site built for the make.fun national statistics bounty. It is not affiliated with the Statistics Bureau of Japan or any publisher listed above. All charts are drawn from the figures on this page with hand-written SVG; no chart library is used.</p>';
};
