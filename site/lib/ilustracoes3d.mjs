// Ilustrações "encorpadas" (3D sutil, vidro, metal e luz): órbita do
// Método 5A e bússola do Como funciona. Estilo em static/css/encorpado.css.

import { esc, icon, asset } from './core.mjs';

const r1 = (n) => Math.round(n * 10) / 10;
const iconeEm = (nome, x, y, t) => icon(nome).replace('<svg ', `<svg x="${r1(x - t / 2)}" y="${r1(y - t / 2)}" width="${t}" height="${t}" `);

/** Método 5A: esfera dourada no centro, fases em vidro na órbita, luz percorrendo. */
export function ilOrbita3d(fases) {
  const C = 230, R = 158, n = fases.length;
  const pos = fases.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [C + R * Math.cos(a), C + R * Math.sin(a)]; });
  const r2c = (n) => Math.round(n * 100) / 100;
  const ticks = Array.from({ length: 120 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2, maior = i % 10 === 0, ra = maior ? 198 : 203, rb = 209;
    return `<line x1="${r2c(C + ra * Math.cos(a))}" y1="${r2c(C + ra * Math.sin(a))}" x2="${r2c(C + rb * Math.cos(a))}" y2="${r2c(C + rb * Math.sin(a))}"${maior ? ' class="o3-maior"' : ''}/>`;
  }).join('');
  const nos = fases
    .map((f, i) => {
      const [x, y] = pos[i];
      const dx = x - C, ancora = Math.abs(dx) < 10 ? 'middle' : dx > 0 ? 'start' : 'end';
      const lx = x + (ancora === 'start' ? 38 : ancora === 'end' ? -38 : 0), ly = y + (Math.abs(dx) < 10 ? -44 : 5);
      return `<g class="o3-no" data-fase="${i}">
        <circle cx="${r1(x)}" cy="${r1(y)}" r="34" class="o3-halo"/>
        <circle cx="${r1(x)}" cy="${r1(y)}" r="27" class="o3-bola" />
        <circle cx="${r1(x)}" cy="${r1(y)}" r="27" class="o3-vidro"/>
        <path d="M${r1(x - 17)} ${r1(y - 9)} A20 20 0 0 1 ${r1(x + 17)} ${r1(y - 9)}" class="o3-reflexo"/>
        <g class="o3-ic">${iconeEm(f.icone, x, y, 24)}</g>
        <g class="o3-rot">
          <text x="${r1(lx)}" y="${r1(ly - 9)}" text-anchor="${ancora}" class="o3-num">0${i + 1}</text>
          <text x="${r1(lx)}" y="${r1(ly + 9)}" text-anchor="${ancora}" class="o3-nome">${esc(f.nome)}</text>
        </g>
        <g class="o3-rot-cel">
          ${i === 0
            ? `<text x="${r1(x)}" y="${r1(y - 44)}" text-anchor="middle" class="o3-nome">${esc(f.nome)}</text>`
            : `<text x="${r1(x)}" y="${r1(y + 54)}" text-anchor="middle" class="o3-nome">${esc(f.nome)}</text>`}
        </g>
      </g>`;
    })
    .join('');
  return `<figure class="il il3d il-orbita3d" role="img" aria-label="As cinco fases do Método 5A em órbita: ${esc(fases.map((f) => f.nome).join(', '))}" data-revela data-orbita>
  <svg viewBox="0 0 460 460" aria-hidden="true">
    <defs>
      <radialGradient id="o3-esfera" cx="36%" cy="30%" r="75%"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".35" stop-color="#F7C93A"/><stop offset=".75" stop-color="#C08A0A"/><stop offset="1" stop-color="#6E4C00"/></radialGradient>
      <radialGradient id="o3-aura" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#F5C328" stop-opacity=".35"/><stop offset=".55" stop-color="#F5C328" stop-opacity=".06"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></radialGradient>
      <linearGradient id="o3-anel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE490"/><stop offset=".5" stop-color="#F5C328" stop-opacity=".25"/><stop offset="1" stop-color="#FFE490"/></linearGradient>
      <radialGradient id="o3-bola-g" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#3A3A42"/><stop offset="1" stop-color="#121216"/></radialGradient>
    </defs>
    <circle cx="${C}" cy="${C}" r="215" fill="url(#o3-aura)"/>
    <circle cx="${C}" cy="${C}" r="213" class="o3-guia"/><g class="o3-ticks">${ticks}</g>
    <circle cx="${C}" cy="${C}" r="${R}" class="o3-orbita" stroke="url(#o3-anel)"/>
    <circle cx="${C}" cy="${C}" r="${R}" class="o3-cometa" pathLength="100"/>
    <circle cx="${C}" cy="${C}" r="104" class="o3-interno"/>
    <circle cx="${C}" cy="${C}" r="78" class="o3-pulso"/>
    <g class="o3-centro">
      <circle cx="${C}" cy="${C + 8}" r="70" class="o3-sombra"/>
      <circle cx="${C}" cy="${C}" r="68" fill="url(#o3-esfera)"/>
      <ellipse cx="${C - 18}" cy="${C - 30}" rx="34" ry="18" class="o3-brilho"/>
      <text x="${C}" y="${C + 14}" text-anchor="middle" class="o3-5a">5A</text>
      <text x="${C}" y="${C + 36}" text-anchor="middle" class="o3-metodo">MÉTODO</text>
    </g>
    ${nos}
  </svg>
  <figcaption class="o3-legenda" aria-live="polite"><b data-o3-nome>${esc(fases[0].nome)}</b><span data-o3-frase>${esc(fases[0].frase)}</span><i class="o3-trilho">${fases.map((_, i) => `<em${i === 0 ? ' class="on"' : ''}></em>`).join('')}</i></figcaption>
  <script type="application/json" data-o3-fases>${JSON.stringify(fases.map((f) => ({ nome: f.nome, frase: f.frase }))).replace(/</g, '\\u003c')}</script>
</figure>`;
}

/** Como funciona: bússola com aro metálico, rosa dos ventos e agulha em bisel. */
export function ilBussola3d() {
  const C = 230;
  const ticks = Array.from({ length: 120 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2, longo = i % 10 === 0, r0 = longo ? 160 : i % 5 === 0 ? 166 : 170;
    return `<line x1="${r1(C + r0 * Math.cos(a))}" y1="${r1(C + r0 * Math.sin(a))}" x2="${r1(C + 176 * Math.cos(a))}" y2="${r1(C + 176 * Math.sin(a))}"${longo ? ' class="lg"' : ''}/>`;
  }).join('');
  const graus = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    .map((g) => { const a = ((g - 90) * Math.PI) / 180; return `<text x="${r1(C + 146 * Math.cos(a))}" y="${r1(C + 146 * Math.sin(a) + 4)}" text-anchor="middle">${g}</text>`; })
    .join('');
  const estrela = (raio, larg, rot) => {
    const pts = [];
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + rot; const rr = k % 2 ? larg : raio; pts.push(`${r1(C + rr * Math.cos(a))},${r1(C + rr * Math.sin(a))}`); }
    return pts.join(' ');
  };
  const cardinais = [['Análise', C, 52, 'n'], ['Estrutura', 412, C + 5, 'l'], ['Escala', C, 418, 's'], ['Leitura', 48, C + 5, 'o']];
  return `<figure class="il il3d il-bussola3d" role="img" aria-label="Uma bússola com a agulha apontando para a estrutura, entre análise, escala e leitura." data-revela>
  <svg viewBox="0 0 460 460" aria-hidden="true">
    <defs>
      <linearGradient id="b3-aro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A5A63"/><stop offset=".35" stop-color="#1C1C21"/><stop offset=".7" stop-color="#3B3B43"/><stop offset="1" stop-color="#0E0E11"/></linearGradient>
      <radialGradient id="b3-mostrador" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#22222A"/><stop offset="1" stop-color="#0A0A0D"/></radialGradient>
      <linearGradient id="b3-ouro-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE9A0"/><stop offset="1" stop-color="#F5C328"/></linearGradient>
      <linearGradient id="b3-ouro-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D9A012"/><stop offset="1" stop-color="#8A5E00"/></linearGradient>
      <linearGradient id="b3-escuro-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A4A52"/><stop offset="1" stop-color="#2A2A31"/></linearGradient>
      <linearGradient id="b3-escuro-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1A1A1F"/><stop offset="1" stop-color="#0B0B0E"/></linearGradient>
      <radialGradient id="b3-joia" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".45" stop-color="#F5C328"/><stop offset="1" stop-color="#7A5400"/></radialGradient>
      <linearGradient id="b3-vidro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <circle cx="${C}" cy="${C + 10}" r="206" class="b3-sombra"/>
    <circle cx="${C}" cy="${C}" r="204" fill="url(#b3-aro)"/>
    <circle cx="${C}" cy="${C}" r="192" class="b3-friso"/>
    <circle cx="${C}" cy="${C}" r="186" fill="url(#b3-mostrador)"/>
    <g class="b3-ticks">${ticks}</g>
    <g class="b3-graus">${graus}</g>
    <polygon points="${estrela(118, 26, -Math.PI / 2)}" class="b3-rosa"/>
    <polygon points="${estrela(80, 18, -Math.PI / 2 + Math.PI / 8)}" class="b3-rosa b3-rosa2"/>
    <circle cx="${C}" cy="${C}" r="128" class="b3-anel"/>
    <g class="b3-agulha">
      <polygon points="${C},${C - 132} ${C - 15},${C} ${C},${C}" fill="url(#b3-escuro-a)"/>
      <polygon points="${C},${C - 132} ${C + 15},${C} ${C},${C}" fill="url(#b3-escuro-b)"/>
      <polygon points="${C},${C + 132} ${C - 15},${C} ${C},${C}" fill="url(#b3-ouro-a)"/>
      <polygon points="${C},${C + 132} ${C + 15},${C} ${C},${C}" fill="url(#b3-ouro-b)"/>
    </g>
    <circle cx="${C}" cy="${C}" r="17" fill="url(#b3-joia)" class="b3-eixo"/>
    <circle cx="${C}" cy="${C}" r="6" class="b3-eixo-in"/>
    <path d="M${C - 170} ${C - 40} A186 186 0 0 1 ${C + 120} ${C - 140}" stroke="url(#b3-vidro)" class="b3-reflexo"/>
    <circle cx="${C}" cy="${C}" r="186" fill="url(#b3-vidro)" class="b3-tampa"/>
  </svg>
  ${cardinais.map(([t, x, y, k]) => `<span class="b3-card b3-${k}${t === 'Estrutura' ? ' on' : ''}" style="left:${((x / 460) * 100).toFixed(2)}%;top:${((y / 460) * 100).toFixed(2)}%">${esc(t)}</span>`).join('')}
</figure>`;
}

/** Sobre: funil 3D de vidro, com o investimento caindo e vazando nas camadas. */
export function ilFunil3d() {
  // funil de vidro em 3D: perfil contínuo, leads descendo em espiral, vazamentos e o que chega ao caixa
  const C = 280, Y0 = 92, H = 360, PESC = 0.78, R0 = 170, RP = 14, ACH = 0.2;
  const raio = (t) => (t < PESC ? RP + (R0 - RP) * Math.pow(1 - t / PESC, 1.7) : RP - 2);
  const yDe = (t) => Y0 + t * H;
  // silhueta (lado esquerdo descendo, lado direito subindo)
  const N = 48, ts = Array.from({ length: N + 1 }, (_, i) => i / N);
  const esq = ts.map((t) => `${r1(C - raio(t))} ${r1(yDe(t))}`), dir = ts.map((t) => `${r1(C + raio(t))} ${r1(yDe(t))}`).reverse();
  const yFim = yDe(1);
  const silhueta = `M${esq.join(' L')} L${dir.join(' L')} Z`;
  // espiral de um lead: cai de cima, entra na boca e gira até o bico (t0..t1)
  const espiral = (fase, voltas, t1, saida) => {
    const pts = [`${r1(C + Math.cos(fase) * 60)} ${Y0 - 80}`];
    const M = 60;
    for (let i = 0; i <= M; i++) {
      const t = (i / M) * t1, a = fase + t * voltas * Math.PI * 2, r = raio(t) * 0.86;
      pts.push(`${r1(C + r * Math.cos(a))} ${r1(yDe(t) + r * ACH * Math.sin(a))}`);
    }
    if (saida === 'caixa') pts.push(`${C} ${r1(yFim + 12)}`, `${C} ${r1(yFim + 58)}`);
    else {
      const [ux, uy] = pts[pts.length - 1].split(' ').map(Number), lado = ux < C ? -1 : 1;
      pts.push(`${r1(ux + lado * 70)} ${r1(uy + 12)}`, `${r1(ux + lado * 110)} ${r1(uy + 90)}`);
    }
    return 'M' + pts.join(' L');
  };
  const leads = Array.from({ length: 16 }, (_, i) => {
    const vaza = i % 4 !== 3, nivel = [0.2, 0.4, 0.57, 0.7][i % 4];
    const t1 = vaza ? nivel : 1, dur = (vaza ? 3.2 + nivel * 2.6 : 6.4) + (i % 3) * 0.4;
    const d = espiral(i * 2.4, 2.2 + (i % 3) * 0.5, t1, vaza ? 'fora' : 'caixa');
    const cor = vaza ? `<animate attributeName="fill" values="#FFE27A;#FFE27A;#FF6B55;#FF6B55" keyTimes="0;.72;.8;1" dur="${dur}s" begin="${(i * 0.45).toFixed(2)}s" repeatCount="indefinite"/>` : '';
    return `<circle r="${vaza ? 4.2 : 5}" class="f4-lead${vaza ? ' f4-vaza' : ' f4-chega'}">
      <animateMotion dur="${dur}s" begin="${(i * 0.45).toFixed(2)}s" repeatCount="indefinite" path="${d}" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .7 1"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur="${dur}s" begin="${(i * 0.45).toFixed(2)}s" repeatCount="indefinite"/>${cor}
    </circle>`;
  }).join('');
  const NIVEIS = [0.2, 0.4, 0.57, 0.7];
  const etapas = ['Leads', 'Atendimento', 'Proposta', 'Fechamento'];
  const vaz = ['Oferta desalinhada', 'Atendimento lento', 'Sem follow-up', 'Rastreamento quebrado'];
  const aneis = NIVEIS.map((t, i) => {
    const r = raio(t), y = yDe(t), ry = r * ACH;
    const xe = C - r, xd = C + r;
    return `<g class="f4-anel" style="--k:${i}">
      <path d="M${r1(xe)} ${r1(y)} A${r1(r)} ${r1(ry)} 0 0 1 ${r1(xd)} ${r1(y)}" class="f4-anel-tras"/>
      <path d="M${r1(xe)} ${r1(y)} A${r1(r)} ${r1(ry)} 0 0 0 ${r1(xd)} ${r1(y)}" class="f4-anel-frente" pathLength="100"/>
      <path d="M${r1(xe + 2)} ${r1(y - 7)} l-7 5 l6 3 l-8 6" class="f4-trinca"/>
      <circle cx="${r1(xe)}" cy="${r1(y + 3)}" r="9" class="f4-furo"/>
      <line x1="${r1(xe - 10)}" y1="${r1(y + 3)}" x2="40" y2="${r1(y + 3)}" class="f4-guia f4-guia-v"/>
      <line x1="${r1(xd + 10)}" y1="${r1(y + 3)}" x2="520" y2="${r1(y + 3)}" class="f4-guia"/>
    </g>`;
  }).join('');
  const pct = (y) => ((y / 620) * 100).toFixed(2) + '%';
  const rotulos = NIVEIS.map((t, i) => `<span class="f4-etq f4-v" style="top:${pct(yDe(t) + 3)};--k:${i}"><i></i>${esc(vaz[i])}</span><span class="f4-etq f4-e" style="top:${pct(yDe(t) + 3)};--k:${i}">${esc(etapas[i])}</span>`).join('');
  const moedas = Array.from({ length: 6 }, (_, i) => {
    const y = yFim + 104 - i * 9;
    return `<g class="f4-moeda" style="--k:${i}"><path d="M${C - 34} ${y} v6 a34 9 0 0 0 68 0 v-6" fill="url(#f4-moeda-lado)"/><ellipse cx="${C}" cy="${y}" rx="34" ry="9" fill="url(#f4-moeda-topo)"/><ellipse cx="${C}" cy="${y}" rx="24" ry="5.5" class="f4-moeda-friso"/></g>`;
  }).join('');
  return `<figure class="il il3d il-funil3d" role="img" aria-label="Funil de vidro em 3D: os leads entram pelo investimento e descem em espiral; parte vaza por oferta desalinhada, atendimento lento, falta de follow-up e rastreamento quebrado; o restante cai no caixa." data-revela>
  <div class="f4-palco">
  <svg viewBox="0 0 560 620" aria-hidden="true">
    <defs>
      <linearGradient id="f4-dentro" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1D1D23"/><stop offset=".5" stop-color="#08080A"/><stop offset="1" stop-color="#1D1D23"/></linearGradient>
      <linearGradient id="f4-vidro" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".07" stop-color="#fff" stop-opacity=".08"/><stop offset=".2" stop-color="#fff" stop-opacity=".02"/>
        <stop offset=".62" stop-color="#fff" stop-opacity="0"/><stop offset=".86" stop-color="#fff" stop-opacity=".07"/><stop offset=".95" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient>
      <linearGradient id="f4-luz-centro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5C328" stop-opacity="0"/><stop offset=".55" stop-color="#F5C328" stop-opacity=".18"/><stop offset="1" stop-color="#FFE27A" stop-opacity=".55"/></linearGradient>
      <linearGradient id="f4-aro" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A5300"/><stop offset=".25" stop-color="#FFE9A6"/><stop offset=".5" stop-color="#F5C328"/><stop offset=".78" stop-color="#FFF3C4"/><stop offset="1" stop-color="#7A5300"/></linearGradient>
      <radialGradient id="f4-boca" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#000"/><stop offset=".75" stop-color="#0E0E12"/><stop offset="1" stop-color="#26262D"/></radialGradient>
      <linearGradient id="f4-moeda-lado" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A5300"/><stop offset=".35" stop-color="#E9B21C"/><stop offset=".6" stop-color="#FFE38A"/><stop offset="1" stop-color="#8A6206"/></linearGradient>
      <radialGradient id="f4-moeda-topo" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".5" stop-color="#F7C935"/><stop offset="1" stop-color="#B98208"/></radialGradient>
      <radialGradient id="f4-chao" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F5C328" stop-opacity=".5"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></radialGradient>
      <filter id="f4-desfoque" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <ellipse cx="${C}" cy="${r1(yFim + 112)}" rx="150" ry="26" fill="url(#f4-chao)"/>
    <text x="${C}" y="24" text-anchor="middle" class="f4-tit">Investimento</text>
    <path d="${silhueta}" fill="url(#f4-dentro)" class="f4-tras"/>
    <path d="M${C - 10} ${Y0 + 40} L${C + 10} ${Y0 + 40} L${C + 6} ${r1(yFim)} L${C - 6} ${r1(yFim)} Z" fill="url(#f4-luz-centro)" filter="url(#f4-desfoque)"/>
    <ellipse cx="${C}" cy="${Y0}" rx="${R0}" ry="${r1(R0 * ACH)}" fill="url(#f4-boca)"/>
    ${aneis}
    <g class="f4-leads">${leads}</g>
    <path d="${silhueta}" fill="url(#f4-vidro)" class="f4-frente"/>
    <path d="M${r1(C - raio(0.04) + 14)} ${r1(yDe(0.04) + 10)} Q${r1(C - raio(0.3) + 6)} ${r1(yDe(0.3))} ${r1(C - raio(0.66) + 3)} ${r1(yDe(0.66))}" class="f4-brilho"/>
    <ellipse cx="${C}" cy="${Y0}" rx="${R0}" ry="${r1(R0 * ACH)}" class="f4-aro" stroke="url(#f4-aro)"/>
    <ellipse cx="${C}" cy="${Y0 + 3}" rx="${R0 - 5}" ry="${r1((R0 - 5) * ACH)}" class="f4-aro-sombra"/>
    <ellipse cx="${C}" cy="${r1(yFim)}" rx="${r1(raio(1))}" ry="${r1(raio(1) * ACH)}" class="f4-bico" stroke="url(#f4-aro)"/>
    ${moedas}
    <text x="${C}" y="${r1(yFim + 150)}" text-anchor="middle" class="f4-tit f4-tit-ouro">Caixa</text>
  </svg>
  ${rotulos}
  </div>
  <p class="il-legenda">O maior desperdício não é o anúncio ruim. É a operação sem estrutura.</p>
</figure>`;
}

/** Growth Control: painel de instrumento com aro metálico, escala de ROAS e ponteiro que passa do equilíbrio. */
export function ilMedidor3d() {
  const C = 240, Y = 236, R = 172;
  // fração 0..1 da escala (0 = esquerda, 1 = direita) para ponto no arco
  const pt = (f, r) => { const a = Math.PI * (1 - f); return [C + r * Math.cos(a), Y - r * Math.sin(a)]; };
  const arco = (f0, f1, r) => { const [x0, y0] = pt(f0, r), [x1, y1] = pt(f1, r); return `M${r1(x0)} ${r1(y0)} A${r} ${r} 0 0 1 ${r1(x1)} ${r1(y1)}`; };
  const marcas = Array.from({ length: 51 }, (_, i) => {
    const f = i / 50, maior = i % 10 === 0, meio = i % 5 === 0;
    const [x0, y0] = pt(f, maior ? 128 : meio ? 134 : 139), [x1, y1] = pt(f, 146);
    return `<line x1="${r1(x0)}" y1="${r1(y0)}" x2="${r1(x1)}" y2="${r1(y1)}" class="${maior ? 'm3-maior' : meio ? 'm3-meio' : ''}"/>`;
  }).join('');
  const numeros = [0, 1, 2, 3, 4, 5].map((n) => { const [x, y] = pt(n / 5, 112); return `<text x="${r1(x)}" y="${r1(y + 5)}" text-anchor="middle" class="m3-num">${n}x</text>`; }).join('');
  const ALVO = 0.68; // ROAS 3,4x
  return `<figure class="il il3d il-medidor3d" role="img" aria-label="Painel de instrumento: escala de ROAS com faixas de prejuízo, equilíbrio e lucro; o ponteiro para em 3,4x, acima do ROAS de equilíbrio." data-revela style="--alvo:${(ALVO * 180 - 90).toFixed(1)}deg">
    <svg viewBox="0 0 480 300" aria-hidden="true">
      <defs>
        <linearGradient id="m3-aro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A5A63"/><stop offset=".35" stop-color="#2A2A30"/><stop offset=".7" stop-color="#16161A"/><stop offset="1" stop-color="#3A3A42"/></linearGradient>
        <radialGradient id="m3-face" cx=".5" cy="1" r="1"><stop offset="0" stop-color="#1E1D22"/><stop offset=".7" stop-color="#121215"/><stop offset="1" stop-color="#0B0B0D"/></radialGradient>
        <linearGradient id="m3-ruim" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7A2318"/><stop offset="1" stop-color="#E8654D"/></linearGradient>
        <linearGradient id="m3-bom" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE490"/><stop offset=".5" stop-color="#F5C328"/><stop offset="1" stop-color="#B98208"/></linearGradient>
        <linearGradient id="m3-ag-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6DA"/><stop offset="1" stop-color="#E9D9A8"/></linearGradient>
        <linearGradient id="m3-ag-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A88F52"/><stop offset="1" stop-color="#6E5A2A"/></linearGradient>
        <radialGradient id="m3-cubo" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF1B8"/><stop offset=".35" stop-color="#F5C328"/><stop offset="1" stop-color="#8A6206"/></radialGradient>
        <linearGradient id="m3-vidro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <filter id="m3-brilho" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <ellipse cx="${C}" cy="${Y + 38}" rx="190" ry="14" class="m3-sombra"/>
      <path d="${arco(0, 1, 204)} L${C + 204} ${Y + 18} L${C - 204} ${Y + 18} Z" fill="url(#m3-aro)" class="m3-aro"/>
      <path d="${arco(0, 1, 190)} L${C + 190} ${Y + 8} L${C - 190} ${Y + 8} Z" fill="url(#m3-face)" class="m3-face"/>
      <path d="${arco(0, 1, 203)}" class="m3-aro-luz"/>
      <path d="${arco(0, 1, 190)}" class="m3-face-borda"/>
      <path d="${arco(0, 0.4, R)}" class="m3-faixa" stroke="url(#m3-ruim)"/>
      <path d="${arco(0.41, 0.49, R)}" class="m3-faixa m3-eq"/>
      <path d="${arco(0.5, 1, R)}" class="m3-faixa" stroke="url(#m3-bom)"/>
      <path d="${arco(0.5, 1, R)}" class="m3-faixa m3-brilho" stroke="url(#m3-bom)" filter="url(#m3-brilho)"/>
      <path d="${arco(0, 1, R)}" class="m3-faixa-luz"/>
      <path d="${arco(0, ALVO, 158)}" class="m3-progresso" pathLength="100"/>
      <g class="m3-marcas">${marcas}</g>
      ${numeros}
      <text x="${r1(pt(0.08, 214)[0])}" y="${Y + 46}" class="m3-rot m3-rot-ruim">Prejuízo</text>
      <text x="${C}" y="${Y - 216}" text-anchor="middle" class="m3-rot m3-rot-eq">Equilíbrio</text>
      <text x="${r1(pt(0.92, 214)[0])}" y="${Y + 46}" text-anchor="end" class="m3-rot m3-rot-bom">Lucro</text>
      <g class="m3-ponteiro">
        <path d="M${C} ${Y - 150} L${C - 7} ${Y - 6} L${C} ${Y + 26} Z" fill="url(#m3-ag-a)"/>
        <path d="M${C} ${Y - 150} L${C + 7} ${Y - 6} L${C} ${Y + 26} Z" fill="url(#m3-ag-b)"/>
        <circle cx="${C}" cy="${Y - 146}" r="5" class="m3-ponta"/>
      </g>
      <circle cx="${C}" cy="${Y}" r="24" class="m3-cubo-aro"/>
      <circle cx="${C}" cy="${Y}" r="17" fill="url(#m3-cubo)"/>
      <ellipse cx="${C - 5}" cy="${Y - 7}" rx="8" ry="4.5" class="m3-cubo-luz"/>
      <path d="${arco(0, 1, 189)} L${C + 189} ${Y - 40} Q${C} ${Y - 120} ${C - 189} ${Y - 40} Z" fill="url(#m3-vidro)" class="m3-vidro"/>
    </svg>
    <div class="m3-leitura"><small>ROAS atual</small><b><span data-conta="34" data-dec>3,4</span>x</b><em>${icon('trend-up')} acima do equilíbrio</em></div>
    <div class="m3-chips"><span>${icon('target')}CPA máximo</span><span>${icon('scales')}ROAS de equilíbrio</span><span>${icon('coins')}Margem por venda</span></div>
    <p class="il-legenda">A matemática antes da mídia: saber até onde dá para pagar por cliente.</p>
  </figure>`;
}

/** Sobre: a marca 2!H em metal dourado, sobre um pedestal de vidro, com órbitas e luz. */
export function ilMarca3d() {
  const logo = asset('img/logo-2h-grande.png');
  const orbita = (rx, ry, rot, dur, cls) => `<g transform="rotate(${rot} 250 250)" class="mk-orbita ${cls}">
      <ellipse cx="250" cy="250" rx="${rx}" ry="${ry}"/>
      <circle r="4" class="mk-cometa"><animateMotion dur="${dur}s" repeatCount="indefinite" path="M${250 - rx} 250 a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0"/></circle>
    </g>`;
  const faiscas = Array.from({ length: 14 }, (_, i) => `<i style="--x:${(8 + ((i * 37) % 84))}%;--d:${((i * 0.7) % 6).toFixed(1)}s;--t:${(5 + (i % 4)).toFixed(0)}s;--s:${2 + (i % 3)}px"></i>`).join('');
  return `<figure class="il il3d il-marca3d" role="img" aria-label="Logo do Grupo 2!H em metal dourado sobre um pedestal de vidro, cercado por órbitas" data-revela>
    <div class="mk-palco">
      <div class="mk-halo"></div>
      <svg class="mk-orbitas" viewBox="0 0 500 500" aria-hidden="true">
        ${orbita(220, 70, -14, 9, 'mk-o1')}
        ${orbita(190, 58, 18, 12, 'mk-o2')}
        ${orbita(236, 92, 4, 16, 'mk-o3')}
      </svg>
      <div class="mk-faiscas" aria-hidden="true">${faiscas}</div>
      <div class="mk-flutua">
        <div class="mk-relevo"><div class="mk-logo" style="--logo:url('${logo}')"></div></div>
        <div class="mk-reflexo" style="--logo:url('${logo}')"></div>
      </div>
      <div class="mk-pedestal"><i></i></div>
    </div>
    <p class="mk-nome">GRUPO <b>2!H</b></p>
  </figure>`;
}
