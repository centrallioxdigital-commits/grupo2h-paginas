// Gera o lead magnet "7 sinais" a partir de conteudo.mjs:
//   7-sinais/index.html     página de captura + checklist interativo (grupo2h.com.br/7-sinais/)
//   7-sinais/material.html  material em páginas A4, base do PDF
//   7-sinais/<pdf>          PDF impresso pelo Chrome sem interface
// Uso: node site/lead-magnet/gerar.mjs

import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { REPO_DIR, esc, icon } from '../lib/core.mjs';
import { LM, SINAIS, FAIXAS } from './conteudo.mjs';

const SAIDA = join(REPO_DIR, LM.slug);
const ic = (n, cls = 'ic') => icon(n, { cls });
const DIVISA = '<div class="divisa" aria-hidden="true"><span class="divisa-selo"><span class="divisa-moeda"><img src="assets/logo-2h-glyph.png" alt="" width="39" height="36"></span></span></div>';
const n2 = (i) => String(i + 1).padStart(2, '0');
const waLink = (msg) => `https://api.whatsapp.com/send?phone=${LM.whatsapp}&text=${encodeURIComponent(msg)}`;
const WA = waLink('Olá! Baixei o checklist dos 7 sinais e quero conversar sobre a minha operação.');

const FONTES = `
@font-face{font-family:'General Sans';font-weight:500;font-display:swap;src:url(assets/fonts/general-sans-500.woff2) format('woff2')}
@font-face{font-family:'General Sans';font-weight:600;font-display:swap;src:url(assets/fonts/general-sans-600.woff2) format('woff2')}
@font-face{font-family:'General Sans';font-weight:700;font-display:swap;src:url(assets/fonts/general-sans-700.woff2) format('woff2')}
@font-face{font-family:'Inter';font-weight:100 900;font-display:swap;src:url(assets/fonts/inter-var-latin.woff2) format('woff2')}
@font-face{font-family:'Inter';font-weight:100 900;font-display:swap;src:url(assets/fonts/inter-var-latin-ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}`;

const TOKENS = `:root{--bg0:#0A0A0C;--bg1:#0F0F12;--bg2:#15151A;--ouro:#F5C328;--ouro-l:#FFE28A;--ouro-d:#B8830A;--tinta:#17130A;
--tx:#F3F2EE;--tx2:rgba(243,242,238,.74);--tx3:rgba(243,242,238,.52);--linha:rgba(242,238,229,.1);--verm:#FF6A5C;--verde:#5BD68A;
--fd:'General Sans',Inter,system-ui,sans-serif;--fb:Inter,system-ui,sans-serif;--mola:cubic-bezier(.32,.72,0,1)}`;

/* ------------------------------------------------------------------ visual do topo: relatório + lupa */
const linhasBonitas = [
  ['Alcance', '128,4 mil', '+32%'], ['Impressões', '312 mil', '+18%'], ['Curtidas', '4.215', '+41%'], ['CPM', 'R$ 8,90', '−12%'],
];
const linhasReais = [
  ['Vendas', '?', 'sem dado'], ['Faturamento', 'não informado', ''], ['Custo por cliente', '?', 'sem dado'], ['Rastreamento', 'não validado', ''],
];
const relatorio = `<figure class="rel" aria-label="Um relatório de agência cheio de números bonitos. A lupa revela o que falta: vendas, faturamento, custo por cliente e rastreamento.">
  <div class="rel-cab"><span class="rel-pontos"><i></i><i></i><i></i></span><b>Relatório do mês</b><span class="rel-ag">Agência</span></div>
  <div class="rel-corpo">
    <div class="rel-camada rel-bonita">${linhasBonitas.map(([a, b, c]) => `<div class="rel-l"><span>${a}</span><b>${b}</b><em class="sobe">${c}</em></div>`).join('')}
      <div class="rel-selo">${ic('seal-check')} Tudo no verde</div></div>
    <div class="rel-camada rel-real" aria-hidden="true">${linhasReais.map(([a, b, c]) => `<div class="rel-l"><span>${a}</span><b>${b}</b><em>${c}</em></div>`).join('')}
      <div class="rel-selo rel-selo-real">${ic('eye-slash')} Faltam os números</div></div>
    <span class="lupa" aria-hidden="true"><i></i></span>
  </div>
  <span class="rel-chip c1">${ic('gift')} Checklist grátis</span>
  <span class="rel-chip c2">${ic('clock')} 3 minutos</span>
</figure>`;

/* ------------------------------------------------------------------ página */
const travados = SINAIS.map((s, i) => `<li><span class="tv-n">${n2(i)}</span><span class="tv-t">${esc(s.titulo)}</span>${ic('lock-simple', 'ic tv-ic')}</li>`).join('');

const cartoes = SINAIS.map((s, i) => `<li class="sn" data-i="${i}">
  <div class="sn-cab"><span class="sn-ic">${ic(s.icone)}</span><span class="sn-n">Sinal ${n2(i)}</span></div>
  <h3>${esc(s.titulo)}</h3>
  <div class="sn-grade">
    <div><p class="sn-r">${ic('eye')} Como perceber</p><p>${esc(s.perceber)}</p></div>
    <div><p class="sn-r sn-r-ok">${ic('check')} O que deveria acontecer</p><p>${esc(s.deveria)}</p></div>
  </div>
  <div class="sn-perg"><p class="sn-r">Pergunte à sua agência</p><p>“${esc(s.pergunta)}”</p></div>
  <button type="button" class="sn-marca" aria-pressed="false"><span class="sn-caixa">${ic('check')}</span><span class="sn-lbl">Isso acontece comigo</span></button>
</li>`).join('');

const faq = [
  ['É gratuito mesmo?', 'Sim. Você preenche o formulário e o checklist abre na hora, com o PDF para baixar.'],
  ['Serve para quem não tem agência?', 'Serve. Os mesmos sinais valem para gestor de tráfego, freelancer ou para quem faz o próprio marketing.'],
  ['Vou receber spam?', 'Não. A 2!H pode te chamar no WhatsApp uma vez para saber se o material ajudou. Você pode pedir para não receber mais contato quando quiser.'],
];

const pagina = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${LM.gtm}');</script>
<title>7 sinais de que sua agência não é transparente com você · Grupo 2!H</title>
<meta name="description" content="${esc(LM.sub)}">
<link rel="canonical" href="https://grupo2h.com.br/${LM.slug}/">
<meta property="og:type" content="website">
<meta property="og:title" content="7 sinais de que sua agência não é transparente com você">
<meta property="og:description" content="${esc(LM.sub)}">
<meta property="og:url" content="https://grupo2h.com.br/${LM.slug}/">
<meta name="theme-color" content="#0A0A0C">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/general-sans-600.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/inter-var-latin.woff2" crossorigin>
<style>
${FONTES}
${TOKENS}
@property --lx{syntax:'<percentage>';inherits:true;initial-value:30%}
@property --ly{syntax:'<percentage>';inherits:true;initial-value:30%}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;scrollbar-color:#F5C328 #0A0A0C}
body{margin:0;background:var(--bg0);color:var(--tx);font:400 16px/1.6 var(--fb);-webkit-font-smoothing:antialiased;overflow-x:clip}
::-webkit-scrollbar{width:12px}::-webkit-scrollbar-track{background:#0A0A0C}::-webkit-scrollbar-thumb{border-radius:99px;border:3px solid #0A0A0C;background:linear-gradient(180deg,#FFE08A,#F5C328 45%,#C99A12)}
a{color:inherit}
img,svg{display:block}
button,input,select{font:inherit;color:inherit}
.ic{width:1.15em;height:1.15em;fill:currentColor;flex:none}
.wrap{width:min(1180px,100% - 32px);margin-inline:auto}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
h1,h2,h3{font-family:var(--fd);font-weight:600;letter-spacing:-.025em;margin:0;text-wrap:balance}
p{margin:0}
.ouro{background:linear-gradient(180deg,#FFE490,#F5C328 55%,#D9A012);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.08em}

/* fundo com grade */
.grade{position:absolute;inset:0;pointer-events:none;z-index:-1;background-image:linear-gradient(rgba(242,238,229,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(242,238,229,.045) 1px,transparent 1px);background-size:56px 56px;
  -webkit-mask-image:radial-gradient(80% 70% at 60% 30%,#000,transparent 75%);mask-image:radial-gradient(80% 70% at 60% 30%,#000,transparent 75%)}

/* topo */
.topo{position:absolute;inset:0 0 auto;z-index:20;padding:18px 0}
.topo .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px}
.marca{display:flex;align-items:center;gap:10px;text-decoration:none;font:700 .92rem/1 var(--fd);letter-spacing:.14em}
.marca img{width:36px;height:auto}
.marca b{color:var(--ouro)}
.topo-pil{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;font:600 .8rem/1 var(--fb);color:var(--tx2);border:1px solid var(--linha);background:rgba(255,255,255,.04)}
.topo-pil .ic{color:var(--ouro)}

/* botões */
.bt{display:inline-flex;align-items:center;justify-content:center;gap:12px;text-align:center;min-height:56px;padding:8px 10px 8px 26px;border-radius:999px;border:0;cursor:pointer;text-decoration:none;
  font:600 1rem/1.15 var(--fd);transition:transform .5s var(--mola),box-shadow .5s var(--mola)}
.bt .bt-c{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;flex:none}
.bt-ouro{color:var(--tinta);background:linear-gradient(180deg,#FFE9A0,#F7C935 50%,#E2AA14);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -2px 0 rgba(140,95,0,.3),0 16px 34px -14px rgba(245,195,40,.7)}
.bt-ouro .bt-c{background:#17130A;color:var(--ouro)}
.bt-vidro{color:var(--tx);background:linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.03));border:1px solid rgba(242,238,229,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.12)}
.bt-vidro .bt-c{background:rgba(255,255,255,.08);color:var(--ouro)}
.bt:hover{transform:translateY(-3px)}
.bt:active{transform:scale(.97)}
.bt:focus-visible,.sn-marca:focus-visible,.op input:focus-visible+span{outline:3px solid var(--ouro);outline-offset:3px}

/* hero */
.hero{position:relative;isolation:isolate;padding:132px 0 88px;overflow:clip}
.hero::before{content:'';position:absolute;z-index:-1;right:-10%;top:-30%;width:70%;height:140%;background:linear-gradient(115deg,transparent 46%,rgba(245,195,40,.16) 49%,rgba(245,195,40,.02) 56%,transparent 60%)}
.hero-grade{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(32px,5vw,72px);align-items:center}
.selo{display:inline-flex;align-items:center;gap:10px;padding:7px 14px 7px 8px;border-radius:999px;border:1px solid rgba(245,195,40,.35);background:rgba(245,195,40,.08);font:600 .8rem/1 var(--fb);color:var(--ouro-l)}
.selo i{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--ouro);color:var(--tinta)}
.selo .ic{width:13px;height:13px}
.hero h1{margin-top:22px;font-size:clamp(2.1rem,1rem + 2.7vw,3.5rem);line-height:1.04}
.hero h1 span{display:block}
.hero-sub{margin-top:20px;max-width:46ch;font-size:clamp(1.02rem,.95rem + .3vw,1.18rem);color:var(--tx2)}
.hero-acoes{display:flex;flex-wrap:wrap;align-items:center;gap:14px 22px;margin-top:32px}
.hero-nota{display:flex;align-items:center;gap:8px;font-size:.88rem;color:var(--tx3)}
.hero-nota .ic{color:var(--ouro)}

/* relatório com lupa */
.rel{position:relative;margin:0;padding:0;text-align:left;border-radius:28px;border:1px solid rgba(242,238,229,.12);background:linear-gradient(180deg,#17171C,#0F0F13);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 60px 100px -50px rgba(0,0,0,.95),0 0 0 8px rgba(242,238,229,.025)}
.rel-cab{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--linha);font:600 .95rem/1 var(--fd)}
.rel-pontos{display:flex;gap:6px}.rel-pontos i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.14)}
.rel-ag{margin-left:auto;font:600 .7rem/1 var(--fb);letter-spacing:.14em;text-transform:uppercase;color:var(--tx3)}
.rel-corpo{position:relative;--lx:30%;--ly:30%;animation:lupa 11s var(--mola) infinite}
@keyframes lupa{0%,100%{--lx:28%;--ly:18%}22%{--lx:70%;--ly:30%}45%{--lx:62%;--ly:62%}68%{--lx:30%;--ly:52%}85%{--lx:55%;--ly:86%}}
.rel-camada{padding:10px 20px 20px}
.rel-l{display:grid;grid-template-columns:minmax(0,1fr) auto 64px;align-items:center;gap:12px;padding:15px 0;border-bottom:1px solid rgba(242,238,229,.06)}
.rel-l span{color:var(--tx2);font-size:.95rem}
.rel-l b{font:600 1.08rem/1 var(--fd);text-align:right}
.rel-l em{font-style:normal;font:600 .78rem/1 var(--fb);text-align:right;color:var(--tx3)}
.rel-l em.sobe{color:var(--verde)}
.rel-selo{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:8px 13px;border-radius:999px;font:600 .82rem/1 var(--fb);color:var(--verde);background:rgba(91,214,138,.1);border:1px solid rgba(91,214,138,.25)}
.rel-real{position:absolute;inset:0;background:radial-gradient(circle at var(--lx) var(--ly),#221d0d,#14130f 60%);
  -webkit-mask-image:radial-gradient(circle 74px at var(--lx) var(--ly),#000 97%,transparent 100%);mask-image:radial-gradient(circle 74px at var(--lx) var(--ly),#000 97%,transparent 100%)}
.rel-real .rel-l b{color:var(--ouro-l)}
.rel-real .rel-l em{color:var(--verm)}
.rel-selo-real{color:var(--verm);background:rgba(255,106,92,.1);border-color:rgba(255,106,92,.3)}
.lupa{position:absolute;left:var(--lx);top:var(--ly);width:148px;height:148px;translate:-50% -50%;border-radius:50%;pointer-events:none;
  box-shadow:0 0 0 3px #F5C328,0 0 0 7px rgba(23,19,10,.85),0 0 0 8px rgba(245,195,40,.4),0 20px 40px -10px rgba(0,0,0,.9),inset 0 0 30px rgba(245,195,40,.25)}
.lupa::before{content:'';position:absolute;inset:10px;border-radius:50%;background:radial-gradient(60% 40% at 32% 22%,rgba(255,255,255,.22),transparent 70%)}
.lupa i{position:absolute;left:84%;top:84%;width:62px;height:16px;border-radius:9px;rotate:45deg;transform-origin:0 50%;background:linear-gradient(180deg,#FFE490,#C8920E);box-shadow:0 8px 16px -6px rgba(0,0,0,.8)}
.rel-chip{position:absolute;display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;font:600 .82rem/1 var(--fd);
  background:rgba(20,20,24,.9);border:1px solid rgba(242,238,229,.14);box-shadow:0 14px 30px -12px rgba(0,0,0,.9);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);animation:flutua 6s ease-in-out infinite}
.rel-chip .ic{color:var(--ouro)}
.rel-chip.c1{left:-20px;top:-18px}
.rel-chip.c2{right:-18px;bottom:16%;animation-delay:-3s}
@keyframes flutua{50%{transform:translateY(-8px)}}

/* seções */
.sec{position:relative;isolation:isolate;padding:clamp(72px,9vw,120px) 0;overflow-x:clip}
.divisa{position:relative;z-index:6;height:0;pointer-events:none}
.divisa::before{content:'';position:absolute;left:0;right:0;top:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(245,195,40,.15) 18%,rgba(245,195,40,.65) 50%,rgba(245,195,40,.15) 82%,transparent)}
.divisa-selo{position:absolute;left:50%;top:0;translate:-50% -50%;display:flex;align-items:center}
.divisa-selo::before,.divisa-selo::after{content:'';width:clamp(40px,8vw,120px);height:1px;background:linear-gradient(90deg,transparent,rgba(245,195,40,.8))}
.divisa-selo::after{transform:scaleX(-1)}
.divisa-moeda{position:relative;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;
  background:radial-gradient(120% 120% at 30% 18%,rgba(255,255,255,.16),transparent 52%),linear-gradient(160deg,#25252B,#0E0E11);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2),inset 0 -3px 6px rgba(0,0,0,.7),0 0 0 1px rgba(245,195,40,.45),0 0 0 6px rgba(10,10,12,.9),0 0 0 7px rgba(245,195,40,.22),0 18px 40px -12px rgba(0,0,0,.9),0 0 36px -6px rgba(245,195,40,.35)}
.divisa-moeda img{width:30px;height:auto;filter:drop-shadow(0 2px 6px rgba(245,195,40,.5))}
.divisa-moeda::after{content:'';position:absolute;inset:4px;border-radius:50%;border:1px dashed rgba(245,195,40,.3);animation:giro 30s linear infinite}
@keyframes giro{to{transform:rotate(360deg)}}
.sec-check{overflow:visible}
.sec-check>.divisa{position:absolute;left:0;right:0;top:0}
.etq{display:inline-flex;align-items:center;gap:8px;font:700 .72rem/1 var(--fb);letter-spacing:.2em;text-transform:uppercase;color:var(--ouro)}
.sec h2{margin-top:14px;font-size:clamp(1.9rem,1.1rem + 2.6vw,3.2rem);line-height:1.06}
.sec h2 span{display:block}
.sec-lead{margin-top:16px;max-width:52ch;color:var(--tx2);font-size:1.05rem}

/* captura: lista travada + formulário */
.cap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:clamp(28px,4vw,64px);align-items:start}
.travados{list-style:none;margin:30px 0 0;padding:0;display:grid;gap:10px}
.travados li{display:grid;grid-template-columns:44px minmax(0,1fr) 22px;align-items:center;gap:14px;padding:14px 16px;border-radius:18px;border:1px solid var(--linha);background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.012)),var(--bg1)}
.tv-n{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;font:600 .95rem/1 var(--fd);color:var(--ouro);background:linear-gradient(160deg,#25252B,#131317);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 0 0 1px rgba(245,195,40,.22)}
.tv-t{font:600 1rem/1.3 var(--fd)}
.tv-ic{color:var(--tx3)}
.form{position:sticky;top:24px;padding:clamp(22px,3vw,32px);border-radius:28px;border:1px solid rgba(245,195,40,.28);
  background:radial-gradient(120% 80% at 0% 0%,rgba(245,195,40,.14),transparent 55%),linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.015)),var(--bg1);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 50px 90px -50px rgba(0,0,0,.95)}
.form h3{font-size:1.45rem;line-height:1.15}
.form-sub{margin-top:8px;color:var(--tx2);font-size:.95rem}
.campos{display:grid;gap:14px;margin-top:22px}
.campo label,.campo legend{display:block;margin-bottom:7px;font:600 .86rem/1.3 var(--fd);color:var(--tx)}
.campo input,.campo select{width:100%;min-height:52px;padding:12px 16px;border-radius:14px;border:1px solid rgba(242,238,229,.16);background:rgba(0,0,0,.35);font-size:1rem;outline:none;transition:border-color .25s,box-shadow .25s;-webkit-appearance:none;appearance:none}
.campo select{background-image:linear-gradient(45deg,transparent 50%,#F5C328 50%),linear-gradient(135deg,#F5C328 50%,transparent 50%);background-position:calc(100% - 22px) 23px,calc(100% - 16px) 23px;background-size:6px 6px;background-repeat:no-repeat}
.campo select option{background:#15151A;color:#F3F2EE}
.campo input::placeholder{color:rgba(243,242,238,.35)}
.campo input:focus,.campo select:focus{border-color:var(--ouro);box-shadow:0 0 0 4px rgba(245,195,40,.15)}
.campo.erro input,.campo.erro select,.campo.erro .ops{border-color:var(--verm)!important;box-shadow:0 0 0 4px rgba(255,106,92,.12)}
.campo .msg{display:none;margin-top:6px;font-size:.8rem;color:var(--verm)}
.campo.erro .msg{display:block}
fieldset.campo{border:0;margin:0;padding:0;min-width:0}
.ops{display:grid;grid-template-columns:1fr 1fr;gap:8px;border-radius:16px;border:1px solid transparent}
.op{position:relative;cursor:pointer}
.op input{position:absolute;opacity:0;inset:0;cursor:pointer}
.op span{display:flex;align-items:center;justify-content:center;min-height:48px;padding:8px 10px;text-align:center;border-radius:14px;font:600 .86rem/1.2 var(--fd);border:1px solid rgba(242,238,229,.14);background:rgba(255,255,255,.03);transition:all .3s var(--mola)}
.op input:checked+span{color:var(--tinta);border-color:transparent;background:linear-gradient(180deg,#FFE9A0,#F7C935 50%,#E2AA14);box-shadow:0 8px 20px -10px rgba(245,195,40,.7)}
.lgpd{display:flex;gap:12px;align-items:flex-start;font-size:.82rem;line-height:1.45;color:var(--tx3);cursor:pointer}
.campo .lgpd input{flex:none;width:20px;height:20px;min-height:0;padding:0;margin:1px 0 0;border-radius:4px;-webkit-appearance:checkbox;appearance:auto;accent-color:#F5C328;background:none;box-shadow:none}
.lgpd a{color:var(--ouro-l)}
.form .bt{width:100%;margin-top:6px}
.form-seg{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;font-size:.8rem;color:var(--tx3)}
.form-seg .ic{color:var(--ouro)}
.form.enviando .bt{opacity:.7;pointer-events:none}
.form-ok{display:none;text-align:center;padding:12px 0}
.form-ok .ic{width:54px;height:54px;margin:0 auto 14px;padding:12px;border-radius:50%;color:var(--tinta);background:linear-gradient(180deg,#FFE9A0,#E2AA14)}
.liberado .form-campos{display:none}
.liberado .form-ok{display:block}
.liberado .tv-ic{color:var(--ouro)}

/* por que */
.tres{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:40px}
.tres div{padding:26px 24px;border-radius:24px;border:1px solid var(--linha);background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.012)),var(--bg1)}
.tres .ic{width:46px;height:46px;padding:11px;border-radius:14px;color:var(--ouro);background:linear-gradient(160deg,#25252B,#131317);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 0 0 1px rgba(245,195,40,.22)}
.tres h3{margin-top:18px;font-size:1.2rem}
.tres p{margin-top:8px;color:var(--tx2);font-size:.96rem}

/* checklist liberado */
#checklist[hidden]{display:none}
.sinais{list-style:none;margin:40px 0 0;padding:0;display:grid;gap:16px}
.sn{padding:clamp(20px,3vw,30px);border-radius:26px;border:1px solid var(--linha);background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.012)),var(--bg1);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.06);transition:border-color .4s,background .5s}
.sn-cab{display:flex;align-items:center;gap:12px}
.sn-ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;color:var(--ouro);background:linear-gradient(160deg,#25252B,#131317);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 0 0 1px rgba(245,195,40,.22)}
.sn-ic .ic{width:22px;height:22px}
.sn-n{font:700 .74rem/1 var(--fb);letter-spacing:.18em;text-transform:uppercase;color:var(--ouro)}
.sn h3{margin-top:16px;font-size:clamp(1.25rem,1rem + .8vw,1.6rem);line-height:1.2}
.sn-grade{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
.sn-grade>div,.sn-perg{padding:16px 18px;border-radius:18px;background:rgba(0,0,0,.28);border:1px solid rgba(242,238,229,.07)}
.sn-grade p:not(.sn-r),.sn-perg p:not(.sn-r){color:var(--tx2);font-size:.96rem}
.sn-r{display:flex;align-items:center;gap:7px;margin-bottom:6px!important;font:700 .72rem/1 var(--fb)!important;letter-spacing:.14em;text-transform:uppercase;color:var(--verm)!important}
.sn-r-ok{color:var(--verde)!important}
.sn-perg{margin-top:12px;border-color:rgba(245,195,40,.25);background:rgba(245,195,40,.06)}
.sn-perg .sn-r{color:var(--ouro)!important}
.sn-perg p:not(.sn-r){color:var(--tx)!important;font:500 1.02rem/1.45 var(--fd)!important}
.sn-marca{display:flex;align-items:center;gap:12px;width:100%;margin-top:16px;padding:12px 16px;min-height:54px;border-radius:16px;cursor:pointer;
  border:1px dashed rgba(242,238,229,.22);background:transparent;font:600 .98rem/1 var(--fd);color:var(--tx2);transition:all .35s var(--mola)}
.sn-caixa{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;border:2px solid rgba(242,238,229,.3);color:transparent;transition:all .35s var(--mola)}
.sn-caixa .ic{width:16px;height:16px}
.sn-marca:hover{border-color:rgba(255,106,92,.5);color:var(--tx)}
.sn.marcado{border-color:rgba(255,106,92,.45);background:radial-gradient(120% 80% at 100% 0%,rgba(255,106,92,.1),transparent 55%),linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.012)),var(--bg1)}
.sn.marcado .sn-marca{border-style:solid;border-color:rgba(255,106,92,.6);color:#fff;background:rgba(255,106,92,.12)}
.sn.marcado .sn-caixa{border-color:transparent;background:var(--verm);color:#fff}

/* resultado */
.res{margin-top:28px;padding:clamp(24px,3.4vw,40px);border-radius:28px;border:1px solid rgba(245,195,40,.3);
  background:radial-gradient(120% 90% at 0% 0%,rgba(245,195,40,.14),transparent 55%),linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.015)),var(--bg1)}
.res-topo{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px}
.res-num{font:700 clamp(3rem,2rem + 3vw,4.4rem)/1 var(--fd);letter-spacing:-.04em}
.res-num small{font-size:.38em;color:var(--tx3);letter-spacing:0}
.res-faixa{display:inline-flex;align-items:center;gap:10px;padding:10px 16px;border-radius:999px;font:600 .95rem/1 var(--fd);border:1px solid}
.res-faixa i{width:10px;height:10px;border-radius:50%;background:currentColor;box-shadow:0 0 12px currentColor}
.res[data-cor=verde] .res-faixa{color:var(--verde);background:rgba(91,214,138,.1)}
.res[data-cor=amarelo] .res-faixa{color:var(--ouro);background:rgba(245,195,40,.1)}
.res[data-cor=vermelho] .res-faixa{color:var(--verm);background:rgba(255,106,92,.1)}
.medidor{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:22px}
.medidor i{height:10px;border-radius:6px;background:rgba(255,255,255,.08);transition:background .5s var(--mola),box-shadow .5s}
.medidor i.on{background:var(--c,#F5C328);box-shadow:0 0 12px var(--c,#F5C328)}
.res-txt{margin-top:18px;max-width:60ch;color:var(--tx2);font-size:1.05rem}
.res-acoes{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.contador{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));translate:-50% 140%;z-index:30;display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:999px;
  font:600 .9rem/1 var(--fd);background:rgba(15,15,18,.92);border:1px solid rgba(245,195,40,.35);box-shadow:0 18px 40px -14px rgba(0,0,0,.9);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:translate .6s var(--mola)}
.contador{white-space:nowrap}
.contador b{color:var(--ouro)}
.contador.on{translate:-50% 0}

/* faq e rodapé */
.faq{margin-top:32px;max-width:860px}
.acord{border:1px solid rgba(242,238,229,.07);border-radius:24px;margin-bottom:12px;padding:0 16px 0 26px;
  background:linear-gradient(180deg,rgba(255,255,255,.075) 0%,rgba(255,255,255,.025) 38%,rgba(255,255,255,.012) 100%),var(--bg1);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10),inset 0 0 0 1px rgba(255,255,255,.035),inset 0 -1px 0 rgba(0,0,0,.55),0 2px 4px -1px rgba(0,0,0,.5),0 22px 44px -22px rgba(0,0,0,.95);
  transition:box-shadow .6s var(--mola),border-color .5s,background .5s,transform .6s var(--mola)}
.acord:hover{border-color:rgba(245,195,40,.22);transform:translateY(-2px)}
.acord[open]{border-color:rgba(245,195,40,.32);background:radial-gradient(120% 140% at 0% 0%,rgba(245,195,40,.12),transparent 55%),linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.012)),var(--bg1);
  box-shadow:inset 0 1px 0 rgba(255,235,170,.18),inset 0 0 0 1px rgba(245,195,40,.22),0 34px 60px -26px rgba(0,0,0,.95),0 18px 50px -30px rgba(245,195,40,.35)}
.acord summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px 0;cursor:pointer;font:600 1.12rem/1.35 var(--fd);letter-spacing:-.01em;color:#fff}
.acord summary::-webkit-details-marker{display:none}
.acord summary .ic{flex:none;width:46px;height:46px;padding:13px;border-radius:50%;color:var(--ouro);
  background:radial-gradient(120% 120% at 30% 15%,rgba(255,255,255,.14),transparent 55%),linear-gradient(160deg,#28282E,#121216);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -2px 4px rgba(0,0,0,.65),0 8px 18px -8px rgba(0,0,0,.95),0 0 0 1px rgba(0,0,0,.45);
  transition:transform .6s var(--mola),background .45s,color .45s,box-shadow .45s}
.acord summary:hover .ic{box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 0 0 1px rgba(245,195,40,.35),0 10px 24px -10px rgba(245,195,40,.45)}
.acord[open] summary .ic{transform:rotate(135deg);color:var(--tinta);background:linear-gradient(180deg,#FFE490,#F7C93A 45%,#E2AA14);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -2px 0 rgba(140,95,0,.35),0 10px 24px -10px rgba(245,195,40,.7)}
.acord-r{overflow:hidden;padding:0 0 20px}
.acord-r p{padding:20px 24px;border-radius:18px;font-weight:500;line-height:1.65;color:#17130A;
  background:radial-gradient(120% 120% at 0% 0%,rgba(255,255,255,.45),transparent 45%),linear-gradient(180deg,#FFE48F 0%,#F7C833 55%,#E6AF17 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -2px 0 rgba(140,95,0,.25),0 1px 0 rgba(0,0,0,.4),0 18px 34px -16px rgba(245,195,40,.55)}
.rod{padding:36px 0 calc(36px + env(safe-area-inset-bottom));border-top:1px solid var(--linha);color:var(--tx3);font-size:.86rem}
.rod .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px}
.rod a{text-decoration:none}.rod a:hover{color:var(--ouro)}

/* entrada suave */
.js [data-entra]{opacity:0;transform:translateY(24px);transition:opacity .9s var(--mola),transform 1.1s var(--mola)}
.js [data-entra].visto{opacity:1;transform:none}

/* responsivo */
@media (max-width:1024px){
  .hero-grade,.cap{grid-template-columns:1fr}
  .hero{padding-top:104px;text-align:center}
  .hero-visual{order:-1;max-width:460px;margin:0 auto 8px;width:100%}
  .hero-sub{margin-inline:auto}
  .hero-acoes{justify-content:center}
  .form{position:relative;top:auto}
  .tres{grid-template-columns:1fr}
}
@media (max-width:640px){
  .topo-pil{display:none}
  .divisa-moeda{width:52px;height:52px}.divisa-moeda img{width:24px}
  .acord{padding-left:18px;padding-right:12px}.acord summary{font-size:1.02rem}.acord-r p{padding:16px 18px}
  .hero{padding:92px 0 64px}
  .rel-chip.c1{left:-6px;top:auto;bottom:-18px}
  .rel-chip.c2{right:-6px;top:58px;bottom:auto}
  .rel-l{grid-template-columns:minmax(0,1fr) auto 56px;padding:13px 0}
  .lupa{width:118px;height:118px}
  .rel-real{-webkit-mask-image:radial-gradient(circle 59px at var(--lx) var(--ly),#000 97%,transparent 100%);mask-image:radial-gradient(circle 59px at var(--lx) var(--ly),#000 97%,transparent 100%)}
  .sec{text-align:center}
  .sec-lead{margin-inline:auto}
  .travados,.form,.sinais,.res,.faq,.tres div{text-align:left}
  .sn-grade{grid-template-columns:1fr}
  .bt{width:100%}
  .res-acoes .bt{width:100%}
}
@media (max-width:380px){.ops{grid-template-columns:1fr}.hero h1{font-size:2.05rem}}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .rel-corpo{animation:none;--lx:62%;--ly:30%}
  .rel-chip,.divisa-moeda::after{animation:none}
  .js [data-entra]{opacity:1;transform:none;transition:none}
}

/* ===== PROTEÇÃO DE CONTEÚDO (padrão 2!H) ===== */
body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
input,textarea,select{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}
img,svg{-webkit-user-drag:none}
</style>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${LM.gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>document.documentElement.classList.add('js')</script>

<header class="topo"><div class="wrap">
  <a class="marca" href="/" aria-label="Grupo 2!H"><img src="assets/logo-2h.png" alt="" width="140" height="129"><span>GRUPO <b>2!H</b></span></a>
  <span class="topo-pil">${ic('gift')} Checklist gratuito</span>
</div></header>

<main>
<section class="hero">
  <div class="grade" aria-hidden="true"></div>
  <div class="wrap hero-grade">
    <div class="hero-texto">
      <p class="selo"><i>${ic('magnifying-glass')}</i> Checklist gratuito da 2!H</p>
      <h1><span>${esc(LM.titulo1)}</span><span class="ouro">${esc(LM.titulo2)}</span></h1>
      <p class="hero-sub">${esc(LM.sub)}</p>
      <div class="hero-acoes">
        <a class="bt bt-ouro" href="#receber">Quero o checklist grátis <span class="bt-c">${ic('arrow-down')}</span></a>
        <p class="hero-nota">${ic('download-simple')} Abre na hora, com PDF</p>
      </div>
    </div>
    <div class="hero-visual">${relatorio}</div>
  </div>
</section>
${DIVISA}
<section class="sec" id="receber">
  <div class="wrap cap">
    <div data-entra>
      <p class="etq">${ic('lock-simple')} O que tem no checklist</p>
      <h2><span>Os 7 sinais, cada um com</span><span class="ouro">a pergunta certa a fazer.</span></h2>
      <p class="sec-lead">Para cada sinal: como perceber, o que deveria acontecer numa relação transparente e a pergunta para levar à próxima reunião com a sua agência.</p>
      <ol class="travados">${travados}</ol>
    </div>
    <form class="form" id="form" novalidate data-entra>
      <div class="form-campos">
        <h3>Receba o checklist agora</h3>
        <p class="form-sub">Preencha e ele abre aqui mesmo, com o PDF para baixar.</p>
        <div class="campos">
          <div class="campo" data-campo="nome"><label for="f-nome">Seu nome</label><input id="f-nome" name="nome" autocomplete="name" placeholder="Como podemos te chamar?"><p class="msg">Escreva o seu nome.</p></div>
          <div class="campo" data-campo="whatsapp"><label for="f-wa">WhatsApp</label><input id="f-wa" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(00) 00000-0000"><p class="msg">Confira o número com DDD.</p></div>
          <div class="campo" data-campo="faturamento"><label for="f-fat">Faturamento mensal da empresa</label>
            <select id="f-fat" name="faturamento"><option value="">Selecione</option><option>Até R$30 mil</option><option>R$30 mil a R$100 mil</option><option>R$100 mil a R$300 mil</option><option>Acima de R$300 mil</option></select><p class="msg">Escolha uma faixa.</p></div>
          <fieldset class="campo" data-campo="agencia"><legend>Sua agência atual te mostra os números?</legend>
            <div class="ops">${['Sim, com clareza', 'Mais ou menos', 'Não mostra', 'Não tenho agência'].map((o) => `<label class="op"><input type="radio" name="agencia" value="${o}"><span>${o}</span></label>`).join('')}</div>
            <p class="msg">Escolha uma opção.</p></fieldset>
          <div class="campo" data-campo="lgpd"><label class="lgpd"><input type="checkbox" name="lgpd"><span>Autorizo a 2!H a usar estes dados para me enviar o material e entrar em contato pelo WhatsApp, conforme a <a href="${LM.privacidade}" target="_blank" rel="noopener">política de privacidade</a>.</span></label><p class="msg">É preciso autorizar para receber o material.</p></div>
        </div>
        <button class="bt bt-ouro" type="submit"><span class="bt-txt">Liberar o checklist</span> <span class="bt-c">${ic('lock-simple-open')}</span></button>
        <p class="form-seg">${ic('shield-check')} Seus dados ficam só com a 2!H.</p>
      </div>
      <div class="form-ok" aria-live="polite">${ic('check')}<h3>Checklist liberado.</h3><p class="form-sub">Role para baixo e marque os sinais que acontecem com você.</p>
        <a class="bt bt-vidro" href="#checklist" style="margin-top:18px">Ir para o checklist <span class="bt-c">${ic('arrow-down')}</span></a></div>
    </form>
  </div>
</section>

<section class="sec sec-check" id="checklist" hidden>
  ${DIVISA}
  <div class="wrap">
    <p class="etq">${ic('lock-simple-open')} Checklist liberado</p>
    <h2><span>Marque os sinais que</span><span class="ouro">acontecem com você.</span></h2>
    <p class="sec-lead">Seja honesto: ninguém mais vê as suas respostas. No final aparece o que elas dizem sobre a sua operação.</p>
    <ol class="sinais">${cartoes}</ol>
    <div class="res" id="resultado" data-cor="verde" aria-live="polite">
      <div class="res-topo"><p class="res-num"><span id="r-num">0</span><small> de 7 sinais</small></p><p class="res-faixa"><i></i><span id="r-nome">${esc(FAIXAS[0].nome)}</span></p></div>
      <div class="medidor" aria-hidden="true">${'<i></i>'.repeat(7)}</div>
      <p class="res-txt" id="r-txt">${esc(FAIXAS[0].texto)}</p>
      <div class="res-acoes">
        <a class="bt bt-ouro" id="r-diag" href="${LM.diagnostico}">Fazer o diagnóstico gratuito <span class="bt-c">${ic('arrow-right')}</span></a>
        <a class="bt bt-vidro" href="${LM.pdf}" download>Baixar o PDF <span class="bt-c">${ic('download-simple')}</span></a>
        <a class="bt bt-vidro" href="${WA}" target="_blank" rel="noopener">Falar no WhatsApp <span class="bt-c">${ic('whatsapp-logo')}</span></a>
      </div>
    </div>
  </div>
</section>
${DIVISA}
<section class="sec">
  <div class="wrap">
    <div data-entra>
      <p class="etq">${ic('seal-check')} Por que a 2!H fez este checklist</p>
      <h2><span>Aqui você vê os números,</span><span class="ouro">não a promessa.</span></h2>
      <p class="sec-lead">A maioria das empresas que chega até a 2!H já se queimou com agência. Não só por falta de resultado: por falta de transparência. Por isso trabalhamos assim:</p>
    </div>
    <div class="tres" data-entra>
      <div>${ic('eye')}<h3>Conta aberta</h3><p>As contas são da sua empresa e você acompanha os números reais, quando quiser.</p></div>
      <div>${ic('crosshair')}<h3>Rastreamento validado</h3><p>Pixel, API de conversões e UTMs testados de ponta a ponta antes de escalar.</p></div>
      <div>${ic('chart-line-up')}<h3>Decisão com número</h3><p>O relatório vai até a venda e o caixa. Cada decisão tem dado por trás.</p></div>
    </div>
  </div>
</section>
${DIVISA}
<section class="sec">
  <div class="wrap">
    <p class="etq">Perguntas</p>
    <h2><span>Antes de você</span><span class="ouro">perguntar.</span></h2>
    <div class="faq" data-acordeoes>${faq.map(([q, a]) => `<details class="acord"><summary>${esc(q)}${ic('plus')}</summary><div class="acord-r"><p>${esc(a)}</p></div></details>`).join('')}</div>
    <div class="hero-acoes" style="justify-content:inherit"><a class="bt bt-ouro" href="#receber">Quero o checklist grátis <span class="bt-c">${ic('arrow-up')}</span></a></div>
  </div>
</section>
</main>

<p class="contador" id="contador" aria-hidden="true">${ic('check')} <b id="c-num">0</b> de 7 sinais marcados</p>

<footer class="rod"><div class="wrap">
  <p>© ${new Date().getFullYear()} Grupo 2!H. Todos os direitos reservados.</p>
  <p><a href="${LM.privacidade}">Política de privacidade</a> · <a href="mailto:${LM.email}">${LM.email}</a></p>
</div></footer>

<script>
(function () {
  var CONFIG = {
    WEBHOOK_URL: ${JSON.stringify(LM.webhook)},
    CHAVE: '2h_7sinais',
  };
  var FAIXAS = ${JSON.stringify(FAIXAS)};
  var CORES = { verde: '#5BD68A', amarelo: '#F5C328', vermelho: '#FF6A5C' };
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document, form = doc.getElementById('form'), lista = doc.getElementById('checklist');
  var ler = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  var gravar = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* entrada suave */
  var ents = doc.querySelectorAll('[data-entra]');
  if ('IntersectionObserver' in window && !reduz) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    ents.forEach(function (el) { io.observe(el); });
  } else ents.forEach(function (el) { el.classList.add('visto'); });

  /* máscara do WhatsApp */
  var wa = doc.getElementById('f-wa');
  wa.addEventListener('input', function () {
    var d = wa.value.replace(/\\D/g, '').replace(/^55(?=\\d{10,11}$)/, '').slice(0, 11);
    var f = d.length > 10 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7) : d.length > 6 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6) : d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d.length ? '(' + d : '';
    wa.value = f;
  });

  function campo(nome, ok) { var c = form.querySelector('[data-campo="' + nome + '"]'); c.classList.toggle('erro', !ok); return ok; }
  form.addEventListener('change', function (e) { var c = e.target.closest('.campo'); if (c) c.classList.remove('erro'); });
  form.addEventListener('input', function (e) { var c = e.target.closest('.campo'); if (c) c.classList.remove('erro'); });

  function utm() {
    var p = new URLSearchParams(location.search), o = {};
    ['origem', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { if (p.get(k)) o[k] = p.get(k); });
    return o;
  }

  function enviar(data) {
    var body = JSON.stringify(data);
    return fetch(CONFIG.WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body })
      .then(function (r) { if (!r.ok) throw 0; })
      .catch(function () {
        /* sem preflight: entrega mesmo sem CORS liberado no n8n */
        return fetch(CONFIG.WEBHOOK_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: body })
          .catch(function () { try { if (navigator.sendBeacon) navigator.sendBeacon(CONFIG.WEBHOOK_URL, new Blob([body], { type: 'text/plain;charset=UTF-8' })); } catch (e) {} });
      });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var nome = form.nome.value.trim(), dig = form.whatsapp.value.replace(/\\D/g, ''), fat = form.faturamento.value;
    var ag = (form.querySelector('input[name=agencia]:checked') || {}).value || '', lg = form.lgpd.checked;
    var ok = [campo('nome', nome.length >= 2), campo('whatsapp', dig.length === 10 || dig.length === 11), campo('faturamento', !!fat), campo('agencia', !!ag), campo('lgpd', lg)];
    if (ok.indexOf(false) > -1) { var e1 = form.querySelector('.erro input, .erro select'); if (e1) e1.focus(); return; }
    form.classList.add('enviando'); form.querySelector('.bt-txt').textContent = 'Liberando...';
    var dados = Object.assign({ source: 'lead-magnet', formulario: '7-sinais', nome: nome, whatsapp: '55' + dig, faturamento: fat, agencia_mostra_numeros: ag,
      consentimento_lgpd: true, pagina: location.origin + location.pathname, enviado_em: new Date().toISOString() }, utm());
    (window.dataLayer = window.dataLayer || []).push({ event: 'lead_magnet', lead_magnet: '7-sinais', faturamento: fat });
    enviar(dados).then(function () {
      gravar(CONFIG.CHAVE, { nome: nome.split(' ')[0], em: dados.enviado_em });
      liberar(true);
    });
  });

  function liberar(rolar) {
    form.classList.add('liberado');
    lista.hidden = false;
    if (rolar) setTimeout(function () { lista.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' }); }, 250);
  }

  /* checklist: marcar, contar e mostrar o resultado */
  var marcados = ler(CONFIG.CHAVE + '_marcados') || [];
  var sns = doc.querySelectorAll('.sn'), segs = doc.querySelectorAll('.medidor i'), res = doc.getElementById('resultado');
  var cont = doc.getElementById('contador');
  function atualizar() {
    var n = marcados.length, f = FAIXAS.filter(function (x) { return n <= x.ate; })[0];
    sns.forEach(function (s) { var on = marcados.indexOf(+s.dataset.i) > -1; s.classList.toggle('marcado', on); s.querySelector('.sn-marca').setAttribute('aria-pressed', on); });
    doc.getElementById('r-num').textContent = n; doc.getElementById('c-num').textContent = n;
    doc.getElementById('r-nome').textContent = f.nome; doc.getElementById('r-txt').textContent = f.texto;
    res.dataset.cor = f.cor;
    segs.forEach(function (s, k) { s.classList.toggle('on', k < n); s.style.setProperty('--c', CORES[f.cor]); });
    doc.getElementById('r-diag').href = ${JSON.stringify(LM.diagnostico)} + '&sinais=' + n;
  }
  sns.forEach(function (s) {
    s.querySelector('.sn-marca').addEventListener('click', function () {
      var i = +s.dataset.i, k = marcados.indexOf(i);
      if (k > -1) marcados.splice(k, 1); else marcados.push(i);
      gravar(CONFIG.CHAVE + '_marcados', marcados); atualizar();
    });
  });
  atualizar();

  /* contador flutuante: aparece enquanto a lista de sinais está na tela */
  if ('IntersectionObserver' in window) {
    var lst = doc.querySelector('.sinais');
    new IntersectionObserver(function (es) { cont.classList.toggle('on', es[0].isIntersecting && !lista.hidden); }, { rootMargin: '-30% 0px -30% 0px' }).observe(lst);
  }

  /* quem já recebeu o checklist volta direto para ele */
  if (ler(CONFIG.CHAVE)) liberar(false);

  /* perguntas: abrem e fecham suave, uma por vez (igual ao site) */
  var acords = doc.querySelectorAll('details.acord');
  var fecharAcord = function (d) {
    var r = d.querySelector('.acord-r');
    if (!d.open) return;
    if (reduz || !r.animate) { d.open = false; return; }
    if (d.classList.contains('fechando')) return;
    d.classList.add('fechando');
    var h = r.offsetHeight, feito = false;
    var fim = function () { if (feito) return; feito = true; d.open = false; d.classList.remove('fechando'); };
    r.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.65,0,.35,1)' }).onfinish = fim;
    setTimeout(fim, 480);
  };
  acords.forEach(function (d) {
    var s = d.querySelector('summary'), r = d.querySelector('.acord-r');
    s.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (d.open && !d.classList.contains('fechando')) { fecharAcord(d); return; }
      if (d.classList.contains('fechando')) return;
      acords.forEach(function (o) { if (o !== d) fecharAcord(o); });
      d.open = true;
      if (reduz || !r.animate) return;
      var h2 = r.offsetHeight;
      r.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
  });

  /* proteção de conteúdo (padrão 2!H) */
  var cmp = function (el) { return el && el.closest && el.closest('input,textarea,select'); };
  var bloq = function (e) { if (!cmp(e.target) && !cmp(doc.activeElement)) e.preventDefault(); };
  doc.addEventListener('contextmenu', function (e) { if (!cmp(e.target)) e.preventDefault(); });
  doc.addEventListener('dragstart', function (e) { if (!cmp(e.target)) e.preventDefault(); });
  doc.addEventListener('copy', bloq); doc.addEventListener('cut', bloq);
  doc.addEventListener('keydown', function (e) { var k = (e.key || '').toLowerCase(); if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'u')) e.preventDefault(); });
})();
</script>
</body>
</html>
`;

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

writeFileSync(join(SAIDA, 'index.html'), pagina);
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
