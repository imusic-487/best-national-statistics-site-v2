// Japan in Numbers — hand-rolled SVG charts. No library, no network:
// every chart is a string of SVG built from DATA and dropped into the page.
//
// All charts share one helper: a number formatter and an SVG escaper.
// Each builder takes plain data and returns an <svg> string with a
// viewBox, so it scales to any screen width.

function fmtNum(n, digits) {
  return Number(n).toFixed(digits === undefined ? 1 : digits);
}

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// A vertical bar chart for one series over years.
// rows: [{ year, value }], unit: axis label, colour: bar fill class.
function barChart(rows, unit, colour) {
  const W = 640, H = 300, padL = 52, padB = 30, padT = 42, padR = 12;
  const top = Math.max.apply(null, rows.map(function (r) { return r.value; }));
  const floor = Math.min(0, Math.min.apply(null, rows.map(function (r) { return r.value; })));
  const span = top - floor || 1;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const slot = plotW / rows.length;
  const barW = Math.min(46, slot * 0.62);
  const yOf = function (v) { return padT + plotH - ((v - floor) / span) * plotH; };
  let out = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Bar chart, ' + esc(unit) + '">';
  out += '<text x="' + padL + '" y="18" font-size="12" font-weight="700" fill="#22302b">' + esc(unit) + '</text>';
  for (let g = 0; g <= 4; g++) {
    const v = floor + (span * g) / 4;
    const y = yOf(v);
    out += '<line class="grid" x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '"/>';
    out += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" font-size="11" text-anchor="end">' + fmtNum(v, 1) + '</text>';
  }
  rows.forEach(function (r, i) {
    const x = padL + slot * i + (slot - barW) / 2;
    const y = yOf(Math.max(r.value, floor));
    const h = Math.max(1, yOf(floor) - y);
    out += '<rect class="bar' + (colour ? ' ' + colour : '') + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"/>';
    out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 5).toFixed(1) + '" font-size="11" text-anchor="middle" font-weight="700" fill="#22302b">' + fmtNum(r.value, 1) + '</text>';
    out += '<text x="' + (padL + slot * i + slot / 2).toFixed(1) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle">' + r.year + '</text>';
  });
  out += '<line class="axis" x1="' + padL + '" y1="' + yOf(floor).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yOf(floor).toFixed(1) + '"/>';
  return out + '</svg>';
}

// A line chart for one series over years, with a zero line when the
// series crosses it (growth rates do).
function lineChart(rows, unit) {
  const W = 640, H = 300, padL = 52, padB = 30, padT = 42, padR = 16;
  const top = Math.max.apply(null, rows.map(function (r) { return r.value; }));
  const bot = Math.min.apply(null, rows.map(function (r) { return r.value; }));
  const hi = Math.max(top, 0), lo = Math.min(bot, 0);
  const span = hi - lo || 1;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xOf = function (i) { return padL + (plotW * i) / (rows.length - 1); };
  const yOf = function (v) { return padT + plotH - ((v - lo) / span) * plotH; };
  let out = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Line chart, ' + esc(unit) + '">';
  out += '<text x="' + padL + '" y="18" font-size="12" font-weight="700" fill="#22302b">' + esc(unit) + '</text>';
  for (let g = 0; g <= 4; g++) {
    const v = lo + (span * g) / 4;
    const y = yOf(v);
    out += '<line class="grid" x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '"/>';
    out += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" font-size="11" text-anchor="end">' + fmtNum(v, 1) + '</text>';
  }
  out += '<line class="axis" x1="' + padL + '" y1="' + yOf(0).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yOf(0).toFixed(1) + '" stroke="#9a9484" stroke-width="1.5"/>';
  let d = '';
  rows.forEach(function (r, i) {
    d += (i === 0 ? 'M' : 'L') + xOf(i).toFixed(1) + ' ' + yOf(r.value).toFixed(1) + ' ';
  });
  out += '<path class="line-path" d="' + d.trim() + '"/>';
  rows.forEach(function (r, i) {
    out += '<circle class="line-dot" cx="' + xOf(i).toFixed(1) + '" cy="' + yOf(r.value).toFixed(1) + '" r="4"/>';
    out += '<text x="' + xOf(i).toFixed(1) + '" y="' + (yOf(r.value) - 10).toFixed(1) + '" font-size="11" text-anchor="middle" font-weight="700" fill="#22302b">' + fmtNum(r.value, 1) + '</text>';
    out += '<text x="' + xOf(i).toFixed(1) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle">' + r.year + '</text>';
  });
  return out + '</svg>';
}

// A donut for parts of a whole. rows: [{ label, value }] in percent.
// The centre shows the biggest slice; the legend sits below in HTML.
function donutChart(rows, centreLabel) {
  const W = 320, H = 320, cx = 160, cy = 160, R = 120, r = 72;
  const total = rows.reduce(function (s, r) { return s + r.value; }, 0);
  const fills = ['#1e3d33', '#c2410c', '#0f766e', '#b45309', '#7c8a83'];
  let out = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Donut chart, ' + esc(centreLabel) + '">';
  let angle = -Math.PI / 2;
  rows.forEach(function (row, i) {
    const frac = row.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const xi1 = cx + r * Math.cos(a1), yi1 = cy + r * Math.sin(a1);
    const xi0 = cx + r * Math.cos(a0), yi0 = cy + r * Math.sin(a0);
    out += '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + R + ' ' + R + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) + ' Z" fill="' + fills[i % fills.length] + '"/>';
    const mid = (a0 + a1) / 2;
    const lx = cx + ((R + r) / 2) * Math.cos(mid), ly = cy + ((R + r) / 2) * Math.sin(mid);
    out += '<text x="' + lx.toFixed(1) + '" y="' + (ly + 4).toFixed(1) + '" font-size="12" font-weight="700" text-anchor="middle" fill="#ffffff">' + fmtNum(row.value, 1) + '%</text>';
    angle = a1;
  });
  out += '<text x="' + cx + '" y="' + (cy - 6) + '" font-size="13" text-anchor="middle" font-weight="700" fill="#22302b">' + esc(centreLabel) + '</text>';
  const biggest = rows.reduce(function (a, b) { return b.value > a.value ? b : a; }, rows[0]);
  out += '<text x="' + cx + '" y="' + (cy + 16) + '" font-size="12" text-anchor="middle" fill="#5f6f68">' + esc(biggest.label) + ' ' + fmtNum(biggest.value, 1) + '%</text>';
  return out + '</svg>';
}

// Horizontal bars for ranked lists (prefectures, markets, categories).
// rows: [{ label, value }], unit: the value's unit, max: scale ceiling.
function hbarChart(rows, unit, max) {
  const W = 640, rowH = 34, padL = 190, padR = 64, padT = 10;
  const H = padT + rows.length * rowH + 8;
  const scale = max || Math.max.apply(null, rows.map(function (r) { return r.value; }));
  let out = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Horizontal bar chart, ' + esc(unit) + '">';
  rows.forEach(function (r, i) {
    const y = padT + i * rowH;
    const w = Math.max(2, ((W - padL - padR) * r.value) / scale);
    const fill = i === 0 ? '#c2410c' : (i % 2 === 0 ? '#1e3d33' : '#0f766e');
    out += '<text x="' + (padL - 10) + '" y="' + (y + 17) + '" font-size="12" text-anchor="end" fill="#22302b">' + esc(r.label) + '</text>';
    out += '<rect x="' + padL + '" y="' + (y + 4) + '" width="' + w.toFixed(1) + '" height="18" rx="3" fill="' + fill + '"/>';
    out += '<text x="' + (padL + w + 8).toFixed(1) + '" y="' + (y + 18) + '" font-size="12" font-weight="700" fill="#22302b">' + fmtNum(r.value, 1) + ' ' + esc(unit) + '</text>';
  });
  return out + '</svg>';
}

// Grouped bars: two series over the same years (exports vs imports).
// rows: [{ year, a, b }], labels: [name of a, name of b].
function groupedChart(rows, labels) {
  const W = 640, H = 320, padL = 52, padB = 30, padT = 30, padR = 12;
  const top = Math.max.apply(null, rows.map(function (r) { return Math.max(r.a, r.b); }));
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const slot = plotW / rows.length;
  const barW = Math.min(30, slot * 0.3);
  const yOf = function (v) { return padT + plotH - (v / top) * plotH; };
  let out = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Grouped bar chart, ' + esc(labels.join(' and ')) + '">';
  out += '<text x="' + padL + '" y="16" font-size="12" font-weight="700" fill="#22302b">¥ trillion</text>';
  for (let g = 0; g <= 4; g++) {
    const v = (top * g) / 4;
    const y = yOf(v);
    out += '<line class="grid" x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '"/>';
    out += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" font-size="11" text-anchor="end">' + fmtNum(v, 0) + '</text>';
  }
  rows.forEach(function (r, i) {
    const cx = padL + slot * i + slot / 2;
    const pairs = [[r.a, '#1e3d33'], [r.b, '#c2410c']];
    pairs.forEach(function (pair, j) {
      const x = cx - barW - 2 + j * (barW + 4);
      const y = yOf(pair[0]);
      out += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(1, yOf(0) - y).toFixed(1) + '" rx="2" fill="' + pair[1] + '"/>';
    });
    out += '<text x="' + cx.toFixed(1) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle">' + r.year + '</text>';
  });
  out += '<line class="axis" x1="' + padL + '" y1="' + yOf(0).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yOf(0).toFixed(1) + '"/>';
  return out + '</svg>';
}

// A legend row for a set of coloured labels.
function legend(items) {
  return '<p class="legend">' + items.map(function (it) {
    return '<span><span class="swatch" style="background:' + it.colour + '"></span>' + esc(it.label) + '</span>';
  }).join('') + '</p>';
}
