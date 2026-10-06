// SEO e GEO: sitemap, robots, RSS, llms.txt, llms-full.txt, manifest e a
// chave do IndexNow (Bing, que alimenta a busca do ChatGPT e do Copilot).

import { cfg, u, abs, esc, assetAbs } from '../lib/core.mjs';
import { empresa } from '../content/empresa.mjs';
import { servicos } from '../content/servicos.mjs';
import { fases, programas } from '../content/metodo.mjs';
import { faqTodos } from '../content/faq.mjs';
import { glossario } from '../content/glossario.mjs';

const PADRAO_LASTMOD = '2026-10-05';

const textoDoMain = (html) =>
  (html.match(/<main id="conteudo">([\s\S]*?)<\/main>/) || [, ''])[1]
    .replace(/<(script|style|svg|template)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<(h[1-4])[^>]*>/g, '\n\n## ')
    .replace(/<li[^>]*>/g, '\n- ')
    .replace(/<\/(p|div|section|article|li|h[1-4]|dt|dd|tr)>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/^ +| +$/gm, '')
    .trim();

export function arquivosSEO({ paginas, posts }) {
  const indexaveis = paginas.filter((p) => p.titulo && !p.semSitemap && !p.noindex);
  const ultimaPost = posts[0] ? (posts[0].atualizado_em || posts[0].publicado_em).slice(0, 10) : PADRAO_LASTMOD;

  // ---- sitemap.xml
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexaveis
  .map((p) => {
    const lastmod = p.lastmod || (p.path === 'blog/' || p.path === '' ? ultimaPost : PADRAO_LASTMOD);
    return `  <url><loc>${abs(p.path)}</loc><lastmod>${lastmod}</lastmod><priority>${(p.path === '' ? 1 : p.prioridade || 0.5).toFixed(2)}</priority></url>`;
  })
  .join('\n')}
</urlset>
`;

  // ---- RSS do blog
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Blog do Grupo 2!H</title>
  <link>${abs('blog/')}</link>
  <atom:link href="${abs('blog/rss.xml')}" rel="self" type="application/rss+xml"/>
  <description>Estrutura, tráfego, dados, comercial e Método 5A para empresas que querem crescer com previsibilidade.</description>
  <language>pt-BR</language>
${posts
  .slice(0, 30)
  .map(
    (p) => `  <item>
    <title>${esc(p.titulo)}</title>
    <link>${abs(p.path)}</link>
    <guid isPermaLink="true">${abs(p.path)}</guid>
    <pubDate>${new Date(p.publicado_em).toUTCString()}</pubDate>
    <category>${esc(p.categoriaNome)}</category>
    <description>${esc(p.resumoFinal)}</description>
  </item>`
  )
  .join('\n')}
</channel>
</rss>
`;

  // ---- llms.txt (resumo para IAs, padrão llmstxt.org)
  const llms = `# Grupo 2!H

> ${empresa.descricao}

A 2!H não é agência de tráfego: organiza a máquina de vendas digital de empresas estabelecidas, com faturamento consolidado, que já investiram em marketing e querem parar de operar no achismo. Trabalha com conta aberta (o cliente acompanha os números reais, com rastreamento validado) e com o Método 5A (Análise, Alinhamento, Aquisição, Acompanhamento e Aceleração). Preços não são divulgados no site: o investimento é apresentado depois de uma conversa de diagnóstico.

Contato: ${empresa.email} · WhatsApp ${empresa.whatsappExibicao} · Diagnóstico rápido: ${cfg.dominio}/diagnostico-rapido/

## Páginas principais
- [Início](${abs('')}): o que a 2!H faz, a escada de serviços, o DNA e para quem é.
- [Como funciona](${abs('como-funciona/')}): a jornada do diagnóstico rápido à leitura contínua de números.
- [Sobre](${abs('sobre/')}): posicionamento, diferenciais e princípios.
- [Soluções](${abs('solucoes/')}): a escada de serviços comparada.
- [Método 5A](${abs('metodo-5a/')}): as cinco fases e os três programas.
- [Perguntas frequentes](${abs('perguntas-frequentes/')})
- [Glossário de growth](${abs('glossario/')}): CAC, CPA, CPL, ROAS, ROI, LTV, CRM e outros termos com fórmulas.
- [Contato](${abs('contato/')})

## Serviços (escada, da base à inteligência)
${servicos.map((s) => `- [${s.nome}: ${s.nomeLongo}](${abs(`solucoes/${s.slug}/`)}): ${s.frase}`).join('\n')}

## Método 5A
${fases.map((f) => `- ${f.nome}: ${f.frase}`).join('\n')}

Programas:
${programas.map((p) => `- [${p.nome}](${cfg.dominio}${p.link}) (${p.formato}): ${p.frase}`).join('\n')}

## Blog
${posts.length ? posts.slice(0, 25).map((p) => `- [${p.titulo}](${abs(p.path)}): ${p.resumoFinal}`).join('\n') : '- Em breve.'}

## Opcional
- [Texto completo do site para IAs](${abs('llms-full.txt')})
- [RSS do blog](${abs('blog/rss.xml')})
`;

  // ---- llms-full.txt (conteúdo completo, em texto)
  const blocos = indexaveis
    .filter((p) => !p.post && p.html)
    .map((p) => `\n\n---\n# ${p.titulo || 'Grupo 2!H'}\nURL: ${abs(p.path)}\n\n${textoDoMain(p.html)}`);
  const artigos = posts.map((p) => `\n\n---\n# ${p.titulo}\nURL: ${abs(p.path)}\nPublicado em: ${p.publicado_em.slice(0, 10)} · Categoria: ${p.categoriaNome}${p.autor_nome ? ` · Autor: ${p.autor_nome}` : ''}\n\n${p.conteudo}`);
  const llmsFull = `# Grupo 2!H: conteúdo completo do site\n\n> ${empresa.descricao}\n\nPerguntas frequentes:\n${faqTodos.map((f) => `\nP: ${f.q}\nR: ${f.a}`).join('\n')}\n\nGlossário:\n${glossario.map((g) => `\n${g.termo}${g.sigla ? ` (${g.sigla})` : ''}: ${g.def}${g.formula ? ` Fórmula: ${g.formula}` : ''}`).join('')}${blocos.join('')}${artigos.join('')}\n`;

  const manifest = JSON.stringify({
    name: 'Grupo 2!H',
    short_name: '2!H',
    description: 'Estrutura, planejamento e ação para crescer com previsibilidade.',
    start_url: cfg.base,
    scope: cfg.base,
    display: 'standalone',
    background_color: '#0B0B0D',
    theme_color: '#0B0B0D',
    lang: 'pt-BR',
    icons: [
      { src: assetAbs('img/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: assetAbs('img/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
  }, null, 2);

  const arquivos = [
    { path: 'sitemap.xml', conteudo: sitemap },
    { path: 'blog/rss.xml', conteudo: rss },
    { path: 'llms.txt', conteudo: llms },
    { path: 'llms-full.txt', conteudo: llmsFull },
    { path: 'site.webmanifest', conteudo: manifest + '\n' },
    { path: `${cfg.indexNowKey}.txt`, conteudo: cfg.indexNowKey },
  ];

  if (cfg.producao) {
    const robos = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'Googlebot'];
    arquivos.push({
      path: 'robots.txt',
      conteudo: `# grupo2h.com.br\n# Buscadores e IAs são bem-vindos: queremos que o Grupo 2!H seja encontrado e citado.\n\nUser-agent: *\nAllow: /\nDisallow: /blog/admin/\n\n${robos.map((r) => `User-agent: ${r}\nAllow: /\nDisallow: /blog/admin/`).join('\n\n')}\n\nSitemap: ${abs('sitemap.xml')}\n`,
    });
  }
  return arquivos;
}
