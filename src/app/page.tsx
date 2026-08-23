import Image from "next/image";
import Link from "next/link";
import { EntranceDoor } from "@/components/door/EntranceDoor";
import { EmailSignup } from "@/components/site/EmailSignup";
import { BRAND, HERO } from "@/lib/brand";
import { formatPrice, products } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ----------------
          Tuned to the campaign composition: subject on the right, black on the
          left. The scrim is deliberately light on wide screens so nothing sits
          over her face; small screens crop in on her, so they get a flat wash
          behind the type instead. */}
      <section className="relative isolate bg-ink text-shell">
        {/* Below md the photograph is its own block and the copy sits beneath it,
            so the frame is never cropped down to an extreme close-up. From md up
            it becomes the background and the copy sits on the black side of it. */}
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:absolute md:inset-0 md:aspect-auto md:h-full">
          {/* Two renditions of one photograph. The desktop file extends the
              wall leftward so the headline has a field to sit on; on a phone
              that extension is a third of the frame — a smear of dark nothing
              with a soft edge against the F. So phones get the photograph
              itself, uncomposited, full width. */}
          <Image
            src="/editorial/hero-open-door-m.webp"
            alt={HERO.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_30%] md:hidden"
          />
          <Image
            src={HERO.src}
            alt={HERO.alt}
            fill
            priority
            sizes="100vw"
            className="hidden object-cover md:block md:object-[70%_35%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.85)_88%,#000_100%)] md:hidden" />
          {/* Wide screens: the wash clears before her face, so it is never veiled. */}
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#000_0%,#000_26%,rgba(0,0,0,0.55)_40%,rgba(0,0,0,0)_56%)] md:block" />
        </div>

        <div className="shell relative flex flex-col justify-end pb-14 pt-8 md:min-h-[36rem] md:py-16 lg:min-h-[40rem]">
          <div className="max-w-[34rem]">
            <p className="eyebrow text-blush/90">{BRAND.display}</p>
            {/* Campaign line — always stacked on two lines (v3.0; single-line is prohibited) */}
            <h1 className="display mt-5 text-balance">
              <span className="block">{BRAND.campaignLines[0]}</span>
              <span className="block">{BRAND.campaignLines[1]}</span>
            </h1>
            <p className="mt-6 font-serif text-[clamp(1.5rem,3vw,2.125rem)] leading-snug text-blush">
              {BRAND.tagline}
            </p>
            {/* The three archetypes, dropped like a cast list. Replaced "Three
                serums. No spreadsheet." on 11 August 2026 — the joke was doing
                the work a seductive line should. */}
            <p className="lede mt-4 text-shell/85">
              The Closer. The Entrance. The Comeback.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary">
                Open the door
              </Link>
              <Link href="/found-her" className="btn btn-ghost-light">
                Read Found Her
              </Link>
            </div>
          </div>

          {!HERO.approved && (
            <p className="mt-10 text-[0.625rem] uppercase tracking-[0.2em] text-shell/50">
              {HERO.placeholderNote}
            </p>
          )}
        </div>
      </section>

      {/* ---------------- The entrance ----------------
          The lobby photograph runs edge to edge — no shell — so the marble
          floor and the mirrored walls read as the room you are standing in. */}
      <section className="section bg-cream" aria-labelledby="entrance-heading">
        <div className="shell">
          <div className="mx-auto max-w-[30rem] text-center">
            <p className="eyebrow text-bronze-ink">{BRAND.collectionFull}</p>
            <h2 id="entrance-heading" className="headline mt-4 text-balance">
              Come in.
            </h2>
            <p className="mt-5 text-charcoal/80">
              Three serums on the other side of this door. Nobody is checking names.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <EntranceDoor />
        </div>

        {/* The three serums, visible on the homepage itself — before this
            row a woman could read the whole page without seeing a product.
            Name, approved label wording, price; the card is the link. */}
        <div className="shell mt-14">
          <ul className="grid gap-10 sm:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group block text-center"
                >
                  <span className="relative mx-auto block h-44 w-28 md:h-52 md:w-32">
                    <Image
                      src={product.bottle}
                      alt={`The ${product.name} bottle.`}
                      fill
                      loading="lazy"
                      sizes="128px"
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="eyebrow mt-5 block text-bronze-ink">
                    {product.archetype}
                  </span>
                  <span className="mt-2 block font-serif text-2xl leading-none text-charcoal transition-colors group-hover:text-bronze-ink">
                    {product.name}
                  </span>
                  <span className="mt-2 block text-xs uppercase tracking-[0.14em] text-charcoal/70">
                    {product.category}
                  </span>
                  <span className="mt-2 block text-sm text-charcoal">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Brand belief ---------------- */}
      <section className="section-tight bg-charcoal py-16 text-shell md:py-20">
        <div className="shell-narrow">
          <h2 className="headline max-w-[16ch] text-balance">{BRAND.belief}</h2>
          <p className="mt-6 max-w-xl text-shell/80">
            A company. A family. A body of work. A comeback. A louder voice. A life she
            chose for herself.
          </p>
        </div>
      </section>

      {/* ---------------- Found Her ---------------- */}
      <section className="section bg-shell" aria-labelledby="found-her-heading">
        <div className="shell">
          {/* The team-written notes that used to fill the right column left
              with their section on /found-her, so the invitation stands
              alone. */}
          <div className="max-w-2xl">
            <div>
              <p className="eyebrow text-bronze-ink">{BRAND.editorial}</p>
              <p className="mt-4 font-serif text-xl text-charcoal/85">
                Stories from women who built before anyone applauded.
              </p>
              <h2 id="found-her-heading" className="headline mt-4 text-balance">
                {BRAND.campaign}
              </h2>
              <p className="mt-6 max-w-md text-charcoal/80">
                What they started, survived, changed, finished — and finally gave
                themselves credit for.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/found-her#share" className="btn btn-dark">
                  I found her when…
                </Link>
                <Link href="/found-her" className="btn btn-outline">
                  Read Found Her
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- Email ---------------- */}
      {/* Founder Green enters the page here — the invitation moment (§3 of the
          alignment spec). One green band only; its authority comes from scarcity. */}
      <section className="section-tight bg-founder-green py-14 md:py-16">
        <div className="shell">
          <div className="max-w-xl">
            <h2 className="headline text-balance text-cream">Come build this with us.</h2>
            <EmailSignup tone="green" source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
