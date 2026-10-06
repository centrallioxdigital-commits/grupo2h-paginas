// Página do lead magnet (grupo2h.com.br/7-sinais/), montada com os componentes do site:
// mesmo CSS e mesmo site.js (copiados para 7-sinais/assets/ pelo gerar.mjs), mesmas pílulas,
// botões, cartões em relevo, perguntas, divisórias e faixa final. Aqui só fica o que é
// próprio desta página: o relatório com a lupa, a pilha dos sinais, o formulário e o checklist.

import { esc, icon } from '../lib/core.mjs';
import { LM, SINAIS, FAIXAS } from './conteudo.mjs';

const n2 = (i) => String(i + 1).padStart(2, '0');
const waLink = (msg) => `https://api.whatsapp.com/send?phone=${LM.whatsapp}&text=${encodeURIComponent(msg)}`;
const WA = waLink('Olá! Baixei o checklist dos 7 sinais e quero conversar sobre a minha operação.');
const DIVISA = '<div class="divisa" aria-hidden="true"><span class="divisa-selo"><span class="divisa-moeda"><img src="assets/img/logo-2h-glyph.png" alt="" width="39" height="36"></span></span></div>';

/* ---------------------------------------------------------------- visual da abertura: relatório + lupa */
const linhasBonitas = [['Alcance', '128,4 mil', '+32%'], ['Impressões', '312 mil', '+18%'], ['Curtidas', '4.215', '+41%'], ['CPM', 'R$ 8,90', '−12%']];
const linhasReais = [['Vendas', '?', 'sem dado'], ['Faturamento', 'não informado', ''], ['Custo por cliente', '?', 'sem dado'], ['Rastreamento', 'não validado', '']];
const relatorio = `<figure class="rel" aria-label="Um relatório de agência cheio de números bonitos. A lupa revela o que falta: vendas, faturamento, custo por cliente e rastreamento.">
  <div class="rel-cab"><span class="rel-pontos"><i></i><i></i><i></i></span><b>Relatório do mês</b><span class="rel-ag">Agência</span></div>
  <div class="rel-corpo">
    <div class="rel-camada">${linhasBonitas.map(([a, b, c]) => `<div class="rel-l"><span>${a}</span><b>${b}</b><em class="sobe">${c}</em></div>`).join('')}
      <div class="rel-selo">${icon('seal-check')} Tudo no verde</div></div>
    <div class="rel-camada rel-real" aria-hidden="true">${linhasReais.map(([a, b, c]) => `<div class="rel-l"><span>${a}</span><b>${b}</b><em>${c}</em></div>`).join('')}
      <div class="rel-selo rel-selo-real">${icon('eye-slash')} Faltam os números</div></div>
    <span class="lupa" aria-hidden="true"><i></i></span>
  </div>
  <span class="chip-flutua lm-ch1">${icon('gift')} Checklist grátis</span>
  <span class="chip-flutua lm-ch2">${icon('clock')} 3 minutos</span>
</figure>`;

const travados = SINAIS.map((s, i) => `<li style="--n:${i}"><span class="tv-n">${n2(i)}</span><span class="tv-t">${esc(s.titulo)}</span>${icon('lock-simple', { cls: 'ic tv-ic' })}</li>`).join('');

const cartoes = SINAIS.map((s, i) => `<li class="sn" data-i="${i}">
  <div class="sn-cab"><span class="sn-ic">${icon(s.icone)}</span><span class="etq">Sinal ${n2(i)}</span></div>
  <h3>${esc(s.titulo)}</h3>
  <div class="sn-grade">
    <div><p class="sn-r sn-r-x">${icon('eye')} Como perceber</p><p>${esc(s.perceber)}</p></div>
    <div><p class="sn-r sn-r-ok">${icon('check')} O que deveria acontecer</p><p>${esc(s.deveria)}</p></div>
  </div>
  <div class="sn-perg"><p class="sn-r">Pergunte à sua agência</p><p>“${esc(s.pergunta)}”</p></div>
  <button type="button" class="sn-marca" aria-pressed="false"><span class="sn-caixa">${icon('check')}</span><span>Isso acontece comigo</span></button>
</li>`).join('');

const faq = [
  ['É gratuito mesmo?', 'Sim. Você preenche o formulário e o checklist abre na hora, com o PDF para baixar.'],
  ['Serve para quem não tem agência?', 'Serve. Os mesmos sinais valem para gestor de tráfego, freelancer ou para quem faz o próprio marketing.'],
  ['Vou receber spam?', 'Não. A 2!H pode te chamar no WhatsApp uma vez para saber se o material ajudou. Você pode pedir para não receber mais contato quando quiser.'],
  ['O que acontece depois de marcar os sinais?', 'Você vê a sua faixa (verde, amarela ou vermelha) e, se quiser, faz o diagnóstico gratuito da 2!H com os números reais da sua operação.'],
];

/* ---------------------------------------------------------------- CSS só desta página (com as variáveis do site) */
const CSS_PAGINA = `
@property --lx{syntax:'<percentage>';inherits:true;initial-value:30%}
@property --ly{syntax:'<percentage>';inherits:true;initial-value:30%}
.lm-topo-cta{margin-left:auto}
@media (max-width:960px){.topo .lm-topo-cta{display:inline-flex}}
@media (max-width:420px){.topo .lm-topo-cta .lbl-l{display:none}}
@media (min-width:421px){.topo .lm-topo-cta .lbl-c{display:none}}

/* relatório com a lupa */
.rel{position:relative;margin:0;text-align:left;border-radius:28px;border:1px solid rgba(242,238,229,.1);background:var(--rel-face),var(--bg-2);box-shadow:var(--rel-sombra),0 0 0 8px rgba(242,238,229,.025)}
.rel-cab{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--line);font:600 .95rem/1 var(--f-d)}
.rel-pontos{display:flex;gap:6px}.rel-pontos i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.14)}
.rel-ag{margin-left:auto;font:600 .7rem/1 var(--f-b);letter-spacing:.14em;text-transform:uppercase;color:var(--tx-3)}
.rel-corpo{position:relative;--lx:30%;--ly:30%;animation:lupa 11s var(--ease-mola) infinite}
@keyframes lupa{0%,100%{--lx:28%;--ly:18%}22%{--lx:70%;--ly:30%}45%{--lx:62%;--ly:62%}68%{--lx:30%;--ly:52%}85%{--lx:55%;--ly:86%}}
.rel-camada{padding:10px 20px 20px}
.rel-l{display:grid;grid-template-columns:minmax(0,1fr) auto 64px;align-items:center;gap:12px;padding:15px 0;border-bottom:1px solid var(--line)}
.rel-l span{color:var(--tx-2);font-size:.95rem}
.rel-l b{font:600 1.08rem/1 var(--f-d);text-align:right}
.rel-l em{font:600 .78rem/1 var(--f-b);font-style:normal;text-align:right;color:var(--tx-3)}
.rel-l em.sobe{color:var(--verde)}
.rel-selo{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:8px 13px;border-radius:999px;font:600 .82rem/1 var(--f-b);color:var(--verde);background:rgba(127,209,163,.1);border:1px solid rgba(127,209,163,.25)}
.rel-selo .ic{width:16px;height:16px}
.rel-real{position:absolute;inset:0;background:radial-gradient(circle at var(--lx) var(--ly),#221d0d,#14130f 60%);
  -webkit-mask-image:radial-gradient(circle 74px at var(--lx) var(--ly),#000 97%,transparent 100%);mask-image:radial-gradient(circle 74px at var(--lx) var(--ly),#000 97%,transparent 100%)}
.rel-real .rel-l b{color:var(--ouro-2)}
.rel-real .rel-l em{color:var(--vermelho)}
.rel-selo-real{color:var(--vermelho);background:rgba(240,140,122,.1);border-color:rgba(240,140,122,.3)}
.lupa{position:absolute;left:var(--lx);top:var(--ly);width:148px;height:148px;translate:-50% -50%;border-radius:50%;pointer-events:none;
  box-shadow:0 0 0 3px var(--ouro),0 0 0 7px rgba(23,19,10,.85),0 0 0 8px var(--ouro-a40),0 20px 40px -10px rgba(0,0,0,.9),inset 0 0 30px rgba(245,195,40,.25)}
.lupa::before{content:'';position:absolute;inset:10px;border-radius:50%;background:radial-gradient(60% 40% at 32% 22%,rgba(255,255,255,.22),transparent 70%)}
.lupa i{position:absolute;left:84%;top:84%;width:62px;height:16px;border-radius:9px;rotate:45deg;transform-origin:0 50%;background:linear-gradient(180deg,#FFE490,#C8920E);box-shadow:0 8px 16px -6px rgba(0,0,0,.8)}
.rel .chip-flutua.lm-ch1{left:18px;top:-36px}
.rel .chip-flutua.lm-ch2{right:-18px;bottom:16%}
.rel .chip-flutua .ic{width:28px;height:28px;padding:6px;border-radius:50%;color:var(--ouro-tinta);background:linear-gradient(180deg,#FFE490,#F7C93A 45%,#E2AA14)}

/* captura: pilha dos sinais + formulário */
.lm-cap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.92fr);gap:clamp(28px,4vw,64px);align-items:start}
.travados{list-style:none;margin:34px 0 0;padding:0;display:grid;gap:12px}
.travados li{display:grid;grid-template-columns:52px minmax(0,1fr) 22px;align-items:center;gap:16px;padding:16px 18px;border-radius:var(--r-lg);
  border:1px solid rgba(242,238,229,.07);background:var(--rel-face),var(--bg-1);box-shadow:var(--rel-sombra);transition:box-shadow .6s var(--ease-mola),border-color .5s,transform .6s var(--ease-mola)}
.travados li:hover{border-color:rgba(245,195,40,.28);box-shadow:var(--rel-sombra-hover);transform:translateY(-3px)}
.tv-n{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font:600 1rem/1 var(--f-d);color:var(--ouro);
  background:radial-gradient(120% 120% at 30% 15%,rgba(255,255,255,.14),transparent 55%),linear-gradient(160deg,#28282E,#121216);box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -2px 4px rgba(0,0,0,.65),0 8px 18px -8px rgba(0,0,0,.95),0 0 0 1px rgba(245,195,40,.22)}
.tv-t{font:600 1.04rem/1.3 var(--f-d);color:var(--tx)}
.tv-ic{width:20px;height:20px;color:var(--tx-3)}
.lm-form{position:sticky;top:96px;padding:clamp(24px,3vw,34px);border-radius:28px;border:1px solid rgba(245,195,40,.3);
  background:radial-gradient(120% 80% at 0% 0%,rgba(245,195,40,.13),transparent 55%),var(--rel-face),var(--bg-1);box-shadow:var(--rel-sombra-hover)}
.lm-form h3{font-size:var(--fs-h3);line-height:1.15}
.form-sub{margin-top:8px;color:var(--tx-2);font-size:.96rem}
.campos{display:grid;gap:14px;margin-top:22px}
.campo label,.campo legend{display:block;margin-bottom:8px;padding:0;font:600 .88rem/1.3 var(--f-d);color:var(--tx)}
.campo input:not([type=checkbox]):not([type=radio]),.campo select{width:100%;height:52px;padding:0 16px;border-radius:14px;background:var(--bg-2);border:1px solid var(--line-2);color:var(--tx);font:inherit;font-size:1rem;outline:none;
  box-shadow:inset 0 1px 2px rgba(0,0,0,.45);transition:border-color .3s,box-shadow .3s;-webkit-appearance:none;appearance:none}
.campo select{background-image:linear-gradient(45deg,transparent 50%,var(--ouro) 50%),linear-gradient(135deg,var(--ouro) 50%,transparent 50%);background-position:calc(100% - 22px) 23px,calc(100% - 16px) 23px;background-size:6px 6px;background-repeat:no-repeat}
.campo select option{background:var(--bg-2);color:var(--tx)}
.campo input::placeholder{color:var(--tx-4)}
.campo input:focus,.campo select:focus{border-color:var(--ouro);box-shadow:0 0 0 4px var(--ouro-a12)}
.campo .msg{display:none;margin-top:6px;font-size:.8rem;color:var(--vermelho)}
.campo.erro .msg{display:block}
.campo.erro input,.campo.erro select{border-color:var(--vermelho)!important;box-shadow:0 0 0 4px rgba(240,140,122,.12)!important}
fieldset.campo{border:0;margin:0;padding:0;min-width:0}
.ops{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.op{position:relative;cursor:pointer}
.op input{position:absolute;inset:0;opacity:0;cursor:pointer}
.op span{display:flex;align-items:center;justify-content:center;min-height:48px;padding:8px 10px;text-align:center;border-radius:999px;font:600 .86rem/1.2 var(--f-d);color:var(--tx);
  border:1px solid rgba(242,238,229,.12);background:var(--rel-face),var(--bg-2);box-shadow:var(--rel-sombra);transition:all .45s var(--ease-mola)}
.op:hover span{border-color:rgba(245,195,40,.35)}
.op input:checked+span{color:var(--ouro-tinta);border-color:transparent;background:linear-gradient(180deg,#FFE490,#F7C93A 45%,#E2AA14);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -2px 0 rgba(140,95,0,.35),0 10px 24px -10px rgba(245,195,40,.7)}
.op input:focus-visible+span{outline:2px solid var(--ouro);outline-offset:3px}
.campo.erro .op span{border-color:rgba(240,140,122,.5)}
.lgpd{display:flex!important;gap:12px;align-items:flex-start;margin:0!important;font:400 .82rem/1.45 var(--f-b)!important;color:var(--tx-3)!important;cursor:pointer}
.lgpd input{flex:none;width:20px;height:20px;margin:1px 0 0;accent-color:#F5C328}
.lgpd a{color:var(--ouro-2)}
.lm-form .btn{width:100%;margin-top:8px}
.form-seg{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;font-size:.8rem;color:var(--tx-3)}
.form-seg .ic{width:16px;height:16px;color:var(--ouro)}
.lm-form.enviando .btn{opacity:.7;pointer-events:none}
.form-ok{display:none;text-align:center;padding:10px 0}
.form-ok>.ic{width:58px;height:58px;margin:0 auto 14px;padding:14px;border-radius:50%;color:var(--ouro-tinta);background:linear-gradient(180deg,#FFE490,#F7C93A 45%,#E2AA14);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 14px 30px -12px rgba(245,195,40,.7)}
.form-ok .btn{margin-top:18px}
.liberado .form-campos{display:none}
.liberado .form-ok{display:block}
.liberado~* .tv-ic,.lm-cap.liberou .tv-ic{color:var(--ouro)}

/* checklist liberado */
#checklist[hidden]{display:none}
.sec-check{overflow:visible}
.sec-check>.divisa{position:absolute;left:0;right:0;top:0}
.sinais{list-style:none;margin:0;padding:0;display:grid;gap:16px}
.sn{padding:clamp(22px,3vw,32px);border-radius:26px;border:1px solid rgba(242,238,229,.07);background:var(--rel-face),var(--bg-1);box-shadow:var(--rel-sombra);transition:box-shadow .6s var(--ease-mola),border-color .5s,background .5s}
.sn:hover{border-color:rgba(245,195,40,.22);box-shadow:var(--rel-sombra-hover)}
.sn-cab{display:flex;align-items:center;gap:14px}
.sn-cab .etq{margin:0}
.sn-ic{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;color:var(--ouro);
  background:radial-gradient(120% 120% at 30% 15%,rgba(255,255,255,.14),transparent 55%),linear-gradient(160deg,#28282E,#121216);box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -2px 4px rgba(0,0,0,.65),0 8px 18px -8px rgba(0,0,0,.95),0 0 0 1px rgba(245,195,40,.22)}
.sn-ic .ic{width:24px;height:24px}
.sn h3{margin-top:18px;font-size:var(--fs-h3);line-height:1.2}
.sn-grade{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
.sn-grade>div,.sn-perg{padding:16px 18px;border-radius:18px;background:var(--bg-2);border:1px solid var(--line);box-shadow:inset 0 1px 2px rgba(0,0,0,.4)}
.sn-grade p:not(.sn-r){color:var(--tx-2);font-size:.96rem;line-height:1.6}
.sn-r{display:flex;align-items:center;gap:7px;margin-bottom:8px;font:600 .72rem/1 var(--f-b);letter-spacing:.14em;text-transform:uppercase}
.sn-r .ic{width:15px;height:15px}
.sn-r-x{color:var(--vermelho)}.sn-r-ok{color:var(--verde)}
.sn-perg{margin-top:12px;border-color:transparent;background:radial-gradient(120% 120% at 0% 0%,rgba(255,255,255,.45),transparent 45%),linear-gradient(180deg,#FFE48F 0%,#F7C833 55%,#E6AF17 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -2px 0 rgba(140,95,0,.25),0 18px 34px -16px rgba(245,195,40,.55)}
.sn-perg .sn-r{color:rgba(23,19,10,.7)}
.sn-perg p:not(.sn-r){color:var(--ouro-tinta);font:600 1.04rem/1.45 var(--f-d)}
.sn-marca{display:flex;align-items:center;gap:12px;width:100%;margin-top:16px;padding:10px 16px 10px 10px;min-height:56px;border-radius:999px;cursor:pointer;
  border:1px solid rgba(242,238,229,.12);background:var(--rel-face),var(--bg-2);box-shadow:var(--rel-sombra);font:600 .98rem/1 var(--f-d);color:var(--tx-2);transition:all .45s var(--ease-mola)}
.sn-marca:hover{border-color:rgba(240,140,122,.45);color:var(--tx)}
.sn-marca:focus-visible{outline:2px solid var(--ouro);outline-offset:3px}
.sn-caixa{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:transparent;
  background:radial-gradient(120% 120% at 30% 15%,rgba(255,255,255,.14),transparent 55%),linear-gradient(160deg,#28282E,#121216);box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 0 0 1px rgba(242,238,229,.14);transition:all .45s var(--ease-mola)}
.sn-caixa .ic{width:18px;height:18px}
.sn.marcado{border-color:rgba(240,140,122,.45);background:radial-gradient(120% 80% at 100% 0%,rgba(240,140,122,.1),transparent 55%),var(--rel-face),var(--bg-1)}
.sn.marcado .sn-marca{color:#fff;border-color:rgba(240,140,122,.55);background:rgba(240,140,122,.12)}
.sn.marcado .sn-caixa{color:#fff;background:linear-gradient(180deg,#F6A492,#E06B55);box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 8px 18px -8px rgba(224,107,85,.8)}

/* resultado */
.res{margin-top:28px;padding:clamp(24px,3.4vw,40px);border-radius:28px;border:1px solid rgba(245,195,40,.3);background:radial-gradient(120% 90% at 0% 0%,rgba(245,195,40,.13),transparent 55%),var(--rel-face),var(--bg-1);box-shadow:var(--rel-sombra-hover)}
.res-topo{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px}
.res-num{font:600 clamp(3rem,2rem + 3vw,4.4rem)/1 var(--f-d);letter-spacing:-.04em}
.res-num small{font-size:.38em;color:var(--tx-3);letter-spacing:0}
.res-faixa{display:inline-flex;align-items:center;gap:10px;padding:9px 16px 9px 12px;border-radius:999px;font:600 .92rem/1 var(--f-b);border:1px solid}
.res-faixa i{width:9px;height:9px;border-radius:50%;background:currentColor;box-shadow:0 0 0 3px color-mix(in srgb,currentColor 18%,transparent),0 0 10px currentColor}
.res[data-cor=verde] .res-faixa{color:var(--verde);background:rgba(127,209,163,.1)}
.res[data-cor=amarelo] .res-faixa{color:var(--ouro);background:var(--ouro-a06)}
.res[data-cor=vermelho] .res-faixa{color:var(--vermelho);background:rgba(240,140,122,.1)}
.medidor{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:22px}
.medidor i{height:10px;border-radius:6px;background:rgba(255,255,255,.08);box-shadow:inset 0 1px 2px rgba(0,0,0,.6);transition:background .5s var(--ease-mola),box-shadow .5s}
.medidor i.on{background:var(--c,#F5C328);box-shadow:0 0 12px var(--c,#F5C328)}
.res-txt{margin-top:18px;max-width:60ch;color:var(--tx-2);font-size:1.05rem}
.res-acoes{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.contador{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));translate:-50% 140%;z-index:30;display:flex;align-items:center;gap:10px;padding:8px 16px 8px 8px;border-radius:999px;white-space:nowrap;
  font:600 .9rem/1 var(--f-d);background:rgba(14,14,17,.86);border:1px solid rgba(245,195,40,.35);box-shadow:0 20px 40px -18px rgba(0,0,0,.9);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:translate .6s var(--ease-mola)}
.contador .ic{width:28px;height:28px;padding:6px;border-radius:50%;color:var(--ouro-tinta);background:linear-gradient(180deg,#FFE490,#F7C93A 45%,#E2AA14)}
.contador b{color:var(--ouro)}
.contador.on{translate:-50% 0}

.pilares-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.pilares-3 .pilar:first-child{grid-row:auto;min-height:0;justify-content:flex-start}
.pilares-3 .pilar h3{font-size:1.3rem!important;margin-top:18px}
.pilares-3 .pilar p{max-width:none}
.lm-rod{padding:32px 0 calc(32px + env(safe-area-inset-bottom))}
.lm-rod .rod2-base{margin-top:0}

@media (max-width:1024px){
  .lm-cap{grid-template-columns:1fr}
  .lm-form{position:relative;top:auto}
  .pilares-3{grid-template-columns:1fr}
  /* celular e tablet: os 7 sinais empilham ao rolar até chegar no formulário */
  .travados{display:block;padding-bottom:6px}
  .travados li{position:sticky;top:calc(84px + var(--n) * 10px);margin-bottom:14px;min-height:108px;padding:20px 18px;
    background:radial-gradient(120% 120% at 0% 0%,rgba(245,195,40,.1),transparent 55%),var(--rel-face),var(--bg-2);border-top-color:rgba(245,195,40,.35);
    box-shadow:0 -14px 34px -14px rgba(0,0,0,.95),var(--rel-sombra);transform-origin:50% 0;transform:scale(calc(1 - var(--c,0) * .06))}
  .travados li::after{content:'';position:absolute;inset:-1px;border-radius:inherit;background:#050507;opacity:calc(var(--c,0) * .45);pointer-events:none}
  .travados li:last-child{margin-bottom:0}
  .travados li:hover{transform:scale(calc(1 - var(--c,0) * .06))}
  .tv-ic{color:var(--ouro)}
}
@media (max-width:760px){
  .rel .chip-flutua.lm-ch1{left:auto;right:-6px;top:auto;bottom:-22px}
  .rel .chip-flutua.lm-ch2{right:-6px;top:58px;bottom:auto}
  .rel-l{grid-template-columns:minmax(0,1fr) auto 56px;padding:13px 0}
  .lupa{width:118px;height:118px}
  .rel-real{-webkit-mask-image:radial-gradient(circle 59px at var(--lx) var(--ly),#000 97%,transparent 100%);mask-image:radial-gradient(circle 59px at var(--lx) var(--ly),#000 97%,transparent 100%)}
  .sn-grade{grid-template-columns:1fr}
  .res-acoes .btn{width:100%}
  .lm-cap .travados,.lm-form,.sinais,.res{text-align:left}
}
@media (max-width:380px){.ops{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){
  .rel-corpo{animation:none;--lx:62%;--ly:30%}
  .travados li{position:relative;top:auto;transform:none;filter:none}
}`;

export function paginaHTML({ versao, cssApp }) {
  const css = `<style>${cssApp}</style>`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${LM.gtm}');</script>
<script>document.documentElement.classList.add('js')</script>
<title>7 sinais de que sua agência não é transparente com você · Grupo 2!H</title>
<meta name="description" content="${esc(LM.sub)}">
<link rel="canonical" href="https://grupo2h.com.br/${LM.slug}/">
<meta property="og:type" content="website">
<meta property="og:title" content="7 sinais de que sua agência não é transparente com você">
<meta property="og:description" content="${esc(LM.sub)}">
<meta property="og:url" content="https://grupo2h.com.br/${LM.slug}/">
<meta name="theme-color" content="#0B0B0D">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="preload" href="assets/fonts/general-sans-600.woff2" as="font" type="font/woff2" crossorigin>
${css}
<style>${CSS_PAGINA}</style>
</head>
<body data-protegido>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${LM.gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<a class="pular" href="#receber">Pular para o formulário</a>
<header class="topo" data-topo>
  <div class="topo-in">
    <a class="marca" href="/" aria-label="Grupo 2!H"><img src="assets/img/logo-2h-glyph.png" alt="" width="39" height="36"><span>GRUPO <b>2!H</b></span></a>
    <a class="btn btn-ouro btn-sm lm-topo-cta" href="#receber"><span class="lbl-l">Quero o checklist</span><span class="lbl-c">Checklist</span> ${icon('arrow-down')}</a>
  </div>
</header>
<main id="conteudo">

<section class="capa com-visual">
  <div class="capa-topo" aria-hidden="true"></div>
  <div class="wrap">
    <div class="capa-texto">
      <p class="hero-selo"><b>Checklist gratuito</b> 7 sinais em 3 minutos</p>
      <h1 class="capa-h1">${esc(LM.titulo1)} <span class="ouro">${esc(LM.titulo2)}</span></h1>
      <p class="capa-lead">${esc(LM.sub)}</p>
      <div class="capa-acoes">
        <a class="btn btn-ouro btn-lg" href="#receber">Quero o checklist grátis ${icon('arrow-down')}</a>
        <a class="btn-link" href="#receber">${icon('download-simple')} Abre na hora, com PDF</a>
      </div>
    </div>
    <div class="capa-visual">${relatorio}</div>
  </div>
</section>
${DIVISA}
<section class="sec" id="receber">
  <div class="wrap lm-cap">
    <div>
      <div data-revela>
        <p class="etq">O que tem no checklist</p>
        <h2 class="h2">Os 7 sinais, cada um com <span class="ouro">a pergunta certa a fazer.</span></h2>
        <p class="lead">Para cada sinal: como perceber, o que deveria acontecer numa relação transparente e a pergunta para levar à próxima reunião com a sua agência.</p>
      </div>
      <ol class="travados">${travados}</ol>
    </div>
    <form class="lm-form" id="form" novalidate>
      <div class="form-campos">
        <p class="etq">Grátis · abre na hora</p>
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
        <button class="btn btn-ouro btn-lg" type="submit"><span class="bt-txt">Liberar o checklist</span> ${icon('lock-simple-open')}</button>
        <p class="form-seg">${icon('shield-check')} Seus dados ficam só com a 2!H.</p>
      </div>
      <div class="form-ok" aria-live="polite">${icon('check')}<h3>Checklist liberado.</h3><p class="form-sub">Role para baixo e marque os sinais que acontecem com você.</p>
        <a class="btn btn-linha" href="#checklist">Ir para o checklist ${icon('arrow-down')}</a></div>
    </form>
  </div>
</section>

<section class="sec sec-check" id="checklist" hidden>
  ${DIVISA}
  <div class="wrap">
    <div class="sec-cab">
      <p class="etq">Checklist liberado</p>
      <h2 class="h2">Marque os sinais que <span class="ouro">acontecem com você.</span></h2>
      <p class="lead">Seja honesto: ninguém mais vê as suas respostas. No final aparece o que elas dizem sobre a sua operação.</p>
    </div>
    <ol class="sinais">${cartoes}</ol>
    <div class="res" id="resultado" data-cor="verde" aria-live="polite">
      <div class="res-topo"><p class="res-num"><span id="r-num">0</span><small> de 7 sinais</small></p><p class="res-faixa"><i></i><span id="r-nome">${esc(FAIXAS[0].nome)}</span></p></div>
      <div class="medidor" aria-hidden="true">${'<i></i>'.repeat(7)}</div>
      <p class="res-txt" id="r-txt">${esc(FAIXAS[0].texto)}</p>
      <div class="res-acoes">
        <a class="btn btn-ouro btn-lg" id="r-diag" href="${LM.diagnostico}">Fazer o diagnóstico gratuito ${icon('arrow-right')}</a>
        <a class="btn btn-linha btn-lg" href="${LM.pdf}" download>Baixar o PDF ${icon('download-simple')}</a>
        <a class="btn-link" href="${WA}" target="_blank" rel="noopener">${icon('whatsapp-logo')} Falar no WhatsApp</a>
      </div>
    </div>
  </div>
</section>
${DIVISA}
<section class="sec">
  <div class="wrap">
    <div class="sec-cab" data-revela>
      <p class="etq">Por que a 2!H fez este checklist</p>
      <h2 class="h2">Aqui você vê os números, <span class="ouro">não a promessa.</span></h2>
      <p class="lead">A maioria das empresas que chega até a 2!H já se queimou com agência. Não só por falta de resultado: por falta de transparência. Por isso trabalhamos assim:</p>
    </div>
    <div class="pilares pilares-3" data-revela-filhos>
      <div class="pilar">${icon('eye')}<h3>Conta aberta</h3><p>As contas são da sua empresa e você acompanha os números reais, quando quiser.</p></div>
      <div class="pilar">${icon('crosshair')}<h3>Rastreamento validado</h3><p>Pixel, API de conversões e UTMs testados de ponta a ponta antes de escalar.</p></div>
      <div class="pilar">${icon('chart-line-up')}<h3>Decisão com número</h3><p>O relatório vai até a venda e o caixa. Cada decisão tem dado por trás.</p></div>
    </div>
  </div>
</section>
${DIVISA}
<section class="sec">
  <div class="wrap dois">
    <div data-revela><p class="etq">Perguntas</p><h2 class="h2">Antes de você <span class="ouro">perguntar.</span></h2><p class="lead">O que mais perguntam antes de baixar.</p></div>
    <div data-revela>${faq.map(([q, a]) => `<details class="acord"><summary>${esc(q)}${icon('plus')}</summary><div class="acord-r"><p>${esc(a)}</p></div></details>`).join('')}</div>
  </div>
</section>

<section class="cta-final">
  <div class="cta-foto" aria-hidden="true"><img src="assets/img/fotos/aperto-de-mao.webp" srcset="assets/img/fotos/aperto-de-mao-800.webp 800w, assets/img/fotos/aperto-de-mao.webp 1600w" sizes="100vw" alt="" loading="lazy"></div>
  <div class="cta-topo" aria-hidden="true"></div>
  <div class="wrap cta-in" data-revela>
    <h2 class="cta-h2">Veja em 3 minutos o que o seu relatório não mostra.</h2>
    <p class="cta-p">Receba o checklist grátis, marque os sinais e descubra se você está vendo os números reais da sua empresa.</p>
    <div class="cta-acoes">
      <a class="btn btn-ouro btn-lg" href="#receber"><span class="lbl-l">Quero o checklist grátis</span><span class="lbl-c">Quero o checklist</span> ${icon('arrow-up')}</a>
      <a class="btn-link" href="${WA}" target="_blank" rel="noopener">${icon('whatsapp-logo')} Prefiro falar no WhatsApp</a>
    </div>
  </div>
</section>
</main>

<p class="contador" id="contador" aria-hidden="true">${icon('check')} <b id="c-num">0</b> de 7 sinais marcados</p>

<footer class="rodape rod2 lm-rod"><div class="wrap"><div class="rod2-base">
  <p>© ${new Date().getFullYear()} Grupo 2!H. Todos os direitos reservados.</p>
  <a href="${LM.privacidade}">Política de privacidade</a>
</div></div></footer>

<script src="assets/js/site.js?v=${versao}" defer></script>
<script>
(function () {
  var CONFIG = { WEBHOOK_URL: ${JSON.stringify(LM.webhook)}, CHAVE: '2h_7sinais' };
  var FAIXAS = ${JSON.stringify(FAIXAS)};
  var CORES = { verde: '#7FD1A3', amarelo: '#F5C328', vermelho: '#F08C7A' };
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document, form = doc.getElementById('form'), lista = doc.getElementById('checklist');
  var ler = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  var gravar = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* máscara do WhatsApp */
  var wa = doc.getElementById('f-wa');
  wa.addEventListener('input', function () {
    var d = wa.value.replace(/\\D/g, '').replace(/^55(?=\\d{10,11}$)/, '').slice(0, 11);
    wa.value = d.length > 10 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7) : d.length > 6 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6) : d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d.length ? '(' + d : '';
  });

  function campo(nome, ok) { var c = form.querySelector('[data-campo="' + nome + '"]'); c.classList.toggle('erro', !ok); return ok; }
  ['change', 'input'].forEach(function (t) { form.addEventListener(t, function (e) { var c = e.target.closest('.campo'); if (c) c.classList.remove('erro'); }); });

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
    enviar(dados).then(function () { gravar(CONFIG.CHAVE, { nome: nome.split(' ')[0], em: dados.enviado_em }); liberar(true); });
  });

  function liberar(rolar) {
    form.classList.add('liberado');
    form.closest('.lm-cap').classList.add('liberou');
    lista.hidden = false;
    if (rolar) setTimeout(function () { lista.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' }); }, 250);
  }

  /* checklist: marcar, contar e mostrar o resultado */
  var marcados = ler(CONFIG.CHAVE + '_marcados') || [];
  var sns = doc.querySelectorAll('.sn'), segs = doc.querySelectorAll('.medidor i'), res = doc.getElementById('resultado'), cont = doc.getElementById('contador');
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
    new IntersectionObserver(function (es) { cont.classList.toggle('on', es[0].isIntersecting && !lista.hidden); }, { rootMargin: '-30% 0px -30% 0px' }).observe(doc.querySelector('.sinais'));
  }

  /* pilha dos 7 sinais no celular: o cartão coberto pelo próximo encolhe e escurece */
  var tvs = Array.prototype.slice.call(doc.querySelectorAll('.travados li')), mqP = window.matchMedia('(max-width: 1024px)'), pedido = false;
  function cobrir() {
    pedido = false;
    tvs.forEach(function (c, k) {
      var prox = tvs[k + 1];
      if (!mqP.matches || reduz || !prox) { c.style.removeProperty('--c'); return; }
      var a = c.getBoundingClientRect(), b = prox.getBoundingClientRect(), h = c.offsetHeight;
      c.style.setProperty('--c', Math.max(0, Math.min(1, (a.top + h - b.top) / h)).toFixed(3));
    });
  }
  window.addEventListener('scroll', function () { if (!pedido) { pedido = true; requestAnimationFrame(cobrir); } }, { passive: true });
  window.addEventListener('resize', cobrir); cobrir();

  /* quem já recebeu o checklist volta direto para ele */
  if (ler(CONFIG.CHAVE)) liberar(false);
})();
</script>
</body>
</html>
`;
}
