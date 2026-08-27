"""
The after-hours grade.

WHAT IT IS FOR. The couch frame on the review build works for reasons that can
be measured, not just felt: most of the frame sits in real shadow, the light
has a direction and a falloff, and the corners fall away so the eye is pushed
to the one lit thing. Several of our own scenes are lit flat and bright — the
Smooth Talker scene has 1.4% of its pixels below L=60, where the couch frame is
around 70% — and no amount of dark page around a bright photograph makes the
page feel like a room.

WHAT IT DOES, AND WHAT IT REFUSES TO DO. This is a grade, not a relight. It
pulls the shadows down, holds the highlights, warms what is left, takes a
little saturation out of the midtones, and adds a directional falloff from the
frame's own brightest quadrant so the vignette agrees with the light that is
already there. It does not move anything, invent a light source, or touch a
label: text stays exactly as legible as it was, which the guard at the bottom
checks rather than assumes.

Run from the repo root:  python3 scripts/after-hours-grade.py
Originals are read from assets/source/daylight/ and never overwritten.
"""

import os, sys
import numpy as np
from PIL import Image
import cv2

SRC = "assets/source/daylight"
OUT = "public"

def grade(arr, strength=1.0, warmth=1.0):
    """arr: float RGB 0-255. Returns graded float RGB."""
    x = arr / 255.0

    # 1 · Shadows down, highlights held. A lifted-toe S-curve inverted: the
    #     bottom two thirds of the range are pushed down hardest, the top
    #     eighth is barely touched so brass and paper keep their sparkle.
    t = x
    pull = 1.0 - np.clip((t - 0.62) / 0.38, 0, 1)      # 1 in shadow, 0 in highlight
    gamma = 1.0 + 0.85 * strength * pull
    x = np.power(np.clip(x, 0, 1), gamma)

    # 2 · Directional falloff. The vignette is anchored on the frame's own
    #     brightest quadrant, so it reads as the light running out rather than
    #     as a filter laid on top.
    h, w = x.shape[:2]
    small = cv2.GaussianBlur(x.mean(2), (0, 0), max(h, w) / 22)
    cy, cx = np.unravel_index(np.argmax(small), small.shape)
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - cx) / w) ** 2 + ((yy - cy) / h) ** 2)
    fall = 1.0 - 0.62 * strength * np.clip((d - 0.28) / 0.85, 0, 1) ** 1.35
    x *= fall[..., None]

    # 3 · Warmth in what survives, and a little saturation out of the mids, so
    #     the room reads as lamplight rather than as a colour cast.
    lum = x @ np.array([0.2126, 0.7152, 0.0722])
    warm = np.stack([1 + 0.055 * warmth, 1 + 0.012 * warmth, 1 - 0.055 * warmth])
    x = x * warm
    x = lum[..., None] * 0.18 + x * 0.82

    return np.clip(x, 0, 1) * 255.0

def stats(a):
    g = np.asarray(Image.fromarray(a.astype(np.uint8)).convert("L"))
    return g.mean(), (g < 60).mean() * 100

JOBS = [
    # file under public/,                          strength, warmth
    ("products/smooth-talker-scene.webp",              1.00, 1.0),
    ("products/double-take-scene.webp",                0.90, 1.0),
    ("editorial/story-wall.webp",                      0.80, 0.9),
    ("editorial/our-story-desk.webp",                  0.70, 0.9),
    ("products/hold-the-room-tall.webp",               0.70, 0.8),
    ("editorial/next-move-dressing-room.webp",         0.65, 0.8),
]

def main():
    os.makedirs(SRC, exist_ok=True)
    for rel, strength, warmth in JOBS:
        src = os.path.join(SRC, os.path.basename(rel))
        dst = os.path.join(OUT, rel)
        # First run stashes the original; every run after grades from that copy,
        # so the grade never stacks on itself.
        if not os.path.exists(src):
            if not os.path.exists(dst):
                print("missing:", dst); continue
            Image.open(dst).convert("RGB").save(src, "WEBP", quality=95, method=6)
        im = Image.open(src).convert("RGB")
        a = np.asarray(im).astype(float)
        before = stats(a)
        out = grade(a, strength, warmth)
        after = stats(out)
        Image.fromarray(out.astype(np.uint8)).save(dst, "WEBP", quality=86, method=6)
        print(f"{rel:<46} L {before[0]:5.0f}->{after[0]:5.0f}   shadow {before[1]:5.1f}%->{after[1]:5.1f}%")

if __name__ == "__main__":
    main()
