"""Capas dos artigos iniciais: foto do Unsplash ligada ao tema + marca 2!H e categoria.
Uso: python site/tools/capas_blog.py"""
import io, os, urllib.request
from PIL import Image, ImageDraw, ImageEnhance
from gerar_imagens import fonte, logo, STATIC

CAPAS = {
  'cpl-barato-nao-significa-operacao-lucrativa': ('1460925895917-afdab827c52f', 'Dados e rastreamento'),
  'antes-de-escalar-o-trafego-5-perguntas': ('1557804506-669a67965ba0', 'Estrutura digital'),
  'marketing-culpa-vendas-vendas-culpa-marketing': ('1517048676732-d65bc937f952', 'Comercial e CRM'),
  'o-que-e-o-metodo-5a': ('1542744173-8e7e53415bb0', 'Método 5A'),
}
W, H = 1600, 900
for slug, (pid, rot) in CAPAS.items():
    dados = urllib.request.urlopen(f'https://images.unsplash.com/photo-{pid}?w=1800&q=85&fm=jpg', timeout=60).read()
    im = Image.open(io.BytesIO(dados)).convert('RGB')
    s = max(W / im.width, H / im.height); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2; im = im.crop((l, t, l + W, t + H))
    im = ImageEnhance.Color(im).enhance(0.8)
    r, g, b = im.split(); b = b.point(lambda v: int(v * 0.86)); r = r.point(lambda v: min(255, int(v * 1.05))); im = Image.merge('RGB', (r, g, b))
    # degradê escuro à esquerda/baixo para a marca ler bem
    grad = Image.new('L', (W, H)); gd = ImageDraw.Draw(grad)
    for x in range(W): gd.line([(x, 0), (x, H)], fill=int(200 * max(0, 1 - x / (W * 0.65))))
    escuro = Image.new('RGB', (W, H), (11, 11, 13)); im = Image.composite(escuro, im, grad)
    im = ImageEnhance.Brightness(im).enhance(0.95)
    lg = logo(70); im.paste(lg, (90, 90), lg)
    d = ImageDraw.Draw(im); f = fonte(600, 30)
    tw = d.textlength(rot.upper(), font=f)
    d.rounded_rectangle([90, 190, 90 + tw + 44, 190 + 58], radius=29, fill=(245, 195, 40))
    d.text((112, 202), rot.upper(), font=f, fill=(23, 19, 10))
    im.save(os.path.join(STATIC, 'img', 'blog', f'{slug}.webp'), 'WEBP', quality=82, method=6)
    print(slug)
