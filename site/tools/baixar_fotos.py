"""Baixa as fotos de tools/fotos.json do Unsplash e aplica o tratamento da marca
(sombras escuras, tom quente puxado para o dourado), salvando em WebP.
Uso: python site/tools/baixar_fotos.py"""
import json, os, io, urllib.request
from PIL import Image, ImageEnhance

AQUI = os.path.dirname(os.path.abspath(__file__))
DEST = os.path.join(AQUI, '..', 'static', 'img', 'fotos')
os.makedirs(DEST, exist_ok=True)
fotos = {k: v for k, v in json.load(open(os.path.join(AQUI, 'fotos.json'), encoding='utf-8')).items() if not k.startswith('_')}

def tratar(im):
    im = im.convert('RGB')
    im = ImageEnhance.Color(im).enhance(0.82)
    im = ImageEnhance.Contrast(im).enhance(1.08)
    # tom dourado: multiplica levemente R e G, reduz B
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.06)))
    g = g.point(lambda v: min(255, int(v * 1.0)))
    b = b.point(lambda v: int(v * 0.86))
    im = Image.merge('RGB', (r, g, b))
    return ImageEnhance.Brightness(im).enhance(0.92)

for nome, pid in fotos.items():
    url = f'https://images.unsplash.com/photo-{pid}?w=2000&q=85&fm=jpg&fit=max'
    dados = urllib.request.urlopen(url, timeout=60).read()
    im = tratar(Image.open(io.BytesIO(dados)))
    for larg, suf in ((1600, ''), (800, '-800')):
        c = im.copy(); c.thumbnail((larg, larg * 2))
        c.save(os.path.join(DEST, f'{nome}{suf}.webp'), 'WEBP', quality=80, method=6)
    print(nome, im.size)
