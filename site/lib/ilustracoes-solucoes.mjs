// Ilustrações das páginas de solução no padrão "encorpado": vidro, ouro,
// luz em movimento. Estilo em static/css/pecas.css.

import { esc, icon } from './core.mjs';

const r1 = (n) => Math.round(n * 10) / 10;
const icEm = (nome, x, y, t = 22) => icon(nome).replace('<svg ', `<svg x="${r1(x - t / 2)}" y="${r1(y - t / 2)}" width="${t}" height="${t}" `);

// curva suave passando pelos pontos (Catmull-Rom em Bézier)
function curva(pts) {
  const n = pts.length, p = (i) => pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

// gradientes compartilhados (cada figura recebe um prefixo para não colidir ids)
const defs = (px) => `<defs>
  <radialGradient id="${px}-vidro" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#3C3C45"/><stop offset=".6" stop-color="#1A1A20"/><stop offset="1" stop-color="#0C0C0F"/></radialGradient>
  <radialGradient id="${px}-ouro" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF6D0"/><stop offset=".4" stop-color="#F7C935"/><stop offset="1" stop-color="#A87408"/></radialGradient>
  <radialGradient id="${px}-aura"><stop offset="0" stop-color="#F5C328" stop-opacity=".5"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></radialGradient>
  <linearGradient id="${px}-linha" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6206"/><stop offset=".5" stop-color="#F5C328"/><stop offset="1" stop-color="#FFE9A0"/></linearGradient>
  <linearGradient id="${px}-placa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2E36"/><stop offset="1" stop-color="#141418"/></linearGradient>
  <linearGradient id="${px}-placa-ouro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A0"/><stop offset=".5" stop-color="#F5C328"/><stop offset="1" stop-color="#C98F0C"/></linearGradient>
  <filter id="${px}-desfoque" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>`;

const orbe = (px, x, y, r, ic, cls = '') => `<g class="pc-orbe ${cls}">
  <circle cx="${r1(x)}" cy="${r1(y)}" r="${r + 9}" class="pc-orbe-halo"/>
  <circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="url(#${px}-vidro)" class="pc-orbe-bola"/>
  <circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" class="pc-orbe-aro"/>
  <path d="M${r1(x - r * 0.62)} ${r1(y - r * 0.38)} A${r * 0.72} ${r * 0.72} 0 0 1 ${r1(x + r * 0.62)} ${r1(y - r * 0.38)}" class="pc-orbe-brilho"/>
  <g class="pc-orbe-ic">${icEm(ic, x, y, Math.round(r * 0.95))}</g>
</g>`;

const sol = (px, x, y, r, ic) => `<g class="pc-sol">
  <circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" class="pc-onda"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" class="pc-onda pc-onda2"/>
  <circle cx="${r1(x)}" cy="${r1(y)}" r="${r * 1.9}" fill="url(#${px}-aura)"/>
  <circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="url(#${px}-ouro)" class="pc-sol-bola"/>
  <ellipse cx="${r1(x - r * 0.3)}" cy="${r1(y - r * 0.38)}" rx="${r1(r * 0.38)}" ry="${r1(r * 0.22)}" class="pc-reflexo"/>
  <g class="pc-sol-ic">${icEm(ic, x, y, Math.round(r * 0.95))}</g>
</g>`;

// rastro de luz que corre sobre um caminho (acompanha qualquer curva)
const rastro = (d, dur, atraso = 0, extra = '') => `<g class="pc-rastro-g" style="--dur:${dur}s;--ini:${atraso}s">${[[18, 2, .14], [10, 2.6, .3], [5, 3.2, .55], [2, 3.8, .9], [0.01, 18, .25, 1], [0.01, 7, 1, 1]]
  .map(([l, w, o, cab]) => `<path d="${d}" pathLength="100" class="pc-rastro${cab ? ' pc-cabeca' : ''}" style="--l:${l};stroke-width:${w};opacity:${o}" ${extra}/>`).join('')}</g>`;

/** EDB: placas em 3D que sobem uma a uma; as campanhas só flutuam no topo depois da base. */
export function ilCamadas3d(fases) {
  const px = 'cm3', W = 520, H = 480, cx = 150, a = 126, b = 48, t = 20;
  const placa = (cy, cls, k) => `<g class="cm3-placa ${cls}" style="--k:${k}">
    <path d="M${cx - a} ${cy} L${cx} ${cy + b} L${cx} ${cy + b + t} L${cx - a} ${cy + t} Z" class="cm3-lado-e"/>
    <path d="M${cx} ${cy + b} L${cx + a} ${cy} L${cx + a} ${cy + t} L${cx} ${cy + b + t} Z" class="cm3-lado-d"/>
    <path d="M${cx} ${cy - b} L${cx + a} ${cy} L${cx} ${cy + b} L${cx - a} ${cy} Z" fill="url(#${px}-${cls === 'cm3-topo' ? 'placa-ouro' : 'placa'})" class="cm3-face"/>
    <path d="M${cx - a} ${cy} L${cx} ${cy + b} L${cx + a} ${cy}" class="cm3-fio"/>
    <path d="M${cx - a + 14} ${cy - 2} L${cx} ${cy - b + 7}" class="cm3-luz"/>
  </g>`;
  const ys = fases.map((_, i) => 392 - i * 64);
  const yTopo = ys[ys.length - 1] - 118;
  const placas = fases.map((f, i) => placa(ys[i], 'cm3-base', i)).join('');
  const rotulos = fases.map((f, i) => `<span class="cm3-rot" style="top:${((ys[i] + t / 2) / H * 100).toFixed(2)}%;--k:${i}"><small>0${i + 1} · ${esc(f.quando)}</small><b>${esc(f.nome)}</b></span>`).join('');
  const guias = fases.map((_, i) => `<line x1="${cx + a + 6}" y1="${ys[i] + t / 2}" x2="${cx + a + 20}" y2="${ys[i] + t / 2}" class="cm3-guia" style="--k:${i}"/>`).join('');
  const faiscas = Array.from({ length: 10 }, (_, i) => `<circle cx="${cx - 70 + (i * 37) % 140}" cy="${ys[ys.length - 1] - 10}" r="${1.5 + (i % 3) * 0.6}" class="cm3-faisca" style="--d:${(i * 0.45).toFixed(2)}s"/>`).join('');
  return `<figure class="il il3d il-camadas3d" role="img" aria-label="As quatro fases do EDB empilhadas como uma fundação em 3D; as campanhas só flutuam no topo depois que a base está pronta." data-revela>
  <div class="cm3-palco">
  <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${defs(px)}
    <ellipse cx="${cx}" cy="${ys[0] + b + t + 18}" rx="${a + 30}" ry="${b * 0.7}" class="cm3-sombra"/>
    ${placas}
    <path d="M${cx - 36} ${ys[ys.length - 1] - 6} L${cx + 36} ${ys[ys.length - 1] - 6} L${cx + 58} ${yTopo + 8} L${cx - 58} ${yTopo + 8} Z" class="cm3-feixe"/>
    ${faiscas}
    <g class="cm3-flutua">${placa(yTopo, 'cm3-topo', fases.length)}</g>
    ${guias}
    <line x1="${cx + a + 6}" y1="${yTopo + t / 2}" x2="${cx + a + 20}" y2="${yTopo + t / 2}" class="cm3-guia cm3-guia-ouro" style="--k:${fases.length}"/>
  </svg>
  ${rotulos}
  <span class="cm3-rot cm3-rot-topo" style="top:${((yTopo + t / 2) / H * 100).toFixed(2)}%;--k:${fases.length}"><small>Depois da base</small><b>Campanhas prontas para anunciar</b></span>
  </div>
  <p class="il-legenda">Primeiro a estrutura. Depois o anúncio.</p>
</figure>`;
}

/** Growth Marketing: duas pistas (marketing e comercial) que se fundem numa só até a venda. */
export function ilConvergencia3d() {
  const px = 'cv3', W = 540, H = 360;
  const A = 'M70 82 C190 82 220 180 340 180', B = 'M70 278 C190 278 220 180 340 180', U = 'M340 180 L462 180';
  const fluxo = (d, n, dur, atraso) => Array.from({ length: n }, (_, i) => `<circle r="${i % 2 ? 3.4 : 4.4}" class="cv3-lead"><animateMotion dur="${dur}s" begin="${(atraso + (i * dur) / n).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`).join('');
  return `<figure class="il il3d il-conv3d" role="img" aria-label="Marketing e comercial como duas pistas que se juntam numa só e chegam à venda, com o mesmo número para os dois." data-revela>
  <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${defs(px)}
    <g class="cv3-pistas">
      <path d="${A}" class="cv3-trilho"/><path d="${B}" class="cv3-trilho"/><path d="${U}" class="cv3-trilho cv3-trilho-u"/>
      <path d="${A}" class="cv3-linha" stroke="url(#${px}-linha)" pathLength="1"/>
      <path d="${B}" class="cv3-linha" stroke="url(#${px}-linha)" pathLength="1"/>
      <path d="${U}" class="cv3-unida" pathLength="1"/>
      <path d="${U}" class="cv3-unida cv3-unida-glow" filter="url(#${px}-desfoque)"/>
    </g>
    ${fluxo(A + ' L462 180', 4, 4.2, 0.6)}${fluxo(B + ' L462 180', 4, 4.2, 1.1)}
    ${rastro(A + ' L462 180', 4.2, 0.6)}${rastro(B + ' L462 180', 4.2, 2.7)}
    <circle cx="340" cy="180" r="10" class="cv3-junta"/><circle cx="340" cy="180" r="10" class="cv3-junta-onda"/>
    ${orbe(px, 70, 82, 27, 'megaphone')}
    ${orbe(px, 70, 278, 27, 'handshake')}
    ${sol(px, 474, 180, 24, 'currency-circle-dollar')}
    <text x="112" y="50" class="pc-nome">Marketing</text><text x="112" y="70" class="pc-meta">anúncio · lead</text>
    <text x="112" y="314" class="pc-nome">Comercial</text><text x="112" y="334" class="pc-meta">atendimento · proposta</text>
    <g class="cv3-selo"><rect x="282" y="122" width="116" height="30" rx="15" class="pc-pilula"/><text x="340" y="142" text-anchor="middle" class="pc-pilula-tx">um funil só</text></g>
    <text x="474" y="236" text-anchor="middle" class="pc-nome pc-nome-ouro">Venda</text>
  </svg>
  <p class="il-legenda">O mesmo funil e o mesmo número na mesa dos dois.</p>
</figure>`;
}

/** Growth Intelligence: mídia, CRM e vendas entram num painel único que indica escalar, corrigir ou parar. */
export function ilDecisao3d() {
  const px = 'dc3', W = 560, H = 360;
  const fontes = [['Mídia', 'megaphone', 70], ['CRM', 'address-book', 180], ['Vendas', 'coins', 290]];
  const cabos = fontes.map(([, , y]) => `M108 ${y} C170 ${y} 170 180 214 180`);
  const saidas = [['Escalar', 'trend-up', 108, 1], ['Corrigir', 'wrench', 180, 0], ['Parar', 'hand-palm', 252, 0]];
  const barras = [34, 56, 44, 78, 64, 96].map((h, i) => `<rect x="${244 + i * 18}" y="${244 - h}" width="11" height="${h}" rx="3" class="dc3-barra${i === 5 ? ' dc3-alta' : ''}" style="--k:${i}"/>`).join('');
  return `<figure class="il il3d il-dec3d" role="img" aria-label="Dados de mídia, CRM e vendas fluindo para um painel único, que indica escalar, corrigir ou parar." data-revela>
  <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${defs(px)}
    ${cabos.map((d) => `<path d="${d}" class="dc3-cabo"/><path d="${d}" class="dc3-cabo-luz" pathLength="1"/>`).join('')}
    ${cabos.map((d, i) => Array.from({ length: 3 }, (_, k) => `<circle r="3.6" class="dc3-dado"><animateMotion dur="2.4s" begin="${(i * 0.4 + k * 0.8).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`).join('')).join('')}
    ${fontes.map(([nome, ic, y]) => `<g class="dc3-fonte"><rect x="44" y="${y - 32}" width="64" height="64" rx="19" fill="url(#${px}-vidro)" class="dc3-app"/><path d="M56 ${y - 25} Q76 ${y - 31} 96 ${y - 25}" class="pc-orbe-brilho"/><g class="pc-orbe-ic">${icEm(ic, 76, y, 26)}</g><text x="76" y="${y + 52}" text-anchor="middle" class="pc-nome pc-nome-p">${nome}</text></g>`).join('')}
    <g class="dc3-painel">
      <rect x="214" y="96" width="168" height="168" rx="26" fill="url(#${px}-vidro)" class="dc3-tela"/>
      <rect x="214" y="96" width="168" height="168" rx="26" class="dc3-tela-aro"/>
      <circle cx="236" cy="118" r="3.5" class="dc3-led"/><circle cx="248" cy="118" r="3.5" class="dc3-led dc3-led2"/><circle cx="260" cy="118" r="3.5" class="dc3-led dc3-led3"/>
      <text x="364" y="122" text-anchor="end" class="pc-meta">visão única</text>
      ${barras}
      <path d="M246 196 L270 184 L288 190 L314 160 L334 168 L356 130" class="dc3-tend" pathLength="1"/>
      <circle cx="356" cy="130" r="4.5" class="dc3-tend-pt"/>
      <path d="M232 104 L364 104" class="dc3-tela-brilho"/>
    </g>
    ${saidas.map(([nome, ic, y, ativo]) => `<path d="M382 180 C410 180 410 ${y} 432 ${y}" class="dc3-saida${ativo ? ' dc3-saida-on' : ''}"/>`).join('')}
    ${rastro('M382 180 C410 180 410 108 432 108', 2.4, 1.2)}
    ${saidas.map(([nome, ic, y, ativo]) => `<g class="dc3-op${ativo ? ' dc3-op-on' : ''}"><rect x="432" y="${y - 21}" width="112" height="42" rx="21" class="dc3-op-caixa"/><g class="dc3-op-ic">${icEm(ic, 456, y, 18)}</g><text x="474" y="${y + 6}" class="dc3-op-tx">${nome}</text></g>`).join('')}
  </svg>
  <p class="il-legenda">Dado espalhado vira uma visão só, e a visão vira decisão.</p>
</figure>`;
}

/** Lançamentos: pilares de vidro que crescem etapa a etapa até o carrinho dourado. */
export function ilLancamento3d() {
  const px = 'ln3', W = 560, H = 380, base = 286, larg = 60;
  const etapas = [['Captação', 'magnet', 46], ['Aquecimento', 'fire', 76], ['Evento', 'presentation', 116], ['Pitch', 'microphone-stage', 166], ['Carrinho', 'shopping-cart', 226]];
  const xs = etapas.map((_, i) => 64 + i * 108);
  const topos = etapas.map(([, , h], i) => [xs[i], base - h - 16]);
  const d = curva(topos);
  const pilares = etapas.map(([nome, ic, h], i) => {
    const x = xs[i] - larg / 2, fim = i === etapas.length - 1;
    return `<g class="ln3-pilar${fim ? ' ln3-fim' : ''}" style="--k:${i}">
      <rect x="${x}" y="${base - h}" width="${larg}" height="${h}" rx="14" fill="url(#${px}-${fim ? 'placa-ouro' : 'placa'})" class="ln3-corpo"/>
      <rect x="${x}" y="${base - h}" width="${larg}" height="${h}" rx="14" class="ln3-aro"/>
      <path d="M${x + 10} ${base - h + 10} L${x + 10} ${base - 12}" class="ln3-brilho"/>
    </g>
    <g class="ln3-rot"><g class="pc-orbe-ic${fim ? ' ln3-ic-fim' : ''}">${icEm(ic, xs[i], base + 26, 20)}</g><text x="${xs[i]}" y="${base + 58}" text-anchor="middle" class="pc-nome pc-nome-p${fim ? ' pc-nome-ouro' : ''}">${nome}</text></g>`;
  }).join('');
  const moedas = Array.from({ length: 8 }, (_, i) => `<circle cx="${xs[4] - 22 + (i * 13) % 46}" cy="${topos[4][1]}" r="${3 + (i % 3)}" class="ln3-moeda" style="--d:${(i * 0.35).toFixed(2)}s;--x:${((i % 2 ? 1 : -1) * (6 + (i * 5) % 18))}px"/>`).join('');
  return `<figure class="il il3d il-lanc3d" role="img" aria-label="Pilares que crescem de captação, aquecimento, evento e pitch até o carrinho, onde a oferta acontece." data-revela>
  <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${defs(px)}
    <line x1="24" y1="${base}" x2="${W - 24}" y2="${base}" class="ln3-chao"/>
    <ellipse cx="${xs[4]}" cy="${base + 4}" rx="70" ry="12" fill="url(#${px}-aura)"/>
    ${pilares}
    <path d="${d}" class="ln3-curva-glow" stroke="url(#${px}-linha)" filter="url(#${px}-desfoque)"/>
    <path d="${d}" class="ln3-curva" stroke="url(#${px}-linha)" pathLength="1"/>
    ${rastro(d, 4.6, 1.6)}
    ${topos.slice(0, 4).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" class="ln3-no"/>`).join('')}
    ${moedas}
    ${sol(px, topos[4][0], topos[4][1], 15, 'currency-circle-dollar')}
    <g class="ln3-selo"><rect x="${xs[4] - 158}" y="${topos[4][1] - 50}" width="142" height="30" rx="15" class="pc-pilula pc-pilula-ouro"/><circle cx="${xs[4] - 141}" cy="${topos[4][1] - 35}" r="4" class="ln3-pisca"/><text x="${xs[4] - 79}" y="${topos[4][1] - 30}" text-anchor="middle" class="pc-pilula-tx pc-pilula-tx-escuro">carrinho aberto</text></g>
  </svg>
  <p class="il-legenda">Cada etapa prepara a próxima. A oferta só acontece no fim.</p>
</figure>`;
}
