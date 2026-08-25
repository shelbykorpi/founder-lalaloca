"""
Image 1's carton misprints the product name: EXTEEME, not EXTREME.

It is a render artefact, not the real box, and this page sells the real box.
The fix transfers the R from MOISTURE on the line below -- same type, same
size, same lighting, two pixels away -- onto the wrong E. Ink is moved as an
alpha map against each site's own paper tone, not as pixels, so the donor's
slightly brighter paper does not come with it.

Nothing else in the frame is touched.

NOTE: assets/ is gitignored, so the input lives on the working machine only.
The corrected WebP in public/products/ is the tracked artefact.
"""
from PIL import Image
import numpy as np

SRC = "assets/source/hold-the-room/01-dressing-room-as-supplied.png"
OUT = "assets/source/hold-the-room/01-dressing-room-corrected.png"

img = np.asarray(Image.open(SRC).convert("RGB")).astype(float)

# Measured off the pixel grid (see the column-run analysis in the transcript):
DON = dict(y0=696, y1=709, x0=1410, x1=1418)   # the R in MOISTURE
TGT = dict(y0=684, y1=697, x0=1391, x1=1399)   # the E that should be an R
PAPER = dict(y0=640, y1=676)                    # clean carton face above the text

def paper_tone(y0, y1, x0, x1):
    """The unprinted carton behind a patch, as a per-column tone (it shades
    left to right across the box face)."""
    strip = img[PAPER["y0"]:PAPER["y1"], x0:x1]
    return strip.mean(0)                        # (w, 3)

def ink_alpha(d):
    """How dark each pixel is against its own paper: 0 = bare card, 1 = ink."""
    tone = paper_tone(d["y0"], d["y1"], d["x0"], d["x1"])
    patch = img[d["y0"]:d["y1"], d["x0"]:d["x1"]]
    lum = patch.mean(2)
    base = tone.mean(1)[None, :]
    a = (base - lum) / max(base.mean() - lum.min(), 1e-6)
    return np.clip(a, 0, 1)

alpha = ink_alpha(DON)

# Donor and target boxes are the same width; heights differ by a row, so
# resample the alpha to the target box rather than shifting the baseline.
th, tw = TGT["y1"] - TGT["y0"], TGT["x1"] - TGT["x0"]
alpha = np.asarray(
    Image.fromarray((alpha * 255).astype(np.uint8)).resize((tw, th), Image.BILINEAR)
).astype(float) / 255.0

# Wipe the wrong glyph back to bare card, then print the R onto it.
tone = paper_tone(TGT["y0"], TGT["y1"], TGT["x0"], TGT["x1"])   # (w,3)
card = np.repeat(tone[None, :, :], th, axis=0)
ink = img[DON["y0"]:DON["y1"], DON["x0"]:DON["x1"]].reshape(-1, 3)
ink_rgb = ink[ink.mean(1).argsort()[: max(3, len(ink) // 12)]].mean(0)

# The resample softens the stroke; 0.8 puts its weight back level with the
# neighbouring letters.
a = np.clip(alpha ** 0.8, 0, 1)[..., None]
patched = card * (1 - a) + ink_rgb * a
# Feather the patch's own border into the surrounding card so the rectangle
# does not show as a lighter block under a hard zoom.
fade = np.ones((th, tw))
fade[0] = fade[-1] = 0.35
fade[:, 0] = np.minimum(fade[:, 0], 0.35)
fade[:, -1] = np.minimum(fade[:, -1], 0.35)
f = fade[..., None]
orig = img[TGT["y0"]:TGT["y1"], TGT["x0"]:TGT["x1"]]
img[TGT["y0"]:TGT["y1"], TGT["x0"]:TGT["x1"]] = patched * f + orig * (1 - f)

Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT)
print("wrote", OUT)
