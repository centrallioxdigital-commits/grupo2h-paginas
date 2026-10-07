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

/** Lançamentos: painel ao vivo do lançamento. A temperatura da audiência sobe fase a fase
 *  e explode na abertura do carrinho, com as vendas por hora subindo em ouro.
 *  Números ilustrativos (painel de exemplo), não resultado de cliente. */
export function ilLancamento3d() {
  const W = 520, H = 210, faixa = W / 5;
  const etapas = [['Captação', 'magnet'], ['Aquecimento', 'fire'], ['Evento', 'presentation'], ['Pitch', 'microphone-stage'], ['Carrinho', 'shopping-cart']];
  const pts = [[0, 182], [52, 178], [104, 168], [156, 152], [208, 136], [262, 104], [298, 92], [330, 102], [372, 80], [416, 62], [452, 40], [486, 26], [508, 20]];
  const linha = curva(pts);
  const area = `${linha}L508 ${H}L0 ${H}Z`;
  const barras = [26, 44, 70, 92, 118, 104, 84].map((h, i) => `<rect x="${426 + i * 12}" y="${H - h}" width="8" height="${h}" rx="2.5" class="lx-venda" style="--k:${i}"/>`).join('');
  const grade = [50, 95, 140, 185].map((y) => `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`).join('') + [1, 2, 3, 4].map((k) => `<line x1="${k * faixa}" y1="0" x2="${k * faixa}" y2="${H}" class="lx-div"/>`).join('');
  const barrasLeads = [30, 42, 38, 56, 64, 78, 92].map((h) => `<i style="height:${h}%"></i>`).join('');
  return `<figure class="il il3d il-lanc3d lx" role="img" aria-label="Painel de um lançamento: a audiência esquenta da captação ao pitch e as vendas disparam na abertura do carrinho." data-revela>
  <div class="lx-palco">
    <div class="lx-tela">
      <div class="lx-cab">
        <div><small>Faturamento do lançamento</small><b>R$ 2,3 mi</b></div>
        <span class="lx-vivo"><i></i>Carrinho aberto</span>
      </div>
      <div class="lx-graf-box">
        <svg class="lx-graf" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="lx-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5C328" stop-opacity=".42"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></linearGradient>
            <linearGradient id="lx-traco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6206"/><stop offset=".55" stop-color="#F5C328"/><stop offset="1" stop-color="#FFF1C2"/></linearGradient>
            <linearGradient id="lx-barra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE490"/><stop offset="1" stop-color="#C08A0A" stop-opacity=".35"/></linearGradient>
          </defs>
          <rect x="${4 * faixa}" y="0" width="${faixa}" height="${H}" class="lx-zona"/>
          <g class="lx-grade">${grade}</g>
          ${barras}
          <path d="${area}" fill="url(#lx-area)" class="lx-area"/>
          <path d="${linha}" stroke="url(#lx-traco)" class="lx-linha-glow"/>
          <path d="${linha}" stroke="url(#lx-traco)" class="lx-linha" pathLength="1"/>
          <line x1="${4 * faixa}" y1="0" x2="${4 * faixa}" y2="${H}" class="lx-marco"/>
        </svg>
        <span class="lx-pico" style="left:${((508 / W) * 100).toFixed(2)}%;top:${((20 / H) * 100).toFixed(2)}%" aria-hidden="true"></span>
      </div>
      <ol class="lx-fases">${etapas.map(([n, ic], i) => `<li${i === 4 ? ' class="on"' : ''}>${icon(ic)}<span>${n}</span></li>`).join('')}</ol>
    </div>
    <div class="lx-card lx-k1" aria-hidden="true">
      <div class="lx-c-cab">${icon('users-three')}<span>Leads captados</span></div>
      <div class="lx-c-num"><b>12.480</b><em>${icon('trend-up')} 64%</em></div>
      <div class="lx-mini">${barrasLeads}</div>
    </div>
    <div class="lx-card lx-k2" aria-hidden="true">
      <div class="lx-c-cab">${icon('presentation')}<span>Presença no evento</span></div>
      <div class="lx-anel"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" class="lx-anel-f"/><circle cx="32" cy="32" r="26" class="lx-anel-on" pathLength="100"/></svg><b>41%</b></div>
    </div>
  </div>
  <p class="il-legenda">Cada etapa esquenta a próxima. A venda acontece quando o carrinho abre.</p>
</figure>`;
}
