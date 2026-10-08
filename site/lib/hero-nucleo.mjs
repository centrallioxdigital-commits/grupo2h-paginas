// Abertura da home: a marca 2!H como núcleo luminoso no centro, anéis de órbita em 3D
// e cartões de painel (leads, faturamento, ROAS, CAC) flutuando ao redor, ligados por
// linhas de luz. Tudo em HTML/CSS/SVG (sem imagem pesada). Estilo em static/css/hero.css.
// Os números dos cartões são ilustrativos (painel de exemplo), não resultados de clientes.

import { icon, asset } from './core.mjs';

const barras = [28, 36, 33, 48, 55, 64, 78];
const cartaoLeads = `<div class="nx-card nx-c1" aria-hidden="true">
  <div class="nx-c-cab">${icon('users-three')}<span>Leads qualificados</span></div>
  <div class="nx-c-num"><b>1.248</b><em class="nx-sobe">${icon('trend-up')} 38%</em></div>
  <svg class="nx-barras" viewBox="0 0 140 64" preserveAspectRatio="none">${barras.map((h, i) => `<rect x="${i * 20 + 2}" y="${64 - h * .8}" width="12" height="${h * .8}" rx="3" class="${i === barras.length - 1 ? 'nx-b-on' : ''}"/>`).join('')}</svg>
</div>`;

const cartaoFat = `<div class="nx-card nx-c2" aria-hidden="true">
  <div class="nx-c-cab">${icon('chart-line-up')}<span>Faturamento</span></div>
  <div class="nx-c-num"><b>R$ 1,2 mi</b><em class="nx-sobe">${icon('trend-up')} 24%</em></div>
  <svg class="nx-area" viewBox="0 0 160 64" preserveAspectRatio="none">
    <defs><linearGradient id="nx-area-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5C328" stop-opacity=".45"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></linearGradient></defs>
    <path d="M0 52 C18 50 26 44 40 45 S64 34 80 36 S106 22 120 24 S146 8 160 6 L160 64 L0 64Z" fill="url(#nx-area-g)"/>
    <path d="M0 52 C18 50 26 44 40 45 S64 34 80 36 S106 22 120 24 S146 8 160 6" class="nx-linha"/>
    <circle cx="160" cy="6" r="4" class="nx-ponto"/>
  </svg>
</div>`;

const cartaoRoas = `<div class="nx-card nx-c3" aria-hidden="true">
  <div class="nx-c-cab">${icon('gauge')}<span>ROAS</span></div>
  <div class="nx-roas">
    <svg viewBox="0 0 120 66"><path d="M10 60 A50 50 0 0 1 110 60" class="nx-g-fundo"/><path d="M10 60 A50 50 0 0 1 98 32" class="nx-g-on"/><line x1="60" y1="60" x2="96" y2="36" class="nx-g-ponteiro"/><circle cx="60" cy="60" r="5" class="nx-ponto"/></svg>
    <b>6,4x</b>
  </div>
  <p class="nx-c-rod">Retorno sobre o investimento em mídia</p>
</div>`;

const cartaoCac = `<div class="nx-card nx-c4" aria-hidden="true">
  <div class="nx-c-cab">${icon('target')}<span>Custo por cliente (CAC)</span></div>
  <div class="nx-c-num"><b>R$ 182</b><em class="nx-cai">${icon('trend-down')} 27%</em></div>
  <svg class="nx-spark" viewBox="0 0 160 48" preserveAspectRatio="none"><path d="M0 8 L22 12 L40 10 L58 20 L78 18 L96 28 L116 30 L136 38 L160 40" class="nx-linha"/><circle cx="160" cy="40" r="4" class="nx-ponto"/></svg>
</div>`;

// notificação no estilo do iPhone: o painel "avisando" o dono da empresa
const notificacao = (cls, quando, titulo) => `<div class="nx-chip nx-notif ${cls}" aria-hidden="true">
    <span class="nx-n-app"><img src="${asset('img/logo-2h-glyph.png')}" alt="" width="14" height="13"></span>
    <span class="nx-n-txt"><span class="nx-n-topo"><b>Grupo 2!H</b><time>${quando}</time></span><strong>${titulo}</strong></span>
  </div>`;

/** Núcleo com a marca 2!H, órbitas, cartões e linhas de luz. */
export function heroNucleo() {
  return `<div class="nx-palco">
  <svg class="nx-fios" viewBox="0 0 1100 460" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="nx-fio-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F5C328" stop-opacity="0"/><stop offset=".5" stop-color="#F5C328" stop-opacity=".7"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></linearGradient></defs>
    <path d="M250 120 C390 130 430 190 550 230"/><path d="M270 360 C400 350 440 280 550 230"/>
    <path d="M850 110 C710 120 670 190 550 230"/><path d="M830 350 C700 345 660 280 550 230"/>
  </svg>
  <div class="nx-nucleo" aria-hidden="true">
    <span class="nx-halo"></span>
    <span class="nx-hud"></span><span class="nx-aro-luz"></span>
    <span class="nx-anel nx-a1"><i></i></span><span class="nx-anel nx-a2"><i></i></span><span class="nx-anel nx-a3"><i></i></span>
    <span class="nx-esfera">
      <span class="nx-mapa"><i></i><i></i></span>
      <span class="nx-sombra-esf"></span>
      <img src="${asset('img/logo-2h-glyph.png')}" alt="" width="39" height="36">
    </span>
  </div>
  ${cartaoLeads}${cartaoFat}${cartaoRoas}${cartaoCac}
  ${notificacao('nx-ch1', 'agora', 'Rastreamento validado')}
  ${notificacao('nx-ch2', '2 min', 'Margem de lucro <b>31%</b>')}
</div>`;
}

/** Faixa de destaques abaixo do núcleo (sem números inventados). */
export function heroDestaques() {
  const itens = [
    ['eye', 'Conta aberta', 'Você vê os números reais'],
    ['crosshair', 'Rastreamento validado', 'Cada venda com a origem certa'],
    ['path', 'Método 5A', 'Do diagnóstico à escala'],
  ];
  return `<ul class="nx-destaques">${itens.map(([i, t, s]) => `<li>${icon(i)}<span><b>${t}</b><small>${s}</small></span></li>`).join('')}</ul>`;
}
