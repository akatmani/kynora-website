"""Writes the HTML for case-study visuals into work/src/out/. render.js turns each into a JPG in work/img/.

- Campaign creative for Solarfy, in Solarfy's own look.
- Covers (wide 16:10 and tall 4:5) for every project: a browser + phone composition on the client's colour.
"""
import os, json

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
IMG = os.path.abspath(os.path.join(HERE, '..', 'img'))
os.makedirs(OUT, exist_ok=True)
jobs = []  # (html file, output jpg, width, height)


def page(name, w, h, body, css='', fonts=''):
    html = f'''<!doctype html><html><head><meta charset="utf-8">{fonts}
<style>*{{box-sizing:border-box}}html,body{{margin:0;width:{w}px;height:{h}px;overflow:hidden}}{css}</style></head><body>{body}</body></html>'''
    open(os.path.join(OUT, name + '.html'), 'w').write(html)
    jobs.append([name + '.html', name + '.jpg', w, h])



# ---------------------------------------------------------------- solarfy campaign creative
SOL_FONTS = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">'
SOL_CSS = '''body{font-family:Inter,sans-serif;letter-spacing:-.02em}
.lg{display:flex;align-items:center;gap:8px;font-weight:800;font-size:34px;letter-spacing:-.04em}.lg i{width:22px;height:30px;background:#B6E802;clip-path:polygon(55% 0,100% 0,60% 45%,95% 45%,20% 100%,45% 55%,5% 55%)}
.pill{display:inline-block;background:#B6E802;color:#0B0E0B;border-radius:99px;padding:22px 36px;font-weight:800;font-size:30px}'''


def solarfy():
    prod = 'file://' + os.path.join(IMG, 'solarfy-product.jpg')
    box = 'file://' + os.path.join(IMG, 'solarfy-box.jpg')
    page('solarfy-ad1', 1080, 1350, f'''<div class="w"><div class="lg"><i></i>solarfy</div>
<div class="img" style="background-image:url(&quot;{prod}&quot;)"></div>
<h1>Your own solar power.<br><em>Plugged in.</em></h1><p>Two panels, one plug. Legal in Great Britain since August 2026.</p><span class="pill">Shop the Duo – £509</span></div>''',
         SOL_CSS + '''body{background:#0B0E0B;color:#fff}.w{padding:70px 72px;height:100%;display:flex;flex-direction:column}
.img{flex:1;margin:40px -72px 40px;background-size:cover;background-position:center 30%}
h1{font-size:86px;line-height:.98;margin:0;font-weight:900;letter-spacing:-.05em}h1 em{font-style:normal;color:#B6E802}.w>.pill{align-self:flex-start}p{font-size:30px;color:rgba(255,255,255,.7);margin:22px 0 36px;line-height:1.3}''', SOL_FONTS)
    page('solarfy-ad2', 1080, 1350, '''<div class="w"><div class="lg"><i style="background:#0B0E0B"></i>solarfy</div>
<div class="big">£100<span>–</span>£120</div><h2>off your bill a year.*</h2>
<div class="row"><div><b>~5 years</b>to pay for itself</div><div><b>30 / 12</b>year panel / inverter warranty</div></div>
<span class="pill" style="background:#0B0E0B;color:#B6E802">Calculate your savings</span>
<small>*Estimate for a south-facing, unshaded spot. Results depend on location, orientation and usage.</small></div>''',
         SOL_CSS + '''body{background:#B6E802;color:#0B0E0B}.w{padding:70px 72px;height:100%;display:flex;flex-direction:column}
.big{font-size:168px;font-weight:900;letter-spacing:-.07em;line-height:.9;margin-top:auto;white-space:nowrap}.big span{opacity:.4}
h2{font-size:64px;margin:10px 0 50px;font-weight:800;letter-spacing:-.04em}
.row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:50px}.row div{background:#0B0E0B;color:#fff;border-radius:28px;padding:30px;font-size:24px;color:rgba(255,255,255,.7)}.row b{display:block;color:#B6E802;font-size:46px;letter-spacing:-.04em;margin-bottom:4px}
.pill{align-self:flex-start}small{display:block;margin-top:40px;font-size:20px;opacity:.65;line-height:1.35}''', SOL_FONTS)
    page('solarfy-ad3', 1080, 1350, f'''<div class="w"><div class="lg" style="color:#0B0E0B"><i></i>solarfy</div>
<h1>Up and running<br>in an afternoon.</h1>
<div class="img" style="background-image:url(&quot;{box}&quot;)"></div>
<div class="steps"><div><b>1</b>Set it up</div><div><b>2</b>Plug it in</div><div><b>3</b>Register it</div></div></div>''',
         SOL_CSS + '''body{background:#F4F6F1;color:#0B0E0B}.w{padding:70px 72px;height:100%;display:flex;flex-direction:column}
h1{font-size:92px;line-height:.98;margin:50px 0 0;font-weight:900;letter-spacing:-.05em}
.img{flex:1;margin:30px 0;border-radius:36px;background-size:cover;background-position:center;background-color:#fff}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.steps div{background:#fff;border-radius:26px;padding:26px;font-size:30px;font-weight:700}.steps b{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:#B6E802;font-size:26px;margin-bottom:16px}''', SOL_FONTS)



# ---------------------------------------------------------------- covers: a tilted browser and two phones on the client's colour
PROJ = {
    'dacy': dict(bg='#14233A', glow='#2BB5A0', desk='dacy-1', phones=['dacy-m1', 'dacy-m5'], url='dacy.ai'),
    'floors': dict(bg='#141414', glow='#E1251B', desk='floors-1', phones=['floors-m1', 'floors-m3'], url='floorsextra.co.uk'),
    'solarfy': dict(bg='#0B0E0B', glow='#B6E802', desk='solarfy-1', phones=['solarfy-m1', 'solarfy-m3'], url='solarfy.co.uk'),
    'timepiece': dict(bg='#0E0D0B', glow='#B8975A', desk='timepiece-1', phones=['timepiece-m2', 'timepiece-m5'], url='time-piece.uk'),
    'amh': dict(bg='#170C2E', glow='#7C3AED', desk='amh-1', phones=['amh-m1', 'amh-m2'], url='amhcars.co.uk'),
}
COVER_CSS = '''body{background:var(--bg);font-family:-apple-system,system-ui,sans-serif;position:relative}
body::before{content:"";position:absolute;inset:0;background:radial-gradient(55% 60% at 72% 30%,color-mix(in srgb,var(--glow) 60%,transparent),transparent 70%),radial-gradient(45% 50% at 5% 100%,color-mix(in srgb,var(--glow) 35%,transparent),transparent 70%)}
body::after{content:"";position:absolute;inset:0;opacity:.18;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.st{position:absolute;inset:0;perspective:2200px}
.br{position:absolute;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 80px 140px -40px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.1)}
.br .bar{height:40px;background:#EDEDED;display:flex;align-items:center;gap:7px;padding:0 16px}.br .bar i{width:11px;height:11px;border-radius:50%;background:#D0D0D0}
.br .bar span{margin-left:16px;flex:0 1 340px;height:22px;border-radius:7px;background:#fff;font-size:12px;color:#888;display:flex;align-items:center;padding:0 10px}
.br img{display:block;width:100%}
.ph{position:absolute;border-radius:48px;padding:10px;background:#0c0c0c;box-shadow:0 70px 110px -30px rgba(0,0,0,.8),inset 0 0 0 2px #3a3a3a}
.ph img{display:block;width:100%;border-radius:39px}'''


def covers():
    for k, p in PROJ.items():
        d = 'file://' + os.path.join(IMG, p['desk'] + '.jpg')
        m1, m2 = ('file://' + os.path.join(IMG, x + '.jpg') for x in p['phones'])
        style = f'<style>:root{{--bg:{p["bg"]};--glow:{p["glow"]}}}</style>'
        bro = f'<div class="bar"><i></i><i></i><i></i><span>{p["url"]}</span></div><img src="{d}">'
        page(f'{k}-cover', 1600, 1000, style + f'''<div class="st">
<div class="br" style="left:90px;top:150px;width:1080px;transform:rotateY(16deg) rotateX(6deg) rotateZ(-2deg)">{bro}</div>
<div class="ph" style="left:1010px;top:120px;width:300px;transform:rotateY(-12deg) rotateZ(4deg) translateZ(80px)"><img src="{m1}"></div>
<div class="ph" style="left:1250px;top:300px;width:280px;transform:rotateY(-14deg) rotateZ(7deg) translateZ(40px)"><img src="{m2}"></div></div>''', COVER_CSS)
        page(f'{k}-cover-tall', 1200, 1500, style + f'''<div class="st">
<div class="br" style="left:90px;top:120px;width:1180px;transform:rotateY(14deg) rotateX(6deg) rotateZ(-3deg)">{bro}</div>
<div class="ph" style="left:180px;top:470px;width:440px;transform:rotateZ(-6deg) translateZ(90px)"><img src="{m1}"></div>
<div class="ph" style="left:640px;top:560px;width:420px;transform:rotateZ(6deg) translateZ(60px)"><img src="{m2}"></div></div>''', COVER_CSS)


solarfy()
first = list(jobs)
covers()
json.dump({'first': first, 'covers': [j for j in jobs if j not in first]}, open(os.path.join(OUT, 'jobs.json'), 'w'), indent=1)
print(len(jobs), 'visuals')
