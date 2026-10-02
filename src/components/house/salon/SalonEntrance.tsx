"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/brand";
import { HONEYPOT_FIELD } from "@/lib/formGuard";
import { grantInvitation, useHouseKey } from "@/components/house/HouseKeyProvider";
import s from "./salon.module.css";

/**
 * THE SALON ENTRANCE (Shelby, 2 Oct 2026): "you need the invitation and the
 * key to enter." She chose: the email earns the key.
 *
 *   sealed  → an envelope with a wax seal is waiting at the shut door
 *   invited → the seal breaks; the invitation; RSVP with your email
 *   keyed   → the RSVP is stored (Shopify, tag source:salon) and the key
 *             appears: the F-key monogram, in brass
 *   inside  → she turns the key, the doors swing, the Salon opens below
 *
 * HONEST BY CONSTRUCTION. The key is only given when /api/subscribe says the
 * address was stored. If the list is not connected she is told so, exactly
 * as every other form on the site does, and the door stays shut.
 *
 * THE KEY IS REMEMBERED. The invitation is written to her Founder Key
 * (localStorage, nothing sent), so on a later visit she arrives holding the
 * key and the House Map shows the Salon unlocked.
 */
type Stage = "sealed" | "opening" | "invited" | "keyed" | "turning" | "inside";

export function SalonEntrance({ children }: { children: React.ReactNode }) {
  const uid = useId();
  const { key, ready } = useHouseKey();
  const invited = ready && key.invitations.includes("salon");

  /* null = not chosen yet this visit; derive from the key instead, so a
     returning guest arrives holding her key without a state write in an
     effect. */
  const [chosen, setChosen] = useState<Stage | null>(null);
  const stage: Stage = chosen ?? (invited ? "keyed" : "sealed");

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState<null | { kind: "unconfigured" | "error"; text: string }>(null);
  const renderedAt = useRef(0);
  const doorRef = useRef<HTMLDivElement>(null);
  const insideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === "invited" && renderedAt.current === 0) renderedAt.current = Date.now();
  }, [stage]);

  const reduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function breakSeal() {
    track("salon_seal");
    if (reduced()) return setChosen("invited");
    setChosen("opening");
    window.setTimeout(() => setChosen("invited"), 650);
  }

  async function rsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setProblem(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          source: "salon",
          rendered_at: renderedAt.current,
          [HONEYPOT_FIELD]: form.get(HONEYPOT_FIELD) ?? "",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.ok) {
        track("salon_rsvp");
        grantInvitation("salon");
        setChosen("keyed");
        return;
      }
      if (response.status === 503) {
        setProblem({
          kind: "unconfigured",
          text: "The guest list isn’t taking names this minute, so we haven’t kept yours and the door stays shut. Try again shortly.",
        });
        return;
      }
      setProblem({ kind: "error", text: data.error ?? "Something went wrong. Try again in a moment." });
    } catch {
      setProblem({ kind: "error", text: "We couldn’t reach the house. Try again in a moment." });
    } finally {
      setSending(false);
    }
  }

  function turnKey() {
    track("salon_enter", { returning: chosen === null });
    const still = reduced();
    doorRef.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
    setChosen("turning");
    window.setTimeout(() => setChosen("inside"), still ? 0 : 700);
    window.setTimeout(
      () => insideRef.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" }),
      still ? 50 : 3000,
    );
  }

  const doorOpen = stage === "inside";

  return (
    <>
      <section
        aria-labelledby={`${uid}-title`}
        className="relative isolate overflow-hidden bg-night-deep pb-20 pt-14 md:pb-28 md:pt-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_35%,rgba(184,121,120,0.16)_0%,transparent_70%),radial-gradient(50%_45%_at_75%_60%,rgba(214,190,154,0.12)_0%,transparent_70%)]"
        />
        <div className="shell relative">
          <div className="mx-auto max-w-[44rem] text-center">
            <p className="room-label">The Salon · By invitation</p>
            <span aria-hidden className="mx-auto mt-4 block h-px w-10 bg-rose" />
            <h1
              id={`${uid}-title`}
              className="mt-5 font-serif text-[clamp(3rem,8vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em] text-cream"
            >
              The Salon
            </h1>
            <p className="mx-auto mt-6 max-w-[34rem] font-serif text-[clamp(1.2rem,2vw,1.55rem)] italic leading-snug text-cream/85">
              The private room of the FOUNDER house. Long dinners, late nights, escapes, and the
              women worth crossing a city for.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-12 lg:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* The door. */}
            <div ref={doorRef} className="order-2 mx-auto w-full max-w-[17rem] sm:max-w-[20rem] lg:order-1 lg:max-w-[26rem]">
              <div className={`${s.door} ${doorOpen ? s.doorOpen : ""}`}>
                <Image src="/door/edoor-scene.webp" alt="" fill sizes="(max-width: 1024px) 80vw, 26rem" className={s.surround} priority />
                <span className={s.opening}>
                  <Image
                    src="/editorial/rooms/inside-founder-lounge-m.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 45vw, 15rem"
                    className={s.room}
                  />
                  <span className={s.glow} />
                  <span className={`${s.leaf} ${s.leafL}`}>
                    <Image src="/door/edoor-leaf-left.webp" alt="" fill sizes="10rem" />
                  </span>
                  <span className={`${s.leaf} ${s.leafR}`}>
                    <Image src="/door/edoor-leaf-right.webp" alt="" fill sizes="10rem" />
                  </span>
                  <span className={s.seam} />
                </span>
              </div>
              <p className="mt-5 text-center text-[0.6875rem] uppercase tracking-[0.28em] text-cream/60" aria-live="polite">
                {doorOpen ? "The door is open" : stage === "keyed" || stage === "turning" ? "The lock is waiting" : "Locked"}
              </p>
            </div>

            {/* The invitation, the RSVP and the key. */}
            <div className="order-1 lg:order-2" aria-live="polite">
              {(stage === "sealed" || stage === "opening") && (
                <div className="text-center">
                  <p className="mb-8 font-serif text-[1.35rem] italic text-cream/85">
                    An invitation has been left for you.
                  </p>
                  <div className={`${s.envelope} ${stage === "opening" ? s.envelopeLeaving : ""}`}>
                    <span className={s.flap} aria-hidden />
                    <p className={`${s.envelopeLine} font-serif text-[1.05rem] italic text-charcoal/80`}>
                      For you, by hand
                    </p>
                    <button type="button" onClick={breakSeal} className={s.seal} aria-label="Break the seal and open your invitation">
                      <span className={s.sealMark} aria-hidden />
                    </button>
                  </div>
                  <button type="button" onClick={breakSeal} className="hairline mt-10 text-cream">
                    Break the seal
                  </button>
                </div>
              )}

              {stage === "invited" && (
                <div className={s.card}>
                  <p className="text-[0.625rem] uppercase tracking-[0.34em] text-bronze-ink">FOUNDER</p>
                  <p className="mt-5 font-serif text-[1.15rem] italic leading-snug text-charcoal/80">
                    requests the pleasure of your company in
                  </p>
                  <h2 className="mt-3 font-serif text-[clamp(2.4rem,5vw,3.2rem)] font-light leading-none text-night">
                    The Salon
                  </h2>
                  <span aria-hidden className="mx-auto mt-5 block h-px w-12 bg-bronze" />
                  <p className="mx-auto mt-5 max-w-[22rem] space-y-1.5 font-serif text-[1.08rem] leading-[1.5] text-charcoal">
                    <span className="block">Private dinners at a long, candlelit table.</span>
                    <span className="block">Parties that start late and end later.</span>
                    <span className="block">Escapes somewhere worth packing for.</span>
                    <span className="block">First looks, before anyone else.</span>
                  </p>
                  <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.24em] text-charcoal/70">
                    Guest list only · Kindly RSVP
                  </p>

                  <form onSubmit={rsvp} className="relative mx-auto mt-5 max-w-[22rem] text-left">
                    <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                      <label htmlFor={`${uid}-hp`}>Company website</label>
                      <input id={`${uid}-hp`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
                    </div>
                    <label htmlFor={`${uid}-email`} className="sr-only">
                      Your email
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        id={`${uid}-email`}
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 w-full flex-1 border border-charcoal/30 bg-transparent px-4 text-sm text-charcoal outline-none placeholder:text-charcoal/50 focus:border-bronze-ink"
                      />
                      <button type="submit" disabled={sending} className="btn btn-dark h-12 shrink-0 disabled:opacity-60">
                        {sending ? "Sending…" : "RSVP"}
                      </button>
                    </div>
                    {problem && (
                      <p role="alert" className="mt-3 text-[0.8rem] leading-relaxed text-charcoal">
                        {problem.text}{" "}
                        {problem.kind === "unconfigured" && (
                          <>
                            Or write to{" "}
                            <a href={CONTACT_MAILTO} className="underline underline-offset-4">
                              {CONTACT_EMAIL}
                            </a>
                            .
                          </>
                        )}
                      </p>
                    )}
                    <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-charcoal/65">
                      Your RSVP puts you on the guest list for Salon invitations and FOUNDER news.
                      One click to leave, any time.
                    </p>
                  </form>
                </div>
              )}

              {(stage === "keyed" || stage === "turning") && (
                <div className="text-center">
                  <p className="font-serif text-[1.35rem] italic text-cream/85">
                    {chosen === null ? "Welcome back. Your key still fits." : "Your name is on the list."}
                  </p>
                  <div className={`${s.keyWrap} mt-8`}>
                    <span className={`${s.key} ${stage === "turning" ? s.keyTurned : ""}`} role="img" aria-label="Your Salon key, the FOUNDER F-key in brass" />
                  </div>
                  <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.3em] text-champagne">Your key</p>
                  <p className="mx-auto mt-3 max-w-[24rem] text-[0.95rem] leading-relaxed text-cream/75">
                    It opens this door every time you come back.
                  </p>
                  <button type="button" onClick={turnKey} disabled={stage === "turning"} className="btn btn-primary mt-8">
                    Turn the key
                  </button>
                </div>
              )}

              {stage === "inside" && (
                <div className="text-center">
                  <p className="font-serif text-[1.5rem] italic text-cream">Come in.</p>
                  <p className="mt-3 text-[0.95rem] text-cream/75">The room is yours.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {stage === "inside" && (
        <div ref={insideRef} className="scroll-mt-20">
          {children}
        </div>
      )}

      {stage !== "inside" && (
        <section className="border-t border-bronze/15 bg-night py-16 md:py-20">
          <div className="shell grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
            <div>
              <p className="room-label">Behind the door</p>
              <p className="mt-5 font-serif text-[clamp(1.9rem,3.6vw,2.8rem)] font-light leading-[1.08] text-cream">
                Dinners. Parties. Escapes. First looks.
              </p>
            </div>
            <div className="space-y-4 text-[1rem] leading-[1.8] text-cream/75">
              <p>
                The Salon is where the FOUNDER house gathers in person, in rooms with doors and
                guest lists that stay short on purpose.
              </p>
              <p>
                It opens by invitation, and invitations go to the guest list first. Not a tier you
                buy. Early customers and the women who write for{" "}
                <Link href="/found-her" className="text-cream underline underline-offset-4">
                  FOUND HER
                </Link>{" "}
                are always welcome at the door.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
