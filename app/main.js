// Japan in Numbers — the router and the Data explorer's behaviour.
//
// The site is one page (index.html) with nine hash routes. On every hash
// change this file picks the matching view from views.js, renders it into
// #view, marks the matching nav link active, and scrolls to the top. The
// Data explorer page gets its table body filled in here, with live search,
// click-to-sort headings and a CSV download.

var NAV = [
  ['#/', 'Overview'], ['#/population', 'Population'], ['#/economy', 'Economy'],
  ['#/labour', 'Labour'], ['#/prices', 'Prices'], ['#/trade', 'Trade'],
  ['#/regions', 'Regions'], ['#/data', 'Data explorer'], ['#/sources', 'Sources & method'],
];

var ROUTES = {
  '/': 'overview',
  '/population': 'population',
  '/economy': 'economy',
  '/labour': 'labour',
  '/prices': 'prices',
  '/trade': 'trade',
  '/regions': 'regions',
  '/data': 'data',
  '/sources': 'sources',
};

function routeFromHash() {
  var hash = window.location.hash || '#/';
  var path = hash.slice(1) || '/';
  return ROUTES[path] || 'overview';
}

function render() {
  var name = routeFromHash();
  var view = document.getElementById('view');
  view.innerHTML = VIEWS[name]();
  document.querySelectorAll('.nav a').forEach(function (a) {
    var path = a.getAttribute('href').slice(1) || '/';
    a.classList.toggle('active', (ROUTES[path] || 'overview') === name);
  });
  document.title = 'Japan in Numbers — ' + navLabel(name);
  window.scrollTo(0, 0);
  if (name === 'data') wireExplorer();
}

function navLabel(name) {
  for (var i = 0; i < NAV.length; i++) {
    if (ROUTES[NAV[i][0].slice(1) || '/'] === name) return NAV[i][1];
  }
  return 'Overview';
}

// ---- Data explorer --------------------------------------------------------

var explorerRows = null;   // the rows currently shown, in display order
var explorerSort = { col: -1, dir: 1 };

function explorerCell(row, col) {
  return [row.name, row.value, String(row.year), row.source][col];
}

function paintExplorer() {
  var body = document.getElementById('explorer-body');
  body.innerHTML = explorerRows.map(function (row) {
    return '<tr><td>' + esc(row.name) + '</td><td>' + esc(row.value) + '</td>' +
      '<td class="num">' + row.year + '</td><td>' + esc(row.source) + '</td></tr>';
  }).join('');
  document.getElementById('explorer-count').textContent =
    'Showing ' + explorerRows.length + ' of ' + DATA.indicatorTable.length + ' indicators.';
}

function sortExplorer(col) {
  if (explorerSort.col === col) {
    explorerSort.dir = -explorerSort.dir;
  } else {
    explorerSort = { col: col, dir: 1 };
  }
  var dir = explorerSort.dir;
  explorerRows.sort(function (a, b) {
    var x = explorerCell(a, col), y = explorerCell(b, col);
    var nx = parseFloat(x), ny = parseFloat(y);
    if (col === 2 || (!isNaN(nx) && !isNaN(ny))) return (nx - ny) * dir;
    return x.localeCompare(y) * dir;
  });
  paintExplorer();
}

function downloadCsv() {
  var lines = ['Indicator,Value,Year,Source'];
  DATA.indicatorTable.forEach(function (row) {
    lines.push([row.name, row.value, row.year, row.source].map(function (c) {
      return '"' + String(c).replace(/"/g, '""') + '"';
    }).join(','));
  });
  var blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'japan-in-numbers-indicators.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 500);
}

function wireExplorer() {
  explorerRows = DATA.indicatorTable.slice();
  explorerSort = { col: -1, dir: 1 };
  paintExplorer();
  var search = document.getElementById('explorer-search');
  search.addEventListener('input', function () {
    var q = search.value.trim().toLowerCase();
    explorerRows = DATA.indicatorTable.filter(function (row) {
      return !q || (row.name + ' ' + row.value + ' ' + row.source).toLowerCase().indexOf(q) !== -1;
    });
    paintExplorer();
  });
  document.querySelectorAll('#explorer-table th.sortable').forEach(function (th) {
    th.addEventListener('click', function () { sortExplorer(Number(th.dataset.col)); });
  });
  document.getElementById('explorer-csv').addEventListener('click', downloadCsv);
}

window.addEventListener('hashchange', render);
render();
