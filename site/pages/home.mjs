// Home. Ordem e textos seguem a copy do site principal (ClickUp), com o
// que cada seção precisa para se sustentar sozinha.

import { u, esc, icon, asset } from '../lib/core.mjs';
import { pagina, diag, ctaFinal, faqLD, foto } from '../lib/layout.mjs';
import { mapaRota } from '../lib/visuais.mjs';
import { heroNucleo, heroDestaques } from '../lib/hero-nucleo.mjs';
import { cartaoPost } from '../lib/blog.mjs';
import { servicos } from '../content/servicos.mjs';
import { fases, programas } from '../content/metodo.mjs';
import { faqTodos } from '../content/faq.mjs';
import { empresa } from '../content/empresa.mjs';

const PECAS = [
  { nome: 'Oferta', d: 'O que é vendido, a quem e por que vale o preço.' },
  { nome: 'Público', d: 'Quem realmente compra, não quem só consome atenção.' },
  { nome: 'Comunicação', d: 'Mensagem e criativo alinhados à oferta.' },
  { nome: 'Aquisição', d: 'Canais e custo de cada lead que entra.' },
  { nome: 'Atendimento', d: 'Velocidade e continuidade da resposta.' },
  { nome: 'Comercial', d: 'Qualificação, follow-up e proposta.' },
  { nome: 'Rastreamento', d: 'De onde veio cada lead e cada venda.' },
  { nome: 'Dados', d: 'Leitura que vira decisão.' },
];

export const DNA = [
  { t: 'Estrutura antes de escala', d: 'Escalar uma operação que vaza só aumenta o vazamento. Primeiro a base, depois o volume.', i: 'stack' },
  { t: 'Clareza antes de investimento', d: 'Antes de colocar mais dinheiro, saber quanto custa cada etapa e quanto se pode pagar por cliente.', i: 'eye' },
  { t: 'Integração entre canais', d: 'Anúncio, Instagram, site, WhatsApp e CRM funcionando como um caminho só, não como ilhas.', i: 'plugs-connected' },
  { t: 'Marketing conectado com vendas', d: 'O mesmo número na mesa do marketing e do comercial. Sem disputa sobre a qualidade do lead.', i: 'handshake' },
  { t: 'Crescimento previsível', d: 'Saber o que acontece quando se investe mais. Crescer por decisão, não por sorte.', i: 'chart-line-up' },
];

/** DNA: cartões que empilham na rolagem e acendem quando chegam ao topo. */
export function dnaCards() {
  return `<ol class="dna-cards" data-dna>${DNA.map((x, i) => `<li style="--n:${i}"><article class="dna-card">
    <span class="dna-luz" aria-hidden="true"></span>
    <div class="dna-cab"><span class="dna-ic">${icon(x.i)}</span><span class="dna-num">0${i + 1}<small>/0${DNA.length}</small></span></div>
    <h3>${esc(x.t)}</h3>
    <p>${esc(x.d)}</p>
    <span class="dna-barra" aria-hidden="true"><i></i></span>
  </article></li>`).join('')}</ol>`;
}

export const COMPARA = {
  antes: ['Relatório bonito no fim do mês', 'Métrica isolada: CPL, cliques e alcance', 'Rastreamento que ninguém conferiu', 'Trocar o criativo como resposta para tudo', 'O problema aparece quando o caixa sente'],
  depois: ['Você acompanha os números reais da sua operação', 'Leitura do funil até a venda e a margem', 'Rastreamento validado antes de qualquer análise', 'Prioridade definida pelo gargalo, não pelo palpite', 'Decisão tomada com você, olhando o mesmo dado'],
};

export function circuloTrafego() {
  // Medalhão: aro metálico com marcas, frase girando no aro e um cometa dourado dando a volta.
  const marcas = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * Math.PI * 2, r0 = i % 5 ? 84 : 81, r2 = 87;
    return `<line x1="${(100 + r0 * Math.cos(a)).toFixed(1)}" y1="${(100 + r0 * Math.sin(a)).toFixed(1)}" x2="${(100 + r2 * Math.cos(a)).toFixed(1)}" y2="${(100 + r2 * Math.sin(a)).toFixed(1)}"${i % 5 ? '' : ' class="cm-maior"'}/>`;
  }).join('');
  return `<svg viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <linearGradient id="cm-aro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A6A74"/><stop offset=".3" stop-color="#2A2A31"/><stop offset=".55" stop-color="#121216"/><stop offset=".8" stop-color="#3C3C45"/><stop offset="1" stop-color="#1A1A1F"/></linearGradient>
      <radialGradient id="cm-face" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="#26252B"/><stop offset=".7" stop-color="#121215"/><stop offset="1" stop-color="#09090B"/></radialGradient>
      <linearGradient id="cm-vidro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <radialGradient id="cm-halo"><stop offset="0" stop-color="#FFE27A" stop-opacity=".9"/><stop offset=".35" stop-color="#F5C328" stop-opacity=".45"/><stop offset="1" stop-color="#F5C328" stop-opacity="0"/></radialGradient>
      <radialGradient id="cm-esfera" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#FFF0B0"/><stop offset=".7" stop-color="#F5C328"/><stop offset="1" stop-color="#B07C06"/></radialGradient>
      <path id="cm-trilho" d="M100 100 m-71 0 a71 71 0 1 1 142 0 a71 71 0 1 1 -142 0"/>
    </defs>
    <circle cx="100" cy="100" r="99" fill="url(#cm-aro)"/>
    <circle cx="100" cy="100" r="98.2" class="cm-aro-luz"/>
    <circle cx="100" cy="100" r="91" fill="url(#cm-face)"/>
    <circle cx="100" cy="100" r="91" class="cm-face-borda"/>
    <g class="cm-marcas">${marcas}</g>
    <g class="cm-texto"><text><textPath href="#cm-trilho" startOffset="0" textLength="440" lengthAdjust="spacing">ESTRUTURA ANTES DE ESCALA · CLAREZA ANTES DE INVESTIMENTO ·</textPath></text></g>
    <g class="cm-cometa">
      ${Array.from({ length: 32 }, (_, k) => { const f = k / 31; return `<circle cx="100" cy="100" r="91" pathLength="100" class="cm-rastro" style="stroke-dasharray:1.25 100;stroke-dashoffset:${(-(98.9 - k * 0.95)).toFixed(2)};stroke-width:${(5 - f * 4.4).toFixed(2)};opacity:${(1 - f).toFixed(3)}"/>`; }).join('')}
      <circle cx="191" cy="100" r="13" fill="url(#cm-halo)" class="cm-halo"/>
      <circle cx="191" cy="100" r="5.6" fill="url(#cm-esfera)" class="cm-esfera"/>
      <ellipse cx="189.6" cy="98.2" rx="2" ry="1.3" class="cm-brilho"/>
      <circle cx="191" cy="100" r="7.5" class="cm-anel"/>
    </g>
    <path d="M100 100 m-90 0 a90 90 0 0 1 180 0 Z" fill="url(#cm-vidro)" class="cm-vidro"/>
  </svg>`;
}

export function escadaHTML(origem = 'home') {
  return `<div class="escada" data-revela-filhos>${servicos
    .map(
      (s, i) => `<article class="degrau" style="--alt:${i}">
    <p class="dg-nivel"><span>${esc(s.degrau)}</span>${icon(s.icone)}</p>
    <h3>${esc(s.nome)}</h3>
    <p>${esc(s.frase)}</p>
    <a class="dg-link" href="${u(`solucoes/${s.slug}/`)}">Conhecer ${icon('arrow-right')}<span class="sr"> ${esc(s.nome)}</span></a>
  </article>`
    )
    .join('')}</div>
  <div class="escada-base"><span>Primeiro a estrutura</span><span>Depois a escala</span></div>`;
}

export function bentoMetodo({ comFases = true } = {}) {
  return `<div class="bento">
    ${comFases ? `<div class="bt bt-fases" data-revela>
      <div class="fases5">${fases
        .map((f) => `<div class="f5"><span class="f5-a">${icon(f.icone)}</span><h3>${esc(f.nome)}</h3><p>${esc(f.frase)}</p></div>`)
        .join('')}</div>
    </div>` : ''}
    ${programas
      .map(
        (p) => `<article class="bt bt-prog" data-revela>
      <p class="fmt">${esc(p.formato)}</p>
      <h3>${esc(p.nome)}</h3>
      <p>${esc(p.frase)}</p>
      <ul>${p.pontos.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
      <a class="dg-link" href="${p.link}">${esc(p.cta)} ${icon('arrow-right')}</a>
    </article>`
      )
      .join('')}
  </div>`;
}

export function paraQuemHTML() {
  return `<div class="pq" data-revela-filhos>
    <div class="pq-col pq-sim">
      <p class="pq-tit">${icon('check-circle')} É para você</p>
      <p>Donos e sócios de empresas já estabelecidas, com faturamento consolidado, que já investiram em marketing antes e querem parar de operar no achismo.</p>
      <ul>
        <li>${icon('check')}Já investe em marketing e não sabe exatamente o que volta para o caixa.</li>
        <li>${icon('check')}Tem equipe, produto e operação, mas falta integração entre marketing e vendas.</li>
        <li>${icon('check')}Quer crescer com controle, não com tentativa.</li>
      </ul>
    </div>
    <div class="pq-col pq-nao">
      <p class="pq-tit">${icon('x-circle')} Não é para você</p>
      <ul>
        <li>${icon('x')}Procura fórmula pronta ou campanha mágica.</li>
        <li>${icon('x')}Quer promessa de faturamento rápido sem olhar a própria operação.</li>
        <li>${icon('x')}Quer só alguém para apertar botão no gerenciador de anúncios.</li>
      </ul>
    </div>
  </div>`;
}

export function passosHTML() {
  return `<div class="passos" data-revela-filhos>
    <div class="passo"><span class="passo-ic">${icon('list-checks')}</span><h3>Responda o diagnóstico rápido</h3><p>Algumas perguntas sobre o cenário da sua empresa.</p><small>Menos de 1 minuto</small></div>
    <div class="passo"><span class="passo-ic">${icon('whatsapp-logo')}</span><h3>A 2!H te chama no WhatsApp</h3><p>Para entender o momento da sua empresa e marcar a conversa de diagnóstico.</p><small>Conversa com gente, não com robô</small></div>
    <div class="passo"><span class="passo-ic">${icon('map-trifold')}</span><h3>Leitura do cenário e proposta</h3><p>Você recebe o degrau certo da escada para o seu momento, com o investimento.</p><small>Sem pacote empurrado</small></div>
  </div>`;
}

function provaHTML() {
  if (!empresa.cases.length) return '';
  return `<section class="sec" id="resultados">
  <div class="wrap">
    <div class="sec-cab" data-revela><h2 class="h2">Resultados de quem estruturou antes de escalar.</h2></div>
    <div class="cases" data-revela-filhos>${empresa.cases
      .map(
        (c) => `<article class="case"><p class="case-seg">${esc(c.segmento)}</p><h3>${esc(c.cliente)}</h3>${c.resultado ? `<p class="case-res">${esc(c.resultado)}</p>` : ''}${c.depoimento ? `<blockquote>${esc(c.depoimento)}<cite>${esc(c.autorDepoimento || '')}${c.cargo ? `, ${esc(c.cargo)}` : ''}</cite></blockquote>` : ''}</article>`
      )
      .join('')}</div>
  </div>
</section>`;
}

export function home({ posts }) {
  const faqHome = faqTodos.filter((f) => /agência de tráfego|Por onde eu começo|divulgam os preços|conta aberta/.test(f.q));
  const recentes = posts.slice(0, 3);
  const palavras = ['Oferta', 'Público', 'Comunicação', 'Aquisição', 'Atendimento', 'Comercial', 'Rastreamento', 'Dados', 'Crescimento previsível'];
  const letreiro = palavras.map((p) => `<span>${esc(p)}</span>`).join('');
  const corpo = `
<section class="hero hero-nx">
  <div class="hero-topo" aria-hidden="true"></div>
  <svg class="nx-raios" viewBox="0 0 1600 420" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="nx-raio-e" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F5C328" stop-opacity="0"/><stop offset="1" stop-color="#F5C328" stop-opacity=".55"/></linearGradient>
    <linearGradient id="nx-raio-d" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#F5C328" stop-opacity="0"/><stop offset="1" stop-color="#F5C328" stop-opacity=".55"/></linearGradient></defs>
    <g stroke="url(#nx-raio-e)"><path d="M0 40 C300 70 520 140 700 210"/><path d="M0 150 C300 160 520 190 700 215"/><path d="M0 300 C300 280 520 240 700 220"/><path d="M0 410 C320 360 520 270 700 225"/></g>
    <g stroke="url(#nx-raio-d)"><path d="M1600 40 C1300 70 1080 140 900 210"/><path d="M1600 150 C1300 160 1080 190 900 215"/><path d="M1600 300 C1300 280 1080 240 900 220"/><path d="M1600 410 C1280 360 1080 270 900 225"/></g>
  </svg>
  <div class="nx-piso" aria-hidden="true"></div>
  <div class="wrap">
    <div class="nx-texto">
      <p class="hero-selo"><b>Não somos agência de tráfego</b> Estruturamos a máquina de vendas</p>
      <h1 class="hero-h1"><span class="l1">Um mapa para não quebrar.</span> <span class="l2">Estrutura, planejamento e ação.</span></h1>
      <p class="hero-sub">A 2!H conecta marketing, dados e vendas numa só estrutura, para o investimento virar faturamento previsível e lucro, não só relatório bonito.</p>
      <div class="hero-acoes">
        <a class="btn btn-ouro btn-lg" href="${diag('home-hero')}" data-diag><span class="lbl-l">Quero estruturar meu crescimento</span><span class="lbl-c">Estruturar meu crescimento</span> ${icon('arrow-up-right')}</a>
        <a class="btn-link" href="#escada">Ver a escada de serviços</a>
      </div>
    </div>
    ${heroNucleo()}
    ${heroDestaques()}
    <div class="hero-mapa">
      <div class="mapa-cab"><b>O mapa da máquina de vendas</b><span>Cada peça depende da anterior. O gargalo pode estar em qualquer uma.</span></div>
      ${mapaRota(PECAS, { nome: 'Crescimento previsível', d: 'O destino.' })}
    </div>
  </div>
</section>

<div class="letreiro" aria-hidden="true"><div class="letreiro-trilho">${letreiro}${letreiro}</div></div>

<section class="sec bloco-ouro" id="o-que-fazemos">
  <div class="wrap manif">
    <div>
      <p class="etq">O que fazemos</p>
      <h2 class="h2" data-revela>Não somos agência de tráfego.</h2>
      <p class="manif-txt" style="margin-top:28px" data-acende>A 2!H não vende só anúncio. Organizamos a máquina de vendas digital da sua empresa: oferta, público, comunicação, aquisição, atendimento, comercial, rastreamento e dados, <span class="ouro">tudo conectado.</span></p>
    </div>
    <div class="manif-lado">
      ${foto('time-reuniao', 'Time de marketing e comercial reunido em volta de uma mesa', { sizes: '(max-width: 900px) 100vw, 40vw' })}
      <div class="manif-selo" data-revela>${circuloTrafego()}<p><b>Tráfego sem estrutura</b> é dinheiro rodando em círculo.</p></div>
    </div>
  </div>
</section>

<section class="sec luz luz-d" id="escada">
  <div class="wrap">
    <div class="sec-cab" data-revela>
      <p class="etq">A escada de serviços</p>
      <h2 class="h2">Você entra no degrau certo e <span class="tinta-ouro">não no mais caro.</span></h2>
      <p class="lead">Cada degrau resolve um momento da empresa. Você começa onde está hoje e sobe quando a base aguenta.</p>
    </div>
    ${escadaHTML()}
  </div>
</section>

<section class="sec luz luz-e" id="dna">
  <div class="wrap dna">
    <div class="dna-fixo">
      <h2 class="h2">O DNA que guia cada decisão.</h2>
      <p class="lead">Cinco princípios que aparecem em todo projeto da 2!H, do primeiro diagnóstico à leitura de número de cada semana.</p>
      <div class="socios" data-revela-filhos>
        ${foto('socio-jhonathan', 'Jhonathan Marcos, CEO do Grupo 2!H', { cls: 'socio-foto', revela: false, sizes: '(max-width: 900px) 50vw, 20vw', legenda: `<figcaption class="socio-leg">${icon('seal-check')}<span><b>Jhonathan Marcos</b><small>Sócio · CEO</small></span></figcaption>` })}
        ${foto('socio-douglas', 'Douglas Kashima, sócio e CTO/COO do Grupo 2!H', { cls: 'socio-foto', revela: false, sizes: '(max-width: 900px) 50vw, 20vw', legenda: `<figcaption class="socio-leg">${icon('seal-check')}<span><b>Douglas Kashima</b><small>Sócio · CTO/COO</small></span></figcaption>` })}
      </div>
    </div>
    ${dnaCards()}
  </div>
</section>

<section class="sec" id="transparencia">
  <div class="wrap">
    <div class="split" style="margin-bottom:clamp(48px,6vw,80px)">
      <div data-revela>
        <p class="etq">Transparência</p>
        <h2 class="h2">Conta aberta. Número real, não relatório maquiado.</h2>
        <p class="lead">A maioria das empresas que chega até nós já se queimou com agência antes. Não só por falta de resultado, por falta de transparência. Por isso trabalhamos com conta aberta: você acompanha os números reais, com rastreamento validado.</p>
      </div>
      ${foto('notebook-abajur', 'Notebook aberto sobre a mesa à noite, iluminado por um abajur', { legenda: `<figcaption class="foto-leg">${icon('eye')} Você vê o mesmo número que a gente vê.</figcaption>` })}
    </div>
    <div class="comp" data-revela>
      <div class="comp-col"><p class="comp-tit">${icon('x-circle')} O que costuma acontecer</p><ul>${COMPARA.antes.map((x) => `<li>${icon('x')}${esc(x)}</li>`).join('')}</ul></div>
      <div class="comp-col"><p class="comp-tit">${icon('seal-check')} Conta aberta na 2!H</p><ul>${COMPARA.depois.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul></div>
    </div>
  </div>
</section>

<section class="sec luz luz-d" id="metodo-5a">
  <div class="wrap">
    <div class="split" style="margin-bottom:clamp(40px,5vw,64px)">
      <div data-revela>
        <p class="etq">Método 5A</p>
        <h2 class="h2 h2-larga">Prefere construir com a gente? Aprenda o Método 5A.</h2>
        <p class="lead">O mesmo método que a 2!H usa nos projetos, em três formatos: para enxergar, para construir em grupo ou para aplicar 1x1 na sua empresa.</p>
      </div>
      ${foto('workshop', 'Encontro de empresários aprendendo o método em uma sala de reunião')}
    </div>
    ${bentoMetodo()}
  </div>
</section>

<section class="sec creme" id="para-quem">
  <div class="wrap pq-cab">
    <p class="etq">Para quem é</p>
    <h2 class="h2" data-revela>Feito para quem já fatura e quer parar de crescer no achismo.</h2>
    <p class="lead" data-revela>Donos e sócios que já investiram em marketing, têm equipe e operação, e querem crescer com controle.</p>
  </div>
  <div class="wrap">${paraQuemHTML()}</div>
</section>

${provaHTML()}

<section class="sec luz luz-e" id="como-comeca">
  <div class="wrap">
    <div class="sec-cab blog-topo" data-revela>
      <div><p class="etq">Como começa</p><h2 class="h2">Do primeiro clique à proposta certa.</h2></div>
      <a class="btn btn-linha" href="${u('como-funciona/')}">Ver como funciona em detalhe ${icon('arrow-right')}</a>
    </div>
    <div class="passos-foto">
      ${foto('celular-whatsapp', 'Mão segurando o celular com uma conversa de WhatsApp aberta', { legenda: `<figcaption class="foto-leg">${icon('whatsapp-logo')} A 2!H te chama no WhatsApp.</figcaption>` })}
      ${passosHTML()}
    </div>
  </div>
</section>

${recentes.length ? `<section class="sec" id="blog">
  <div class="wrap">
    <div class="sec-cab blog-topo" data-revela>
      <div><p class="etq">Blog</p><h2 class="h2">Conteúdo para decidir melhor.</h2></div>
      <a class="btn btn-linha" href="${u('blog/')}">Ver todos os artigos ${icon('arrow-right')}</a>
    </div>
    <div class="posts" data-revela-filhos>${recentes.map((p) => cartaoPost(p)).join('')}</div>
  </div>
</section>` : ''}

<section class="sec creme" id="perguntas">
  <div class="wrap">
    <div class="sec-cab blog-topo" data-revela>
      <h2 class="h2">Perguntas que todo empresário faz.</h2>
      <a class="btn btn-linha" href="${u('perguntas-frequentes/')}">Todas as perguntas ${icon('arrow-right')}</a>
    </div>
    <div class="faq-grade faq-loop" data-revela><div class="faq-trilho">${faqHome.map((f) => `<div class="faq-item"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('')}${faqHome.map((f) => `<div class="faq-item faq-dup" aria-hidden="true"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('')}</div></div>
    <div class="faq-mais"><a class="btn btn-ouro" href="${u('perguntas-frequentes/')}">Ver todas as perguntas ${icon('arrow-right')}</a></div>
  </div>
</section>

${ctaFinal({ origem: 'home-final', foto: 'aperto-de-mao' })}`;

  return pagina({
    path: '',
    tituloCompleto: 'Grupo 2!H | Estrutura, planejamento e ação para crescer com previsibilidade',
    titulo: 'Grupo 2!H',
    ogTitulo: 'Um mapa para não quebrar: estrutura, planejamento e ação.',
    descricao: 'A 2!H organiza a máquina de vendas digital da sua empresa: oferta, público, comunicação, aquisição, atendimento, comercial, rastreamento e dados, tudo conectado.',
    classe: 'pg-home',
    corpo,
    ld: [faqLD(faqHome)],
  });
}
