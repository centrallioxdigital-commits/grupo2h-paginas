// Núcleo do gerador: configuração, caminhos, escape, ícones e escrita dos
// arquivos com manifesto (para apagar o que deixou de existir, como um post
// despublicado, sem nunca tocar nas LPs que moram no mesmo repositório).

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const SITE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_DIR = resolve(SITE_DIR, '..');

const raw = JSON.parse(readFileSync(join(SITE_DIR, 'site.config.json'), 'utf8'));
const modo = process.env.SITE_MODE || raw.modo;
if (!['previa', 'producao'].includes(modo)) throw new Error(`modo inválido: ${modo}`);

export const cfg = {
  ...raw,
  modo,
  producao: modo === 'producao',
  base: raw[modo].base,
  saida: resolve(REPO_DIR, raw[modo].saida),
};

/** Link interno do site: u('blog/') -> '/novo/blog/' na prévia, '/blog/' em produção. */
export const u = (p = '') => cfg.base + String(p).replace(/^\//, '');
/** URL absoluta canônica (sempre o domínio de produção). */
export const abs = (p = '') => cfg.dominio + '/' + String(p).replace(/^\//, '');

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const slugify = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Ícones Phosphor (regular), embutidos no HTML: zero requisição extra.
const ICON_DIR = join(SITE_DIR, 'node_modules', '@phosphor-icons', 'core', 'assets');
const iconCache = new Map();
export function icon(name, { weight = 'regular', cls = 'ic', label } = {}) {
  const key = `${weight}/${name}`;
  if (!iconCache.has(key)) {
    const file = join(ICON_DIR, weight, weight === 'regular' ? `${name}.svg` : `${name}-${weight}.svg`);
    if (!existsSync(file)) throw new Error(`ícone não existe: ${key}`);
    iconCache.set(key, readFileSync(file, 'utf8').replace(/<svg /, '<svg focusable="false" '));
  }
  const svg = iconCache.get(key);
  const aria = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
  return svg.replace('<svg ', `<svg class="${cls}" ${aria} `);
}

// ---- escrita com manifesto -------------------------------------------------
const MANIFESTO = join(SITE_DIR, '.gerado.json');
const escritos = new Set();

export function write(relPath, content) {
  const full = join(cfg.saida, relPath);
  mkdirSync(dirname(full), { recursive: true });
  const novo = typeof content === 'string' ? Buffer.from(content, 'utf8') : content;
  // Só regrava se mudou: o robô do GitHub não faz commit à toa.
  if (!existsSync(full) || !readFileSync(full).equals(novo)) writeFileSync(full, novo);
  escritos.add(relative(REPO_DIR, full).replace(/\\/g, '/'));
}

/** Para arquivos fora da pasta de saída (ex.: 404.html na raiz do domínio). */
export function writeRoot(relPath, content) {
  const full = join(REPO_DIR, relPath);
  mkdirSync(dirname(full), { recursive: true });
  const novo = Buffer.from(content, 'utf8');
  if (!existsSync(full) || !readFileSync(full).equals(novo)) writeFileSync(full, novo);
  escritos.add(relPath.replace(/\\/g, '/'));
}

export function finalizarManifesto() {
  const antigo = existsSync(MANIFESTO) ? JSON.parse(readFileSync(MANIFESTO, 'utf8')) : [];
  const removidos = [];
  for (const f of antigo) {
    if (!escritos.has(f)) {
      const full = join(REPO_DIR, f);
      if (existsSync(full)) {
        rmSync(full);
        removidos.push(f);
        limparPastasVazias(dirname(full));
      }
    }
  }
  writeFileSync(MANIFESTO, JSON.stringify([...escritos].sort(), null, 1) + '\n');
  return { total: escritos.size, removidos };
}

function limparPastasVazias(dir) {
  while (dir.startsWith(cfg.saida) && dir !== cfg.saida && dir !== REPO_DIR) {
    if (readdirSync(dir).length) return;
    rmSync(dir, { recursive: true });
    dir = dirname(dir);
  }
}

// ---- assets estáticos com versão no nome da query (?v=hash) ---------------
const versoes = new Map();
export function copiarStatic() {
  const origem = join(SITE_DIR, 'static');
  const andar = (dir) => {
    for (const nome of readdirSync(dir)) {
      const f = join(dir, nome);
      if (statSync(f).isDirectory()) andar(f);
      else {
        const rel = relative(origem, f).replace(/\\/g, '/');
        const buf = readFileSync(f);
        versoes.set(rel, createHash('sha1').update(buf).digest('hex').slice(0, 8));
        write(join('assets', rel), buf);
      }
    }
  };
  andar(origem);
}
/** Ordem das folhas de estilo do site; o build junta tudo em assets/css/app.css (uma requisição só). */
export const CSS_SITE = ['site', 'turbo', 'relevo', 'movimento', 'encorpado', 'acabamento', 'vitrine', 'pecas', 'desempenho'];
export const minificarCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};])\s*/g, '$1').trim();
export function juntarCss() {
  const css = CSS_SITE.map((n) => readFileSync(join(SITE_DIR, 'static', 'css', n + '.css'), 'utf8')).join('\n');
  const min = minificarCss(css) + '\n';
  versoes.set('css/app.css', createHash('sha1').update(min).digest('hex').slice(0, 8));
  write('assets/css/app.css', min);
  return min;
}
/** Caminho de um asset com cache-busting: asset('css/site.css'). */
export const asset = (rel) => u(`assets/${rel}`) + (versoes.has(rel) ? `?v=${versoes.get(rel)}` : '');
export const assetAbs = (rel) => abs(`${cfg.producao ? '' : cfg.base.replace(/^\//, '')}assets/${rel}`);

export const hoje = () => new Date().toISOString().slice(0, 10);

export const dataBR = (iso) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });

export { join, readFileSync, existsSync, copyFileSync };
