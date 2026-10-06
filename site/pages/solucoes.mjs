// Soluções: a visão geral da escada e uma página por serviço.

import { u, abs, esc, icon } from '../lib/core.mjs';
import { pagina, diag, ctaFinal, faqLD, trilha, capa, ORG_ID, foto } from '../lib/layout.mjs';

const FOTO = { edb: ['notebook-abajur', 'Notebook aberto sobre a mesa à noite'], 'growth-control': ['painel-anuncios', 'Painel de métricas de anúncios na tela'], 'growth-marketing': ['reuniao-maos', 'Time de marketing e comercial reunido em volta da mesa'], 'growth-intelligence': ['dashboard-escuro', 'Dashboard com gráficos de desempenho na tela'], lancamentos: ['palco-evento', 'Microfone num palco iluminado, pronto para o evento'] };
import { escadaHTML } from './home.mjs';
import { servicos } from '../content/servicos.mjs';
import { programas } from '../content/metodo.mjs';
import { ilMedidor3d } from '../lib/ilustracoes3d.mjs';
import { ilCamadas3d, ilConvergencia3d, ilDecisao3d, ilLancamento3d } from '../lib/ilustracoes-solucoes.mjs';
import { ilCamadas, ilConvergencia, ilDecisao, ilLancamento, ilEscada } from '../lib/ilustracoes.mjs';

const VISUAL = { edb: (s) => ilCamadas3d(s.fases), 'growth-control': ilMedidor3d, 'growth-marketing': ilConvergencia3d, 'growth-intelligence': ilDecisao3d, lancamentos: ilLancamento3d };

const ATUALIZADO = '2026-10-05';

const acordeao = (itens) =>
  itens.map((f) => `<details class="acord"><summary>${esc(f.q)}${icon('plus')}</summary><div class="acord-r"><p>${esc(f.a)}</p></div></details>`).join('');

function visaoGeral() {
  const t = trilha([{ nome: 'Soluções', path: 'solucoes/' }]);
  const linhas = [
    { s: 'edb', quando: 'Ainda não há base organizada para anunciar', entrega: 'Site, rastreamento, funil e presença digital prontos', formato: 'Projeto fechado de 8 semanas' },
    { s: 'growth-control', quando: 'A base existe e falta clareza de número na mídia', entrega: 'Tráfego gerido com leitura do funil até a venda', formato: 'Gestão contínua' },
    { s: 'growth-marketing', quando: 'O lead chega, mas a venda se perde no caminho', entrega: 'Marketing, atendimento e comercial num processo só', formato: 'Acompanhamento contínuo' },
    { s: 'growth-intelligence', quando: 'Os dados estão espalhados e a decisão é no escuro', entrega: 'Dashboards e leitura para decidir onde investir', formato: 'Projeto e acompanhamento' },
    { s: 'lancamentos', quando: 'Há um produto ou evento para lançar', entrega: 'Estrutura completa do lançamento, do zero ao pitch', formato: 'Projeto pontual' },
  ];
  const por = Object.fromEntries(servicos.map((s) => [s.slug, s]));
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Uma escada,', tituloOuro: 'não um pacote.', lead: 'A 2!H organiza a máquina de vendas digital em degraus. Cada degrau resolve um momento da empresa, e você entra no que faz sentido para onde está hoje.', visual: ilEscada(servicos), fotoFundo: 'reuniao-maos' })}

<section class="sec">
  <div class="wrap">${escadaHTML('solucoes')}</div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela><h2 class="h2">Qual degrau faz sentido agora?</h2><p class="lead">Um resumo para comparar. A conversa de diagnóstico confirma o degrau com você.</p></div>
    <div class="compara compara-5" style="--cols:5" data-revela-filhos>${linhas.map((l) => `<article class="cmp-card"><div class="cmp-topo">${icon(por[l.s].icone)}<div><h3>${esc(por[l.s].nome)}</h3><small>${esc(l.formato)}</small></div></div><dl><div class="cmp-linha"><dt>Quando faz sentido</dt><dd>${esc(l.quando)}</dd></div><div class="cmp-linha"><dt>Você passa a ter</dt><dd>${esc(l.entrega)}</dd></div></dl><a class="btn btn-linha btn-sm" href="${u(`solucoes/${l.s}/`)}">Conhecer ${icon('arrow-right')}</a></article>`).join('')}</div>
    <p class="lead" style="margin-top:22px;font-size:.98rem">O investimento de cada serviço é apresentado depois da conversa de diagnóstico, junto com a proposta feita para o seu caso.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela><p class="etq">Programas</p><h2 class="h2 h2-larga">Quer construir o sistema com o seu time?</h2><p class="lead">Os programas do Método 5A ensinam e acompanham a construção dentro da sua empresa.</p></div>
    <div class="bento">${programas
      .map((p) => `<article class="bt bt-prog" data-revela><p class="fmt">${esc(p.formato)}</p><h3>${esc(p.nome)}</h3><p>${esc(p.frase)}</p><a class="dg-link" href="${p.link}">${esc(p.cta)} ${icon('arrow-right')}</a></article>`)
      .join('')}</div>
  </div>
</section>

${ctaFinal({ origem: 'solucoes' })}`;
  const desc = 'Os serviços da 2!H em escada: EDB (Estruturação Digital de Base), Growth Control, Growth Marketing, Growth Intelligence e Lançamentos e coprodução.';
  return {
    path: 'solucoes/', prioridade: 0.9, titulo: 'Soluções', descricao: desc,
    html: pagina({
      path: 'solucoes/', titulo: 'Soluções: a escada de serviços', descricao: desc, corpo, dataModificada: ATUALIZADO, navAtual: 'solucoes/',
      ld: [t.ld, { '@type': 'OfferCatalog', name: 'Serviços do Grupo 2!H', itemListElement: servicos.map((s, i) => ({ '@type': 'Offer', position: i + 1, itemOffered: { '@type': 'Service', name: s.nome, description: s.frase, url: abs(`solucoes/${s.slug}/`) } })) }],
    }),
  };
}

function paginaServico(s, i) {
  const path = `solucoes/${s.slug}/`;
  const t = trilha([{ nome: 'Soluções', path: 'solucoes/' }, { nome: s.nome, path }]);
  const proximo = servicos[i + 1];
  const anterior = servicos[i - 1];

  const blocoInclui = s.perguntas
    ? `<section class="sec"><div class="wrap">
        <div class="sec-cab" data-revela><h2 class="h2 h2-larga">As perguntas que toda empresa precisa responder antes de escalar.</h2></div>
        <div class="seis" data-revela-filhos>${s.perguntas.map((p) => `<div><b>${esc(p.t)}</b><p>${esc(p.d)}</p></div>`).join('')}</div>
      </div></section>`
    : `<section class="sec"><div class="wrap">
        <div class="sec-cab" data-revela><h2 class="h2">O que entra no ${esc(s.nome)}.</h2></div>
        <div class="inclui" data-revela-filhos>${s.inclui.map((x) => `<div class="inc"><h3>${icon('check-circle')}${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join('')}</div>
      </div></section>`;

  const blocoFases = s.fases
    ? `<section class="sec"><div class="wrap">
        <div class="sec-cab" data-revela><h2 class="h2">4 fases, 8 semanas.</h2><p class="lead">Um projeto fechado, do posicionamento até a entrega pronta para a gestão de tráfego.</p></div>
        <div class="linha-tempo" data-revela-filhos>${s.fases.map((f) => `<div class="lt-item"><p class="lt-quando">${esc(f.quando)}</p><div><h3>${esc(f.nome)}</h3><ul>${f.itens.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`).join('')}</div>
      </div></section>`
    : '';

  const corpo = `
${capa({
  trilhaHtml: t.html,
  titulo: s.nome + '.',
  tituloOuro: s.nomeLongo + '.',
  lead: esc(s.resumo),
  extra: `<div class="capa-acoes"><a class="btn btn-ouro" href="${diag(`servico-${s.slug}`)}" data-diag>Quero saber se é o meu caso ${icon('arrow-right')}</a>${s.lp ? `<a class="btn-link" href="${s.lp}">Ver a página completa do ${esc(s.nome)}</a>` : ''}</div>
  <div class="capa-fatos">${s.formato.map((f) => `<span class="fato">${icon('info')}<span>${esc(f.k)}: <b>${esc(f.v)}</b></span></span>`).join('')}</div>`,
  visual: VISUAL[s.slug](s),
  fotoFundo: FOTO[s.slug][0],
})}

<section class="sec">
  <div class="wrap dois">
    <div><div data-revela><h2 class="h2">Para quem é.</h2><p class="lead">${esc(s.frase)}</p></div><div style="margin-top:36px">${foto(FOTO[s.slug][0], FOTO[s.slug][1])}</div></div>
    <div data-revela>
      <ul class="lista-check">${s.paraQuem.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
      <p class="aviso">${icon('warning-circle')}<span><b>Não é para</b> ${esc(s.naoE.replace(/^Para /, ''))}</span></p>
    </div>
  </div>
</section>

${blocoInclui}
${blocoFases}

<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela><h2 class="h2">Onde ele fica na escada.</h2><p class="lead">${esc(s.degrau)}: ${anterior ? `vem depois do ${esc(anterior.nome)}` : 'é o primeiro degrau'}${proximo ? ` e prepara para o ${esc(proximo.nome)}` : ''}.</p></div>
    <nav class="mini-escada" aria-label="Escada de serviços" data-revela>${servicos.map((x) => `<a class="me${x.slug === s.slug ? ' atual' : ''}" href="${u(`solucoes/${x.slug}/`)}"${x.slug === s.slug ? ' aria-current="page"' : ''}><small>${esc(x.degrau)}</small>${esc(x.nome)}</a>`).join('')}</nav>
  </div>
</section>

<section class="sec">
  <div class="wrap dois">
    <div data-revela><h2 class="h2">Perguntas sobre o ${esc(s.nome)}.</h2></div>
    <div data-revela>${acordeao(s.faq)}</div>
  </div>
</section>

${ctaFinal({ origem: `servico-${s.slug}` })}`;

  const desc = `${s.nome} (${s.nomeLongo}) da 2!H: ${s.frase}`.slice(0, 300);
  return {
    path, prioridade: 0.85, titulo: `${s.nome}: ${s.nomeLongo}`, descricao: desc,
    html: pagina({
      path, titulo: `${s.nome}: ${s.nomeLongo}`, descricao: desc, corpo, dataModificada: ATUALIZADO, navAtual: 'solucoes/',
      ld: [t.ld, faqLD(s.faq), { '@type': 'Service', '@id': abs(path) + '#servico', name: s.nome, alternateName: s.nomeLongo, description: s.resumo, serviceType: s.nomeLongo, provider: { '@id': ORG_ID }, areaServed: { '@type': 'Country', name: 'Brasil' }, url: abs(path), audience: { '@type': 'BusinessAudience', audienceType: 'Empresas estabelecidas com faturamento consolidado' } }],
    }),
  };
}

export function paginasServicos() {
  return [visaoGeral(), ...servicos.map(paginaServico)];
}
