// Visuais gerados em código: o mapa da máquina de vendas (hero) e as
// texturas de curva de nível. Determinísticos (semente fixa): o mesmo build
// gera sempre o mesmo arquivo, então o robô não faz commit à toa.

import { esc } from './core.mjs';

const r1 = (n) => Math.round(n * 10) / 10;

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Catmull-Rom -> Bézier cúbica. closed=true fecha o laço. */
function curva(pts, closed = false) {
  const n = pts.length;
  const p = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  const fim = closed ? n : n - 1;
  for (let i = 0; i < fim; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/**
 * Textura de curvas de nível (arquivo SVG). centros: [[cx, cy, raioMax], ...]
 */
export function topografia({ w = 1600, h = 900, centros, passo = 26, semente = 7 }) {
  const rnd = mulberry32(semente);
  const paths = [];
  for (const [cx, cy, rMax] of centros) {
    const f1 = rnd() * 6.28, f2 = rnd() * 6.28, f3 = rnd() * 6.28;
    const a1 = 0.05 + rnd() * 0.04, a2 = 0.03 + rnd() * 0.03, a3 = 0.04 + rnd() * 0.04;
    for (let r = passo; r <= rMax; r += passo) {
      const pts = [];
      const N = 44;
      for (let k = 0; k < N; k++) {
        const t = (k / N) * Math.PI * 2;
        const rr = r * (1 + a1 * Math.sin(3 * t + f1 + r * 0.0045) + a2 * Math.sin(5 * t + f2 - r * 0.006) + a3 * Math.sin(2 * t + f3 + r * 0.002));
        pts.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t) * 0.82]);
      }
      paths.push(`<path d="${curva(pts, true)}"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#F5C328" stroke-width="1" vector-effect="non-scaling-stroke">${paths.join('')}</svg>\n`;
}

/**
 * O mapa da máquina de vendas: uma rota que passa pelas peças até o destino.
 * Versão horizontal (SVG, desktop) + lista ordenada (celular e leitores de tela).
 */
export function mapaRota(estacoes, destino) {
  const W = 1200, H = 290;
  const todos = [...estacoes, destino];
  const n = todos.length;
  const ys = [176, 104, 186, 96, 180, 92, 174, 108, 146];
  const pts = todos.map((_, i) => [64 + (i * (W - 128)) / (n - 1), ys[i % ys.length]]);
  const d = curva(pts);
  const sts = todos
    .map((e, i) => {
      const [x, y] = pts[i];
      const ehDestino = i === n - 1;
      const acima = y < 140;
      const ly = acima ? y - 26 : y + 38;
      const delay = (0.35 + (2.2 * i) / (n - 1)).toFixed(2);
      if (ehDestino) {
        return `<g class="rota-st rota-fim" style="--d:${delay}s"><circle cx="${r1(x)}" cy="${r1(y)}" r="22" class="rota-halo"/><circle cx="${r1(x)}" cy="${r1(y)}" r="9" class="rota-pt"/><text x="${r1(x - 8)}" y="${r1(y + 50)}" text-anchor="end" class="rota-tx rota-tx-fim">${esc(e.nome)}</text></g>`;
      }
      return `<g class="rota-st" style="--d:${delay}s"><title>${esc(e.nome)}: ${esc(e.d)}</title><circle cx="${r1(x)}" cy="${r1(y)}" r="6.5" class="rota-pt"/><text x="${r1(x)}" y="${r1(ly)}" text-anchor="middle" class="rota-tx">${esc(e.nome)}</text></g>`;
    })
    .join('');
  const svg = `<svg class="rota-svg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
<path d="${d}" class="rota-base" pathLength="1"/>
<path d="${d}" id="rota-linha" class="rota-linha" pathLength="1"/>
${sts}
<g class="rota-lead"><circle r="11" class="rota-lead-halo"/><circle r="4.5" class="rota-lead-pt"/><animateMotion dur="11s" begin="2.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.35 1"><mpath href="#rota-linha"/></animateMotion></g>
</svg>`;
  const lista = `<ol class="rota-lista">${todos
    .map((e, i) => `<li${i === n - 1 ? ' class="fim"' : ''}><b>${esc(e.nome)}</b><span>${esc(e.d)}</span></li>`)
    .join('')}</ol>`;
  return `<figure class="rota" aria-label="O mapa da máquina de vendas: ${esc(todos.map((e) => e.nome).join(', '))}">${svg}${lista}</figure>`;
}
