/* Vivi Marques | Mapeamento de Perfil Comportamental
   Interações: topo com vidro, revelação, frases da identificação, bússola DISC,
   linha do "como funciona", vídeo, barra fixa no celular e rolagem suave da roda do mouse. */
(function () {
  "use strict";
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Topo */
  var top = $(".top"), hero = $(".hero"), mbar = $(".mbar");
  var ultimoY = window.scrollY;
  function aoRolar() {
    var y = window.scrollY, d = y - ultimoY;
    if (top) {
      top.classList.toggle("is-scrolled", y > 12);
      var passouHero = hero ? y > hero.offsetTop + hero.offsetHeight - 80 : y > 600;
      if (!passouHero || d < -3) top.classList.remove("is-hidden");
      else if (d > 3) top.classList.add("is-hidden");
      if (top.contains(document.activeElement)) top.classList.remove("is-hidden");
    }
    ultimoY = y;
    if (mbar && hero) {
      var fimHero = hero.offsetTop + hero.offsetHeight * 0.75;
      var perto = document.body.scrollHeight - (y + window.innerHeight) < 380;
      mbar.classList.toggle("is-on", y > fimHero && !perto);
    }
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  window.addEventListener("load", aoRolar);
  window.addEventListener("pageshow", aoRolar);
  aoRolar();

  /* Revelação */
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    $$(".rv, .steps").forEach(function (el) { io.observe(el); });
  } else {
    $$(".rv, .steps").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Frases da identificação */
  var pains = $$(".pain"), saida = $("[data-pains-out]");
  var textos = saida ? JSON.parse(saida.getAttribute("data-pains-out")) : null;
  function atualizaPains() {
    if (!saida) return;
    var n = pains.filter(function (p) { return p.getAttribute("aria-pressed") === "true"; }).length;
    var t = n === 0 ? textos[0] : n <= 2 ? textos[1] : textos[2];
    saida.innerHTML = t.replace("{n}", n).replace("{s}", n === 1 ? "" : "s");
  }
  pains.forEach(function (p) {
    p.addEventListener("click", function () {
      p.setAttribute("aria-pressed", p.getAttribute("aria-pressed") === "true" ? "false" : "true");
      atualizaPains();
    });
  });
  atualizaPains();

  /* Bússola DISC */
  var quads = $$(".disc__q"), painel = $(".disc__panel");
  function abre(q) {
    quads.forEach(function (o) { o.classList.toggle("is-on", o === q); o.setAttribute("aria-pressed", o === q ? "true" : "false"); });
    if (painel) {
      painel.querySelector("h3").textContent = q.getAttribute("data-t");
      painel.querySelector("p").textContent = q.getAttribute("data-d");
    }
  }
  quads.forEach(function (q) {
    q.addEventListener("click", function () { abre(q); });
    q.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abre(q); } });
    if (window.matchMedia("(hover: hover)").matches) q.addEventListener("mouseenter", function () { abre(q); });
  });

  /* Vídeo (VSL): quando houver link, colocar em data-video no botão */
  $$("[data-vsl]").forEach(function (b) {
    b.addEventListener("click", function () {
      var url = b.getAttribute("data-video");
      var box = b.closest(".vsl__player");
      if (!url) { b.querySelector("small").textContent = "Vídeo em breve"; return; }
      var f = document.createElement("iframe");
      f.src = url + (url.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true; f.title = b.getAttribute("aria-label") || "Vídeo";
      box.appendChild(f); b.remove();
    });
  });

  /* Links de checkout sem URL ainda: levam para a oferta */
  $$("[data-link^='checkout']").forEach(function (a) {
    if (a.getAttribute("href") === "#") a.setAttribute("href", "#investimento");
  });

  /* Rolagem suave da roda do mouse (solta ao arrastar a barra, clicar, usar teclado ou toque) */
  if (!reduz && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var alvo = window.scrollY, atual = window.scrollY, rodando = false, ativo = false;
    function max() { return document.documentElement.scrollHeight - window.innerHeight; }
    function passo() {
      atual += (alvo - atual) * 0.12;
      if (Math.abs(alvo - atual) < 0.6) { atual = alvo; rodando = false; }
      window.scrollTo(0, atual);
      if (rodando) requestAnimationFrame(passo); else ativo = false;
    }
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      var el = e.target.closest("iframe, textarea, [data-noscroll]");
      if (el) return;
      e.preventDefault();
      if (!ativo) { alvo = atual = window.scrollY; ativo = true; }
      var d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      alvo = Math.max(0, Math.min(max(), alvo + d));
      if (!rodando) { rodando = true; requestAnimationFrame(passo); }
    }, { passive: false });
    function solta() { rodando = false; ativo = false; alvo = atual = window.scrollY; }
    ["mousedown", "keydown", "touchstart"].forEach(function (ev) { window.addEventListener(ev, solta, { passive: true }); });
    window.addEventListener("scroll", function () { if (!rodando) { alvo = atual = window.scrollY; } }, { passive: true });
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute("href").length < 2) return;
      var t = document.querySelector(a.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      alvo = Math.min(max(), t.getBoundingClientRect().top + window.scrollY - 84);
      atual = window.scrollY; ativo = true;
      if (!rodando) { rodando = true; requestAnimationFrame(passo); }
    });
  }
})();

/* Ondinha de luz no clique dos botões em metal líquido */
document.addEventListener("pointerdown", function (e) {
  var b = e.target.closest(".btn:not(.btn--ghost)");
  if (!b || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var r = b.getBoundingClientRect(), s = document.createElement("span");
  s.className = "btn__ripple"; s.style.left = (e.clientX - r.left) + "px"; s.style.top = (e.clientY - r.top) + "px";
  b.appendChild(s); setTimeout(function () { s.remove(); }, 750);
});

/* Perguntas frequentes: abre e fecha devagar (altura + fade); abrir uma fecha a outra */
(function () {
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = 650, EASE = "cubic-bezier(.22,.61,.36,1)";
  function fechar(d) {
    var ans = d.querySelector(".ans"); if (!ans || d.dataset.anim) return;
    if (reduz) { d.open = false; return; }
    d.dataset.anim = 1; d.classList.add("is-closing");
    var a = ans.animate([{ height: ans.offsetHeight + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: DUR, easing: EASE });
    a.onfinish = function () { d.open = false; d.classList.remove("is-closing"); delete d.dataset.anim; };
  }
  function abrir(d) {
    var ans = d.querySelector(".ans"); if (!ans || d.dataset.anim) return;
    d.open = true; if (reduz) return;
    d.dataset.anim = 1;
    var h = ans.offsetHeight;
    var a = ans.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: DUR + 100, easing: EASE });
    a.onfinish = function () { delete d.dataset.anim; };
  }
  document.querySelectorAll(".faq details").forEach(function (d) {
    d.querySelector("summary").addEventListener("click", function (e) {
      e.preventDefault();
      if (d.open) { fechar(d); return; }
      document.querySelectorAll(".faq details[open]").forEach(function (o) { if (o !== d) fechar(o); });
      abrir(d);
    });
  });
})();
