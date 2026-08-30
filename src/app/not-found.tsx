import Link from "next/link";

export default function NotFound() {
  return (
    /* A short error state, not reading — a dark room like the rest of the
       house's chrome, not a paper panel. .btn-dark/.btn-outline are
       paper-only, so the CTAs take their dark-room equivalents. */
    <section className="section room-dark">
      <div className="shell-narrow py-10">
        <p className="eyebrow text-champagne">404</p>
        <h1 className="headline mt-5 max-w-[16ch] text-balance text-cream">
          That page isn’t here.
        </h1>
        <p className="mt-5 max-w-md text-cream/80">
          Either it moved or it never existed. The three serums are still where you left
          them.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/shop" className="btn btn-primary">
            Shop the collection
          </Link>
          <Link href="/" className="btn btn-ghost-light">
            Back to the homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
