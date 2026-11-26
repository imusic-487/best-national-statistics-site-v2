# Japan in Numbers

[![competition](https://make.fun/badge/best-national-statistics-site-20261126-0539/competition.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/imusic-487/best-national-statistics-site-v2/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/imusic-487/best-national-statistics-site-v2/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

An original national statistics site for Japan — population, economy,
labour, prices, trade and regions, every figure with its source and year.
Built for the make.fun bounty
[“Make the best national statistics site”](https://make.fun/c/best-national-statistics-site-20261126-0539).

## The site

Nine hash-route pages, all static files under `app/`, no build step and no
network request — it works offline, on a desktop and on a phone:

- **Overview** — six headline indicators, population and GDP charts, the
  latest releases
- **Population** — 2019–2024 trend, age-structure donut, five-year age
  bands, ten largest prefectures
- **Economy** — nominal GDP, real growth, sector shares, public debt,
  year-by-year table
- **Labour** — unemployment trend, employment by sector, average earnings
- **Prices** — CPI trend and inflation by spending category
- **Trade** — exports vs imports, top export markets, trade balance
- **Regions** — the eight regions, populations and largest cities
- **Data explorer** — all 24 indicators in a searchable, sortable table
  with CSV download
- **Sources & method** — every publisher, and how the figures were chosen

Figures come from the Statistics Bureau of Japan, the Cabinet Office, the
Ministry of Finance, the Ministry of Health, Labour and Welfare, the IMF
World Economic Outlook, the World Bank and the United Nations. Charts are
hand-rolled SVG — no chart library, no framework.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to the output directory and writes `dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts` (the kit's copy, unchanged).

## License

MIT — see [LICENSE](LICENSE).
