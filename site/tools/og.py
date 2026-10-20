"""Imagens de prévia de link (WhatsApp, Instagram, LinkedIn, Google...), 1200x630.

Cada cartão é montado em HTML com as fontes e as cores do site e fotografado
pelo Chrome sem janela. O conteúdo fica centralizado: o WhatsApp corta as
laterais na miniatura, então logo e título nunca encostam nas bordas.

Uso:  python site/tools/og.py            (gera todos)
      python site/tools/og.py home edb   (só os citados)
Saída: site/static/img/og/<nome>.jpg  ->  publicado em /assets/img/og/<nome>.jpg
Requer: Google Chrome instalado e Pillow.
"""
import os, sys, subprocess, tempfile, pathlib
from PIL import Image

AQUI = pathlib.Path(__file__).resolve().parent
STATIC = AQUI.parent / 'static'
SAIDA = STATIC / 'img' / 'og'
CHROME = next((c for c in [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
] if os.path.exists(c)), None)

# nome: (etiqueta, linha branca, linha dourada, foto de fundo)
CARTOES = {
    'home': ('Growth · Dados · Vendas', 'Crescer não é sorte.', 'É planejamento e previsibilidade.', 'hero-reuniao-marketing'),
    'sobre': ('Sobre a 2!H', 'Estrutura antes de escala.', 'Clareza antes de investimento.', 'time-reuniao'),
    'como-funciona': ('Como funciona', 'Como a 2!H trabalha:', 'do diagnóstico à escala.', 'estrategia-quadro'),
    'metodo-5a': ('Método 5A', 'Cinco fases para', 'crescer sem quebrar.', 'workshop'),
    'solucoes': ('Soluções', 'Uma escada,', 'não um pacote.', 'reuniao-maos'),
    'edb': ('EDB · Estruturação Digital de Base', 'Primeiro a estrutura,', 'depois o anúncio.', 'estrategia-quadro'),
    'growth-control': ('Growth Control', 'Tráfego com controle', 'e clareza de número.', 'painel-anuncios'),
    'growth-marketing': ('Growth Marketing', 'Marketing e comercial', 'andando juntos.', 'reuniao-maos'),
    'growth-intelligence': ('Growth Intelligence', 'Dados para decidir', 'onde investir.', 'dashboard-escuro'),
    'lancamentos': ('Lançamentos e coprodução', 'Lançamento pago,', 'do zero ao pitch.', 'lancamento-palco'),
    'blog': ('Blog da 2!H', 'Conteúdo para', 'decidir melhor.', 'notebook-abajur'),
    'contato': ('Contato', 'Fale com a 2!H.', 'Diagnóstico em menos de 1 minuto.', 'celular-whatsapp'),
    'perguntas-frequentes': ('Perguntas frequentes', 'Respostas diretas sobre', 'crescer com estrutura.', 'mesa-estudo'),
    'glossario': ('Glossário de growth', 'CAC, CPA, ROAS e mais,', 'com fórmula e exemplo.', 'conta-dashboard'),
    # landing pages (fora do gerador do site; apontam para /assets/img/og/)
    'diagnostico-rapido': ('Diagnóstico rápido', '6 perguntas,', 'o próximo passo certo.', 'celular-whatsapp'),
    '7-sinais': ('Checklist gratuito', '7 sinais de que a sua agência', 'não é transparente com você.', 'conta-dashboard'),
    'bio': ('Links oficiais', 'Grupo 2!H', 'Estrutura, planejamento e ação.', 'hero-reuniao-marketing'),
    'mentoria5a': ('Mentoria 5A', '12 semanas em grupo,', 'construindo o seu sistema.', 'workshop'),
    'diagnostico5a': ('Diagnóstico Estratégico 5A', 'O Método 5A aplicado', 'direto na sua empresa.', 'aperto-de-mao'),
    'diagnostico': ('Diagnóstico Estratégico', 'Onde a sua empresa', 'está perdendo vendas.', 'escritorio-noite'),
    'imersao5a': ('Imersão Estrutura 5A', 'Descubra onde a sua empresa', 'está perdendo vendas.', 'workshop'),
    'ficha': ('Imersão Estrutura 5A', 'Ficha de matrícula', 'Imersão Estrutura 5A.', 'workshop'),
}

HTML = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:G;font-weight:500;src:url("{fonts}/general-sans-500.woff2")}}
@font-face{{font-family:G;font-weight:600;src:url("{fonts}/general-sans-600.woff2")}}
@font-face{{font-family:G;font-weight:700;src:url("{fonts}/general-sans-700.woff2")}}
*{{margin:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;overflow:hidden;background:#0B0B0D}}
.c{{position:relative;width:1200px;height:630px;overflow:hidden;font-family:G,sans-serif;color:#fff}}
.foto{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.30;filter:grayscale(.35) contrast(1.05) brightness(.75)}}
.tinta{{position:absolute;inset:0;background:
  radial-gradient(60% 75% at 50% 42%,rgba(11,11,13,.55),rgba(11,11,13,.92) 70%,#0B0B0D),
  linear-gradient(180deg,rgba(11,11,13,.5),rgba(11,11,13,.2) 40%,rgba(11,11,13,.9))}}
.brilho{{position:absolute;left:50%;top:40%;width:900px;height:520px;transform:translate(-50%,-50%);background:radial-gradient(closest-side,rgba(245,195,40,.20),rgba(245,195,40,.06) 55%,transparent)}}
svg.topo{{position:absolute;inset:0;opacity:.55}}
.horiz{{position:absolute;left:50%;top:548px;width:2200px;height:2200px;margin-left:-1100px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(245,195,40,.10),transparent 30%);
  box-shadow:0 -2px 0 0 rgba(255,226,140,.95),0 -10px 40px -6px rgba(245,195,40,.75),0 -60px 140px -40px rgba(245,195,40,.45)}}
.arco-luz{{position:absolute;left:50%;top:528px;width:620px;height:44px;margin-left:-310px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,244,205,.95),rgba(245,195,40,.45) 45%,transparent);filter:blur(5px)}}
.moldura{{position:absolute;inset:18px;border-radius:28px;border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}}
.conteudo{{position:absolute;left:0;right:0;top:0;bottom:82px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 120px}}
.marca{{display:flex;align-items:center;gap:14px;margin-bottom:26px}}
.marca img{{height:52px;filter:drop-shadow(0 6px 18px rgba(245,195,40,.45))}}
.marca span{{font-weight:600;font-size:26px;letter-spacing:.22em}}
.marca b{{color:#F5C328;font-weight:600}}
.etq{{display:inline-flex;align-items:center;gap:10px;padding:10px 20px;border-radius:999px;font-weight:600;font-size:19px;letter-spacing:.06em;text-transform:uppercase;color:#FFE9A0;
  background:linear-gradient(180deg,rgba(245,195,40,.18),rgba(245,195,40,.06));border:1px solid rgba(245,195,40,.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 10px 30px -12px rgba(245,195,40,.5);margin-bottom:26px}}
.etq i{{width:8px;height:8px;border-radius:50%;background:#F5C328;box-shadow:0 0 10px #F5C328}}
h1{{font-weight:700;letter-spacing:-.035em;line-height:1.02;white-space:nowrap}}
h1 span{{display:block}}
h1 .ouro{{background:linear-gradient(180deg,#FFE58F 10%,#F5C328 55%,#D99A0E);-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:.08em}}
.url{{position:absolute;left:0;right:0;bottom:44px;text-align:center;font-weight:500;font-size:20px;letter-spacing:.14em;color:rgba(255,255,255,.62)}}
.url b{{color:#fff;font-weight:600}}
</style></head><body><div class="c">
<img class="foto" src="{foto}">
<div class="tinta"></div><div class="brilho"></div>
<svg class="topo" viewBox="0 0 1200 630">{aneis}</svg>
<div class="horiz"></div><div class="arco-luz"></div><div class="moldura"></div>
<div class="conteudo">
  <div class="marca"><img src="{logo}"><span>GRUPO <b>2!H</b></span></div>
  <div class="etq"><i></i>{etq}</div>
  <h1 id="t"><span>{l1}</span><span class="ouro">{l2}</span></h1>
</div>
<div class="url"><b>grupo2h.com.br</b></div>
</div>
<script>
document.fonts.ready.then(function(){{
  var t=document.getElementById('t'),s=74;t.style.fontSize=s+'px';
  while(t.scrollWidth>960&&s>40){{s-=2;t.style.fontSize=s+'px'}}
  document.title='pronto';
}});
</script></body></html>"""


def aneis():
    import math, random
    rnd = random.Random(7); out = []
    for k in range(1, 15):
        r = 60 + k * 42; pts = []
        for i in range(121):
            t = i / 120 * 2 * math.pi
            rr = r * (1 + .05 * math.sin(3 * t + k * .3) + .03 * math.sin(5 * t - k * .2))
            pts.append(f'{600 + rr * math.cos(t) * 1.35:.1f},{290 + rr * math.sin(t) * .78:.1f}')
        op = max(.03, .16 - k * .009)
        out.append(f'<polygon points="{" ".join(pts)}" fill="none" stroke="rgba(245,195,40,{op:.3f})" stroke-width="1.2"/>')
    return ''.join(out)


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def gerar(nome, etq, l1, l2, foto):
    SAIDA.mkdir(parents=True, exist_ok=True)
    html = HTML.format(fonts=(STATIC / 'fonts').as_uri(), foto=(STATIC / 'img' / 'fotos' / f'{foto}.webp').as_uri(),
                       logo=(STATIC / 'img' / 'logo-2h-glyph.png').as_uri(), aneis=aneis(), etq=esc(etq), l1=esc(l1), l2=esc(l2))
    with tempfile.TemporaryDirectory() as tmp:
        f = pathlib.Path(tmp) / 'og.html'; f.write_text(html, encoding='utf-8')
        png = pathlib.Path(tmp) / 'og.png'
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                        '--allow-file-access-from-files', '--virtual-time-budget=4000', '--window-size=1200,630',
                        f'--screenshot={png}', f.as_uri()], check=True, capture_output=True, timeout=90)
        im = Image.open(png).convert('RGB').crop((0, 0, 1200, 630))
        im.save(SAIDA / f'{nome}.jpg', 'JPEG', quality=88, optimize=True, progressive=True)
    print(f'og/{nome}.jpg')


if __name__ == '__main__':
    if not CHROME: sys.exit('Chrome não encontrado.')
    alvos = sys.argv[1:] or list(CARTOES)
    for n in alvos: gerar(n, *CARTOES[n])
