// Painel de publicação do blog: grupo2h.com.br/blog/admin/
// Login com o mesmo usuário do painel do time (Supabase Auth). Quem publica:
// administradores e quem tem a área "Conteúdo" (regra no banco, não na tela).

import { cfg, u, asset, icon } from '../lib/core.mjs';
import { pagina } from '../lib/layout.mjs';
import { CATEGORIAS } from '../lib/blog.mjs';

export function paginaAdmin() {
  const corpo = `
<div class="adm" data-adm>
  <section class="adm-login" data-tela="login" hidden>
    <form class="adm-cartao" data-form-login novalidate>
      <a class="marca" href="${u('')}"><img src="${asset('img/logo-2h-glyph.png')}" alt="" width="39" height="36"><span>GRUPO <b>2!H</b></span></a>
      <h1>Publicar no blog</h1>
      <p class="adm-sub">Entre com o mesmo e-mail e senha do painel do time.</p>
      <label class="campo"><span>E-mail</span><input type="email" name="email" autocomplete="username" required></label>
      <label class="campo"><span>Senha</span><input type="password" name="senha" autocomplete="current-password" required></label>
      <p class="adm-erro" data-erro-login role="alert" hidden></p>
      <button class="btn btn-ouro btn-bloco" type="submit">Entrar ${icon('sign-in')}</button>
      <button class="adm-link" type="button" data-esqueci>Esqueci a senha</button>
    </form>
  </section>

  <section class="adm-login" data-tela="nova-senha" hidden>
    <form class="adm-cartao" data-form-senha novalidate>
      <h1>Nova senha</h1>
      <p class="adm-sub">Escolha uma senha nova para entrar.</p>
      <label class="campo"><span>Nova senha</span><input type="password" name="senha" autocomplete="new-password" minlength="8" required></label>
      <p class="adm-erro" data-erro-senha role="alert" hidden></p>
      <button class="btn btn-ouro btn-bloco" type="submit">Salvar senha</button>
    </form>
  </section>

  <section class="adm-sem" data-tela="sem-permissao" hidden>
    <div class="adm-cartao">
      <h1>Sem permissão para publicar</h1>
      <p class="adm-sub">O seu usuário entrou, mas não tem a área <b>Conteúdo</b> liberada. Peça a um administrador para liberar no painel do time (Time &gt; permissões).</p>
      <button class="btn btn-linha btn-bloco" type="button" data-sair>Sair</button>
    </div>
  </section>

  <section class="adm-app" data-tela="app" hidden>
    <header class="adm-topo">
      <a class="marca" href="${u('')}"><img src="${asset('img/logo-2h-glyph.png')}" alt="" width="39" height="36"><span>GRUPO <b>2!H</b></span></a>
      <span class="adm-titulo">Blog · Publicação</span>
      <span class="adm-usuario" data-usuario></span>
      <a class="btn btn-linha btn-sm" href="${u('blog/')}" target="_blank" rel="noopener">Ver blog ${icon('arrow-up-right')}</a>
      <button class="btn btn-linha btn-sm" type="button" data-sair>Sair</button>
    </header>

    <div class="adm-grade">
      <aside class="adm-lista">
        <button class="btn btn-ouro btn-bloco" type="button" data-novo>${icon('plus')} Novo post</button>
        <label class="busca adm-busca"><span class="sr">Buscar post</span>${icon('magnifying-glass')}<input type="search" placeholder="Buscar post" data-busca-adm></label>
        <div class="adm-filtros" role="tablist">
          <button type="button" data-filtro="todos" aria-pressed="true">Todos</button>
          <button type="button" data-filtro="publicado" aria-pressed="false">Publicados</button>
          <button type="button" data-filtro="rascunho" aria-pressed="false">Rascunhos</button>
        </div>
        <ul class="adm-posts" data-posts><li class="adm-carregando">Carregando posts...</li></ul>
      </aside>

      <main class="adm-editor" data-editor>
        <div class="adm-vazio" data-editor-vazio>
          ${icon('notepad', { cls: 'ic adm-vazio-ic' })}
          <h2>Escolha um post ou crie um novo</h2>
          <p>Título, imagem de capa, resumo e texto. Ao publicar, o post entra no site com página própria, no Google e nas IAs.</p>
        </div>

        <form class="adm-form" data-form-post hidden novalidate>
          <div class="adm-form-main">
            <label class="campo"><span>Título <small data-cont="titulo">0/140</small></span><input name="titulo" maxlength="140" required placeholder="Ex.: CPL barato não significa operação lucrativa"></label>
            <label class="campo campo-slug"><span>Endereço do post</span><div class="slug"><em>grupo2h.com.br/blog/</em><input name="slug" maxlength="90" pattern="[a-z0-9]+(-[a-z0-9]+)*" required></div><small class="dica" data-dica-slug>Gerado a partir do título. Use letras minúsculas, números e hífen.</small></label>

            <div class="campo">
              <span>Imagem de capa <small>JPG, PNG ou WebP · reduzida automaticamente</small></span>
              <div class="capa-drop" data-capa-drop tabindex="0" role="button" aria-label="Escolher imagem de capa">
                <img data-capa-img alt="" hidden>
                <div class="capa-vazia" data-capa-vazia>${icon('image')}<b>Arraste a imagem aqui ou clique para escolher</b><small>Ideal: 1600 x 900 px (16:9)</small></div>
                <div class="capa-progresso" data-capa-prog hidden><i></i></div>
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" data-capa-arquivo hidden>
              <div class="capa-acoes" data-capa-acoes hidden><button type="button" class="adm-link" data-capa-trocar>Trocar imagem</button><button type="button" class="adm-link perigo" data-capa-remover>Remover</button></div>
              <label class="campo campo-sub"><span>Descrição da imagem <small>para o Google e para leitores de tela</small></span><input name="capa_alt" maxlength="160" placeholder="Ex.: Empresário analisando o funil de vendas no computador"></label>
            </div>

            <label class="campo"><span>Resumo <small data-cont="resumo">0/300</small></span><textarea name="resumo" rows="3" maxlength="300" placeholder="Uma ou duas frases. Aparece no Google, no WhatsApp e na lista do blog (ideal: 120 a 160 caracteres)."></textarea></label>

            <div class="campo">
              <span>Texto do post <small data-cont="palavras">0 palavras</small></span>
              <div class="editor-barra" role="toolbar" aria-label="Formatação">
                <button type="button" data-fmt="h2" title="Subtítulo">${icon('text-h-two')}</button>
                <button type="button" data-fmt="h3" title="Subtítulo menor">${icon('text-h-three')}</button>
                <button type="button" data-fmt="b" title="Negrito">${icon('text-b')}</button>
                <button type="button" data-fmt="i" title="Itálico">${icon('text-italic')}</button>
                <button type="button" data-fmt="ul" title="Lista">${icon('list-bullets')}</button>
                <button type="button" data-fmt="ol" title="Lista numerada">${icon('list-numbers')}</button>
                <button type="button" data-fmt="quote" title="Citação">${icon('quotes')}</button>
                <button type="button" data-fmt="link" title="Link">${icon('link-simple')}</button>
                <button type="button" data-fmt="img" title="Imagem no texto">${icon('image')}</button>
                <span class="barra-sep"></span>
                <div class="abas" role="tablist"><button type="button" data-aba="escrever" aria-selected="true">Escrever</button><button type="button" data-aba="ver" aria-selected="false">Pré-visualizar</button></div>
              </div>
              <textarea name="conteudo" rows="22" class="editor-texto" data-texto placeholder="Escreva o artigo aqui. Use a barra acima para subtítulos, negrito, listas, links e imagens.&#10;&#10;## Um subtítulo&#10;Texto do parágrafo..."></textarea>
              <div class="prosa editor-ver" data-ver hidden></div>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" data-img-arquivo hidden>
            </div>
          </div>

          <aside class="adm-form-lado">
            <div class="painel">
              <p class="painel-tit">Publicação</p>
              <p class="estado" data-estado>Novo post</p>
              <label class="campo"><span>Categoria</span><select name="categoria">${Object.entries(CATEGORIAS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
              <label class="campo"><span>Tags <small>separadas por vírgula</small></span><input name="tags" placeholder="cpl, cac, margem"></label>
              <label class="campo"><span>Data de publicação <small>vazio = agora</small></span><input type="datetime-local" name="publicado_em"></label>
              <div class="painel-acoes">
                <button class="btn btn-ouro btn-bloco" type="button" data-publicar>${icon('cloud-check')} <span data-publicar-txt>Publicar</span></button>
                <button class="btn btn-linha btn-bloco" type="button" data-rascunho>${icon('floppy-disk')} Salvar rascunho</button>
                <button class="adm-link perigo" type="button" data-despublicar hidden>Tirar do ar (voltar a rascunho)</button>
                <button class="adm-link perigo" type="button" data-excluir hidden>${icon('trash')} Excluir post</button>
              </div>
            </div>
            <div class="painel">
              <p class="painel-tit">Como vai aparecer no Google</p>
              <div class="serp"><span class="serp-url" data-serp-url>grupo2h.com.br › blog</span><b class="serp-tit" data-serp-tit>Título do post</b><span class="serp-desc" data-serp-desc>O resumo do post aparece aqui.</span></div>
              <ul class="checklist" data-checklist></ul>
            </div>
          </aside>
        </form>
      </main>
    </div>
    <div class="aviso-flutuante" data-toast role="status" aria-live="polite" hidden></div>
  </section>
</div>`;

  return {
    path: 'blog/admin/', noindex: true, semSitemap: true,
    html: pagina({
      path: 'blog/admin/',
      titulo: 'Publicar no blog',
      descricao: 'Painel de publicação do blog do Grupo 2!H.',
      corpo,
      noindex: true,
      semCabecalho: true,
      semGTM: true,
      semProtecao: true,
      classe: 'pg-admin',
      extraHead: `<link rel="stylesheet" href="${asset('css/admin.css')}">`,
      scripts: `<script>window.G2H_ADMIN=${JSON.stringify({ url: cfg.supabase.url, chave: cfg.supabase.chavePublica, base: cfg.base, dominio: cfg.dominio, categorias: CATEGORIAS })};</script>
<script src="https://cdn.jsdelivr.net/npm/marked@15.0.12/marked.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@3.2.6/dist/purify.min.js" defer></script>
<script type="module" src="${asset('js/admin.js')}"></script>`,
    }),
  };
}
