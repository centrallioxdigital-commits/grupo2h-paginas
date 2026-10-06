// Home. Ordem e textos seguem a copy do site principal (ClickUp), com o
// que cada seção precisa para se sustentar sozinha.

import { u, esc, icon, asset } from '../lib/core.mjs';
import { pagina, diag, ctaFinal, faqLD, foto } from '../lib/layout.mjs';
import { mapaRota } from '../lib/visuais.mjs';
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

export const COMPARA = {
  antes: ['Relatório bonito no fim do mês', 'Métrica isolada: CPL, cliques e alcance', 'Rastreamento que ninguém conferiu', 'Trocar o criativo como resposta para tudo', 'O problema aparece quando o caixa sente'],
  depois: ['Você acompanha os números reais da sua operação', 'Leitura do funil até a venda e a margem', 'Rastreamento validado antes de qualquer análise', 'Prioridade definida pelo gargalo, não pelo palpite', 'Decisão tomada com você, olhando o mesmo dado'],
};

export function circuloTrafego() {
  // Seta girando num círculo: "dinheiro rodando em círculo".
  return `<svg viewBox="0 0 200 200" aria-hidden="true"><circle class="circ-anel" cx="100" cy="100" r="90"/><g class="circ-giro-g"><circle class="circ-giro" cx="100" cy="100" r="90" pathLength="100"/><path class="circ-seta" d="M-6 -6 L6 0 L-6 6 Z" transform="translate(138.3 181.4) rotate(154.8)"/></g></svg>`;
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
<section class="hero">
  <div class="hero-topo" aria-hidden="true"></div>
  <div class="wrap">
    <div class="hero-grade">
      <div class="hero-texto">
        <p class="hero-selo"><b>Não somos agência de tráfego</b> Estruturamos a máquina de vendas</p>
        <h1 class="hero-h1"><span class="l1">Um mapa para não quebrar.</span> <span class="l2">Estrutura, planejamento e ação.</span></h1>
        <p class="hero-sub">A 2!H organiza a estrutura que faz o marketing da sua empresa parar de ser tentativa e começar a virar crescimento previsível.</p>
        <div class="hero-acoes">
          <a class="btn btn-ouro btn-lg" href="${diag('home-hero')}" data-diag><span class="lbl-l">Quero estruturar meu crescimento</span><span class="lbl-c">Estruturar meu crescimento</span> ${icon('arrow-up-right')}</a>
          <a class="btn-link" href="#escada">Ver a escada de serviços</a>
        </div>
      </div>
      <div class="hero-quadro">
        ${foto('hero-dono-noite', 'Empresário trabalhando até tarde no escritório', { revela: false, prioridade: true, sizes: '(max-width: 900px) 100vw, 46vw' })}
        <span class="chip-flutua c1">${icon('seal-check')} Rastreamento validado</span>
        <span class="chip-flutua c2">${icon('eye')} Conta aberta</span>
        <span class="chip-flutua c3">${icon('chart-line-up')} Crescimento previsível</span>
      </div>
    </div>
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
      <div class="manif-selo" data-revela>${circuloTrafego()}<p>Tráfego sem estrutura é dinheiro rodando em círculo.</p></div>
    </div>
  </div>
</section>

<section class="sec luz luz-d" id="escada">
  <div class="wrap">
    <div class="sec-cab" data-revela>
      <p class="etq">A escada de serviços</p>
      <h2 class="h2">Você entra no degrau certo: <span class="tinta-ouro">não no mais caro.</span></h2>
      <p class="lead">Cada degrau resolve um momento da empresa. Você começa onde está hoje e sobe quando a base aguenta.</p>
    </div>
    ${escadaHTML()}
  </div>
</section>

<section class="sec" id="numeros">
  <div class="wrap">
    <div class="numeros" data-revela-filhos>
      <div class="num"><b data-conta="5">5</b><span>fases no Método 5A</span><small>Análise, Alinhamento, Aquisição, Acompanhamento e Aceleração.</small></div>
      <div class="num"><b data-conta="8">8</b><span>semanas de EDB</span><small>Da estratégia à base testada de ponta a ponta.</small></div>
      <div class="num"><b data-conta="12">12</b><span>entregáveis na Mentoria</span><small>Do Raio-X econômico ao plano de 90 dias.</small></div>
      <div class="num"><b data-conta="10">10</b><span>etapas analisadas</span><small>Do negócio até a margem, onde tudo se prova.</small></div>
    </div>
  </div>
</section>

<section class="sec luz luz-e" id="dna">
  <div class="wrap dna">
    <div class="dna-fixo">
      <h2 class="h2">O DNA que guia cada decisão.</h2>
      <p class="lead">Cinco princípios que aparecem em todo projeto da 2!H, do primeiro diagnóstico à leitura de número de cada semana.</p>
      ${foto('jhonathan-ceo', 'Jhonathan Marcos, CEO do Grupo 2!H', { cls: 'dna-foto', sizes: '(max-width: 900px) 100vw, 40vw', legenda: `<figcaption class="foto-leg">${icon('seal-check')} Jhonathan Marcos, CEO do Grupo 2!H</figcaption>` })}
    </div>
    <ul class="dna-lista" data-acende-item>${DNA.map((x) => `<li>${icon(x.i)}<h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></li>`).join('')}</ul>
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
    <div class="faq-colunas" data-acordeoes data-revela>${[faqHome.slice(0, Math.ceil(faqHome.length / 2)), faqHome.slice(Math.ceil(faqHome.length / 2))].map((col) => `<div>${col.map((f) => `<details class="acord"><summary>${esc(f.q)}${icon('plus')}</summary><div class="acord-r"><p>${esc(f.a)}</p></div></details>`).join('')}</div>`).join('')}</div>
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
    extraHead: `<link rel="preload" as="image" href="${asset('img/fotos/hero-dono-noite.webp')}" imagesrcset="${asset('img/fotos/hero-dono-noite-800.webp')} 800w, ${asset('img/fotos/hero-dono-noite.webp')} 1600w" imagesizes="(max-width: 900px) 100vw, 62vw">`,
  });
}
