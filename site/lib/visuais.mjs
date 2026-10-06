// Visuais gerados em código: o mapa da máquina de vendas (hero) e as
// texturas de curva de nível. Determinísticos (semente fixa): o mesmo build
// gera sempre o mesmo arquivo, então o robô não faz commit à toa.

import { esc, icon } from './core.mjs';

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
  const W = 1200, H = 340, DUR = 10, INI = 2.4;
  const ICONES = { Oferta: 'tag', 'Público': 'users-three', 'Comunicação': 'megaphone', 'Aquisição': 'magnet', Atendimento: 'chats-circle', Comercial: 'handshake', Rastreamento: 'crosshair', Dados: 'chart-bar' };
  const todos = [...estacoes, destino];
  const n = todos.length;
  const ys = [196, 118, 206, 110, 200, 106, 194, 122, 166];
  const pts = todos.map((_, i) => [70 + (i * (W - 150)) / (n - 1), ys[i % ys.length]]);
  const d = curva(pts);
  // comprimento acumulado da curva (Catmull-Rom em Bézier), para o pulso acender cada estação na hora certa
  const seg = (i) => {
    const p = (k) => pts[Math.max(0, Math.min(n - 1, k))];
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    let L = 0, ant = p1;
    for (let k = 1; k <= 40; k++) {
      const t = k / 40, u = 1 - t;
      const q = [u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0], u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1]];
      L += Math.hypot(q[0] - ant[0], q[1] - ant[1]); ant = q;
    }
    return L;
  };
  const acum = [0];
  for (let i = 0; i < n - 1; i++) acum.push(acum[i] + seg(i));
  const total = acum[n - 1];
  const area = `${d} L${r1(pts[n - 1][0])} ${H - 20} L${r1(pts[0][0])} ${H - 20} Z`;
  const icEm = (nome, x, y) => icon(nome).replace('<svg ', `<svg x="${r1(x - 10)}" y="${r1(y - 10)}" width="20" height="20" `);
  const sts = todos.map((e, i) => {
    const [x, y] = pts[i], fim = i === n - 1, acima = y < 160;
    const atraso = (INI + (acum[i] / total) * DUR).toFixed(2);
    if (fim) {
      return `<g class="rt-st rt-fim" style="--t:${atraso}s">
        <circle cx="${r1(x)}" cy="${r1(y)}" r="20" class="rt-onda"/><circle cx="${r1(x)}" cy="${r1(y)}" r="20" class="rt-onda rt-onda2"/>
        <circle cx="${r1(x)}" cy="${r1(y)}" r="34" fill="url(#rt-aura)"/>
        <circle cx="${r1(x)}" cy="${r1(y)}" r="19" fill="url(#rt-ouro)" class="rt-sol"/>
        <ellipse cx="${r1(x - 5)}" cy="${r1(y - 7)}" rx="7" ry="4" class="rt-reflexo"/>
        <g class="rt-ic rt-ic-fim">${icEm('trend-up', x, y)}</g>
        <text x="${r1(x + 10)}" y="${r1(y + 54)}" text-anchor="end" class="rt-nome rt-nome-fim">${esc(e.nome)}</text>
      </g>`;
    }
    const ly = acima ? y - 44 : y + 56;
    return `<g class="rt-st" style="--t:${atraso}s"><title>${esc(e.nome)}: ${esc(e.d)}</title>
      <circle cx="${r1(x)}" cy="${r1(y)}" r="30" class="rt-halo"/>
      <circle cx="${r1(x)}" cy="${r1(y)}" r="21" fill="url(#rt-vidro)" class="rt-bola"/>
      <circle cx="${r1(x)}" cy="${r1(y)}" r="21" class="rt-aro"/>
      <path d="M${r1(x - 13)} ${r1(y - 8)} A15 15 0 0 1 ${r1(x + 13)} ${r1(y - 8)}" class="rt-brilho"/>
      <g class="rt-ic">${icEm(ICONES[e.nome] || 'circle', x, y)}</g>
      <text x="${r1(x)}" y="${r1(ly - 14)}" text-anchor="middle" class="rt-num">0${i + 1}</text>
      <text x="${r1(x)}" y="${r1(ly + 4)}" text-anchor="middle" class="rt-nome">${esc(e.nome)}</text>
    </g>`;
  }).join('');
  const pontos = Array.from({ length: 24 * 7 }, (_, k) => `<circle cx="${25 + (k % 24) * 50}" cy="${30 + Math.floor(k / 24) * 46}" r="1"/>`).join('');
  const svg = `<svg class="rota-svg rt" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
<defs>
  <linearGradient id="rt-linha-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6206"/><stop offset=".45" stop-color="#F5C328"/><stop offset="1" stop-color="#FFE9A0"/></linearGradient>
  <linearGradient id="rt-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5C328" stop-opacity=".16"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></linearGradient>
  <radialGradient id="rt-vidro" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#3A3A42"/><stop offset=".6" stop-color="#19191E"/><stop offset="1" stop-color="#0C0C0F"/></radialGradient>
  <radialGradient id="rt-ouro" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF6D0"/><stop offset=".4" stop-color="#F7C935"/><stop offset="1" stop-color="#A87408"/></radialGradient>
  <radialGradient id="rt-aura"><stop offset="0" stop-color="#F5C328" stop-opacity=".45"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></radialGradient>
  <linearGradient id="rt-cauda" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".3" stop-color="#F5C328" stop-opacity=".7"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></linearGradient>
  <filter id="rt-desfoque" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
<g class="rt-pontos">${pontos}</g>
<path d="${area}" fill="url(#rt-area)" class="rt-area"/>
<path d="${d}" class="rt-trilho"/>
<path d="${d}" class="rt-glow" stroke="url(#rt-linha-g)" filter="url(#rt-desfoque)" pathLength="1"/>
<path d="${d}" id="rota-linha" class="rt-linha" stroke="url(#rt-linha-g)" pathLength="1"/>
${sts}
<g class="rt-pulso" style="--ini:${INI}s;--dur:${DUR}s">${[[16, 2, .16], [9, 2.6, .32], [4.5, 3.2, .55], [1.8, 3.8, .85], [0.01, 22, .22, 1], [0.01, 8, 1, 1]].map(([l, w, o, cab]) => `<path d="${d}" pathLength="100" class="rt-rastro${cab ? ' rt-cabeca' : ''}" style="--l:${l};stroke-width:${w};opacity:${o}"/>`).join('')}</g>
</svg>`;
  const lista = `<ol class="rota-lista">${todos
    .map((e, i) => `<li${i === n - 1 ? ' class="fim"' : ''}><b>${esc(e.nome)}</b><span>${esc(e.d)}</span></li>`)
    .join('')}</ol>`;
  // celular: rota vertical em curva, esferas de vidro com ícone e luz que acende com a rolagem
  const P = 124, X = 36, HC = n * P;
  const yc = (i) => P / 2 + i * P;
  let dc = `M${X} ${yc(0)}`;
  for (let i = 0; i < n - 1; i++) {
    const b = i % 2 ? -20 : 20;
    dc += ` C${X + b} ${r1(yc(i) + P / 3)} ${X + b} ${r1(yc(i + 1) - P / 3)} ${X} ${yc(i + 1)}`;
  }
  const cel = `<div class="rc" data-rota-cel style="--rc-passo:${P}px">
  <svg class="rc-svg" width="72" height="${HC}" viewBox="0 0 72 ${HC}" aria-hidden="true" focusable="false">
    <defs><linearGradient id="rc-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6206"/><stop offset=".5" stop-color="#F5C328"/><stop offset="1" stop-color="#FFE9A0"/></linearGradient></defs>
    <path d="${dc}" class="rc-trilho"/>
    <path d="${dc}" class="rc-glow" stroke="url(#rc-g)" pathLength="1"/>
    <path d="${dc}" class="rc-luz" stroke="url(#rc-g)" pathLength="1"/>
    <path d="${dc}" class="rc-pulso" pathLength="100"/>
  </svg>
  <ol class="rc-lista">${todos
    .map((e, i) => {
      const fim = i === n - 1;
      return `<li class="rc-st${fim ? ' rc-fim' : ''}"><span class="rc-orbe">${icon(fim ? 'trend-up' : ICONES[e.nome] || 'circle')}</span><div><small>${fim ? 'Destino' : `Peça 0${i + 1}`}</small><b>${esc(e.nome)}</b>${fim ? '' : `<span>${esc(e.d)}</span>`}</div></li>`;
    })
    .join('')}</ol>
</div>`;
  return `<figure class="rota" aria-label="O mapa da máquina de vendas: ${esc(todos.map((e) => e.nome).join(', '))}">${svg}${lista}${cel}</figure>`;
}
