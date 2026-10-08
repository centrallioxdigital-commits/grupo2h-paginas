// Gera static/img/mapa-pontos.svg: o mapa-múndi em pontos (projeção equirretangular 2:1),
// usado dentro do globo da abertura da home, girando devagar.
// Uso: node site/tools/mapa_pontos.mjs  (dados: world-atlas, Natural Earth, domínio público)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const AQUI = dirname(fileURLToPath(import.meta.url));
const topo = JSON.parse(readFileSync(join(AQUI, '..', 'node_modules', 'world-atlas', 'land-110m.json'), 'utf8'));
const terra = feature(topo, topo.objects.land);

const PASSO = 3.6; // graus entre pontos
const W = 360 / PASSO, H = 170 / PASSO; // sem os polos extremos
const pts = [];
for (let j = 0; j < H; j++) {
  const lat = 85 - (j + 0.5) * PASSO;
  for (let i = 0; i < W; i++) {
    const lon = -180 + (i + 0.5) * PASSO;
    if (geoContains(terra, [lon, lat])) pts.push(`M${i * 2 + 1} ${j * 2 + 1}h0`);
  }
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W * 2} ${Math.round(H * 2)}" width="${W * 2}" height="${Math.round(H * 2)}"><path d="${pts.join('')}" stroke="#F5C328" stroke-width="1.25" stroke-linecap="round"/></svg>\n`;
writeFileSync(join(AQUI, '..', 'static', 'img', 'mapa-pontos.svg'), svg);
console.log(pts.length, 'pontos', (svg.length / 1024).toFixed(1), 'KB');
