"""Gera as imagens da marca usadas pelo site:
  - static/img/og-padrao.png  (prévia de compartilhamento, 1200x630)
  - static/img/blog/<slug>.webp  (capas dos artigos iniciais, 1600x900)

Uso:  python site/tools/gerar_imagens.py
Requer: pip install pillow fonttools brotli
"""
import io, math, random, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont

AQUI = os.path.dirname(os.path.abspath(__file__))
STATIC = os.path.join(AQUI, '..', 'static')
FONTES = os.path.join(STATIC, 'fonts')

BG = (11, 11, 13)
OURO = (245, 195, 40)
TX = (242, 238, 229)
TX3 = (140, 136, 126)


def fonte(peso, tam):
    tt = TTFont(os.path.join(FONTES, f'general-sans-{peso}.woff2'))
    tt.flavor = None
    buf = io.BytesIO(); tt.save(buf); buf.seek(0)
    return ImageFont.truetype(buf, tam)


def aneis(draw, cx, cy, rmax, passo, cor, semente, larg=2, achatar=0.82):
    rnd = random.Random(semente)
    f1, f2, f3 = (rnd.random() * 6.28 for _ in range(3))
    a1, a2, a3 = 0.05 + rnd.random() * .04, 0.03 + rnd.random() * .03, 0.04 + rnd.random() * .04
    r = passo
    while r <= rmax:
        pts = []
        for k in range(181):
            t = k / 180 * 2 * math.pi
            rr = r * (1 + a1 * math.sin(3 * t + f1 + r * .0045) + a2 * math.sin(5 * t + f2 - r * .006) + a3 * math.sin(2 * t + f3 + r * .002))
            pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t) * achatar))
        draw.line(pts, fill=cor, width=larg, joint='curve')
        r += passo


def rota(draw, pts, cor, larg):
    # curva suave pelos pontos (Catmull-Rom amostrado)
    amostras = []
    n = len(pts)
    for i in range(n - 1):
        p0, p1, p2, p3 = pts[max(0, i - 1)], pts[i], pts[i + 1], pts[min(n - 1, i + 2)]
        for s in range(24):
            t = s / 24
            t2, t3 = t * t, t * t * t
            x = .5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            amostras.append((x, y))
    amostras.append(pts[-1])
    draw.line(amostras, fill=cor, width=larg, joint='curve')


def base(w, h, escala=2):
    im = Image.new('RGB', (w * escala, h * escala), BG)
    return im, ImageDraw.Draw(im), escala


def logo(alt):
    lg = Image.open(os.path.join(STATIC, 'img', 'logo-2h.png')).convert('RGBA')
    return lg.resize((int(lg.width * alt / lg.height), alt), Image.LANCZOS)


def og_padrao():
    W, H = 1200, 630
    im, d, e = base(W, H)
    aneis(d, 980 * e, 120 * e, 760 * e, 30 * e, (52, 44, 20), 11, 2 * e)
    pts = [(x * e, y * e) for x, y in [(80, 520), (230, 470), (370, 540), (520, 455), (670, 525), (820, 440), (960, 500), (1110, 420)]]
    rota(d, pts, (70, 58, 22), 3 * e)
    for x, y in pts[:-1]:
        d.ellipse([x - 7 * e, y - 7 * e, x + 7 * e, y + 7 * e], fill=BG, outline=OURO, width=3 * e)
    x, y = pts[-1]
    d.ellipse([x - 12 * e, y - 12 * e, x + 12 * e, y + 12 * e], fill=OURO)
    lg = logo(74 * e); im.paste(lg, (80 * e, 70 * e), lg)
    d.text((80 * e + lg.width + 22 * e, 92 * e), 'GRUPO 2!H', font=fonte(600, 30 * e), fill=TX)
    f1 = fonte(600, 74 * e)
    d.text((80 * e, 190 * e), 'Um mapa para', font=f1, fill=TX)
    d.text((80 * e, 272 * e), 'não quebrar.', font=f1, fill=TX)
    d.text((80 * e, 368 * e), 'Estrutura, planejamento e ação.', font=fonte(500, 38 * e), fill=OURO)
    im = im.resize((W, H), Image.LANCZOS)
    im.save(os.path.join(STATIC, 'img', 'og-padrao.png'), optimize=True)
    print('og-padrao.png')


CAPAS = {
    'cpl-barato-nao-significa-operacao-lucrativa': ('Dados e rastreamento', 3),
    'antes-de-escalar-o-trafego-5-perguntas': ('Estrutura digital', 7),
    'marketing-culpa-vendas-vendas-culpa-marketing': ('Comercial e CRM', 13),
    'o-que-e-o-metodo-5a': ('Método 5A', 21),
}


def capa(slug, rotulo, semente):
    W, H = 1600, 900
    im, d, e = base(W, H)
    rnd = random.Random(semente)
    cx, cy = rnd.randint(900, 1300), rnd.randint(200, 600)
    aneis(d, cx * e, cy * e, 900 * e, 28 * e, (48, 41, 19), semente, 2 * e)
    n = 7
    pts = [((120 + i * (1360 / (n - 1))) * e, (rnd.randint(470, 760)) * e) for i in range(n)]
    rota(d, pts, OURO, 5 * e)
    for i, (x, y) in enumerate(pts):
        r = (14 if i == n - 1 else 9) * e
        if i == n - 1:
            d.ellipse([x - 34 * e, y - 34 * e, x + 34 * e, y + 34 * e], outline=(110, 90, 28), width=2 * e)
            d.ellipse([x - r, y - r, x + r, y + r], fill=OURO)
        else:
            d.ellipse([x - r, y - r, x + r, y + r], fill=BG, outline=OURO, width=4 * e)
    lg = logo(70 * e); im.paste(lg, (110 * e, 100 * e), lg)
    d.text((110 * e, 210 * e), rotulo.upper(), font=fonte(600, 34 * e), fill=TX3)
    im = im.resize((W, H), Image.LANCZOS)
    pasta = os.path.join(STATIC, 'img', 'blog'); os.makedirs(pasta, exist_ok=True)
    im.save(os.path.join(pasta, f'{slug}.webp'), 'WEBP', quality=84, method=6)
    print(f'blog/{slug}.webp')


if __name__ == '__main__':
    og_padrao()
    for slug, (rot, sem) in CAPAS.items():
        capa(slug, rot, sem)
