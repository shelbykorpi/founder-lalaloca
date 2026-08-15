"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import s from "./concierge.module.css";
import { CONTACT_EMAIL } from "@/lib/brand";
import { DESK_ORDER, DESKS, type Desk } from "@/lib/concierge/desks";
import { HONEYPOT_FIELD } from "@/lib/formGuard";

/**
 * The concierge: a brass bell on the desk, and a leather folio behind it.
 *
 * WHAT THIS COMPONENT DOES AND DOES NOT DO. It renders, it collects, it posts.
 * It contains no product facts, no answers and no safety logic — all of that is
 * on the server in /api/concierge, because anything shipped to the browser can
 * be read and bypassed. The prototype this is ported from ran its whole
 * knowledge base client-side, which is fine for a demo and unusable for a brand
 * that has to stand behind what the bot says.
 *
 * IT FAILS HONESTLY. If the endpoint is not configured, or the model call
 * fails, the folio says so in plain words rather than showing a plausible
 * canned answer. That is the same position every other form on this site takes.
 */

type Turn =
  | { who: "you"; text: string }
  | { who: "bot"; text: string; kind?: "care" | "flag"; tag?: string };

const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
    <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CLOCHE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
    <path d="M3 18h18M4.5 18a7.5 7.5 0 0115 0M12 6.6V4.4" strokeLinecap="round" />
  </svg>
);

/** Bold is the only inline mark the system prompt permits, so it is the only one parsed. */
function renderBody(text: string) {
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={i}>
      {para.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) =>
        chunk.startsWith("**") && chunk.endsWith("**") ? (
          <strong key={j}>{chunk.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{chunk}</span>
        ),
      )}
    </p>
  ));
}

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [desk, setDesk] = useState<Desk>("beauty");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [showMore, setShowMore] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);
  /* Stamped in an effect, not in render: Date.now() during render is impure and
     the React compiler is right to reject it. */
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const content = DESKS[desk];
  const chatting = turns.length > 0;

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [turns, busy]);

  const toggle = useCallback(() => {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        setRinging(true);
        setTimeout(() => setRinging(false), 1200);
        setTimeout(() => fieldRef.current?.focus(), 480);
      }
      return !wasOpen;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || busy) return;

      /* Captured before the state update so the request carries the
         conversation as the server should see it — without the new message,
         which is sent separately. */
      const history = turns.map((t) => ({
        role: t.who === "you" ? ("user" as const) : ("assistant" as const),
        content: t.text,
      }));

      setDraft("");
      setTurns((prev) => [...prev, { who: "you", text: message }]);
      setBusy(true);

      try {
        const response = await fetch("/api/concierge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            message,
            desk,
            history,
            rendered_at: renderedAt.current,
            [HONEYPOT_FIELD]: hpRef.current?.value ?? "",
          }),
        });
        const data = await response.json().catch(() => ({}));

        if (response.ok && data.ok && typeof data.text === "string") {
          setTurns((prev) => [
            ...prev,
            { who: "bot", text: data.text, kind: data.kind, tag: data.tag },
          ]);
        } else if (response.status === 503) {
          setTurns((prev) => [
            ...prev,
            {
              who: "bot",
              text: `The concierge isn’t connected yet, so I’d rather say that than invent an answer.\n\nWrite to ${CONTACT_EMAIL} and a person will pick it up.`,
              kind: "care",
              tag: "Not connected",
            },
          ]);
        } else {
          setTurns((prev) => [
            ...prev,
            {
              who: "bot",
              text: data.error ?? "Something went wrong at my end. Try again in a moment.",
              kind: "care",
            },
          ]);
        }
      } catch {
        setTurns((prev) => [
          ...prev,
          { who: "bot", text: "I couldn’t reach the desk. Try again in a moment.", kind: "care" },
        ]);
      } finally {
        setBusy(false);
        setTimeout(() => fieldRef.current?.focus(), 30);
      }
    },
    [busy, desk, turns],
  );

  return (
    <div className={`${s.root} ${open ? s.open : ""}`}>
      {/* ---------------- the bell ---------------- */}
      <button
        type="button"
        className={`${s.bell} ${ringing ? s.ringing : ""}`}
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close the concierge" : "Ring for service — open the FOUNDER concierge"}
      >
        <svg viewBox="0 0 160 128" aria-hidden>
          <defs>
            {/* Banded highlights are what make brass read as metal rather than
                as a yellow shape. */}
            <linearGradient id="cbrass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8C6428" />
              <stop offset=".13" stopColor="#D9B26A" />
              <stop offset=".28" stopColor="#FFF3CE" />
              <stop offset=".42" stopColor="#E0BC77" />
              <stop offset=".60" stopColor="#A67C38" />
              <stop offset=".76" stopColor="#EBCB8C" />
              <stop offset=".90" stopColor="#B98F49" />
              <stop offset="1" stopColor="#79521F" />
            </linearGradient>
            <linearGradient id="cbrassTop" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8E6629" />
              <stop offset=".22" stopColor="#FFF6D8" />
              <stop offset=".5" stopColor="#D8B36C" />
              <stop offset=".78" stopColor="#F3DBA4" />
              <stop offset="1" stopColor="#7E5722" />
            </linearGradient>
            <linearGradient id="cstone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#EFC4B2" />
              <stop offset=".5" stopColor="#CE9887" />
              <stop offset="1" stopColor="#9A6858" />
            </linearGradient>
            <linearGradient id="cplate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F9E8BE" />
              <stop offset=".5" stopColor="#DDBA7E" />
              <stop offset="1" stopColor="#A97F45" />
            </linearGradient>
            <radialGradient id="csheen" cx=".32" cy=".2" r=".55">
              <stop offset="0" stopColor="#FFFCEC" stopOpacity=".85" />
              <stop offset="1" stopColor="#FFFCEC" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cglow" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#E7CE9C" stopOpacity=".26" />
              <stop offset="1" stopColor="#E7CE9C" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="80" cy="86" rx="76" ry="60" fill="url(#cglow)" />
          <g fill="none" stroke="#E7CE9C" strokeWidth="1.5">
            <circle className={s.ping} cx="80" cy="70" r="46" />
            <circle className={`${s.ping} ${s.pingB}`} cx="80" cy="70" r="55" />
          </g>
          <ellipse cx="80" cy="119" rx="58" ry="7" fill="#000" opacity=".3" />
          <g className={s.dome}>
            <path d="M32 92C32 52 52 30 80 30s48 22 48 62z" fill="url(#cbrass)" />
            <path d="M32 92C32 52 52 30 80 30s48 22 48 62z" fill="url(#csheen)" />
            <path d="M52 62c3-13 12-22 24-25" stroke="#FFF9E4" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".72" />
            <path d="M112 66c2 7 3 15 3 24" stroke="#FFF3D4" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".34" />
            <ellipse cx="80" cy="92" rx="48" ry="7.5" fill="url(#cbrassTop)" />
            <ellipse cx="80" cy="90.6" rx="48" ry="6" fill="#B98F49" opacity=".4" />
            <rect x="75.4" y="17" width="9.2" height="14" rx="3" fill="url(#cbrassTop)" />
            <circle cx="80" cy="14" r="7.4" fill="url(#cbrassTop)" />
            <circle cx="77.2" cy="11.6" r="2.7" fill="#FFF9E4" opacity=".85" />
          </g>
          <ellipse cx="80" cy="110" rx="56" ry="9.5" fill="#956555" />
          <rect x="24" y="100" width="112" height="10" fill="url(#cstone)" />
          <ellipse cx="80" cy="100" rx="56" ry="9.5" fill="url(#cstone)" />
          <ellipse cx="80" cy="100" rx="56" ry="9.5" fill="none" stroke="#F6D8C8" strokeWidth=".9" opacity=".55" />
          <rect x="31" y="99" width="98" height="15" rx="2" fill="url(#cplate)" />
          <rect x="31" y="99" width="98" height="15" rx="2" fill="none" stroke="#7E5A28" strokeWidth=".8" opacity=".75" />
          <rect x="33.4" y="101.2" width="93.2" height="10.6" rx="1.2" fill="none" stroke="#8A6534" strokeWidth=".7" opacity=".5" />
          <text className={s.plateTxt} x="80" y="109.4" textAnchor="middle">
            Ring for Service
          </text>
        </svg>
      </button>

      {/* ---------------- the folio ---------------- */}
      <section className={s.folio} role="dialog" aria-label="FOUNDER concierge" aria-hidden={!open}>
        <div className={s.tabs} role="tablist" aria-label="Concierge desks">
          {DESK_ORDER.map((key, i) => (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={desk === key}
              tabIndex={open ? 0 : -1}
              className={i % 2 === 0 ? s.tabCream : s.tabDark}
              onClick={() => {
                setDesk(key);
                setTurns([]);
              }}
            >
              {DESKS[key].label}
            </button>
          ))}
        </div>

        <div className={s.cover}>
          <div className={s.spine}>
            <span className={`${s.hinge} ${s.hingeA}`} />
            <span className={`${s.hinge} ${s.hingeB}`} />
          </div>

          <div className={s.page}>
            <div className={s.frame}>
              <span /><span /><span /><span />
            </div>

            <div className={s.inner}>
              <div className={s.ph}>
                <div className={s.kicker}>Founder Concierge</div>
                <button
                  type="button"
                  className={s.close}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  aria-label="Close"
                >
                  ×
                </button>
                <div className={s.ruleD}><i /><b /><i /></div>
              </div>

              {!chatting ? (
                /* ---------------- the menu ---------------- */
                <div className={s.view}>
                  <div className={s.menuScroll}>
                    <h2 className={s.welcome}>{content.title}</h2>
                    <p className={s.askline}>How can I be of service?</p>

                    {content.courses.map((course) => (
                      <section className={s.course} key={course.label}>
                        <div className={s.courseLabel}>
                          <i /><span>{course.label}</span><i />
                        </div>
                        {course.items.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            className={s.dish}
                            tabIndex={open ? 0 : -1}
                            onClick={() => ask(item.ask)}
                          >
                            <span className={s.dishLine}>
                              <span className={s.dishName}>{item.name}</span>
                              <span className={s.leader} />
                              {ARROW}
                            </span>
                            <span className={s.dishDesc}>{item.desc}</span>
                          </button>
                        ))}
                      </section>
                    ))}

                    {content.faq.length > 0 && (
                      <div className={s.faq}>
                        <div className={s.courseLabel}>
                          <i /><span>Frequently asked</span><i />
                        </div>
                        {content.faq.map((q) => (
                          <button
                            key={q}
                            type="button"
                            className={s.faqBtn}
                            tabIndex={open ? 0 : -1}
                            onClick={() => ask(q)}
                          >
                            <i />
                            <span>{q}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className={s.cloche}><i />{CLOCHE}<i /></div>
                    <p className={s.closing}>{content.note}</p>
                  </div>
                </div>
              ) : (
                /* ---------------- the conversation ---------------- */
                <div className={s.view}>
                  <div className={s.log} ref={logRef} aria-live="polite">
                    {turns.map((turn, i) =>
                      turn.who === "you" ? (
                        <div className={`${s.turn} ${s.you}`} key={i}>
                          <div className={s.slip}>
                            <span className={s.who}>You</span>
                            <span className={s.txt}>{turn.text}</span>
                          </div>
                        </div>
                      ) : (
                        <div className={`${s.turn} ${turn.kind ? s[turn.kind] : ""}`} key={i}>
                          <div className={s.bot}>
                            {turn.tag && (
                              <span className={`${s.tag} ${turn.kind === "care" ? s.tagCare : ""}`}>
                                {turn.tag}
                              </span>
                            )}
                            <div className={s.body}>{renderBody(turn.text)}</div>
                          </div>
                        </div>
                      ),
                    )}
                    {busy && (
                      <div className={`${s.turn} ${s.thinking}`}>
                        {CLOCHE}
                        <i /><i /><i />
                      </div>
                    )}
                  </div>
                  <div className={s.chips}>
                    {content.chips.map((c) => (
                      <button key={c} type="button" tabIndex={open ? 0 : -1} onClick={() => ask(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form
                className={s.composer}
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(draft);
                }}
              >
                {/* Honeypot: off-screen, hidden from screen readers, skipped by
                    tabbing. Invisible to a person, irresistible to a bot. */}
                <div aria-hidden style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                  <input ref={hpRef} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <input
                  ref={fieldRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  type="text"
                  autoComplete="off"
                  maxLength={1000}
                  tabIndex={open ? 0 : -1}
                  placeholder="Ask the concierge…"
                  aria-label="Message the concierge"
                />
                <button type="submit" disabled={busy} tabIndex={open ? 0 : -1} aria-label="Send">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>

              <p className={s.disclaimer}>
                Automated assistant — not a medical professional.
                {showMore ? (
                  <span>
                    {" "}We can’t diagnose skin conditions or give medical advice. These are
                    cosmetic products, intended to improve the appearance of skin, and are not
                    intended to diagnose, treat, cure or prevent any disease.
                  </span>
                ) : (
                  <button type="button" tabIndex={open ? 0 : -1} onClick={() => setShowMore(true)}>
                    More
                  </button>
                )}
              </p>
            </div>
          </div>

          <div className={`${s.corner} ${s.cornerTr}`}><i /><i /></div>
          <div className={`${s.corner} ${s.cornerBr}`}><i /><i /></div>
        </div>
      </section>
    </div>
  );
}
