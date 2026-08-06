import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section bg-cream">
      <div className="shell-narrow py-10">
        <p className="eyebrow text-bronze-ink">404</p>
        <h1 className="headline mt-5 max-w-[16ch] text-balance text-charcoal">
          That page isn’t here.
        </h1>
        <p className="mt-5 max-w-md text-charcoal/80">
          Either it moved or it never existed. The three serums are still where you left
          them.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/shop" className="btn btn-dark">
            Shop the collection
          </Link>
          <Link href="/" className="btn btn-outline">
            Back to the homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
