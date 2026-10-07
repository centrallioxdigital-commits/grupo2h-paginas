/* Site principal Grupo 2!H. Sem framework, sem ouvinte de scroll:
   tudo que depende de rolagem usa IntersectionObserver. */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement, body = doc.body;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temIO = 'IntersectionObserver' in window;

  /* ---------- cabeçalho sólido depois do topo ---------- */
  var topo = doc.querySelector('[data-topo]');
  if (topo && temIO) {
    var sentinela = doc.createElement('div');
    sentinela.setAttribute('aria-hidden', 'true');
    sentinela.style.cssText = 'position:absolute;top:0;left:0;height:24px;width:1px;pointer-events:none';
    body.prepend(sentinela);
    new IntersectionObserver(function (e) { topo.classList.toggle('solido', !e[0].isIntersecting); }).observe(sentinela);
  }

  /* ---------- menu Soluções: abre e fecha só no clique ---------- */
  doc.querySelectorAll('.nav-mega').forEach(function (li) {
    var a = li.querySelector('a');
    var abrir = function (sim) { li.classList.toggle('aberto', sim); a.setAttribute('aria-expanded', sim ? 'true' : 'false'); if (sim && topo) topo.classList.remove('escondido'); };
    a.setAttribute('role', 'button');
    a.addEventListener('click', function (ev) { ev.preventDefault(); abrir(!li.classList.contains('aberto')); });
    a.addEventListener('keydown', function (ev) {
      if (ev.key === ' ') { ev.preventDefault(); abrir(!li.classList.contains('aberto')); }
      if (ev.key === 'ArrowDown') { ev.preventDefault(); abrir(true); var p = li.querySelector('.mega a'); if (p) p.focus(); }
    });
    doc.addEventListener('click', function (ev) { if (!li.contains(ev.target)) abrir(false); });
    doc.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && li.classList.contains('aberto')) { abrir(false); a.focus(); } });
    li.addEventListener('focusout', function (ev) { if (ev.relatedTarget && !li.contains(ev.relatedTarget)) abrir(false); });
    window.addEventListener('scroll', function () { if (li.classList.contains('aberto') && window.scrollY > 400) abrir(false); }, { passive: true });
  });

  /* ---------- menu do celular ---------- */
  var mBtn = doc.querySelector('[data-menu-btn]'), menu = doc.querySelector('[data-menu]');
  if (mBtn && menu) {
    /* abre e fecha com animação (estilo Apple): o painel só some depois que a transição de saída termina */
    var tFecha;
    var fechar = function () {
      if (menu.hidden || !menu.classList.contains('aberto')) return;
      menu.classList.remove('aberto'); menu.classList.add('saindo');
      mBtn.setAttribute('aria-expanded', 'false'); body.style.overflow = ''; if (topo) topo.classList.remove('menu-aberto');
      clearTimeout(tFecha);
      tFecha = setTimeout(function () { menu.hidden = true; menu.classList.remove('saindo'); }, reduz ? 0 : 620);
    };
    var abrirMenu = function () {
      clearTimeout(tFecha);
      menu.classList.remove('saindo'); menu.hidden = false;
      void menu.offsetWidth;
      menu.classList.add('aberto');
      mBtn.setAttribute('aria-expanded', 'true'); body.style.overflow = 'hidden';
      if (topo) { topo.classList.add('menu-aberto'); topo.classList.remove('escondido'); }
    };
    mBtn.addEventListener('click', function () { if (menu.classList.contains('aberto')) fechar(); else abrirMenu(); });
    menu.querySelector('.mm-fundo').addEventListener('click', fechar);
    menu.addEventListener('click', function (ev) { if (ev.target.closest('a')) fechar(); });
    doc.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && menu.classList.contains('aberto')) { fechar(); mBtn.focus(); } });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) fechar(); });
  }

  /* ---------- rodapé: no celular as colunas viram sanfonas fechadas; no computador ficam sempre abertas ---------- */
  var gruposR = doc.querySelectorAll('.rod-grupo');
  if (gruposR.length) {
    var mqR = window.matchMedia('(max-width: 760px)');
    var ajustarR = function () { gruposR.forEach(function (g) { g.open = !mqR.matches; }); };
    ajustarR(); mqR.addEventListener('change', ajustarR);
    gruposR.forEach(function (g) { g.querySelector('summary').addEventListener('click', function (ev) { if (!mqR.matches) ev.preventDefault(); }); });
  }

  /* ---------- revelação ao entrar na tela ---------- */
  var alvos = doc.querySelectorAll('[data-revela],[data-revela-filhos]');
  doc.querySelectorAll('[data-revela-filhos]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });
  var visto = function (el) {
    el.classList.add('visto');
    // EDB: as campanhas só "acendem" depois que as quatro camadas da base subiram
    if (el.classList.contains('il-camadas')) setTimeout(function () { el.classList.add('pronto'); }, reduz ? 0 : 1750);
  };
  if (!temIO || reduz) alvos.forEach(visto);
  else {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { visto(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    alvos.forEach(function (el) { io.observe(el); });
  }

  /* ---------- números contam do zero quando entram na tela ---------- */
  doc.querySelectorAll('[data-conta]').forEach(function (el) {
    if (reduz || !temIO) return;
    var alvo = +el.getAttribute('data-conta');
    el.textContent = el.hasAttribute('data-dec') ? '0,0' : '0';
    var o = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now(), dur = 1400;
      (function passo(t) {
        var p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 4);
        el.textContent = el.hasAttribute('data-dec') ? (alvo * k / 10).toFixed(1).replace('.', ',') : String(Math.round(alvo * k));
        if (p < 1) requestAnimationFrame(passo);
      })(t0);
    }, { threshold: 0.6 });
    o.observe(el);
  });

  /* ---------- luz que segue o mouse nos cartões ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    doc.addEventListener('pointermove', function (ev) {
      var c = ev.target.closest && ev.target.closest('.degrau,.bt-prog,.inc,.canal,.pilar');
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      c.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- manifesto: as palavras acendem na ordem de leitura ---------- */
  doc.querySelectorAll('[data-acende]').forEach(function (el) {
    if (reduz || !temIO) return;
    var palavras = [];
    var andar = function (no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(p)); return; }
            var s = doc.createElement('span'); s.className = 'w apaga'; s.textContent = p; palavras.push(s); frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) andar(n);
      });
    };
    andar(el);
    palavras.forEach(function (p, i) { p.style.transitionDelay = (i * 45) + 'ms'; });
    var o = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { palavras.forEach(function (p) { p.classList.remove('apaga'); }); o.disconnect(); }
    }, { threshold: 0.55 });
    o.observe(el);
  });

  /* ---------- lista que acende o item no meio da tela (DNA) ---------- */
  doc.querySelectorAll('[data-acende-item]').forEach(function (lista) {
    var itens = lista.querySelectorAll('li');
    if (!temIO || reduz) { itens.forEach(function (li) { li.classList.add('ativo'); }); return; }
    var o = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { itens.forEach(function (li) { li.classList.toggle('ativo', li === e.target); }); } });
    }, { rootMargin: '-42% 0px -42% 0px' });
    itens.forEach(function (li) { o.observe(li); });
    itens[0].classList.add('ativo');
  });

  /* ---------- rolagem: cada efeito roda no máximo uma vez por quadro ---------- */
  var porQuadro = function (fn) {
    var pedido = false;
    return function () { if (pedido) return; pedido = true; requestAnimationFrame(function () { pedido = false; fn(); }); };
  };

  /* ---------- DNA: cartões empilham e acendem ao chegar no topo ---------- */
  doc.querySelectorAll('[data-dna]').forEach(function (lista) {
    var itens = Array.prototype.slice.call(lista.children);
    if (reduz) { itens.forEach(function (li) { li.classList.add('aceso'); }); return; }
    var topos = [];
    var medirTopos = function () { topos = itens.map(function (li) { return parseFloat(getComputedStyle(li).top) || 0; }); };
    var medir = function () {
      var ultimoAceso = -1, alto = innerHeight * .55, rs = itens.map(function (li) { return li.getBoundingClientRect(); });
      itens.forEach(function (li, i) {
        var r = rs[i], chegou = r.top <= topos[i] + 2 || r.top < alto;
        if (li.classList.contains('aceso') !== chegou) li.classList.toggle('aceso', chegou);
        if (chegou) ultimoAceso = i;
        var coberto = 0;
        if (rs[i + 1] && chegou) coberto = Math.max(0, Math.min(1, 1 - (rs[i + 1].top - r.top) / Math.max(1, r.height)));
        var v = coberto.toFixed(2);
        if (li.firstElementChild.style.getPropertyValue('--cob') !== v) li.firstElementChild.style.setProperty('--cob', v);
      });
      itens.forEach(function (li, i) { if (li.classList.contains('atual') !== (i === ultimoAceso)) li.classList.toggle('atual', i === ultimoAceso); });
    };
    medirTopos();
    addEventListener('scroll', porQuadro(medir), { passive: true });
    addEventListener('resize', function () { medirTopos(); medir(); });
    medir();
  });

  /* ---------- links para o diagnóstico levam as UTMs da visita ---------- */
  try {
    var q = new URLSearchParams(location.search), chaves = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    var salvas = JSON.parse(sessionStorage.getItem('g2h_utm') || '{}');
    chaves.forEach(function (k) { if (q.get(k)) salvas[k] = q.get(k); });
    sessionStorage.setItem('g2h_utm', JSON.stringify(salvas));
    if (Object.keys(salvas).length) {
      doc.querySelectorAll('a[data-diag]').forEach(function (a) {
        var url = new URL(a.getAttribute('href'), location.href);
        Object.keys(salvas).forEach(function (k) { if (!url.searchParams.has(k)) url.searchParams.set(k, salvas[k]); });
        a.setAttribute('href', url.pathname + url.search);
      });
    }
  } catch (e) { /* armazenamento bloqueado: segue sem UTM */ }

  /* ---------- perguntas: todas fechadas; abrir uma fecha as outras do grupo ---------- */
  var acords = doc.querySelectorAll('details.acord');
  var fecharAcord = function (d) {
    var r = d.querySelector('.acord-r');
    if (!d.open) return;
    if (reduz || !r || !r.animate) { d.open = false; return; }
    if (d.classList.contains('fechando')) return;
    d.classList.add('fechando');
    var h = r.offsetHeight, feito = false;
    var fim = function () { if (feito) return; feito = true; d.open = false; d.classList.remove('fechando'); };
    r.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.65,0,.35,1)' }).onfinish = fim;
    setTimeout(fim, 480);
  };
  acords.forEach(function (d) {
    d.open = false;
    var s = d.querySelector('summary'), r = d.querySelector('.acord-r');
    if (!s || !r) return;
    s.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (d.open && !d.classList.contains('fechando')) { fecharAcord(d); return; }
      if (d.classList.contains('fechando')) return;
      var grupo = d.closest('[data-acordeoes]') || d.parentElement;
      grupo.querySelectorAll('details.acord').forEach(function (o) { if (o !== d) fecharAcord(o); });
      d.open = true;
      if (reduz || !r.animate) return;
      var h2 = r.offsetHeight;
      r.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
  });

  /* ---------- como funciona: "por onde começar?" ---------- */
  var sel = doc.querySelector('[data-seletor]');
  if (sel) {
    var res = sel.querySelector('[data-sel-res]');
    sel.querySelectorAll('[data-op]').forEach(function (b) {
      b.addEventListener('click', function () {
        sel.querySelectorAll('[data-op]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var t = doc.getElementById('sel-' + b.getAttribute('data-op'));
        if (t && res) {
          res.classList.remove('pronto'); void res.offsetWidth;
          var f = '<span class="sel-faiscas" aria-hidden="true">';
          for (var k = 0; k < 14; k++) f += '<i style="--x:' + (8 + Math.random() * 84) + '%;--y:' + (20 + Math.random() * 60) + '%;--dx:' + (Math.random() * 80 - 40) + 'px;--dy:' + (-30 - Math.random() * 50) + 'px;--d:' + (Math.random() * .3) + 's"></i>';
          res.innerHTML = t.innerHTML + f + '</span>'; res.classList.add('pronto');
          sel.classList.add('respondeu');
        }
      });
    });
  }

  /* ---------- seletor: atalhos A a F quando ele está na tela ---------- */
  if (sel) {
    var selVisivel = false;
    if (temIO) new IntersectionObserver(function (e) { selVisivel = e[0].isIntersecting; }, { threshold: .3 }).observe(sel);
    doc.addEventListener('keydown', function (e) {
      if (!selVisivel || e.ctrlKey || e.metaKey || e.altKey || /input|textarea|select/i.test((e.target || {}).tagName || '')) return;
      var b = sel.querySelector('[data-tecla="' + (e.key || '').toLowerCase() + '"]');
      if (b) { e.preventDefault(); b.click(); b.focus({ preventScroll: true }); }
    });
  }

  /* ---------- índice do post acende a seção atual ---------- */
  var indice = doc.querySelector('[data-indice]');
  if (indice && temIO) {
    var links = indice.querySelectorAll('a');
    var mapa = {};
    links.forEach(function (a) { mapa[a.getAttribute('href').slice(1)] = a; });
    var oi = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting && mapa[e.target.id]) { links.forEach(function (a) { a.classList.remove('ativo'); }); mapa[e.target.id].classList.add('ativo'); }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    Object.keys(mapa).forEach(function (id) { var h = doc.getElementById(id); if (h) oi.observe(h); });
  }

  /* ---------- copiar link do post ---------- */
  doc.querySelectorAll('[data-copiar]').forEach(function (b) {
    b.addEventListener('click', function () {
      var url = b.getAttribute('data-copiar');
      var feito = function () { var t = b.querySelector('span'); if (t) { var o = t.textContent; t.textContent = 'Link copiado'; setTimeout(function () { t.textContent = o; }, 2200); } };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(feito, function () {});
    });
  });

  /* ---------- barra superior: some ao descer, volta ao subir ---------- */
  if (topo) {
    var ultimoY = window.scrollY, pedido = false, menuAberto = function () { var m = doc.querySelector('[data-menu]'); return (m && m.classList.contains('aberto')) || !!doc.querySelector('.nav-mega.aberto'); };
    window.addEventListener('scroll', function () {
      var y = window.scrollY, d = y - ultimoY;
      if (y < 140 || menuAberto()) topo.classList.remove('escondido');
      else if (d > 6) topo.classList.add('escondido');
      else if (d < -6) topo.classList.remove('escondido');
      if (Math.abs(d) > 6) ultimoY = y;
    }, { passive: true });
    topo.addEventListener('focusin', function () { topo.classList.remove('escondido'); });
  }

  /* ---------- seções que ficam e a seguinte sobe por cima ---------- */
  if (!reduz) {
    var fixas = doc.querySelectorAll('main > .hero, main > .capa, main > .bloco-ouro');
    var ajustar = function () {
      fixas.forEach(function (s) {
        s.setAttribute('data-fica', '');
        s.style.top = Math.min(0, window.innerHeight - s.offsetHeight) + 'px';
        var prox = s.nextElementSibling;
        while (prox && prox.classList.contains('divisa')) prox = prox.nextElementSibling;
        if (prox) prox.classList.add('cobre');
      });
    };
    ajustar();
    var largAnt = window.innerWidth;
    window.addEventListener('resize', function () { if (window.innerWidth !== largAnt) { largAnt = window.innerWidth; ajustar(); } });
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(ajustar); fixas.forEach(function (s) { ro.observe(s); }); }
  }

  /* ---------- pilhas de cartões ao rolar ---------- */
  var pilhas = [
    { sel: '.linha-tempo', mq: '(min-width: 901px)' },
    { sel: '.escada, .bento, .inclui, .esteira, .time, .canais', mq: '(max-width: 760px)' },
  ];
  if (!reduz) pilhas.forEach(function (p) {
    var mq = window.matchMedia(p.mq);
    var els = doc.querySelectorAll(p.sel);
    els.forEach(function (el) { Array.prototype.forEach.call(el.children, function (c, i) { c.style.setProperty('--n', i); }); });
    var aplicar = function () { els.forEach(function (el) { el.classList.toggle('pilha-ativa', mq.matches); }); };
    aplicar(); mq.addEventListener('change', aplicar);
  });

  /* ---------- inclinação 3D sutil no hover (só mouse) ---------- */
  if (!reduz && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    doc.querySelectorAll('.bt-prog, .membro, .num, .canal, .pilar, .cmp-card').forEach(function (c) {
      c.setAttribute('data-tilt', '');
      c.addEventListener('pointermove', function (ev) {
        var r = c.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
        c.classList.add('inclinando');
        c.style.transform = 'perspective(900px) rotateX(' + (-y * (c.classList.contains('il') ? 7 : 5)).toFixed(2) + 'deg) rotateY(' + (x * (c.classList.contains('il') ? 9 : 6)).toFixed(2) + 'deg)' + (c.classList.contains('il') ? '' : ' translateY(-6px)');
      });
      c.addEventListener('pointerleave', function () { c.classList.remove('inclinando'); c.style.transform = ''; });
    });
  }

  /* ---------- órbita do Método 5A: fase ativa em sequência ---------- */
  doc.querySelectorAll('[data-orbita]').forEach(function (fig) {
    var nos = fig.querySelectorAll('.o3-no'), leg = fig.querySelector('.o3-legenda');
    var dados = JSON.parse((fig.querySelector('[data-o3-fases]') || {}).textContent || '[]');
    var trilho = fig.querySelectorAll('.o3-trilho em'), i = 0, timer;
    var ir = function (k) {
      i = k; nos.forEach(function (n, j) { n.classList.toggle('on', j === k); });
      trilho.forEach(function (t, j) { t.classList.toggle('on', j === k); });
      if (dados[k]) { fig.querySelector('[data-o3-nome]').textContent = dados[k].nome; fig.querySelector('[data-o3-frase]').textContent = dados[k].frase; leg.classList.remove('troca'); void leg.offsetWidth; leg.classList.add('troca'); }
    };
    ir(0);
    if (reduz) return;
    var tocar = function () { clearInterval(timer); timer = setInterval(function () { ir((i + 1) % nos.length); }, 2600); };
    nos.forEach(function (n, j) { n.style.cursor = 'pointer'; n.addEventListener('click', function () { ir(j); tocar(); }); });
    if (temIO) new IntersectionObserver(function (e) { if (e[0].isIntersecting) tocar(); else clearInterval(timer); }).observe(fig); else tocar();
  });

  /* ---------- jornada: a linha acende conforme a rolagem ---------- */
  var jornada = doc.querySelector('[data-jornada]');
  if (jornada) {
    var passosJ = jornada.querySelectorAll('.jr');
    var atualizarJ = function () {
      var r = jornada.getBoundingClientRect(), alvo = window.innerHeight * 0.6;
      var p = Math.max(0, Math.min(1, (alvo - r.top - 32) / (r.height - 92)));
      jornada.style.setProperty('--p', reduz ? 1 : p.toFixed(4));
      passosJ.forEach(function (li) { li.classList.toggle('aceso', reduz || li.getBoundingClientRect().top + 32 < alvo); });
    };
    atualizarJ();
    window.addEventListener('scroll', porQuadro(atualizarJ), { passive: true });
    window.addEventListener('resize', atualizarJ);
  }

  /* ---------- 10 etapas: contador fixo acompanha o cartão da vez ---------- */
  doc.querySelectorAll('[data-esteira]').forEach(function (bloco) {
    var itens = bloco.querySelectorAll('.esteira li'), num = bloco.querySelector('[data-esteira-num]'), nome = bloco.querySelector('[data-esteira-nome]'), barra = bloco.querySelector('.esteira-barra');
    var atualizarE = function () {
      var atual = 0, linha = window.innerHeight * 0.55;
      itens.forEach(function (li, k) { if (li.getBoundingClientRect().top < linha) atual = k; });
      if (atual === bloco._atual) return;
      bloco._atual = atual;
      if (num) num.textContent = String(atual + 1).padStart(2, '0');
      if (nome) nome.textContent = itens[atual].querySelector('b').textContent;
      if (barra) barra.style.setProperty('--e', atual + 1);
    };
    atualizarE();
    window.addEventListener('scroll', porQuadro(atualizarE), { passive: true });
  });

  /* ---------- mapa da máquina de vendas no celular: a rota acende conforme a rolagem ---------- */
  doc.querySelectorAll('[data-rota-cel]').forEach(function (rc) {
    var sts = rc.querySelectorAll('.rc-st');
    var heroR = rc.closest('.hero');
    var atualizarR = function () {
      var r = rc.getBoundingClientRect(), vh = window.innerHeight, alvo = vh * 0.62;
      /* com a hero parada (grudada) o mapa não anda mais: a rolagem que sobra continua descendo a linha que acende */
      if (heroR) {
        var prox = heroR.nextElementSibling;
        var fimHero = prox ? prox.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(prox).marginTop || 0) : 0;
        var parada = fimHero - vh;
        alvo += Math.max(0, window.scrollY - parada) * 1.1;
      }
      if (!r.height) return;
      var p = reduz ? 1 : Math.max(0, Math.min(1, (alvo - r.top) / r.height));
      rc.style.setProperty('--p', p.toFixed(4));
      sts.forEach(function (li) { var q = li.querySelector('.rc-orbe').getBoundingClientRect(); li.classList.toggle('aceso', reduz || q.top + q.height / 2 < alvo); });
    };
    atualizarR();
    window.addEventListener('scroll', porQuadro(atualizarR), { passive: true });
    window.addEventListener('resize', atualizarR);
  });

  /* ---------- 10 etapas no celular: cartão coberto pelo próximo encolhe e escurece ---------- */
  if (!reduz) doc.querySelectorAll('.esteira').forEach(function (ol) {
    var cards = Array.prototype.slice.call(ol.children), mqE = window.matchMedia('(max-width: 760px)');
    var cobrir = function () {
      if (!mqE.matches) { cards.forEach(function (c) { c.style.removeProperty('--c'); }); return; }
      cards.forEach(function (c, k) {
        var prox = cards[k + 1]; if (!prox) { c.style.setProperty('--c', 0); return; }
        var a = c.getBoundingClientRect(), b = prox.getBoundingClientRect();
        var h = c.offsetHeight, p = Math.max(0, Math.min(1, (a.top + h - b.top) / h));
        c.style.setProperty('--c', p.toFixed(3));
      });
    };
    cobrir();
    window.addEventListener('scroll', porQuadro(cobrir), { passive: true });
    mqE.addEventListener('change', cobrir);
  });

  /* ---------- animações contínuas só rodam enquanto estão na tela ---------- */
  if (temIO) {
    var vivos = doc.querySelectorAll('.letreiro, .il, .rota, .rc, .divisa, .chip-flutua, .rel, .nx-palco, .manif-selo, .faq-loop, .escada-base, .hero-quadro, .capa-visual');
    var olho = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        e.target.classList.toggle('pausado', !e.isIntersecting);
        e.target.querySelectorAll('svg').forEach(function (sv) {
          if (!sv.pauseAnimations) return;
          if (e.isIntersecting) sv.unpauseAnimations(); else sv.pauseAnimations();
        });
      });
    }, { rootMargin: '120px 0px' });
    vivos.forEach(function (v) { olho.observe(v); });
  }

  /* ---------- proteção de conteúdo (padrão das páginas da 2!H) ---------- */
  if (body.hasAttribute('data-protegido')) {
    var campo = function (el) { return el && el.closest && el.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])'); };
    var bloqueia = function (e) { if (!campo(e.target) && !campo(doc.activeElement)) e.preventDefault(); };
    doc.addEventListener('contextmenu', function (e) { if (!campo(e.target)) e.preventDefault(); });
    doc.addEventListener('dragstart', function (e) { if (!campo(e.target)) e.preventDefault(); });
    doc.addEventListener('selectstart', function (e) { if (!campo(e.target)) e.preventDefault(); });
    doc.addEventListener('copy', bloqueia);
    doc.addEventListener('cut', bloqueia);
    doc.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'u')) e.preventDefault();
    });
  }
})();
