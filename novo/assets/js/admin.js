// Painel de publicação do blog do Grupo 2!H.
// Quem pode escrever é decidido pelo banco (RLS: private.tem_area('/conteudo')).
// A tela só confere antes para dar uma mensagem clara.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const C = window.G2H_ADMIN;
const db = createClient(C.url, C.chave, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'g2h-blog-admin' } });
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

const telas = $$('[data-tela]');
const mostrar = (nome) => telas.forEach((t) => (t.hidden = t.dataset.tela !== nome));

let eu = null;          // { id, nome }
let posts = [];         // lista do painel
let atual = null;       // post em edição (objeto do banco) ou null para novo
let filtro = 'todos';
let slugManual = false;
let capaUrl = null;
let sujo = false;

const slugify = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90).replace(/-+$/, '');
const esc = (s) => { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; };
const dataBR = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
const urlPost = (slug) => `${C.base}blog/${slug}/`;

function toast(msg, tipo = 'ok', ms = 4200) {
  const t = $('[data-toast]');
  t.innerHTML = msg; t.className = `aviso-flutuante ${tipo}`; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), ms);
}
const traduzErro = (e) => {
  const m = (e && (e.message || e.error_description || e.msg)) || String(e);
  if (/Invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(m)) return 'Este e-mail ainda não foi confirmado.';
  if (/duplicate key.*slug/i.test(m)) return 'Já existe um post com esse endereço. Mude o endereço do post.';
  if (/row-level security|permission denied/i.test(m)) return 'Seu usuário não tem permissão para esta ação (área Conteúdo).';
  if (/slug_check|blog_posts_slug_check/i.test(m)) return 'O endereço do post precisa ter de 3 a 90 caracteres: letras minúsculas, números e hífen.';
  if (/titulo_check/i.test(m)) return 'O título precisa ter entre 5 e 140 caracteres.';
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com o servidor. Confira a internet e tente de novo.';
  return m;
};

// ------------------------------------------------------------- sessão
async function iniciar() {
  const { data: { session } } = await db.auth.getSession();
  if (location.hash.includes('type=recovery')) { mostrar('nova-senha'); return; }
  if (!session) { mostrar('login'); return; }
  await entrar(session.user);
}

db.auth.onAuthStateChange((evento, session) => {
  if (evento === 'PASSWORD_RECOVERY') mostrar('nova-senha');
  if (evento === 'SIGNED_OUT') { eu = null; mostrar('login'); }
  if (evento === 'SIGNED_IN' && session && !eu && !location.hash.includes('type=recovery')) entrar(session.user);
});

async function entrar(user) {
  const { data: perfil } = await db.from('profiles').select('nome,papel,areas').eq('id', user.id).maybeSingle();
  const pode = perfil && (perfil.papel === 'administrador' || (perfil.areas || []).includes('/conteudo'));
  eu = { id: user.id, nome: (perfil && perfil.nome) || user.email };
  if (!pode) { mostrar('sem-permissao'); return; }
  $('[data-usuario]').textContent = eu.nome;
  mostrar('app');
  await carregarPosts();
}

$('[data-form-login]').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const f = ev.currentTarget, erro = $('[data-erro-login]');
  erro.hidden = true;
  const botao = f.querySelector('button[type=submit]'); botao.disabled = true;
  const { data, error } = await db.auth.signInWithPassword({ email: f.email.value.trim(), password: f.senha.value });
  botao.disabled = false;
  if (error) { erro.textContent = traduzErro(error); erro.hidden = false; return; }
  f.senha.value = '';
  await entrar(data.user);
});

$('[data-esqueci]').addEventListener('click', async () => {
  const f = $('[data-form-login]'), erro = $('[data-erro-login]');
  const email = f.email.value.trim();
  if (!email) { erro.textContent = 'Digite o seu e-mail acima e clique de novo em "Esqueci a senha".'; erro.hidden = false; return; }
  const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
  erro.textContent = error ? traduzErro(error) : 'Se o e-mail estiver cadastrado, você vai receber um link para criar uma senha nova.';
  erro.hidden = false;
});

$('[data-form-senha]').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const f = ev.currentTarget, erro = $('[data-erro-senha]');
  if (f.senha.value.length < 8) { erro.textContent = 'Use pelo menos 8 caracteres.'; erro.hidden = false; return; }
  const { data, error } = await db.auth.updateUser({ password: f.senha.value });
  if (error) { erro.textContent = traduzErro(error); erro.hidden = false; return; }
  history.replaceState(null, '', location.pathname);
  await entrar(data.user);
});

$$('[data-sair]').forEach((b) => b.addEventListener('click', async () => {
  if (sujo && !confirm('Há alterações não salvas. Sair mesmo assim?')) return;
  await db.auth.signOut(); sujo = false; mostrar('login');
}));

// ---------------------------------------------------------------- lista
async function carregarPosts() {
  const { data, error } = await db.from('blog_posts').select('id,slug,titulo,status,publicado_em,atualizado_em,categoria').order('atualizado_em', { ascending: false });
  if (error) { $('[data-posts]').innerHTML = `<li class="adm-carregando">${esc(traduzErro(error))}</li>`; return; }
  posts = data;
  desenharLista();
}

function desenharLista() {
  const q = ($('[data-busca-adm]').value || '').trim().toLowerCase();
  const lista = posts.filter((p) => (filtro === 'todos' || p.status === filtro) && (!q || p.titulo.toLowerCase().includes(q)));
  const ul = $('[data-posts]');
  if (!lista.length) { ul.innerHTML = `<li class="adm-carregando">${posts.length ? 'Nenhum post neste filtro.' : 'Nenhum post ainda. Clique em "Novo post".'}</li>`; return; }
  const agora = Date.now();
  ul.innerHTML = lista.map((p) => {
    const agendado = p.status === 'publicado' && p.publicado_em && new Date(p.publicado_em).getTime() > agora;
    const selo = p.status === 'rascunho' ? '<span class="selo rascunho">Rascunho</span>' : agendado ? '<span class="selo agendado">Agendado</span>' : '<span class="selo publicado">No ar</span>';
    return `<li><button type="button" data-abrir="${p.id}" class="${atual && atual.id === p.id ? 'ativo' : ''}"><b>${esc(p.titulo)}</b><span>${selo}${esc(dataBR(p.publicado_em || p.atualizado_em))}</span></button></li>`;
  }).join('');
}

$('[data-busca-adm]').addEventListener('input', desenharLista);
$$('[data-filtro]').forEach((b) => b.addEventListener('click', () => {
  filtro = b.dataset.filtro;
  $$('[data-filtro]').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
  desenharLista();
}));
$('[data-posts]').addEventListener('click', async (ev) => {
  const b = ev.target.closest('[data-abrir]'); if (!b) return;
  if (sujo && !confirm('Há alterações não salvas neste post. Abrir outro mesmo assim?')) return;
  const { data, error } = await db.from('blog_posts').select('*').eq('id', b.dataset.abrir).single();
  if (error) return toast(esc(traduzErro(error)), 'erro');
  abrirEditor(data);
});
$('[data-novo]').addEventListener('click', () => {
  if (sujo && !confirm('Há alterações não salvas. Começar um post novo mesmo assim?')) return;
  abrirEditor(null);
});

// --------------------------------------------------------------- editor
const form = $('[data-form-post]');
const F = (n) => form.elements[n];

function paraLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso); const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
}

function abrirEditor(p) {
  atual = p;
  $('[data-editor-vazio]').hidden = true;
  form.hidden = false;
  F('titulo').value = p ? p.titulo : '';
  F('slug').value = p ? p.slug : '';
  F('resumo').value = p ? p.resumo || '' : '';
  F('conteudo').value = p ? p.conteudo || '' : '';
  F('categoria').value = p ? p.categoria : 'estrategia';
  F('tags').value = p ? (p.tags || []).join(', ') : '';
  F('capa_alt').value = p ? p.capa_alt || '' : '';
  F('publicado_em').value = p && p.publicado_em ? paraLocal(p.publicado_em) : '';
  slugManual = !!p;
  definirCapa(p ? p.capa_url : null);
  trocarAba('escrever');
  const publicado = p && p.status === 'publicado';
  $('[data-estado]').innerHTML = !p ? 'Novo post' : publicado ? `No ar desde ${esc(dataBR(p.publicado_em))} · <a href="${urlPost(p.slug)}" target="_blank" rel="noopener">ver post</a>` : 'Rascunho (não aparece no site)';
  $('[data-publicar-txt]').textContent = publicado ? 'Salvar e atualizar no site' : 'Publicar';
  $('[data-despublicar]').hidden = !publicado;
  $('[data-excluir]').hidden = !p;
  $('[data-dica-slug]').textContent = publicado ? 'Atenção: mudar o endereço de um post publicado quebra os links já compartilhados.' : 'Gerado a partir do título. Use letras minúsculas, números e hífen.';
  sujo = false;
  atualizarContadores();
  desenharLista();
  F('titulo').focus();
}

F('titulo').addEventListener('input', () => { if (!slugManual) F('slug').value = slugify(F('titulo').value); });
F('slug').addEventListener('input', () => { slugManual = true; const v = slugify(F('slug').value); if (v !== F('slug').value) F('slug').value = v; });
form.addEventListener('input', () => { sujo = true; atualizarContadores(); });
window.addEventListener('beforeunload', (e) => { if (sujo) { e.preventDefault(); e.returnValue = ''; } });

function contarPalavras(t) { return (t.replace(/[#>*_`\-[\]()!]/g, ' ').match(/\S+/g) || []).length; }

function atualizarContadores() {
  const titulo = F('titulo').value, resumo = F('resumo').value, texto = F('conteudo').value;
  $('[data-cont="titulo"]').textContent = `${titulo.length}/140`;
  $('[data-cont="resumo"]').textContent = `${resumo.length}/300`;
  const palavras = contarPalavras(texto);
  $('[data-cont="palavras"]').textContent = `${palavras} palavras · ${Math.max(1, Math.round(palavras / 200))} min de leitura`;
  $('[data-serp-tit]').textContent = (titulo || 'Título do post') + ' | Grupo 2!H';
  $('[data-serp-url]').textContent = `grupo2h.com.br › blog › ${F('slug').value || '...'}`;
  const desc = resumo || texto.replace(/[#>*_`]/g, '').replace(/\s+/g, ' ').slice(0, 155);
  $('[data-serp-desc]').textContent = desc || 'O resumo do post aparece aqui.';
  const h2 = (texto.match(/^##\s+\S/gm) || []).length;
  const itens = [
    [titulo.length >= 30 && titulo.length <= 65, `Título com 30 a 65 caracteres (agora: ${titulo.length})`],
    [resumo.length >= 120 && resumo.length <= 160, `Resumo com 120 a 160 caracteres (agora: ${resumo.length})`],
    [!!capaUrl, 'Imagem de capa'],
    [!!capaUrl && F('capa_alt').value.trim().length >= 10, 'Descrição da imagem preenchida'],
    [palavras >= 600, `Texto com 600 palavras ou mais (agora: ${palavras})`],
    [h2 >= 2, `Pelo menos 2 subtítulos (agora: ${h2})`],
    [/\]\((\/|https:\/\/grupo2h\.com\.br)/.test(texto), 'Link para outra página do site'],
  ];
  $('[data-checklist]').innerHTML = itens.map(([ok, t]) => `<li class="${ok ? 'ok' : ''}">${t}</li>`).join('');
}

// ---------------------------------------------------- imagens (capa e texto)
async function reduzirImagem(arquivo, max = 1600) {
  if (!/^image\//.test(arquivo.type)) throw new Error('O arquivo precisa ser uma imagem (JPG, PNG ou WebP).');
  if (arquivo.size > 25 * 1024 * 1024) throw new Error('Imagem grande demais (máximo 25 MB antes de reduzir).');
  const bmp = await createImageBitmap(arquivo);
  const escala = Math.min(1, max / bmp.width);
  const w = Math.round(bmp.width * escala), h = Math.round(bmp.height * escala);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  cv.getContext('2d').drawImage(bmp, 0, 0, w, h);
  const blob = await new Promise((ok) => cv.toBlob(ok, 'image/webp', 0.84));
  if (!blob) throw new Error('Não consegui processar a imagem neste navegador.');
  return blob;
}

async function enviarImagem(arquivo, pasta) {
  const blob = await reduzirImagem(arquivo);
  const base = slugify(F('slug').value || F('titulo').value || 'imagem') || 'imagem';
  const caminho = `${pasta}/${new Date().getFullYear()}/${base}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await db.storage.from('blog').upload(caminho, blob, { contentType: 'image/webp', cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return db.storage.from('blog').getPublicUrl(caminho).data.publicUrl;
}

function definirCapa(url) {
  capaUrl = url || null;
  const img = $('[data-capa-img]');
  const src = !url ? '' : /^https?:/.test(url) ? url : C.base + url.replace(/^\//, '');
  img.hidden = !url; if (url) img.src = src; else img.removeAttribute('src');
  $('[data-capa-vazia]').hidden = !!url;
  $('[data-capa-acoes]').hidden = !url;
  atualizarContadores();
}

async function receberCapa(arquivo) {
  if (!arquivo) return;
  const prog = $('[data-capa-prog]'); prog.hidden = false;
  try { definirCapa(await enviarImagem(arquivo, 'capas')); sujo = true; toast('Imagem de capa enviada.'); }
  catch (e) { toast(esc(traduzErro(e)), 'erro'); }
  finally { prog.hidden = true; }
}

const drop = $('[data-capa-drop]'), arqCapa = $('[data-capa-arquivo]');
drop.addEventListener('click', () => arqCapa.click());
drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); arqCapa.click(); } });
arqCapa.addEventListener('change', () => { receberCapa(arqCapa.files[0]); arqCapa.value = ''; });
['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('arrastando'); }));
['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove('arrastando'); }));
drop.addEventListener('drop', (e) => receberCapa(e.dataTransfer.files[0]));
$('[data-capa-trocar]').addEventListener('click', () => arqCapa.click());
$('[data-capa-remover]').addEventListener('click', () => { definirCapa(null); sujo = true; });

// --------------------------------------------------- barra de formatação
const texto = $('[data-texto]');
function envolver(antes, depois = antes, exemplo = 'texto') {
  const { selectionStart: a, selectionEnd: b, value } = texto;
  const sel = value.slice(a, b) || exemplo;
  texto.setRangeText(antes + sel + depois, a, b, 'end');
  texto.focus(); texto.selectionStart = a + antes.length; texto.selectionEnd = a + antes.length + sel.length;
  texto.dispatchEvent(new Event('input', { bubbles: true }));
}
function prefixarLinhas(prefixo) {
  const { selectionStart: a, selectionEnd: b, value } = texto;
  const ini = value.lastIndexOf('\n', a - 1) + 1;
  const fimIdx = value.indexOf('\n', b); const fim = fimIdx === -1 ? value.length : fimIdx;
  const linhas = value.slice(ini, fim).split('\n').map((l, i) => (typeof prefixo === 'function' ? prefixo(i) : prefixo) + l.replace(/^(#{1,6}\s|>\s|-\s|\d+\.\s)/, ''));
  texto.setRangeText(linhas.join('\n'), ini, fim, 'end');
  texto.focus(); texto.dispatchEvent(new Event('input', { bubbles: true }));
}
const arqImg = $('[data-img-arquivo]');
$$('[data-fmt]').forEach((b) => b.addEventListener('click', () => {
  const f = b.dataset.fmt;
  if (f === 'h2') prefixarLinhas('## ');
  else if (f === 'h3') prefixarLinhas('### ');
  else if (f === 'b') envolver('**', '**', 'texto em negrito');
  else if (f === 'i') envolver('*', '*', 'texto em itálico');
  else if (f === 'ul') prefixarLinhas('- ');
  else if (f === 'ol') prefixarLinhas((i) => `${i + 1}. `);
  else if (f === 'quote') prefixarLinhas('> ');
  else if (f === 'link') {
    const url = prompt('Endereço do link (ex.: https://grupo2h.com.br/como-funciona/):', 'https://');
    if (url && url !== 'https://') envolver('[', `](${url})`, 'texto do link');
  } else if (f === 'img') arqImg.click();
}));
arqImg.addEventListener('change', async () => {
  const arq = arqImg.files[0]; arqImg.value = ''; if (!arq) return;
  toast('Enviando imagem...', 'ok', 20000);
  try {
    const url = await enviarImagem(arq, 'conteudo');
    const alt = prompt('Descreva a imagem em poucas palavras (ajuda o Google e quem usa leitor de tela):', '') || '';
    envolver(`\n![${alt.replace(/[[\]]/g, '')}](${url})\n`, '', '');
    toast('Imagem inserida no texto.');
  } catch (e) { toast(esc(traduzErro(e)), 'erro'); }
});

// ------------------------------------------------------- pré-visualizar
function trocarAba(aba) {
  $$('[data-aba]').forEach((b) => b.setAttribute('aria-selected', b.dataset.aba === aba ? 'true' : 'false'));
  const ver = $('[data-ver]');
  texto.hidden = aba !== 'escrever'; ver.hidden = aba === 'escrever';
  if (aba === 'ver') {
    const html = window.marked ? window.marked.parse(texto.value || '*Nada escrito ainda.*') : esc(texto.value);
    ver.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(html) : esc(texto.value);
  }
}
$$('[data-aba]').forEach((b) => b.addEventListener('click', () => trocarAba(b.dataset.aba)));

// ----------------------------------------------------------- gravar
function coletar(status) {
  const tags = F('tags').value.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 12);
  const pub = F('publicado_em').value ? new Date(F('publicado_em').value).toISOString() : null;
  return {
    titulo: F('titulo').value.trim(),
    slug: slugify(F('slug').value || F('titulo').value),
    resumo: F('resumo').value.trim() || null,
    conteudo: F('conteudo').value,
    categoria: F('categoria').value,
    tags,
    capa_url: capaUrl,
    capa_alt: F('capa_alt').value.trim() || null,
    status,
    publicado_em: status === 'publicado' ? pub || (atual && atual.status === 'publicado' ? atual.publicado_em : null) : pub,
  };
}

function validar(d, publicando) {
  if (d.titulo.length < 5) return 'Escreva um título (pelo menos 5 caracteres).';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug) || d.slug.length < 3) return 'O endereço do post precisa ter pelo menos 3 caracteres: letras minúsculas, números e hífen.';
  if (d.slug === 'admin' || d.slug === 'categoria' || d.slug === 'rss-xml') return 'Esse endereço é reservado. Escolha outro.';
  if (publicando) {
    if (contarPalavras(d.conteudo) < 80) return 'O texto está curto demais para publicar (mínimo de 80 palavras).';
    if (d.capa_url && !d.capa_alt) return 'Descreva a imagem de capa antes de publicar (campo "Descrição da imagem").';
  }
  return null;
}

async function gravar(status) {
  const d = coletar(status);
  const erro = validar(d, status === 'publicado');
  if (erro) { toast(esc(erro), 'erro'); return; }
  const botoes = $$('[data-publicar],[data-rascunho]'); botoes.forEach((b) => (b.disabled = true));
  const q = atual ? db.from('blog_posts').update(d).eq('id', atual.id).select('*').single() : db.from('blog_posts').insert(d).select('*').single();
  const { data, error } = await q;
  botoes.forEach((b) => (b.disabled = false));
  if (error) { toast(esc(traduzErro(error)), 'erro', 7000); return; }
  sujo = false;
  const idx = posts.findIndex((p) => p.id === data.id);
  const resumo = { id: data.id, slug: data.slug, titulo: data.titulo, status: data.status, publicado_em: data.publicado_em, atualizado_em: data.atualizado_em, categoria: data.categoria };
  if (idx >= 0) posts[idx] = resumo; else posts.unshift(resumo);
  abrirEditor(data);
  if (status === 'publicado') {
    const futuro = new Date(data.publicado_em).getTime() > Date.now();
    toast(futuro
      ? `Agendado para ${esc(new Date(data.publicado_em).toLocaleString('pt-BR'))}. Ele entra no site sozinho nessa data.`
      : `Publicado. <a href="${urlPost(data.slug)}" target="_blank" rel="noopener">Ver o post</a><br><small>O post já abre pelo link. A página definitiva, que o Google e as IAs leem, é gerada automaticamente em alguns minutos.</small>`, 'ok', 9000);
  } else toast('Rascunho salvo. Ele não aparece no site.');
}

$('[data-publicar]').addEventListener('click', () => gravar('publicado'));
$('[data-rascunho]').addEventListener('click', () => gravar('rascunho'));
$('[data-despublicar]').addEventListener('click', () => { if (confirm('Tirar este post do ar? Ele volta a ser rascunho e some do site no próximo ciclo.')) gravar('rascunho'); });
$('[data-excluir]').addEventListener('click', async () => {
  if (!atual || !confirm(`Excluir "${atual.titulo}" de vez? Isso não pode ser desfeito.`)) return;
  const { error } = await db.from('blog_posts').delete().eq('id', atual.id);
  if (error) return toast(esc(traduzErro(error)), 'erro');
  posts = posts.filter((p) => p.id !== atual.id);
  atual = null; sujo = false; form.hidden = true; $('[data-editor-vazio]').hidden = false;
  desenharLista(); toast('Post excluído.');
});

// atalho: Ctrl+S salva (rascunho, ou atualiza se já está no ar)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !form.hidden) { e.preventDefault(); gravar(atual && atual.status === 'publicado' ? 'publicado' : 'rascunho'); }
});

iniciar().catch((e) => { mostrar('login'); console.error(e); });
