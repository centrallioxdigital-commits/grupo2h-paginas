// Páginas institucionais: Sobre, Como funciona, Método 5A, Contato,
// Perguntas frequentes, Glossário, Privacidade (e o atalho /comofunciona).

import { u, abs, esc, icon, slugify, cfg, asset } from '../lib/core.mjs';
import { pagina, diag, ctaFinal, faqLD, trilha, capa, ORG_ID } from '../lib/layout.mjs';
import { DNA, dnaCards, paraQuemHTML, passosHTML, bentoMetodo } from './home.mjs';
import { servicos } from '../content/servicos.mjs';
import { fases, programas, esteira } from '../content/metodo.mjs';
import { faqGrupos, faqTodos } from '../content/faq.mjs';
import { glossario } from '../content/glossario.mjs';
import { ilConversa, ilFormula } from '../lib/ilustracoes.mjs';
import { ilOrbita3d, ilBussola3d, ilFunil3d, ilMarca3d } from '../lib/ilustracoes3d.mjs';
import { empresa, whatsappLink } from '../content/empresa.mjs';

const acordeao = (itens) =>
  itens.map((f) => `<details class="acord"><summary>${esc(f.q)}${icon('plus')}</summary><div class="acord-r"><p>${esc(f.a)}</p></div></details>`).join('');

const ATUALIZADO = '2026-10-05';

function esteiraSecao(titulo, lead) {
  return `<section class="sec">
  <div class="wrap esteira-grade" data-esteira>
    <div class="esteira-fixo">
      <h2 class="h2 h2-larga" data-revela>${esc(titulo)}</h2>
      <p class="lead" data-revela>${esc(lead)}</p>
      <div class="esteira-cont"><b data-esteira-num>01</b><span>de 10 etapas<strong data-esteira-nome>${esc(esteira[0].nome)}</strong></span></div>
      <div class="esteira-barra" aria-hidden="true"><i></i></div>
    </div>
    <ol class="esteira">${esteira.map((e) => `<li><div><b>${esc(e.nome)}</b><span>${esc(e.d)}</span></div></li>`).join('')}</ol>
  </div>
</section>`;
}


// ------------------------------------------------------------------ Sobre
function sobre() {
  const t = trilha([{ nome: 'Sobre', path: 'sobre/' }]);
  const time = empresa.time.filter((m) => m.nome && m.papel);
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Estrutura antes de escala.', tituloOuro: 'Clareza antes de investimento.', lead: 'A 2!H organiza a máquina de vendas digital de empresas que já faturam, já investem e já têm operação, mas ainda não têm clareza, integração e controle para transformar marketing em crescimento previsível.', visual: ilMarca3d(), fotoFundo: 'escritorio-noite' })}

<section class="sec">
  <div class="wrap dois">
    <div>
      <h2 class="h2" data-revela>A maioria das empresas que já faturam ainda cresce no escuro.</h2>
      <div class="prosa" style="margin-top:28px" data-revela>
      <p>Elas investem. Têm equipe. Têm produto. Têm operação. Mas continuam sem previsibilidade, sem clareza do retorno e sem integração real entre marketing e vendas.</p>
      <p>O gargalo raramente é só tráfego. Quando marketing, vendas, CRM e dados não conversam, a empresa trabalha muito e ainda assim sente que está sempre abaixo do potencial. O maior desperdício não é o anúncio ruim: é a operação sem estrutura.</p>
      <p>A 2!H existe para organizar essa máquina. Não para subir mais uma campanha, mas para fazer oferta, público, comunicação, aquisição, atendimento, comercial, rastreamento e dados funcionarem como um sistema só.</p>
      </div>
    </div>
    ${ilFunil3d()}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela><h2 class="h2">O que nos diferencia.</h2></div>
    <div class="pilares" data-revela-filhos>
      <div class="pilar">${icon('map-trifold')}<h3>Não somos agência de tráfego.</h3><p>Tráfego é uma peça. O trabalho é a máquina inteira: do que você vende até o dinheiro que volta para o caixa. Tráfego sem estrutura é dinheiro rodando em círculo.</p></div>
      <div class="pilar">${icon('eye')}<h3>Conta aberta</h3><p>Você acompanha os números reais da sua operação, com rastreamento validado. Nada de relatório maquiado.</p></div>
      <div class="pilar">${icon('path')}<h3>Método próprio</h3><p>O Método 5A organiza o crescimento em cinco fases: Análise, Alinhamento, Aquisição, Acompanhamento e Aceleração.</p></div>
      <div class="pilar">${icon('stairs')}<h3>Uma escada, não um pacote</h3><p>Cada empresa entra no degrau certo para o seu momento, da fundação (EDB) à inteligência de dados.</p></div>
      <div class="pilar">${icon('handshake')}<h3>Marketing e vendas na mesma mesa</h3><p>O mesmo número para os dois lados. Sem disputa sobre a qualidade do lead.</p></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap dna">
    <div class="dna-fixo"><p class="etq">DNA</p><h2 class="h2">Cinco princípios em todo projeto.</h2></div>
    ${dnaCards()}
  </div>
</section>

${time.length ? `<section class="sec luz luz-d" id="time"><div class="wrap"><div class="sec-cab" data-revela><p class="etq">Quem está por trás</p><h2 class="h2">O time que organiza a sua máquina.</h2></div><div class="time" data-revela-filhos>${time
    .map((m) => {
      const iniciais = m.nome.split(' ').filter(Boolean).map((x) => x[0]).slice(0, 2).join('').toUpperCase();
      return `<article class="membro"><figure>${m.foto ? `<img src="${asset(`img/${m.foto}`)}" alt="${esc(m.nome)}, ${esc(m.papel)} do Grupo 2!H" width="512" height="512" loading="lazy">` : `<span class="monograma" aria-hidden="true">${esc(iniciais)}</span>`}<figcaption class="membro-barra"><h3>${esc(m.nome)}</h3><p>${esc(m.papel)}</p></figcaption></figure>${m.frase ? `<blockquote class="membro-frase">${esc(m.frase)}</blockquote>` : ''}</article>`;
    })
    .join('')}</div></div></section>` : ''}

<section class="sec">
  <div class="wrap"><p class="citacao" data-revela>Sem promessa vazia. Sem improviso. Com estrutura, planejamento e ação.</p></div>
</section>

<section class="sec">
  <div class="wrap"><div class="sec-cab" data-revela><h2 class="h2">Para quem é a 2!H.</h2></div>${paraQuemHTML()}</div>
</section>

${ctaFinal({ origem: 'sobre' })}`;
  return {
    path: 'sobre/', prioridade: 0.8, titulo: 'Sobre a 2!H',
    descricao: 'Quem é a 2!H: não somos agência de tráfego. Organizamos a máquina de vendas digital de empresas estabelecidas, com conta aberta e Método 5A.',
    html: pagina({ path: 'sobre/', titulo: 'Sobre a 2!H', descricao: 'Quem é a 2!H: não somos agência de tráfego. Organizamos a máquina de vendas digital de empresas estabelecidas, com conta aberta e Método 5A.', corpo, ld: [t.ld, { '@type': 'AboutPage', '@id': abs('sobre/') + '#sobre', about: { '@id': ORG_ID } }], tipoPagina: 'AboutPage', dataModificada: ATUALIZADO }),
  };
}

// --------------------------------------------------------- Como funciona
const OPCOES = [
  { id: 'base', icone: 'stack', t: 'Ainda não anuncio ou não tenho base organizada', s: 'Site, rastreamento e atendimento ainda não estão de pé.', srv: 'edb' },
  { id: 'retorno', icone: 'gauge', t: 'Já anuncio, mas não sei o que volta para o caixa', s: 'Tenho base, mas falta clareza de número.', srv: 'growth-control' },
  { id: 'comercial', icone: 'handshake', t: 'Gero lead, mas perco venda no caminho', s: 'O problema está no atendimento e no comercial.', srv: 'growth-marketing' },
  { id: 'dados', icone: 'chart-line-up', t: 'Tenho dados espalhados e decido no escuro', s: 'Preciso de uma visão única para decidir.', srv: 'growth-intelligence' },
  { id: 'lancar', icone: 'rocket-launch', t: 'Quero lançar um produto ou evento', s: 'Um projeto com começo, meio e fim.', srv: 'lancamentos' },
  { id: 'aprender', icone: 'book-open-text', t: 'Quero aprender e construir o sistema eu mesmo', s: 'Com método e acompanhamento.', srv: null },
];

function comoFunciona() {
  const t = trilha([{ nome: 'Como funciona', path: 'como-funciona/' }]);
  const faqC = faqGrupos.find((g) => g.grupo === 'Como começar').itens;
  const jornada = [
    { i: 'list-checks', t: 'Diagnóstico rápido', d: 'Algumas perguntas sobre o cenário da sua empresa: faturamento, canais, time e principal desafio. Leva menos de 1 minuto.', tag: 'Você, pelo site' },
    { i: 'whatsapp-logo', t: 'Conversa no WhatsApp', d: 'A 2!H te chama para entender o momento da empresa e marcar a conversa de diagnóstico. Gente falando com gente.', tag: 'A 2!H te chama' },
    { i: 'magnifying-glass', t: 'Leitura do cenário', d: 'Olhamos a operação inteira: oferta, público, comunicação, aquisição, atendimento, comercial, rastreamento e dados. O objetivo é achar o gargalo, não vender um pacote.', tag: 'Diagnóstico' },
    { i: 'stairs', t: 'Proposta com o degrau certo', d: 'Você recebe a proposta do serviço que faz sentido para o seu momento, com escopo e investimento. Se a resposta for "ainda não é hora de anunciar", você vai ouvir isso.', tag: 'Proposta' },
    { i: 'stack', t: 'Estrutura primeiro', d: 'Se a base não está pronta, ela vem antes de qualquer campanha: site, rastreamento, funil e presença digital. É o trabalho do EDB.', tag: 'Fundação' },
    { i: 'gauge', t: 'Aquisição com controle', d: 'Com a base pronta, o tráfego roda com rastreamento validado e leitura do funil inteiro, não só do CPL.', tag: 'Escala' },
    { i: 'chart-line-up', t: 'Leitura e ajuste contínuo', d: 'Números lidos com você, em conta aberta. Decidimos juntos o que escalar, o que corrigir e o que parar.', tag: 'Rotina' },
  ];
  const nomeSrv = Object.fromEntries(servicos.map((s) => [s.slug, s]));
  const ORDEM = ['edb', 'growth-control', 'growth-marketing', 'growth-intelligence', 'lancamentos'];
  const degraus = (ativo) => `<div class="sel-degraus" aria-hidden="true">${ORDEM.map((slug) => `<span${slug === ativo ? ' class="on"' : ''}>${esc(nomeSrv[slug].nome)}</span>`).join('')}</div>`;
  const premio = `<span class="sel-premio">${icon('trophy')} Resultado desbloqueado</span>`;
  const templates = OPCOES.map((o) => {
    if (!o.srv)
      return `<template id="sel-${o.id}">${premio}<b>Comece pelo Método 5A.</b>Aprenda a enxergar o sistema na Imersão, construa em grupo na Mentoria 5A ou aplique 1x1 no Diagnóstico Estratégico 5A.<br><br><a class="btn btn-ouro btn-sm" href="${u('metodo-5a/')}">Conhecer o Método 5A ${icon('arrow-right')}</a></template>`;
    const s = nomeSrv[o.srv];
    return `<template id="sel-${o.id}">${premio}<b>O seu degrau provável: ${esc(s.nome)}.</b>${esc(s.frase)} A conversa de diagnóstico confirma isso com você.${degraus(o.srv)}<a class="btn btn-ouro btn-sm" href="${u(`solucoes/${s.slug}/`)}">Conhecer o ${esc(s.nome)} ${icon('arrow-right')}</a></template>`;
  }).join('');

  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Como a 2!H trabalha:', tituloOuro: 'do diagnóstico à escala.', lead: 'Nada começa pelo anúncio. Começa por entender onde a sua empresa está, onde o dinheiro trava e qual é o próximo degrau.', extra: `<div class="capa-acoes"><a class="btn btn-ouro" href="${diag('como-funciona-topo')}" data-diag>Fazer o diagnóstico rápido ${icon('arrow-right')}</a><a class="btn-link" href="#por-onde-comecar">Descobrir por onde começar</a></div>`, visual: ilBussola3d(), fotoFundo: 'estrategia-quadro' })}

<section class="sec">
  <div class="wrap dois">
    <div class="dna-fixo" data-revela>
      <h2 class="h2">A jornada, passo a passo.</h2>
      <p class="lead">Sete etapas, do primeiro clique à rotina de leitura de números. Algumas empresas pulam etapas porque já têm a base. Ninguém pula a leitura do cenário.</p>
    </div>
    <ol class="jornada" data-jornada><span class="jornada-luz" aria-hidden="true"></span>${jornada.map((j) => `<li class="jr"><span class="jr-ic">${icon(j.i)}</span><div><h3>${esc(j.t)}</h3><p>${esc(j.d)}</p><span class="jr-tag">${esc(j.tag)}</span></div></li>`).join('')}</ol>
  </div>
</section>

<section class="sec" id="por-onde-comecar">
  <div class="wrap">
    <div class="seletor" data-seletor data-revela>
      <div class="sel-cab"><div><p class="sel-jogo">${icon('game-controller')} Desafio de 10 segundos</p><h3>Por onde a sua empresa deveria começar?</h3><p>Escolha a frase que mais parece com o seu momento. Pode usar as teclas A a F.</p></div><div class="sel-hud"><span>1 pergunta</span><span class="sel-hud-barra"><i></i></span><span>resultado na hora</span></div></div>
      <div class="sel-opcoes">${OPCOES.map((o, i) => `<button type="button" class="sel-op" data-op="${o.id}" data-tecla="${'abcdef'[i]}" aria-pressed="false"><span class="sel-tecla" aria-hidden="true">${'ABCDEF'[i]}</span>${icon(o.icone)}<span><b>${esc(o.t)}</b><small>${esc(o.s)}</small></span><span class="sel-marca" aria-hidden="true">${icon('check')}</span></button>`).join('')}</div>
      <div class="sel-res"><div class="sel-res-in" data-sel-res aria-live="polite"><span class="sel-bloq">${icon('lock-simple')} Resultado bloqueado. Escolha uma opção acima para descobrir o seu degrau.</span></div></div>
      ${templates}
    </div>
  </div>
</section>

${esteiraSecao('O que olhamos na leitura do cenário.', 'Cada etapa depende da anterior. É por isso que trocar de anúncio quase nunca resolve: o gargalo pode estar em qualquer ponto desta esteira.')}

<section class="sec">
  <div class="wrap dois">
    <div data-revela><h2 class="h2">Antes de você perguntar.</h2><p class="lead">O que mais perguntam antes de começar.</p></div>
    <div data-revela>${acordeao(faqC)}</div>
  </div>
</section>

${ctaFinal({ origem: 'como-funciona' })}`;
  const desc = 'Como a 2!H trabalha: diagnóstico rápido, conversa no WhatsApp, leitura do cenário, proposta com o degrau certo, estrutura, aquisição com controle e leitura contínua.';
  return {
    path: 'como-funciona/', prioridade: 0.9, titulo: 'Como funciona',
    descricao: desc,
    html: pagina({
      path: 'como-funciona/', titulo: 'Como funciona', descricao: desc, corpo, dataModificada: ATUALIZADO,
      ld: [t.ld, faqLD(faqC), { '@type': 'HowTo', name: 'Como começar a estruturar o crescimento com a 2!H', description: desc, step: jornada.map((j, i) => ({ '@type': 'HowToStep', position: i + 1, name: j.t, text: j.d })) }],
    }),
  };
}

function atalhoComoFunciona() {
  const destino = u('como-funciona/');
  return {
    path: 'comofunciona/', semSitemap: true,
    html: `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Como funciona | Grupo 2!H</title><link rel="canonical" href="${abs('como-funciona/')}"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0; url=${destino}"><script>location.replace(${JSON.stringify(destino)} + location.search + location.hash)</script></head><body><a href="${destino}">Como funciona</a></body></html>\n`,
  };
}

// ----------------------------------------------------------- Método 5A
function metodo() {
  const t = trilha([{ nome: 'Método 5A', path: 'metodo-5a/' }]);
  const faqM = [
    { q: 'O que é o Método 5A?', a: 'É o método da 2!H para estruturar o crescimento de uma empresa em cinco fases: Análise, Alinhamento, Aquisição, Acompanhamento e Aceleração. Cada fase depende da anterior: só se acelera o que já foi analisado, alinhado e medido.' },
    { q: 'Qual a diferença entre a Imersão e a Mentoria 5A?', a: 'Na Imersão você aprende a enxergar o sistema e identificar onde a sua empresa perde dinheiro, em 4 horas ao vivo. Na Mentoria você constrói esse sistema dentro da sua empresa, em 12 semanas, em grupo, com entrega obrigatória toda semana.' },
    { q: 'Qual a diferença entre a Mentoria 5A e o Diagnóstico Estratégico 5A?', a: 'A Mentoria 5A é em grupo, com outros empresários, por 12 semanas. O Diagnóstico Estratégico 5A é individual: o mesmo método aplicado na sua empresa, 1x1, com atenção total ao seu caso.' },
    { q: 'Os programas incluem a 2!H executando por mim?', a: 'Não. Nos programas você constrói o sistema da sua empresa com direcionamento da 2!H. Para a 2!H executar, existem os serviços da escada, como o EDB e o Growth Control.' },
  ];
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Método 5A.', tituloOuro: 'Cinco fases para crescer sem quebrar.', lead: 'Análise, Alinhamento, Aquisição, Acompanhamento e Aceleração. O método que a 2!H usa para tirar o crescimento do achismo e colocar em sequência.', visual: ilOrbita3d(fases), fotoFundo: 'workshop' })}

<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela><h2 class="h2 h2-larga">Cada fase depende da anterior.</h2><p class="lead">Só se acelera o que já foi analisado, alinhado e medido. Pular fase é o caminho mais rápido para investir mais e lucrar menos.</p></div>
    <div class="linha-tempo" data-revela-filhos>${fases
      .map((f) => `<div class="lt-item"><p class="lt-quando">${esc(f.nome)}</p><div><h3>${esc(f.frase)}</h3><ul>${f.entregas.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div></div>`)
      .join('')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela><h2 class="h2">Três jeitos de aplicar o método.</h2><p class="lead">Para enxergar o sistema, para construir em grupo ou para aplicar 1x1 na sua empresa.</p></div>
    ${bentoMetodo({ comFases: false })}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela><h2 class="h2">Lado a lado.</h2></div>
    <div class="compara" data-revela-filhos>${[
      { n: 'Imersão Estrutura 5A', f: 'Online e ao vivo · 4 horas', q: 'Quem quer descobrir onde a empresa perde vendas antes de investir mais em tráfego', s: 'A leitura das 10 etapas, do negócio à margem, e o verdadeiro gargalo da operação', l: '/imersao5a/', ic: 'presentation-chart' },
      { n: 'Mentoria 5A', f: 'Em grupo · 12 semanas', q: 'Quem viu o método e quer sair da teoria para a implementação', s: '12 entregáveis, do Raio-X econômico ao plano de crescimento de 90 dias', l: '/mentoria5a/', ic: 'users-three', d: true },
      { n: 'Diagnóstico Estratégico 5A', f: 'Individual · 1x1', q: 'Empresário ou sócio que quer o método aplicado com atenção individual', s: 'Raio-X econômico, mapa de gargalos, oferta alinhada, rastreamento e plano de prioridades', l: '/diagnostico5a/', ic: 'target' },
    ].map((c) => `<article class="cmp-card${c.d ? ' cmp-dest' : ''}"><div class="cmp-topo">${icon(c.ic)}<div><h3>${esc(c.n)}</h3><small>${esc(c.f)}</small></div></div><dl><div class="cmp-linha"><dt>Para quem</dt><dd>${esc(c.q)}</dd></div><div class="cmp-linha"><dt>Você sai com</dt><dd>${esc(c.s)}</dd></div></dl><a class="btn btn-linha btn-sm" href="${c.l}">Conhecer ${icon('arrow-right')}</a></article>`).join('')}</div>
  </div>
</section>

${esteiraSecao('A esteira que a Imersão ensina a enxergar.', 'O caminho completo da primeira etapa até o dinheiro entrar de verdade.')}

<section class="sec">
  <div class="wrap dois">
    <div data-revela><h2 class="h2">Perguntas sobre o Método 5A.</h2></div>
    <div data-revela>${acordeao(faqM)}</div>
  </div>
</section>

${ctaFinal({ origem: 'metodo-5a' })}`;
  const desc = 'O Método 5A da 2!H: Análise, Alinhamento, Aquisição, Acompanhamento e Aceleração. Aprenda na Imersão, construa na Mentoria 5A ou aplique 1x1 no Diagnóstico Estratégico.';
  return {
    path: 'metodo-5a/', prioridade: 0.9, titulo: 'Método 5A', descricao: desc,
    html: pagina({
      path: 'metodo-5a/', titulo: 'Método 5A: cinco fases para crescer sem quebrar', descricao: desc, corpo, dataModificada: ATUALIZADO,
      ld: [t.ld, faqLD(faqM), { '@type': 'ItemList', name: 'Programas do Método 5A', itemListElement: programas.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Course', name: p.nome, description: p.frase, url: abs(p.link.replace(/^\//, '')), provider: { '@id': ORG_ID }, inLanguage: 'pt-BR' } })) }],
    }),
  };
}

// --------------------------------------------------------------- Contato
function contato() {
  const t = trilha([{ nome: 'Contato', path: 'contato/' }]);
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Fale com a 2!H.', lead: 'O caminho mais rápido é o diagnóstico rápido: em menos de 1 minuto você conta o cenário da sua empresa e a 2!H te chama no WhatsApp já sabendo do seu caso.', visual: ilConversa(), fotoFundo: 'celular-whatsapp' })}

<section class="sec">
  <div class="wrap">
    <div class="canais" data-revela-filhos>
      <article class="canal canal-pri">${icon('list-checks', { cls: 'ic ic-g' })}<h2>Diagnóstico rápido</h2><p>Algumas perguntas sobre faturamento, canais e principal desafio. A 2!H te chama no WhatsApp para entender o seu caso.</p><a class="btn btn-ouro" href="${diag('contato')}" data-diag>Fazer o diagnóstico ${icon('arrow-right')}</a></article>
      <article class="canal">${icon('whatsapp-logo', { cls: 'ic ic-g' })}<h2>WhatsApp</h2><p>Prefere mandar mensagem direto? Fale com o time comercial.</p><a class="dg-link" href="${whatsappLink()}" target="_blank" rel="noopener">${esc(empresa.whatsappExibicao)} ${icon('arrow-up-right')}</a></article>
      <article class="canal">${icon('envelope-simple', { cls: 'ic ic-g' })}<h2>E-mail</h2><p>Para parcerias, imprensa e assuntos que não são comerciais.</p><a class="dg-link" href="mailto:${esc(empresa.email)}">${esc(empresa.email)} ${icon('arrow-up-right')}</a></article>
    </div>
    ${empresa.endereco ? `<p class="lead" style="margin-top:32px">${icon('map-pin')} ${esc([empresa.endereco.rua, empresa.endereco.cidade, empresa.endereco.uf].filter(Boolean).join(', '))}</p>` : ''}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela><h2 class="h2">O que acontece depois.</h2></div>
    ${passosHTML()}
  </div>
</section>`;
  const desc = 'Fale com a 2!H: faça o diagnóstico rápido em menos de 1 minuto, chame no WhatsApp ou mande um e-mail para contato@grupo2h.com.br.';
  return {
    path: 'contato/', prioridade: 0.7, titulo: 'Contato', descricao: desc,
    html: pagina({ path: 'contato/', titulo: 'Contato', descricao: desc, corpo, tipoPagina: 'ContactPage', ld: [t.ld], dataModificada: ATUALIZADO }),
  };
}

// ------------------------------------------------ Perguntas frequentes
function perguntas() {
  const t = trilha([{ nome: 'Perguntas frequentes', path: 'perguntas-frequentes/' }]);
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Perguntas frequentes.', lead: 'Respostas diretas sobre a 2!H, os serviços, o Método 5A e como começar.', fotoFundo: 'mesa-estudo' })}
${faqGrupos
  .map(
    (g) => `<section class="sec" id="${slugify(g.grupo)}"><div class="wrap dois"><div data-revela><h2 class="h2">${esc(g.grupo)}</h2></div><div data-revela>${acordeao(g.itens)}</div></div></section>`
  )
  .join('')}
${ctaFinal({ origem: 'perguntas', titulo: 'Ficou alguma dúvida?', texto: 'Responda o diagnóstico rápido e a 2!H te chama no WhatsApp para conversar sobre o seu caso.' })}`;
  const desc = 'Perguntas frequentes sobre a 2!H: o que fazemos, para quem é, preços, conta aberta, EDB, Growth Control, Método 5A e como começar.';
  return {
    path: 'perguntas-frequentes/', prioridade: 0.7, titulo: 'Perguntas frequentes', descricao: desc,
    html: pagina({ path: 'perguntas-frequentes/', titulo: 'Perguntas frequentes', descricao: desc, corpo, ld: [t.ld, faqLD(faqTodos)], dataModificada: ATUALIZADO }),
  };
}

// --------------------------------------------------------------- Glossário
function glossarioPagina() {
  const t = trilha([{ nome: 'Glossário de growth', path: 'glossario/' }]);
  const letras = [...new Set(glossario.map((g) => g.termo[0].toUpperCase()))];
  const porLetra = (l) => glossario.filter((g) => g.termo[0].toUpperCase() === l);
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Glossário de growth.', lead: 'CAC, CPA, ROAS, CRM, rastreamento: os termos que aparecem em toda conversa sobre crescimento, explicados de forma direta e com a fórmula quando existe.', visual: ilFormula(), fotoFundo: 'dashboard-escuro' })}
<section class="sec">
  <div class="wrap">
    <nav class="glos-nav" aria-label="Letras">${letras.map((l) => `<a href="#letra-${l.toLowerCase()}">${l}</a>`).join('')}</nav>
    ${letras
      .map(
        (l) => `<div id="letra-${l.toLowerCase()}"><dl class="glos">${porLetra(l)
          .map((g) => `<div class="glos-item" id="${slugify(g.termo)}"><dt>${esc(g.termo)}${g.sigla ? `<small>${esc(g.sigla)}</small>` : ''}</dt><dd>${esc(g.def)}${g.formula ? `<code class="formula">${esc(g.formula)}</code>` : ''}</dd></div>`)
          .join('')}</dl></div>`
      )
      .join('')}
  </div>
</section>
${ctaFinal({ origem: 'glossario', titulo: 'Quer ver esses números na sua empresa?', texto: 'Responda o diagnóstico rápido. A 2!H te chama no WhatsApp para entender onde o dinheiro trava na sua operação.' })}`;
  const desc = 'Glossário de growth da 2!H: CAC, CPA, CPL, ROAS, ROI, LTV, CRM, pixel, API de conversões, funil, gargalo e mais, com definições diretas e fórmulas.';
  return {
    path: 'glossario/', prioridade: 0.7, titulo: 'Glossário de growth', descricao: desc,
    html: pagina({
      path: 'glossario/', titulo: 'Glossário de growth: CAC, CPA, ROAS e mais', descricao: desc, corpo, dataModificada: ATUALIZADO,
      ld: [t.ld, { '@type': 'DefinedTermSet', '@id': abs('glossario/') + '#termos', name: 'Glossário de growth do Grupo 2!H', hasDefinedTerm: glossario.map((g) => ({ '@type': 'DefinedTerm', name: g.termo, ...(g.sigla ? { alternateName: g.sigla } : {}), description: g.def + (g.formula ? ` Fórmula: ${g.formula}.` : ''), url: abs('glossario/') + '#' + slugify(g.termo), inDefinedTermSet: abs('glossario/') + '#termos' })) }],
    }),
  };
}

// -------------------------------------------------------------- Privacidade
function privacidade() {
  const t = trilha([{ nome: 'Política de privacidade', path: 'privacidade/' }]);
  const controlador = [empresa.razaoSocial || 'Grupo 2!H', empresa.cnpj && `CNPJ ${empresa.cnpj}`].filter(Boolean).join(', ');
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Política de privacidade.', lead: 'Como a 2!H coleta, usa e protege os seus dados pessoais, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).' })}
<section class="sec">
  <div class="wrap" style="max-width:calc(820px + var(--gut)*2)">
    <div class="prosa">
      <p><em>Atualizada em 5 de outubro de 2026.</em></p>
      <h2>Quem é o responsável pelos seus dados</h2>
      <p>O controlador dos dados pessoais tratados neste site e nas páginas do domínio grupo2h.com.br é ${esc(controlador)}. Para qualquer assunto sobre os seus dados, fale com a gente pelo e-mail <a href="mailto:${esc(empresa.email)}">${esc(empresa.email)}</a>.</p>
      <h2>Quais dados coletamos</h2>
      <ul>
        <li><strong>Dados que você informa:</strong> nome, WhatsApp, e-mail e as respostas do diagnóstico rápido e dos formulários das nossas páginas (por exemplo, faturamento aproximado, canais que usa e principal desafio).</li>
        <li><strong>Dados de navegação:</strong> páginas visitadas, origem da visita (como parâmetros UTM), tipo de dispositivo e navegador, coletados por cookies e ferramentas de análise e de publicidade.</li>
        <li><strong>Conversas:</strong> mensagens trocadas com a 2!H pelo WhatsApp e por e-mail.</li>
      </ul>
      <h2>Para que usamos</h2>
      <ul>
        <li>Responder o seu contato e entender o cenário da sua empresa para indicar o serviço adequado (procedimentos preliminares a um contrato).</li>
        <li>Prestar os serviços contratados e cumprir obrigações legais e fiscais.</li>
        <li>Medir o desempenho do site e das nossas campanhas e mostrar anúncios relevantes (legítimo interesse e, quando exigido, consentimento).</li>
        <li>Enviar conteúdos e convites sobre os nossos programas, quando você autorizar. Você pode pedir para parar a qualquer momento.</li>
      </ul>
      <h2>Com quem compartilhamos</h2>
      <p>Não vendemos os seus dados. Eles podem ser processados por fornecedores que nos ajudam a operar, como ferramentas de CRM e automação, hospedagem, análise de tráfego e plataformas de anúncio (por exemplo, Google e Meta), sempre na medida necessária para cada finalidade. Também podemos compartilhar dados quando a lei ou uma autoridade exigir.</p>
      <h2>Cookies</h2>
      <p>Usamos cookies próprios e de terceiros para o site funcionar, para entender como ele é usado e para medir campanhas. Você pode bloquear ou apagar cookies nas configurações do seu navegador; algumas partes do site podem funcionar de forma limitada.</p>
      <h2>Por quanto tempo guardamos</h2>
      <p>Pelo tempo necessário para as finalidades acima, para o cumprimento de obrigações legais e para o exercício de direitos em processos. Depois disso, os dados são apagados ou anonimizados.</p>
      <h2>Os seus direitos</h2>
      <p>Pela LGPD, você pode pedir a confirmação de que tratamos os seus dados, o acesso a eles, a correção, a anonimização, o bloqueio ou a eliminação, a portabilidade, informações sobre compartilhamento e a revogação do consentimento. Basta escrever para <a href="mailto:${esc(empresa.email)}">${esc(empresa.email)}</a>.</p>
      <h2>Segurança</h2>
      <p>Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados e situações de perda, alteração ou vazamento.</p>
      <h2>Mudanças nesta política</h2>
      <p>Podemos atualizar esta política. A data da última atualização fica sempre no topo desta página.</p>
    </div>
  </div>
</section>`;
  const desc = 'Política de privacidade do Grupo 2!H: quais dados coletamos, para que usamos, com quem compartilhamos e como exercer os seus direitos pela LGPD.';
  return {
    path: 'privacidade/', prioridade: 0.3, titulo: 'Política de privacidade', descricao: desc,
    html: pagina({ path: 'privacidade/', titulo: 'Política de privacidade', descricao: desc, corpo, ld: [t.ld], dataModificada: ATUALIZADO }),
  };
}

export function paginasInstitucionais() {
  return [sobre(), comoFunciona(), atalhoComoFunciona(), metodo(), contato(), perguntas(), glossarioPagina(), privacidade()];
}
