// Gera o lead magnet "7 sinais" a partir de conteudo.mjs:
//   7-sinais/index.html     página de captura + checklist interativo (grupo2h.com.br/7-sinais/)
//   7-sinais/material.html  material em páginas A4, base do PDF
//   7-sinais/<pdf>          PDF impresso pelo Chrome sem interface
// Uso: node site/lead-magnet/gerar.mjs

import { writeFileSync, existsSync, mkdirSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { REPO_DIR, SITE_DIR, esc, icon, CSS_SITE, minificarCss } from '../lib/core.mjs';
import { paginaHTML } from './pagina.mjs';
import { LM, SINAIS, FAIXAS } from './conteudo.mjs';

const SAIDA = join(REPO_DIR, LM.slug);
const ic = (n, cls = 'ic') => icon(n, { cls });
const n2 = (i) => String(i + 1).padStart(2, '0');

const FONTES = `
@font-face{font-family:'General Sans';font-weight:500;font-display:swap;src:url(assets/fonts/general-sans-500.woff2) format('woff2')}
@font-face{font-family:'General Sans';font-weight:600;font-display:swap;src:url(assets/fonts/general-sans-600.woff2) format('woff2')}
@font-face{font-family:'General Sans';font-weight:700;font-display:swap;src:url(assets/fonts/general-sans-700.woff2) format('woff2')}
@font-face{font-family:'Inter';font-weight:100 900;font-display:swap;src:url(assets/fonts/inter-var-latin.woff2) format('woff2')}
@font-face{font-family:'Inter';font-weight:100 900;font-display:swap;src:url(assets/fonts/inter-var-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}`;

const TOKENS = `:root{--bg0:#0A0A0C;--bg1:#0F0F12;--bg2:#15151A;--ouro:#F5C328;--ouro-l:#FFE28A;--ouro-d:#B8830A;--tinta:#17130A;
--tx:#F3F2EE;--tx2:rgba(243,242,238,.74);--tx3:rgba(243,242,238,.52);--linha:rgba(242,238,229,.1);--verm:#FF6A5C;--verde:#5BD68A;
--fd:'General Sans',Inter,system-ui,sans-serif;--fb:Inter,system-ui,sans-serif;--mola:cubic-bezier(.32,.72,0,1)}`;

/* ------------------------------------------------------------------ material (PDF) */
const pgSinal = (s, i) => `<article class="m-sn">
  <div class="m-sn-cab"><span class="m-caixa"></span><span class="m-ic">${ic(s.icone)}</span><span class="m-n">Sinal ${n2(i)}</span></div>
  <h3>${esc(s.titulo)}</h3>
  <div class="m-dois">
    <div><p class="m-r m-r-x">Como perceber</p><p>${esc(s.perceber)}</p></div>
    <div><p class="m-r m-r-ok">O que deveria acontecer</p><p>${esc(s.deveria)}</p></div>
  </div>
  <div class="m-perg"><p class="m-r">Pergunte à sua agência</p><p>“${esc(s.pergunta)}”</p></div>
</article>`;
const pares = [];
for (let i = 0; i < SINAIS.length; i += 2) pares.push(SINAIS.slice(i, i + 2).map((s, k) => pgSinal(s, i + k)).join(''));
// página com um sinal só: completa com espaço de anotações para a reunião com a agência
if (SINAIS.length % 2) pares[pares.length - 1] += `<div class="notas"><p class="etq">Anotações para a próxima reunião</p><p class="notas-sub">Escreva as respostas da sua agência para as perguntas deste checklist.</p>${'<i></i>'.repeat(9)}</div>`;
const rodapeM = (n) => `<footer class="m-rod"><span>Grupo <b>2!H</b> · 7 sinais de que sua agência não é transparente com você</span><span>${n}</span></footer>`;

const material = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>7 sinais de que sua agência não é transparente com você · Grupo 2!H</title>
<meta name="robots" content="noindex">
<style>
${FONTES}
${TOKENS}
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:#0A0A0C;color:var(--tx);font:400 11.5pt/1.55 var(--fb);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ic{width:1em;height:1em;fill:currentColor}
h1,h2,h3{font-family:var(--fd);font-weight:600;letter-spacing:-.02em;margin:0}
p{margin:0}
.ouro{background:linear-gradient(180deg,#FFE490,#F5C328 55%,#D9A012);-webkit-background-clip:text;background-clip:text;color:transparent}
.pg{position:relative;width:210mm;height:297mm;padding:22mm 20mm 26mm;overflow:hidden;page-break-after:always;break-after:page;
  background:radial-gradient(70% 40% at 100% 0%,rgba(245,195,40,.1),transparent 70%),linear-gradient(180deg,#0F0F12,#0A0A0C)}
.pg:last-child{page-break-after:auto;break-after:auto}
.grade{position:absolute;inset:0;background-image:linear-gradient(rgba(242,238,229,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(242,238,229,.04) 1px,transparent 1px);background-size:12mm 12mm;
  -webkit-mask-image:radial-gradient(70% 60% at 70% 20%,#000,transparent 75%);mask-image:radial-gradient(70% 60% at 70% 20%,#000,transparent 75%)}
.m-marca{position:relative;display:flex;align-items:center;gap:3mm;font:700 10pt/1 var(--fd);letter-spacing:.16em}
.m-marca img{width:11mm;height:auto}
.m-marca b{color:var(--ouro)}
.m-rod{position:absolute;left:20mm;right:20mm;bottom:12mm;display:flex;justify-content:space-between;padding-top:4mm;border-top:.3mm solid rgba(242,238,229,.12);font-size:8.5pt;color:var(--tx3)}
.m-rod b{color:var(--ouro)}
.etq{font:700 8.5pt/1 var(--fb);letter-spacing:.22em;text-transform:uppercase;color:var(--ouro)}

/* capa */
.capa{display:flex;flex-direction:column}
.capa::after{content:'';position:absolute;right:-30mm;top:-20mm;width:160mm;height:340mm;background:linear-gradient(115deg,transparent 44%,rgba(245,195,40,.18) 48%,rgba(245,195,40,.02) 56%,transparent 60%)}
.capa-meio{position:relative;margin-top:auto;margin-bottom:auto}
.capa .selo{display:inline-block;padding:2.5mm 5mm;border-radius:99mm;border:.3mm solid rgba(245,195,40,.4);background:rgba(245,195,40,.1);font:600 9.5pt/1 var(--fb);color:var(--ouro-l)}
.capa h1{margin-top:9mm;font-size:38pt;line-height:1.04;max-width:165mm;text-wrap:balance}
.notas{flex:1;display:flex;flex-direction:column;padding:8mm;border-radius:6mm;border:.3mm dashed rgba(245,195,40,.35);background:rgba(245,195,40,.03)}
.notas-sub{margin-top:2.5mm;font-size:10pt;color:var(--tx3)}
.notas i{display:block;flex:none;height:12mm;border-bottom:.3mm solid rgba(242,238,229,.16)}
.capa h1 span{display:block;text-wrap:balance}
.capa .sub{margin-top:8mm;max-width:130mm;font-size:13.5pt;color:var(--tx2)}
.capa-num{position:absolute;right:16mm;bottom:30mm;font:700 190pt/1 var(--fd);letter-spacing:-.06em;color:transparent;-webkit-text-stroke:.5mm rgba(245,195,40,.35)}
.capa-pe{position:relative;display:flex;justify-content:space-between;align-items:flex-end;font-size:9.5pt;color:var(--tx3)}

/* como usar */
.uso h2,.fim h2{margin-top:5mm;font-size:26pt;line-height:1.08}
.uso h2 span,.fim h2 span{display:block}
.uso .lead{margin-top:6mm;font-size:12pt;color:var(--tx2);max-width:150mm}
.passos{display:grid;gap:4mm;margin-top:10mm}
.passo{display:grid;grid-template-columns:12mm 1fr;gap:5mm;align-items:start;padding:5mm 6mm;border-radius:5mm;border:.3mm solid rgba(242,238,229,.1);background:rgba(255,255,255,.035)}
.passo b{display:grid;place-items:center;width:12mm;height:12mm;border-radius:3.5mm;font:600 12pt/1 var(--fd);color:var(--ouro);background:#1B1B20;box-shadow:0 0 0 .3mm rgba(245,195,40,.3)}
.passo h3{font-size:12.5pt}
.passo p{margin-top:1mm;color:var(--tx2);font-size:10.5pt}
.legenda{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:10mm}
.legenda div{padding:5mm;border-radius:5mm;border:.3mm solid;background:rgba(255,255,255,.03)}
.legenda b{display:block;font:600 12pt/1.2 var(--fd)}
.legenda small{display:block;margin-top:1.5mm;font-size:9pt;color:var(--tx3)}
.l-verde{border-color:rgba(91,214,138,.4)!important}.l-verde b{color:var(--verde)}
.l-amarelo{border-color:rgba(245,195,40,.4)!important}.l-amarelo b{color:var(--ouro)}
.l-vermelho{border-color:rgba(255,106,92,.45)!important}.l-vermelho b{color:var(--verm)}

/* sinais */
.sinais-pg{display:flex;flex-direction:column;gap:8mm;height:240mm}
.m-sn{position:relative;padding:8mm 8mm 7mm;border-radius:6mm;border:.3mm solid rgba(242,238,229,.12);background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.015))}
.m-sn-cab{display:flex;align-items:center;gap:4mm}
.m-caixa{width:7mm;height:7mm;border-radius:1.6mm;border:.5mm solid rgba(242,238,229,.45)}
.m-ic{display:grid;place-items:center;width:10mm;height:10mm;border-radius:3mm;color:var(--ouro);background:#1B1B20;box-shadow:0 0 0 .3mm rgba(245,195,40,.3);font-size:14pt}
.m-n{font:700 8.5pt/1 var(--fb);letter-spacing:.2em;text-transform:uppercase;color:var(--ouro)}
.m-sn h3{margin-top:5mm;font-size:17pt;line-height:1.15}
.m-dois{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:5mm}
.m-dois>div,.m-perg{padding:4.5mm 5mm;border-radius:4mm;background:rgba(0,0,0,.3);border:.3mm solid rgba(242,238,229,.08)}
.m-dois p:not(.m-r){font-size:10.5pt;color:var(--tx2)}
.m-r{margin-bottom:1.5mm!important;font:700 7.5pt/1 var(--fb)!important;letter-spacing:.16em;text-transform:uppercase}
.m-r-x{color:var(--verm)}.m-r-ok{color:var(--verde)}
.m-perg{margin-top:4mm;border-color:rgba(245,195,40,.3);background:rgba(245,195,40,.07)}
.m-perg .m-r{color:var(--ouro)}
.m-perg p:not(.m-r){font:500 12pt/1.4 var(--fd)}

/* pontuação + fim */
.pontos{display:flex;align-items:center;gap:6mm;margin-top:8mm;padding:7mm 8mm;border-radius:6mm;border:.3mm solid rgba(245,195,40,.35);background:rgba(245,195,40,.06)}
.pontos .caixas{display:flex;gap:2.5mm}
.pontos .caixas i{width:9mm;height:9mm;border-radius:2mm;border:.5mm solid rgba(242,238,229,.45)}
.pontos p{font:600 13pt/1.3 var(--fd)}
.fim .faixas{display:grid;gap:4mm;margin-top:8mm}
.fim .faixas div{display:grid;grid-template-columns:30mm 1fr;gap:5mm;align-items:center;padding:5mm 6mm;border-radius:5mm;border:.3mm solid;background:rgba(255,255,255,.03)}
.fim .faixas b{font:600 12pt/1.2 var(--fd)}
.fim .faixas p{font-size:10.5pt;color:var(--tx2)}
.cta{margin-top:10mm;padding:9mm;border-radius:7mm;color:var(--tinta);background:linear-gradient(180deg,#FFE9A0,#F7C935 50%,#E2AA14)}
.cta h3{font-size:19pt;line-height:1.15}
.cta p{margin-top:3mm;font-size:11pt;color:rgba(23,19,10,.8)}
.cta .links{display:flex;gap:8mm;margin-top:6mm;font:600 11pt/1.3 var(--fd)}
.cta .links span{display:flex;align-items:center;gap:2.5mm}
.cta .links .ic{font-size:14pt}
/* PDF leve: nada de máscara nem texto em degradê (o Chrome transformava em imagem de página inteira e o leitor travava) */
.grade{display:none!important}
.ouro{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#F5C328!important}
.capa::after{opacity:.8}
.pg{background:#0D0D10!important}
.m-sn,.passo,.legenda div,.fim .faixas div{background:#16161A!important}
.m-dois>div{background:#0F0F12!important}
.m-perg,.pontos{background:#211C0E!important}
.notas{background:#141310!important}
</style></head>
<body>
<section class="pg capa"><div class="grade"></div>
  <div class="m-marca"><img src="assets/logo-2h.png" alt=""><span>GRUPO <b>2!H</b></span></div>
  <div class="capa-meio">
    <span class="selo">Checklist gratuito</span>
    <h1><span>${esc(LM.titulo1)}</span><span class="ouro">${esc(LM.titulo2)}</span></h1>
    <p class="sub">${esc(LM.sub)}</p>
  </div>
  <span class="capa-num" aria-hidden="true">7</span>
  <div class="capa-pe"><span>grupo2h.com.br</span><span>Estrutura, planejamento e ação.</span></div>
</section>

<section class="pg uso"><div class="grade"></div>
  <div class="m-marca"><img src="assets/logo-2h.png" alt=""><span>GRUPO <b>2!H</b></span></div>
  <p class="etq" style="margin-top:14mm">Antes de começar</p>
  <h2><span>Transparência não é</span><span class="ouro">relatório bonito.</span></h2>
  <p class="lead">É você saber, com número, quanto investiu, quanto voltou e por quê. Este checklist mostra os 7 sinais mais comuns de que essa clareza está faltando, e o que fazer com cada um.</p>
  <div class="passos">
    <div class="passo"><b>1</b><div><h3>Leia cada sinal com calma</h3><p>Pense nos últimos 3 meses da relação com a sua agência, gestor ou freelancer.</p></div></div>
    <div class="passo"><b>2</b><div><h3>Marque o quadrado se acontece com você</h3><p>Na dúvida, marque. Dúvida sobre os próprios números já é um sinal.</p></div></div>
    <div class="passo"><b>3</b><div><h3>Leve as perguntas para a próxima reunião</h3><p>Cada sinal traz a pergunta certa. A forma como a agência responde diz muito.</p></div></div>
    <div class="passo"><b>4</b><div><h3>Some os sinais e veja a sua faixa</h3><p>A pontuação está na última página.</p></div></div>
  </div>
  <div class="legenda">
    <div class="l-verde"><b>0 a 1 sinal</b><small>${esc(FAIXAS[0].nome)}</small></div>
    <div class="l-amarelo"><b>2 a 3 sinais</b><small>${esc(FAIXAS[1].nome)}</small></div>
    <div class="l-vermelho"><b>4 ou mais</b><small>${esc(FAIXAS[2].nome)}</small></div>
  </div>
  ${rodapeM(2)}
</section>

${pares.map((p, k) => `<section class="pg"><div class="grade"></div><div class="sinais-pg">${p}</div>${rodapeM(k + 3)}</section>`).join('\n')}

<section class="pg fim"><div class="grade"></div>
  <div class="m-marca"><img src="assets/logo-2h.png" alt=""><span>GRUPO <b>2!H</b></span></div>
  <p class="etq" style="margin-top:12mm">Sua pontuação</p>
  <h2><span>Quantos sinais</span><span class="ouro">você marcou?</span></h2>
  <div class="pontos"><div class="caixas">${'<i></i>'.repeat(7)}</div><p>Pinte um quadrado<br>para cada sinal marcado.</p></div>
  <div class="faixas">
    ${FAIXAS.map((f, k) => `<div class="l-${f.cor}"><b>${['0 a 1 sinal', '2 a 3 sinais', '4 ou mais'][k]}<br>${esc(f.nome)}</b><p>${esc(f.texto)}</p></div>`).join('')}
  </div>
  <div class="cta">
    <h3>Quer ver os números reais da sua operação?</h3>
    <p>A 2!H faz um diagnóstico gratuito com dado de verdade: onde o dinheiro entra, onde trava e o que corrigir primeiro.</p>
    <div class="links"><span>${ic('arrow-right')} grupo2h.com.br/diagnostico-rapido</span><span>${ic('whatsapp-logo')} ${LM.whatsappExibicao}</span></div>
  </div>
  ${rodapeM(pares.length + 3)}
</section>
</body></html>
`;

/* a página usa o mesmo CSS, JS e imagens do site: copia da fonte do site a cada geração */
const copiar = (de, para) => { mkdirSync(join(SAIDA, para, '..'), { recursive: true }); copyFileSync(de, join(SAIDA, para)); return readFileSync(de); };
const hash = createHash('sha1');
/* mesmo pacote único de CSS do site (com os ajustes de desempenho), uma requisição só */
const cssApp = minificarCss(CSS_SITE.map((n) => readFileSync(join(SITE_DIR, 'static', 'css', n + '.css'), 'utf8')).join('\n')) + '\n';
rmSync(join(SAIDA, 'assets', 'css'), { recursive: true, force: true });
mkdirSync(join(SAIDA, 'assets', 'css'), { recursive: true });
writeFileSync(join(SAIDA, 'assets', 'css', 'app.css'), cssApp);
/* embutido no HTML da página: os caminhos relativos à pasta do CSS passam a partir de assets/ */
const cssEmb = cssApp.replace(/url\(\.\.\/([^)'"]+)\)/g, (_, rel) => `url(assets/${rel})`);
hash.update(cssApp);
hash.update(copiar(join(SITE_DIR, 'static', 'js', 'site.js'), 'assets/js/site.js'));
copiar(join(SITE_DIR, 'static', 'img', 'logo-2h-glyph.png'), 'assets/img/logo-2h-glyph.png');
for (const f of ['topo-capa.svg', 'topo-cta.svg', 'topo-hero.svg', 'topo-cartao.svg']) {
  const de = join(REPO_DIR, 'novo', 'assets', 'img', f);
  if (existsSync(de)) copiar(de, `assets/img/${f}`);
}
for (const f of ['aperto-de-mao.webp', 'aperto-de-mao-800.webp']) copiar(join(SITE_DIR, 'static', 'img', 'fotos', f), `assets/img/fotos/${f}`);
rmSync(join(SAIDA, 'assets', 'logo-2h-glyph.png'), { force: true });

writeFileSync(join(SAIDA, 'index.html'), paginaHTML({ versao: hash.digest('hex').slice(0, 8), cssApp: cssEmb }));
writeFileSync(join(SAIDA, 'material.html'), material);
console.log('página e material gerados em', SAIDA);

/* PDF pelo Chrome sem interface */
const CHROMES = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const chrome = CHROMES.find((c) => existsSync(c));
if (!chrome) console.log('Chrome não encontrado: PDF não gerado.');
else {
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=4000',
    `--print-to-pdf=${join(SAIDA, LM.pdf)}`, pathToFileURL(join(SAIDA, 'material.html')).href], { stdio: 'ignore' });
  console.log('PDF gerado:', LM.pdf);
}
