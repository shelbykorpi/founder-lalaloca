"""Walk the house: every room, both widths, console errors, links, forms.

Run against a local `next start` (default http://localhost:3777). Writes
screenshots to /tmp/house-shots and prints a report. Never sends a real
form submission — the story form and the newsletter are exercised up to
the point of submit and no further.
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

BASE = os.environ.get("BASE", "http://localhost:3777")
OUT = "/tmp/house-shots"
os.makedirs(OUT, exist_ok=True)
ROUTES = ["/", "/shop", "/founder-collection", "/our-story", "/found-her", "/young-founders-room",
          "/products/thirst-trap", "/products/hold-the-room", "/found-her/shelby-korpi", "/the-next-move", "/find-your-serum"]

async def main():
    report = {"console": {}, "routes": {}, "doors": {}, "bag": None, "form": None, "newsletter": None, "reduced": None, "mobileMenu": None}
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for label, vp in [("desktop", {"width": 1440, "height": 900}), ("mobile", {"width": 390, "height": 844})]:
            ctx = await browser.new_context(viewport=vp, device_scale_factor=1)
            page = await ctx.new_page()
            errors = []
            page.on("console", lambda m: errors.append(f"{m.type}: {m.text}") if m.type in ("error",) else None)
            page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
            for r in ROUTES:
                resp = await page.goto(BASE + r, wait_until="networkidle")
                report["routes"][f"{label}{r}"] = resp.status if resp else None
                await page.wait_for_timeout(400)
                name = r.strip("/").replace("/", "_") or "home"
                await page.screenshot(path=f"{OUT}/{label}-{name}.png", full_page=False)
                if r in ("/", "/shop", "/founder-collection", "/our-story", "/found-her", "/young-founders-room"):
                    await page.screenshot(path=f"{OUT}/{label}-{name}-full.png", full_page=True)
                # door portal link present?
                doors = await page.locator("a.door-portal").count()
                report["doors"][f"{label}{r}"] = doors
            report["console"][label] = errors
            await ctx.close()

        # Bag behaviour (desktop)
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()
        await page.goto(BASE + "/shop", wait_until="networkidle")
        await page.locator("button", has_text="Add to bag").first.click()
        await page.wait_for_timeout(800)
        bag_text = await page.locator("header button", has_text="Bag").first.inner_text()
        drawer = await page.get_by_role("dialog", name="Shopping bag").count()
        subtotal = await page.locator("text=Subtotal").count()
        report["bag"] = {"header": bag_text.strip(), "drawerOpen": drawer, "subtotal": subtotal}
        await page.screenshot(path=f"{OUT}/desktop-bag.png")

        # Door portal: click and confirm navigation to next room
        await page.goto(BASE + "/shop", wait_until="networkidle")
        door = page.locator("a.door-portal").first
        await door.scroll_into_view_if_needed()
        await page.wait_for_timeout(300)
        await door.click()
        await page.wait_for_timeout(2200)
        report["doors"]["shop→next"] = page.url

        # Found Her form: fill, don't submit
        await page.goto(BASE + "/found-her#share", wait_until="networkidle")
        forms = await page.locator("form").count()
        story_forms = await page.locator("form:has(textarea)").count()
        textareas = page.locator("form:has(textarea) textarea")
        n_ta = await textareas.count()
        if n_ta:
            await textareas.first.fill("Test — not sent.")
        required = await page.locator("form:has(textarea) [required]").count()
        consent = await page.locator("form:has(textarea) input[type=checkbox]").count()
        legal = await page.locator("text=Two separate permissions").count()
        before = await page.locator("text=Before you write").count()
        report["form"] = {"forms": forms, "storyForms": story_forms, "textareas": n_ta, "required": required, "checkboxes": consent, "permissionsLegend": legal, "beforeYouWrite": before}
        await page.locator("#share").scroll_into_view_if_needed()
        await page.screenshot(path=f"{OUT}/desktop-found-her-form.png")

        # Newsletter UI: type, don't submit
        email = page.locator("form input[type=email]").first
        await email.fill("preview@example.com")
        report["newsletter"] = {"emailInputs": await page.locator("form input[type=email]").count(), "value": await email.input_value()}

        # Home: Enter the house transition
        await page.goto(BASE + "/", wait_until="networkidle")
        await page.get_by_role("link", name="Enter the house").click()
        await page.wait_for_timeout(2600)
        await page.screenshot(path=f"{OUT}/desktop-transition.png")
        dialog = await page.get_by_role("dialog", name="Entering the house").count()
        await page.wait_for_timeout(3500)
        gone = await page.get_by_role("dialog", name="Entering the house").count()
        report["transition"] = {"shownAt2.6s": dialog, "goneAt6.1s": gone, "hash": page.url}
        await page.screenshot(path=f"{OUT}/desktop-after-transition.png")
        await ctx.close()

        # Reduced motion
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        page = await ctx.new_page()
        await page.goto(BASE + "/", wait_until="networkidle")
        await page.get_by_role("link", name="Enter the house").click()
        await page.wait_for_timeout(500)
        dialog = await page.get_by_role("dialog", name="Entering the house").count()
        report["reduced"] = {"dialogShown": dialog, "hash": page.url}
        await ctx.close()

        # Mobile room menu
        ctx = await browser.new_context(viewport={"width": 390, "height": 844})
        page = await ctx.new_page()
        await page.goto(BASE + "/our-story", wait_until="networkidle")
        btn = page.locator("button[aria-expanded]", has_text="Our Story")
        await btn.click()
        await page.wait_for_timeout(300)
        items = await page.locator("ul[role=list] a[href]").count()
        await page.screenshot(path=f"{OUT}/mobile-room-menu.png")
        report["mobileMenu"] = {"items": items}
        await ctx.close()
        await browser.close()
    print(json.dumps(report, indent=1))

asyncio.run(main())
