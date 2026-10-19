// Ilustrações em código para o lado visual das seções. Cada uma explica
// uma ideia da página (não é enfeite): camadas da fundação, ponto de
// equilíbrio, marketing e comercial se encontrando, dados virando decisão...
// Animações em CSS (site.css, bloco "ilustrações"), param sozinhas com
// prefers-reduced-motion e só tocam quando entram na tela (.visto).

import { esc, asset } from './core.mjs';

const fig = (cls, conteudo, rotulo) => `<figure class="il ${cls}" role="img" aria-label="${esc(rotulo)}" data-revela>${conteudo}</figure>`;

/** EDB: as quatro camadas da fundação sobem e só então as campanhas acendem. */
export function ilCamadas(fases) {
  const camadas = [...fases].reverse();
  return fig(
    'il-camadas',
    `<div class="cm-topo"><span>Campanhas</span><b>Prontas para anunciar</b><em>Aguardando a base</em></div>
     ${camadas.map((f, i) => `<div class="cm" style="--k:${camadas.length - 1 - i}"><span>${esc(f.nome)}</span><small>${esc(f.quando)}</small></div>`).join('')}
     <p class="il-legenda">Primeiro a estrutura. Depois o anúncio.</p>`,
    'As quatro fases do EDB empilhadas como a fundação, e as campanhas por cima só depois que a base está pronta.'
  );
}

/** Growth Control: o ponteiro do medidor sai do prejuízo e para acima do equilíbrio. */
export function ilMedidor() {
  // semicírculo de 180° (centro 200,200, raio 150)
  const arco = (a0, a1, r = 150) => {
    const p = (a) => [200 + r * Math.cos(Math.PI * (1 - a)), 200 - r * Math.sin(Math.PI * (1 - a))];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const marcas = Array.from({ length: 21 }, (_, i) => {
    const a = Math.PI * (1 - i / 20), r0 = i % 5 ? 128 : 120, r1 = 136;
    return `<line x1="${(200 + r0 * Math.cos(a)).toFixed(1)}" y1="${(200 - r0 * Math.sin(a)).toFixed(1)}" x2="${(200 + r1 * Math.cos(a)).toFixed(1)}" y2="${(200 - r1 * Math.sin(a)).toFixed(1)}"/>`;
  }).join('');
  return fig(
    'il-medidor',
    `<svg viewBox="0 0 400 250" aria-hidden="true">
      <path d="${arco(0, 0.42)}" class="md-z md-ruim"/>
      <path d="${arco(0.42, 0.5)}" class="md-z md-eq"/>
      <path d="${arco(0.5, 1)}" class="md-z md-bom"/>
      <g class="md-marcas">${marcas}</g>
      <text x="62" y="236" class="il-tx il-tx-m">Prejuízo</text>
      <text x="200" y="34" text-anchor="middle" class="il-tx il-tx-ouro">Equilíbrio</text>
      <text x="338" y="236" text-anchor="end" class="il-tx il-tx-m">Lucro</text>
      <g class="md-ponteiro"><line x1="200" y1="200" x2="200" y2="78"/><circle cx="200" cy="200" r="11"/></g>
    </svg>
    <div class="il-chips"><span>CPA máximo</span><span>ROAS de equilíbrio</span><span>Margem por venda</span></div>
    <p class="il-legenda">A matemática antes da mídia: saber até onde dá para pagar por cliente.</p>`,
    'Medidor com as faixas de prejuízo, equilíbrio e lucro: a campanha precisa operar acima do ROAS de equilíbrio.'
  );
}

/** Growth Marketing: as faixas de marketing e de comercial convergem na venda. */
export function ilConvergencia() {
  return fig(
    'il-conv',
    `<svg viewBox="0 0 460 300" aria-hidden="true">
      <path id="cv-a" class="cv-faixa" d="M20 60 C150 60 180 150 300 150"/>
      <path id="cv-b" class="cv-faixa" d="M20 240 C150 240 180 150 300 150"/>
      <path class="cv-faixa cv-unida" d="M300 150 L420 150"/>
      <circle class="cv-no" cx="20" cy="60" r="6"/><circle class="cv-no" cx="20" cy="240" r="6"/>
      <circle class="cv-fim-halo" cx="420" cy="150" r="22"/><circle class="cv-fim" cx="420" cy="150" r="9"/>
      <text x="20" y="38" class="il-tx">Marketing</text><text x="20" y="276" class="il-tx">Comercial</text>
      <text x="104" y="84" class="il-tx il-tx-m">anúncio · lead</text><text x="104" y="226" class="il-tx il-tx-m">atendimento · proposta</text>
      <text x="420" y="198" text-anchor="middle" class="il-tx il-tx-ouro">Venda</text>
      <circle r="4.5" class="cv-pt"><animateMotion dur="3.6s" repeatCount="indefinite"><mpath href="#cv-a"/></animateMotion></circle>
      <circle r="4.5" class="cv-pt"><animateMotion dur="3.6s" begin="1.8s" repeatCount="indefinite"><mpath href="#cv-b"/></animateMotion></circle>
    </svg>
    <p class="il-legenda">O mesmo funil e o mesmo número na mesa dos dois.</p>`,
    'Duas faixas, marketing e comercial, que se juntam numa só até a venda.'
  );
}

/** Growth Intelligence: mídia, CRM e vendas entram num painel e viram decisão. */
export function ilDecisao() {
  const fontes = ['Mídia', 'CRM', 'Vendas'];
  return fig(
    'il-dec',
    `<svg viewBox="0 0 480 300" aria-hidden="true">
      ${fontes.map((f, i) => `<g class="dc-f" style="--k:${i}"><rect x="10" y="${40 + i * 90}" width="96" height="44" rx="10"/><text x="58" y="${67 + i * 90}" text-anchor="middle" class="il-tx">${f}</text><path class="dc-l" d="M106 ${62 + i * 90} C150 ${62 + i * 90} 150 150 190 150" pathLength="1"/></g>`).join('')}
      <rect x="190" y="80" width="150" height="140" rx="14" class="dc-painel"/>
      <g class="dc-barras"><rect x="210" y="170" width="18" height="30" rx="3"/><rect x="238" y="150" width="18" height="50" rx="3"/><rect x="266" y="160" width="18" height="40" rx="3"/><rect x="294" y="128" width="18" height="72" rx="3" class="dc-alta"/></g>
      <path class="dc-tend" d="M210 132 L240 120 L268 124 L312 100" pathLength="1"/>
      <path class="dc-l dc-saida" d="M340 150 L370 150" pathLength="1"/>
      <g class="dc-op"><rect x="372" y="88" width="98" height="34" rx="9" class="dc-sim"/><text x="421" y="110" text-anchor="middle" class="il-tx il-tx-ouro">Escalar</text>
      <rect x="372" y="133" width="98" height="34" rx="9"/><text x="421" y="155" text-anchor="middle" class="il-tx">Corrigir</text>
      <rect x="372" y="178" width="98" height="34" rx="9"/><text x="421" y="200" text-anchor="middle" class="il-tx">Parar</text></g>
    </svg>
    <p class="il-legenda">Dado espalhado vira uma visão só, e a visão vira decisão.</p>`,
    'Dados de mídia, CRM e vendas entrando num painel único que indica escalar, corrigir ou parar.'
  );
}

/** Lançamentos: a curva do lançamento, da captação ao carrinho. */
export function ilLancamento() {
  const etapas = ['Captação', 'Aquecimento', 'Evento', 'Pitch', 'Carrinho'];
  return fig(
    'il-lanc',
    `<svg viewBox="0 0 480 290" aria-hidden="true">
      ${etapas.map((e, i) => `<line x1="${40 + i * 100}" y1="40" x2="${40 + i * 100}" y2="236" class="ln-grade"/><text x="${40 + i * 100}" y="262" text-anchor="middle" class="il-tx il-tx-m">${e}</text>`).join('')}
      <path class="ln-area" d="M40 226 C110 222 150 200 240 176 C300 160 320 120 340 92 C360 64 400 52 440 48 L440 236 L40 236 Z"/>
      <path class="ln-curva" d="M40 226 C110 222 150 200 240 176 C300 160 320 120 340 92 C360 64 400 52 440 48" pathLength="1"/>
      <circle cx="440" cy="48" r="7" class="ln-pico"/>
    </svg>
    <p class="il-legenda">Cada etapa prepara a próxima. A oferta só acontece no fim.</p>`,
    'Curva de um lançamento passando por captação, aquecimento, evento, pitch e carrinho.'
  );
}

/** Método 5A: as cinco fases em órbita, com a fase atual acesa em sequência. */
export function ilOrbita(fases) {
  const n = fases.length, R = 150, cx = 210, cy = 200;
  const pos = fases.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
  return fig(
    'il-orbita',
    `<svg viewBox="0 0 420 410" aria-hidden="true">
      <circle cx="${cx}" cy="${cy}" r="${R}" class="ob-anel"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" class="ob-giro" pathLength="100"/>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" class="ob-centro">5A</text>
      <text x="${cx}" y="${cy + 34}" text-anchor="middle" class="il-tx il-tx-m">Método</text>
      ${fases
        .map((f, i) => {
          const [x, y] = pos[i];
          const dx = x - cx, ancora = Math.abs(dx) < 10 ? 'middle' : dx > 0 ? 'start' : 'end';
          const lx = x + (ancora === 'start' ? 22 : ancora === 'end' ? -22 : 0), ly = y + (Math.abs(dx) < 10 ? -24 : 6);
          return `<g class="ob-f" style="--k:${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" class="ob-pt"/><text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${ancora}" class="il-tx">${esc(f.nome)}</text></g>`;
        })
        .join('')}
    </svg>`,
    'As cinco fases do Método 5A em círculo: Análise, Alinhamento, Aquisição, Acompanhamento e Aceleração.'
  );
}

/** Sobre: o funil que vaza (onde o dinheiro escapa entre o investimento e o caixa). */
export function ilFunil() {
  const vazamentos = [
    { y: 92, lado: 'e', t: 'Oferta desalinhada' },
    { y: 150, lado: 'd', t: 'Atendimento lento' },
    { y: 204, lado: 'e', t: 'Sem follow-up' },
    { y: 256, lado: 'd', t: 'Rastreamento quebrado' },
  ];
  return fig(
    'il-funil',
    `<svg viewBox="0 0 440 360" aria-hidden="true">
      <text x="220" y="30" text-anchor="middle" class="il-tx il-tx-m">Investimento</text>
      <path class="fn-corpo" d="M90 48 L350 48 L262 288 L178 288 Z"/>
      ${[92, 150, 204, 256].map((y) => { const w = 130 - ((y - 48) / 240) * 88; return `<line x1="${220 - w}" y1="${y}" x2="${220 + w}" y2="${y}" class="fn-linha"/>`; }).join('')}
      ${vazamentos
        .map((v, i) => {
          const w = 130 - ((v.y - 48) / 240) * 88;
          const x = v.lado === 'e' ? 220 - w : 220 + w;
          const dir = v.lado === 'e' ? -1 : 1;
          return `<g class="fn-vaz" style="--k:${i}"><circle cx="${(x + dir * 14).toFixed(1)}" cy="${v.y + 8}" r="3.5" class="fn-gota"/><text x="${(x + dir * 26).toFixed(1)}" y="${v.y + 4}" text-anchor="${v.lado === 'e' ? 'end' : 'start'}" class="il-tx il-tx-v">${esc(v.t)}</text></g>`;
        })
        .join('')}
      <path class="fn-saida" d="M220 288 L220 324"/>
      <text x="220" y="348" text-anchor="middle" class="il-tx il-tx-ouro">Caixa</text>
    </svg>
    <p class="il-legenda">O maior desperdício não é o anúncio ruim. É a operação sem estrutura.</p>`,
    'Um funil com vazamentos nas laterais: oferta desalinhada, atendimento lento, falta de follow-up e rastreamento quebrado.'
  );
}

/** Como funciona: bússola apontando para a estrutura. */
export function ilBussola() {
  const pontos = [['Análise', 210, 46, 'middle'], ['Estrutura', 372, 214, 'start'], ['Escala', 210, 384, 'middle'], ['Leitura', 48, 214, 'end']];
  return fig(
    'il-bussola',
    `<svg viewBox="0 0 420 410" aria-hidden="true">
      <circle cx="210" cy="210" r="150" class="bs-anel"/><circle cx="210" cy="210" r="112" class="bs-anel bs-fino"/>
      ${Array.from({ length: 36 }, (_, i) => { const a = (i * Math.PI) / 18, r0 = i % 9 ? 142 : 132; return `<line x1="${(210 + r0 * Math.cos(a)).toFixed(1)}" y1="${(210 + r0 * Math.sin(a)).toFixed(1)}" x2="${(210 + 150 * Math.cos(a)).toFixed(1)}" y2="${(210 + 150 * Math.sin(a)).toFixed(1)}" class="bs-marca"/>`; }).join('')}
      ${pontos.map(([t, x, y, a]) => `<text x="${x}" y="${y}" text-anchor="${a}" class="il-tx${t === 'Estrutura' ? ' il-tx-ouro' : ''}">${t}</text>`).join('')}
      <g class="bs-agulha"><path d="M210 92 L224 210 L210 328 L196 210 Z" class="bs-ag-a"/><path d="M210 92 L224 210 L196 210 Z" class="bs-ag-n"/><circle cx="210" cy="210" r="8" class="bs-eixo"/></g>
    </svg>`,
    'Uma bússola com a agulha apontando para a estrutura, entre análise, escala e leitura.'
  );
}

/** Contato: a conversa que começa no diagnóstico rápido. */
export function ilConversa() {
  return fig(
    'il-conversa',
    `<div class="cv-bolha cv-voce" style="--k:0"><small>Você</small>Respondi o diagnóstico rápido.</div>
     <div class="cv-bolha cv-2h" style="--k:1"><small>2!H</small>Oi! Já vi o cenário da sua empresa. Podemos conversar sobre onde o dinheiro está travando?</div>
     <div class="cv-bolha cv-voce" style="--k:2"><small>Você</small>Podemos sim.</div>
     <div class="cv-cartao" style="--k:3"><b>Leitura do cenário</b><span>e proposta com o degrau certo</span></div>`,
    'Ilustração da conversa: você responde o diagnóstico rápido, a 2!H chama no WhatsApp e a conversa vira uma proposta.'
  );
}

/** Soluções: a escada em perfil. Os degraus crescem, a linha de tendência
 *  liga o topo de cada um e uma luz percorre o caminho até a escala. */
export function ilEscada(servicos) {
  const n = servicos.length;
  const BASE = 300, L = 80, PASSO = 96, X0 = 20;
  const curto = (s) => s.nome.replace('Growth ', '').replace(' e coprodução', '');
  const d = servicos.map((s, i) => {
    const h = 70 + i * 52, x = X0 + i * PASSO, y = BASE - h;
    return { s, i, h, x, y, cx: x + L / 2, topo: i === n - 1 };
  });
  const rota = d.map((p, i) => `${i ? 'L' : 'M'}${p.cx} ${p.y}`).join(' ');
  const fim = d[n - 1];
  const grade = [0, 1, 2, 3].map((k) => `<line x1="0" x2="500" y1="${BASE - 70 - k * 70}" y2="${BASE - 70 - k * 70}" class="es-grade"/>`).join('');
  return fig(
    'il-escada',
    `<svg viewBox="0 0 500 360" aria-hidden="true">
      <defs>
        <linearGradient id="es-brilho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5C328" stop-opacity=".55"/><stop offset=".45" stop-color="#F5C328" stop-opacity=".12"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></linearGradient>
        <linearGradient id="es-ouro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE58F"/><stop offset=".5" stop-color="#F5C328"/><stop offset="1" stop-color="#B9850B"/></linearGradient>
        <linearGradient id="es-chao" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".6" stop-color="#F5C328" stop-opacity=".5"/><stop offset="1" stop-color="#F5C328"/></linearGradient>
        <radialGradient id="es-halo"><stop offset="0" stop-color="#F5C328" stop-opacity=".5"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></radialGradient>
      </defs>
      ${grade}
      <ellipse cx="${fim.cx}" cy="${fim.y + 40}" rx="120" ry="110" fill="url(#es-halo)" class="es-aura"/>
      ${d
        .map(
          (p) => `<g class="es-d${p.topo ? ' es-d-topo' : ''}" style="--k:${p.i}">
        <g class="es-barra">
          <rect x="${p.x}" y="${p.y}" width="${L}" height="${p.h}" rx="10" class="es-r"/>
          <rect x="${p.x}" y="${p.y}" width="${L}" height="${p.h}" rx="10" fill="url(#${p.topo ? 'es-ouro' : 'es-brilho'})" style="opacity:${p.topo ? 1 : (0.35 + p.i * 0.16).toFixed(2)}"/>
          <rect x="${p.x + 0.5}" y="${p.y + 0.5}" width="${L - 1}" height="${p.h - 1}" rx="9.5" class="es-borda"/>
          <line x1="${p.x + 14}" x2="${p.x + L - 14}" y1="${p.y + 1}" y2="${p.y + 1}" class="es-cap"/>
          <text x="${p.x + 14}" y="${p.y + 28}" class="es-num">${String(p.i + 1).padStart(2, '0')}</text>
        </g>
        <text x="${p.cx}" y="${BASE + 30}" text-anchor="middle" class="es-nome">${esc(curto(p.s))}</text>
        <text x="${p.cx}" y="${BASE + 49}" text-anchor="middle" class="es-grau">${esc(p.s.degrau)}</text>
      </g>`
        )
        .join('')}
      <line x1="0" y1="${BASE + 0.5}" x2="500" y2="${BASE + 0.5}" stroke="url(#es-chao)" class="es-base"/>
      <path d="${rota}" pathLength="1" class="es-rota"/>
      <path d="${rota}" pathLength="1" class="es-luz"/>
      ${d.map((p) => `<circle cx="${p.cx}" cy="${p.y}" r="${p.topo ? 6 : 4}" class="es-pt${p.topo ? ' es-pt-topo' : ''}" style="--k:${p.i}"/>`).join('')}
      <circle cx="${fim.cx}" cy="${fim.y}" r="6" class="es-ping"/>
    </svg>`,
    'Os cinco serviços da 2!H desenhados como degraus que sobem, da fundação (EDB) à escala (Lançamentos), ligados por uma linha de crescimento.'
  );
}

/** Glossário: uma fórmula em destaque. */
export function ilFormula() {
  return fig(
    'il-formula',
    `<div class="fm-linha"><span>ROAS de equilíbrio</span><b>=</b><span class="fm-frac"><i>1</i><i>margem</i></span></div>
     <div class="fm-linha fm-2"><span>CAC</span><b>=</b><span class="fm-frac"><i>marketing + comercial</i><i>clientes novos</i></span></div>
     <p class="il-legenda">Os números que decidem se o crescimento se paga.</p>`,
    'Fórmulas de ROAS de equilíbrio e CAC em destaque.'
  );
}

/** Sobre: a marca da 2!H no centro de anéis, como o ponto fixo de um mapa. */
export function ilMarca() {
  return `<figure class="il il-marca" role="img" aria-label="Logo do Grupo 2!H" data-revela>
    <svg class="mc-aneis" viewBox="0 0 400 360" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><circle cx="200" cy="170" r="70"/><circle cx="200" cy="170" r="110"/><circle cx="200" cy="170" r="150" class="mc-ouro"/><circle cx="200" cy="170" r="190"/><circle cx="200" cy="170" r="230"/></svg>
    <img src="${asset('img/logo-2h.png')}" alt="" width="140" height="129">
    <p>GRUPO 2!H</p>
  </figure>`;
}
