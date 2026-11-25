"""Builds the case-study pages work/<slug>.html from the data below, in Soft's look.

The logo, footer wordmark and social icons are lifted from idea-soft.html so they stay in sync.
Run: python3 work/src/build.py
"""
import os, re, html

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.abspath(os.path.join(HERE, '..'))
ROOT = os.path.abspath(os.path.join(WORK, '..'))
soft = open(os.path.join(ROOT, 'idea-soft.html')).read()
LOGO = re.search(r'<a href="#top" class="logo"[^>]*>(<svg.*?</svg>)</a>', soft, re.S).group(1)
GIANT = re.search(r'(<div class="giant" aria-hidden="true">.*?</svg></span></div>)', soft, re.S).group(1)
SOCIAL = re.search(r'(<span class="social">.*?</span>)\s*</div>', soft, re.S).group(1)

# ------------------------------------------------------------------ the work
# Figures in "stats" and the quotes come from each client's own live site. Nothing here is a made-up result.
P = [
    dict(slug='dacy', name='Dacy', live='https://dacy.ai/', liveLabel='dacy.ai',
         bg='#14233A', glow='#2BB5A0', tag='SaaS',
         card='Restaurant operations, run from one system',
         title='The operating system for restaurants that would rather cook than count.',
         lede='Dacy runs a restaurant’s back office in one place: stock, recipe costs, rotas and payroll, food-safety checks, bookings and live analytics. We built the product, from the web dashboard to the apps staff use on shift.',
         meta=[('Sector', 'Hospitality software'), ('What we did', 'Product design, web app, mobile apps, integrations'), ('Model', 'Subscription SaaS')],
         brief=['Independent restaurants were running on clipboards, spreadsheets and memory. Real food cost was a month-end surprise, stock counts ate a morning, and rotas, clock-in and payroll lived in three different places.',
                'The brief was one system that connects to the till, does the counting for you, and is simple enough that the team actually uses it on their phones.'],
         quote=('Dacy paid for itself in the first month. We finally know our real food cost and our waste is down by nearly a third.', 'Afrikana Star City, on dacy.ai'),
         did=[('Product and UX', 'One dashboard for the whole operation, built around the five jobs that eat a manager’s week, with a before-and-after for each.'),
              ('Live stock and recipe costing', 'Every sale deducts its own ingredients, so stock, margin per dish and reorder flags stay right without anyone counting.'),
              ('Rota, clock-in and payroll', 'Build the rota, staff clock in on their phones, hours land in payroll. One place, one number.'),
              ('Integrations and apps', 'Connections to tills and delivery apps such as Square, Toast, Clover, Uber Eats and Deliveroo, plus native iOS and Android apps for staff.')],
         stats=[('9', 'POS and delivery platforms connected'), ('£0', 'per cover on bookings, however busy it gets'), ('£19', 'a month to start, first month free')],
         showcase=[('dacy-1', 'Home'), ('dacy-2', 'Before and after'), ('dacy-3', 'Features'), ('dacy-4', 'Analytics'), ('dacy-5', 'Pricing'), ('dacy-6', 'Apps')],
         phones=['dacy-m1', 'dacy-m3', 'dacy-m4', 'dacy-m5', 'dacy-m6', 'dacy-m7', 'dacy-m8', 'dacy-m2'],
         module='gallery', gallery=['dacy-4', 'dacy-3']),
    dict(slug='floors', name='Floors Extra', live=None, liveLabel='floorsextra.co.uk',
         bg='#141414', glow='#E1251B', tag='E-commerce + CRM',
         card='A Birmingham flooring showroom, open online',
         title='A family-run flooring showroom, open online around the clock.',
         lede='Floors Extra is a family-run flooring showroom in Sparkhill, Birmingham, with thirty years in the trade. We built the online store and the CRM behind it, so laminate, vinyl and wood floors sell as well online as they do on the showroom floor.',
         meta=[('Sector', 'Home and interiors'), ('What we did', 'E-commerce website, CRM, integrations'), ('Location', 'Birmingham')],
         brief=['Flooring is a considered buy. People want to know what it will look like in a real room, how much they need, and that the price is right before they order.',
                'Floors Extra already had the answers in the showroom: thirty years of advice, a price match promise and next-day delivery. The website had to carry all of that, and the CRM had to keep every enquiry from the site, the phone and WhatsApp in one place.'],
         quote=('Fantastic prices and fantastic staff. They were the best price we could find online, and the quality of the flooring was amazing.', 'Dean Reeve, Google review'),
         did=[('The store', 'Collections for laminate, click vinyl, LVT, engineered and solid wood, each with a from-price and the current saving up front.'),
              ('Product pages', 'Enter the floor area and get the packs and order total, with full specifications and the rooms each floor suits.'),
              ('Real homes, real proof', 'Photos from customers’ homes, 5.0 Google reviews and a price match promise, so trust is built before the basket.'),
              ('The CRM', 'Enquiries from the site, the phone and WhatsApp land in one place, so the team can follow up every quote and order.')],
         stats=[('5.0', 'from 80 Google reviews'), ('30', 'years of experience in the trade'), ('2pm', 'order cut-off for next-day delivery')],
         showcase=[('floors-1', 'Home'), ('floors-2', 'Shop by collection'), ('floors-6', 'Collection'), ('floors-3', 'Reviews'), ('floors-4', 'Help and inspiration'), ('floors-5', 'Visit the showroom')],
         phones=['floors-m1', 'floors-m2', 'floors-m3', 'floors-m4', 'floors-m5', 'floors-m6'],
         module='gallery', gallery=['floors-2', 'floors-3']),
    dict(slug='solarfy', name='Solarfy', live='https://solarfy.co.uk/', liveLabel='solarfy.co.uk',
         bg='#0B0E0B', glow='#B6E802', tag='Marketing',
         card='Selling plug-in solar to Britain, from the month it became legal',
         title='Selling plug-in solar to Britain, from the month it became legal.',
         lede='Plug-in solar became legal in Great Britain in August 2026, and Solarfy was ready with a complete kit. Our job was to make a brand-new category make sense, and make people trust it enough to buy online.',
         meta=[('Sector', 'Home energy'), ('What we did', 'Launch strategy, paid social, content, email'), ('Market', 'Great Britain')],
         brief=['Most British households had never heard of plug-in solar. The ones who had assumed it meant scaffolding, an installer and a five-figure quote.',
                'Solarfy’s team had already shipped over 10,000 orders in Germany. In Britain they were starting from zero, with a product people did not know was allowed.'],
         quote=None,
         did=[('Positioning', 'We led with honesty: real savings figures with the working shown, not the inflated numbers the rest of the category uses.'),
              ('Launch campaigns', 'Paid social built around the three questions everyone asks first: is it legal, what does it save, and how hard is it to set up.'),
              ('Content', 'Explainers on legality, set-up and savings that answer objections before they become reasons not to buy.'),
              ('Email and offers', 'A members-only list and seasonal offers, such as Black Friday, that turn interest into orders.')],
         stats=[('£509', 'for the Solarfy Duo, a complete two-panel kit'), ('£100–£120', 'a year off a household bill, Solarfy’s own estimate'), ('10,000+', 'orders shipped by the team in Germany')],
         showcase=[('solarfy-1', 'Home'), ('solarfy-2', 'Choose your kit'), ('solarfy-3', 'In the box'), ('solarfy-4', 'Savings'), ('solarfy-5', 'Our story')],
         phones=['solarfy-m1', 'solarfy-m2', 'solarfy-m3', 'solarfy-m4'],
         module='ads', ads=['solarfy-ad1', 'solarfy-ad2', 'solarfy-ad3']),
    dict(slug='timepiece', name='Time Piece', live='https://time-piece.uk/', liveLabel='time-piece.uk',
         bg='#0E0D0B', glow='#B8975A', tag='E-commerce',
         card='Pre-owned luxury watches, bought, sold and traded online',
         title='Pre-owned luxury watches, bought, sold and traded online.',
         lede='Time Piece is a Birmingham dealer in pre-owned Rolex, Audemars Piguet, Patek Philippe, Richard Mille, Cartier and Omega. We built an online store worthy of the watches, with buying, selling and part-exchange in one place.',
         meta=[('Sector', 'Luxury retail'), ('What we did', 'E-commerce website, sell and trade flows, appointments'), ('Location', 'Birmingham')],
         brief=['A £70,000 watch is not an impulse buy. People want to see the exact piece, know it is genuine, and trust the person selling it before they spend a penny.',
                'Time Piece also buys and part-exchanges, so the site had to work just as hard for sellers: a quick, honest way to get a figure without walking into a shop.'],
         quote=('Very honest and straightforward, quoted me in a few minutes and paid me out same day. Old school simple business as it should be, no games.', 'Luqman Shahzad, Google review'),
         did=[('The store', 'A calm, editorial shop where the photography leads, with every watch authenticated in-house and priced up front.'),
              ('Shop by maker', 'Collections for each brand, each with its own story, so collectors go straight to the watches they care about.'),
              ('Sell and part-exchange', 'Send the details, get a figure, bring it in and get paid: a three-step flow that turns sellers into stock.'),
              ('Appointments', 'Book a viewing at the Bull Street showroom from any page, because the last step of a big purchase is often in person.')],
         stats=[('5.0', 'from 27 Google reviews'), ('6', 'marques, from Rolex to Richard Mille'), ('3 steps', 'from sending details to getting paid')],
         showcase=[('timepiece-1', 'Home'), ('timepiece-2', 'New arrivals'), ('timepiece-3', 'Shop by brand'), ('timepiece-4', 'Sell your watch'), ('timepiece-5', 'Appointments'), ('timepiece-6', 'Instagram')],
         phones=['timepiece-m1', 'timepiece-m2', 'timepiece-m3', 'timepiece-m4', 'timepiece-m5', 'timepiece-m6'],
         module='photos', photos=['timepiece-photo1', 'timepiece-photo3', 'timepiece-photo2', 'timepiece-photo4', 'timepiece-photo5', 'timepiece-photo6']),
    dict(slug='amh', name='AMH Cars', live='https://www.amhcars.co.uk/', liveLabel='amhcars.co.uk',
         bg='#170C2E', glow='#7C3AED', tag='Website',
         card='A family-run Birmingham dealership, as good online as on the forecourt',
         title='A family-run dealership, as good online as on the forecourt.',
         lede='AMH Cars has sold quality used cars from Kingstanding Road in Birmingham for 15 years. We built a website that matches the reputation they have earned in person.',
         meta=[('Sector', 'Automotive retail'), ('What we did', 'Website design and build, stock search'), ('Location', 'Birmingham')],
         brief=['AMH Cars is rated five stars on Auto Trader and has picked up its awards every year since 2018. Their old online presence did not show any of that.',
                'People buying a used car want three things fast: what is in stock, whether they can trust the dealer, and how to get in touch. The site had to answer all three on a phone.'],
         quote=('I’d suggest AMH Cars to a friend because I had great service from my salesman and all of the team. The whole process was smooth and genuinely stress-free.', 'Ali Tufan, verified buyer'),
         did=[('Stock search', 'Search by make, body type and price, plus shortcuts for how people actually shop: low insurance, first-time driver, seven seats, automatic.'),
              ('Listings', 'Clear vehicle cards with mileage, year, fuel and gearbox up front, and the price where you expect it.'),
              ('Trust, up front', 'Auto Trader ratings and awards sit right under the headline, not buried on an about page.'),
              ('Contact everywhere', 'Phone, directions and WhatsApp one tap away on every page, because most enquiries start on a phone.')],
         stats=[('5', 'stars on Auto Trader, with awards every year since 2018'), ('2', 'years running highly rated for customer service'), ('15', 'years as a local dealership in Birmingham')],
         showcase=[('amh-1', 'Home'), ('amh-2', 'Latest arrivals'), ('amh-3', 'Highly rated'), ('amh-4', 'All vehicles'), ('amh-5', 'Why choose us')],
         phones=['amh-m1', 'amh-m3', 'amh-m2', 'amh-m4', 'amh-m5', 'amh-m6', 'amh-m7'],
         module='gallery', gallery=['amh-4', 'amh-2']),
]

e = html.escape


def bbar(url):
    return f'<div class="bbar"><i></i><i></i><i></i><span>{e(url)}</span></div>'


def wall(p):
    shots = [s for s, _ in p['showcase']] + p['phones']
    cols = []
    for c in range(6):
        seq = [shots[(c * 3 + i) % len(shots)] for i in range(12)]
        imgs = ''.join(f'<img src="img/{s}.jpg" alt="" class="{"m" if "-m" in s else "d"}">' for s in seq)
        cols.append(f'<div class="wc"><div class="wt">{imgs}{imgs}</div></div>')
    return f'<div class="wall" aria-hidden="true"><div class="plane">{"".join(cols)}</div></div>'


def module(p):
    if p['module'] == 'ads':
        return '<section class="ads"><div class="wrap"><p class="kicker rv">Campaign creative</p><h2 class="sec rv">Three questions, three ads.</h2><div class="agrid">' + ''.join(
            f'<figure class="rv"><img src="img/{a}.jpg" alt="{e(p["name"])} social ad" loading="lazy"></figure>' for a in p['ads']) + '</div></div></section>'
    if p['module'] == 'photos':
        return '<section class="photos"><div class="wrap"><p class="kicker rv">The collection</p><h2 class="sec rv">The watches do the talking.</h2></div><div class="mosaic">' + ''.join(
            f'<figure class="ph{i + 1}"><img src="img/{a}.jpg" alt="Watch from the {e(p["name"])} collection" loading="lazy"></figure>' for i, a in enumerate(p['photos'])) + '</div></section>'
    g = p['gallery']
    return f'''<section class="gal"><div class="wrap"><div class="g2">
<figure class="browser rv g-a">{bbar(p["liveLabel"])}<img src="img/{g[0]}.jpg" alt="{e(p["name"])} screen" loading="lazy"></figure>
<figure class="browser rv g-b">{bbar(p["liveLabel"])}<img src="img/{g[1]}.jpg" alt="{e(p["name"])} screen" loading="lazy"></figure></div></div></section>'''


def build(i, p):
    nxt = P[(i + 1) % len(P)]
    meta = ''.join(f'<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in p['meta'])
    if p['live']:
        meta += f'<div><dt>Live site</dt><dd><a href="{p["live"]}" target="_blank" rel="noopener">{e(p["liveLabel"])} ↗</a></dd></div>'
    brief = ''.join(f'<p>{e(t)}</p>' for t in p['brief'])
    quote = ''
    if p.get('quote'):
        q, who = p['quote']
        quote = f'<figure class="quote rv"><blockquote>“{e(q)}”</blockquote><figcaption>{e(who)}</figcaption></figure>'
    ph = p['phones']
    did = ''.join(f'<li data-shot="img/{ph[n % len(ph)]}.jpg"><span class="n">{n + 1:02d}</span><div><h3>{e(h)}</h3><p>{e(t)}</p></div></li>' for n, (h, t) in enumerate(p['did']))
    shots = ''.join(f'<img src="img/{s}.jpg" alt="{e(p["name"])}: {e(l)}" class="{"on" if j == 0 else ""}" loading="{"eager" if j == 0 else "lazy"}">' for j, (s, l) in enumerate(p['showcase']))
    tabs = ''.join(f'<button type="button" class="{"on" if j == 0 else ""}"><i><b></b></i><span>{e(l)}</span></button>' for j, (s, l) in enumerate(p['showcase']))
    fan = ''.join(f'<figure class="phone f{j + 1}"><img src="img/{s}.jpg" alt="{e(p["name"])} on a phone" loading="lazy"></figure>' for j, s in enumerate(dict.fromkeys(ph)))
    stats = ''
    if p.get('stats'):
        stats = '<section class="stats" data-dark><div class="wrap"><p class="kicker rv">In numbers</p><div class="sgrid">' + ''.join(
            f'<div class="rv"><b class="count">{e(a)}</b><span>{e(b)}</span></div>' for a, b in p['stats']) + '</div></div></section>'
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(p["name"])} — KYNORA WORKS</title>
<meta name="description" content="{e(p["lede"])}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23E5482E'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="case.css">
<style>:root{{--c:{p["bg"]};--g:{p["glow"]}}}</style>
</head>
<body>
<header class="hdr dark"><a href="../idea-soft.html" class="logo" aria-label="KYNORA WORKS home">{LOGO}</a><a href="../idea-soft.html#contact" class="btn btn-verm">Book a call</a></header>

<main>
<section class="hero" data-dark>
  {wall(p)}
  <div class="shade"></div>
  <div class="wrap hin">
    <a class="back rv" href="index.html">← All work</a>
    <p class="kicker rv">Case study · {i + 1:02d} · {e(p["tag"])}</p>
    <h1 class="split">{e(p["name"])}</h1>
    <p class="title rv">{e(p["title"])}</p>
    <dl class="meta rv">{meta}</dl>
  </div>
</section>

<section class="intro"><div class="wrap two">
  <p class="kicker rv">The brief</p>
  <div><p class="lede rv">{e(p["lede"])}</p><div class="body rv">{brief}</div>{quote}</div>
</div></section>

<section class="showcase"><div class="wrap">
  <figure class="browser big rv">{bbar(p["liveLabel"])}<div class="stack">{shots}</div></figure>
  <div class="tabs rv">{tabs}</div>
</div></section>

<section class="did" data-dark><div class="wrap dgrid">
  <div><p class="kicker rv">What we did</p><h2 class="sec rv">{e(p["card"])}.</h2><ol>{did}</ol></div>
  <div class="dside"><figure class="phone sticky"><img src="img/{ph[0]}.jpg" alt="{e(p["name"])} on a phone"></figure></div>
</div></section>

<section class="fan"><div class="frow n{len(list(dict.fromkeys(ph)))}">{fan}</div></section>

{module(p)}
{stats}

<section class="next" data-dark style="--nc:{nxt["bg"]};--ng:{nxt["glow"]}">
  <a class="nx" href="{nxt["slug"]}.html">
    <div class="wrap"><p class="kicker">Next project</p><span class="nn split2">{e(nxt["name"])}</span><span class="nt">{e(nxt["card"])} →</span></div>
    <img src="img/{nxt["slug"]}-cover.jpg" alt="" loading="lazy">
  </a>
</section>
</main>

<footer class="contact" data-dark><div class="wrap">
  <h2 class="rv">Got something worth building?</h2>
  <a href="mailto:hello@kynora.works" class="btn btn-verm rv">Book an intro call</a>
  <div class="fgrid"><a class="email" href="mailto:hello@kynora.works">hello@kynora.works</a>{SOCIAL}</div>
  <div class="fbar"><span>© 2026 KYNORA WORKS</span><a href="#">Privacy</a></div>
</div>{GIANT}</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="case.js"></script>
</body>
</html>
'''


def index():
    """work/index.html: every case study as a big cover on its client's colour."""
    cards = ''
    for n, p in enumerate(P):
        tall = '-tall' if n % 5 in (1, 2) else ''
        cards += f'''<a class="awc rv" href="{p["slug"]}.html" style="--c:{p["bg"]};--g:{p["glow"]}">
  <div class="im"><img src="img/{p["slug"]}-cover{tall}.jpg" alt="{e(p["name"])} on desktop and phone" loading="{"eager" if n < 2 else "lazy"}"><span class="pill">View case →</span></div>
  <div class="cap"><span class="no">{n + 1:02d}</span><h2>{e(p["name"])}</h2><span class="tg">{e(p["tag"])}</span><p class="ct">{e(p["card"])}</p></div>
</a>
'''
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>All work — KYNORA WORKS</title>
<meta name="description" content="Software and marketing we have built for businesses: SaaS, e-commerce, websites and launch campaigns.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23E5482E'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="case.css">
</head>
<body>
<header class="hdr"><a href="../idea-soft.html" class="logo" aria-label="KYNORA WORKS home">{LOGO}</a><a href="../idea-soft.html#contact" class="btn btn-verm">Book a call</a></header>

<main>
<section class="aw"><div class="wrap">
  <a class="back rv" href="../idea-soft.html">← Home</a>
  <p class="kicker rv">Selected work · {len(P):02d}</p>
  <h1 class="aw-t">All work</h1>
  <p class="lead rv">Software we built, and the marketing that launched it. Every project, from the first commit to launch day.</p>
</div></section>
<section><div class="wrap awgrid">
{cards}</div></section>
</main>

<footer class="contact" data-dark><div class="wrap">
  <h2 class="rv">Got something worth building?</h2>
  <a href="mailto:hello@kynora.works" class="btn btn-verm rv">Book an intro call</a>
  <div class="fgrid"><a class="email" href="mailto:hello@kynora.works">hello@kynora.works</a>{SOCIAL}</div>
  <div class="fbar"><span>© 2026 KYNORA WORKS</span><a href="#">Privacy</a></div>
</div>{GIANT}</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="case.js"></script>
</body>
</html>
'''


for f in os.listdir(WORK):  # pages from slugs that no longer exist
    if f.endswith('.html') and f[:-5] not in {p['slug'] for p in P} | {'index'}:
        os.remove(os.path.join(WORK, f))
for i, p in enumerate(P):
    open(os.path.join(WORK, p['slug'] + '.html'), 'w').write(build(i, p))
open(os.path.join(WORK, 'index.html'), 'w').write(index())
print('built', [p['slug'] for p in P] + ['index'])
