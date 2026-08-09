#!/usr/bin/env python3
"""
Build the FOUNDER v3.0 brand asset kit into public/brand/.

Sources:
  - founder-monogram-lattice-board.pdf  -> key monogram (traced from board art)
  - Jost Light 300 (from .next font cache) -> wordmark glyph outlines (paths, not live type)

Outputs (public/brand/):
  founder-f-monogram.svg          single path, fill=currentColor (vector master)
  founder-horizontal-cream.svg    lockup, Founder Green - for Cream header
  founder-horizontal-ink.svg      lockup, Antique Gold - for Ink hero / Charcoal footer
  founder-favicon-32.svg / -16.svg  icon tile, Warm Ivory on Founder Green
  founder-icon-green.svg          icon tile master
  founder-icon-180.png            apple-touch-icon 180x180
  favicon.ico                     16/32/48 multi-res
  founder-primary-green.png       OG image 1200x630, primary lockup on green

Notes:
  - Monogram proportion normalized to the locked 1:1.995.
  - Clear space unit = key-bit height (board section A).
  - Wordmark is Jost Light 300, uppercase, .28em tracking, converted to outlines.
    Swap the wordmark paths for the v3.0 approved artwork when delivered -
    keep file names identical and nothing else changes.
"""
import json, re, os, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "brand")
os.makedirs(OUT, exist_ok=True)

GREEN = "#164D49"; GOLD = "#B08A64"; IVORY = "#F7EFE8"; CHARCOAL = "#2A2928"

def parse(d):
    toks = re.findall(r'([MLQCZ])([^MLQCZ]*)', d)
    return [(c, [float(x) for x in re.findall(r'-?\d+\.?\d*', a)]) for c, a in toks]

def emit(toks, tf):
    parts = []
    for c, a in toks:
        if c == 'Z':
            parts.append('Z'); continue
        pts = [tf(a[i], a[i+1]) for i in range(0, len(a), 2)]
        parts.append(c + ' '.join(f"{x:.2f} {y:.2f}" for x, y in pts))
    return "".join(parts)

def flatten(toks, tf, steps=16):
    polys, cur, pos = [], [], None
    for c, a in toks:
        if c == 'M':
            if cur: polys.append(cur)
            cur = [tf(a[0], a[1])]; pos = (a[0], a[1])
        elif c == 'L':
            for i in range(0, len(a), 2):
                cur.append(tf(a[i], a[i+1])); pos = (a[i], a[i+1])
        elif c == 'Q':
            for i in range(0, len(a), 4):
                p0 = pos; c1 = (a[i], a[i+1]); p2 = (a[i+2], a[i+3])
                for t in np.linspace(1.0/steps, 1, steps):
                    x = (1-t)**2*p0[0] + 2*(1-t)*t*c1[0] + t*t*p2[0]
                    y = (1-t)**2*p0[1] + 2*(1-t)*t*c1[1] + t*t*p2[1]
                    cur.append(tf(x, y))
                pos = p2
        elif c == 'C':
            for i in range(0, len(a), 6):
                p0 = pos; c1 = (a[i], a[i+1]); c2 = (a[i+2], a[i+3]); p3 = (a[i+4], a[i+5])
                for t in np.linspace(1.0/steps, 1, steps):
                    x = (1-t)**3*p0[0]+3*(1-t)**2*t*c1[0]+3*(1-t)*t*t*c2[0]+t**3*p3[0]
                    y = (1-t)**3*p0[1]+3*(1-t)**2*t*c1[1]+3*(1-t)*t*t*c2[1]+t**3*p3[1]
                    cur.append(tf(x, y))
                pos = p3
        elif c == 'Z':
            if cur: polys.append(cur); cur = []
    if cur: polys.append(cur)
    return polys

def draw_evenodd(draw, polys, fill, bg):
    """Nonzero-winding style fill: outer contours (majority orientation) in fg,
    reverse-oriented contours (holes) in bg, holes drawn last."""
    def sarea(p):
        s = 0
        for i in range(len(p)):
            x1, y1 = p[i]; x2, y2 = p[(i+1) % len(p)]
            s += x1*y2 - x2*y1
        return s/2
    if not polys:
        return
    dom = sarea(max(polys, key=lambda p: abs(sarea(p)))) > 0
    outers = [p for p in polys if (sarea(p) > 0) == dom]
    holes  = [p for p in polys if (sarea(p) > 0) != dom]
    for p in sorted(outers, key=lambda p: -abs(sarea(p))):
        draw.polygon(p, fill=fill)
    for p in holes:
        draw.polygon(p, fill=bg)

import fitz
doc = fitz.open(os.path.join(ROOT, 'founder-monogram-lattice-board.pdf'))
png = doc.extract_image(36)['image']
open('/tmp/monogram.png', 'wb').write(png)
im = Image.open('/tmp/monogram.png').convert('RGB')
arr = np.asarray(im).astype(int)
mask = (arr[:,:,0] > 100) & (arr[:,:,1] < arr[:,:,0]+30) & (arr[:,:,0]-arr[:,:,2] > 20)
import potrace
path = potrace.Bitmap(mask).trace(turdsize=8, alphamax=1.0, opttolerance=0.2)
subpaths = []
for curve in path:
    d = ["M%.2f %.2f" % (curve.start_point.x, curve.start_point.y)]
    for seg in curve:
        if seg.is_corner:
            d.append("L%.2f %.2fL%.2f %.2f" % (seg.c.x, seg.c.y, seg.end_point.x, seg.end_point.y))
        else:
            d.append("C%.2f %.2f %.2f %.2f %.2f %.2f" % (seg.c1.x, seg.c1.y,
                     seg.c2.x, seg.c2.y, seg.end_point.x, seg.end_point.y))
    d.append("Z")
    subpaths.append("".join(d))
raw = max(subpaths[1:], key=len) if len(subpaths) > 1 else subpaths[0]

toks = parse(raw)
xs = [a[i] for c, a in toks for i in range(0, len(a), 2)]
ys = [a[i+1] for c, a in toks for i in range(0, len(a), 2)]
x0, y0, w, h = min(xs), min(ys), max(xs)-min(xs), max(ys)-min(ys)
ysc = (w*1.995)/h
MW, MH = w, w*1.995
MONO = emit(toks, lambda x, y: (x-x0, (y-y0)*ysc))

rows = np.where(mask.any(axis=1))[0]
rowmax = np.array([np.where(mask[r])[0].max() if mask[r].any() else 0 for r in range(mask.shape[0])])
lo, hi = int(rows.max()-0.45*h), int(rows.max()-0.08*h)
stem = np.median([rowmax[r] for r in range(lo, hi)])
teeth = [r for r in range(lo, hi) if rowmax[r] > stem+15]
BIT = ((max(teeth)-min(teeth)+1)*ysc) if teeth else MH*0.18
print("monogram %.1fx%.1f, clear-space unit %.1f (%.0f%% of H)" % (MW, MH, BIT, 100*BIT/MH))


def normalize(d):
    """Expand H/V into L so downstream only sees M/L/Q/C/Z."""
    toks = re.findall(r'([MLQCZHV])([^MLQCZHV]*)', d)
    out = []; cx = cy = 0.0
    for c, a in toks:
        nums = [float(x) for x in re.findall(r'-?\d+\.?\d*(?:e-?\d+)?', a)]
        if c == 'M':
            out.append(('M', nums)); cx, cy = nums[-2], nums[-1]
        elif c == 'L':
            out.append(('L', nums)); cx, cy = nums[-2], nums[-1]
        elif c == 'H':
            pts = []
            for n in nums: pts += [n, cy]; cx = n
            out.append(('L', pts))
        elif c == 'V':
            pts = []
            for n in nums: pts += [cx, n]; cy = n
            out.append(('L', pts))
        elif c == 'Q':
            out.append(('Q', nums)); cx, cy = nums[-2], nums[-1]
        elif c == 'C':
            out.append(('C', nums)); cx, cy = nums[-2], nums[-1]
        elif c == 'Z':
            out.append(('Z', []))
    return out

G = json.load(open('/tmp/jost_glyphs.json'))
from fontTools.ttLib import TTFont
ft = TTFont('/tmp/jost300.ttf')
CAP = ft['OS/2'].sCapHeight; UPM = ft['head'].unitsPerEm
TRACK = 0.28*UPM

def wordmark(scale, xoff, ybase):
    ds, pen = [], 0.0
    for ch in "FOUNDER":
        g = G[ch]
        t = normalize(g["d"])
        ds.append(emit(t, lambda x, y, p=pen: (xoff+(p+x)*scale, ybase-y*scale)))
        pen += g["adv"]+TRACK
    return "".join(ds), (pen-TRACK)*scale

def wordmark_polys(scale, xoff, ybase):
    out, pen = [], 0.0
    for ch in "FOUNDER":
        g = G[ch]
        t = normalize(g["d"])
        out.append(flatten(t, lambda x, y, p=pen: (xoff+(p+x)*scale, ybase-y*scale)))
        pen += g["adv"]+TRACK
    return out, (pen-TRACK)*scale

def svg(vb_w, vb_h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.1f %.1f" '
            'role="img" aria-label="FOUNDER">%s</svg>\n' % (vb_w, vb_h, body))

open(os.path.join(OUT, 'founder-f-monogram.svg'), 'w').write(
    svg(MW, MH, '<path d="%s" fill="currentColor"/>' % MONO))

def horizontal(color):
    cap_h = 0.42*MH
    wscale = cap_h/CAP
    gap = BIT
    wm_d, wm_w = wordmark(wscale, MW+gap, MH*0.5 + cap_h*0.5)
    W = MW+gap+wm_w
    body = ('<path d="%s" fill="%s"/><path d="%s" fill="%s"/>'
            % (MONO, color, wm_d, color))
    return svg(W, MH, body)

open(os.path.join(OUT, 'founder-horizontal-cream.svg'), 'w').write(horizontal(GREEN))
open(os.path.join(OUT, 'founder-horizontal-ink.svg'), 'w').write(horizontal(GOLD))

def tile_svg(fg, bg):
    S = 100.0
    gh = 0.62*S; gs = gh/MH; gw = MW*gs
    gx = (S-gw)/2; gy = (S-gh)/2*0.92
    t = emit(toks, lambda x, y: (gx+(x-x0)*gs, gy+(y-y0)*ysc*gs))
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" '
            'aria-label="FOUNDER"><rect width="100" height="100" fill="%s"/>'
            '<path d="%s" fill="%s"/></svg>\n' % (bg, t, fg))

open(os.path.join(OUT, 'founder-favicon-32.svg'), 'w').write(tile_svg(IVORY, GREEN))
open(os.path.join(OUT, 'founder-favicon-16.svg'), 'w').write(tile_svg(IVORY, GREEN))
open(os.path.join(OUT, 'founder-icon-green.svg'), 'w').write(tile_svg(GOLD, GREEN))

def render_tile(size, fg, bg, ss=4):
    S = size*ss
    img = Image.new('RGB', (S, S), bg)
    d = ImageDraw.Draw(img)
    gh = 0.62*S; gs = gh/MH
    gw = MW*gs
    gx = (S-gw)/2; gy = (S-gh)/2*0.92
    polys = flatten(toks, lambda x, y: (gx+(x-x0)*gs, gy+(y-y0)*ysc*gs))
    draw_evenodd(d, polys, fg, bg)
    return img.resize((size, size), Image.LANCZOS)

# RGBA, NOT RGB — and this is not cosmetic.
#
# Pillow writes each ICO entry as a PNG in whatever mode the source image is.
# Turbopack decodes favicon.ico with the Rust `image` crate, whose ICO decoder
# accepts PNG-in-ICO entries ONLY when they are RGBA8. Hand it an RGB entry and
# the Next.js build dies with:
#
#     ./src/app/favicon.ico
#     Error: Processing image failed
#     unable to decode image data
#
# which names the file but not the cause, and which took a failed production
# deploy to find. The tiles are fully opaque either way, so this changes no
# pixel — it only changes the pixel format the encoder records.
render_tile(180, GOLD, GREEN).convert('RGBA').save(os.path.join(OUT, 'founder-icon-180.png'))
render_tile(48, IVORY, GREEN).convert('RGBA').save(os.path.join(OUT, 'favicon.ico'),
                                                   sizes=[(16, 16), (32, 32), (48, 48)])

def og():
    ss = 2; W, H = 1200*ss, 630*ss
    img = Image.new('RGB', (W, H), GREEN)
    d = ImageDraw.Draw(img)
    mh = 0.42*H; ms = mh/MH; mw = MW*ms
    gap = BIT*ms
    cap_h = 0.11*H; wsc = cap_h/CAP
    _, wm_w = wordmark(wsc, 0, 0)
    total_h = mh+gap+cap_h
    top = (H-total_h)/2
    mx = (W-mw)/2
    mpolys = flatten(toks, lambda x, y: (mx+(x-x0)*ms, top+(y-y0)*ysc*ms))
    draw_evenodd(d, mpolys, GOLD, GREEN)
    wx = (W-wm_w)/2; wy = top+mh+gap+cap_h
    gpolys, _ = wordmark_polys(wsc, wx, wy)
    for gp in gpolys:
        draw_evenodd(d, gp, GOLD, GREEN)
    img.resize((1200, 630), Image.LANCZOS).save(os.path.join(OUT, 'founder-primary-green.png'))
og()

print("assets written to", OUT)
for f in sorted(os.listdir(OUT)):
    print(" ", f, os.path.getsize(os.path.join(OUT, f)), "bytes")
