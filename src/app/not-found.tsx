import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="container-luxe flex min-h-[70vh] flex-col items-center justify-center pt-32 pb-20 text-center">
      <Image
        src="/images/flavors/double-chocolate.png"
        alt=""
        width={160}
        height={146}
        preload
        className="h-auto animate-float drop-shadow-xl"
      />
      <p className="kicker mt-8">Error 404</p>
      <h1 className="heading-display mt-4 text-4xl sm:text-5xl">
        This scoop has
        <span className="italic text-gold-600"> melted away</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-700">
        The page you&apos;re looking for doesn&apos;t exist — but the feel-good part of
        the menu is very much still open.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-btn bg-plum-900 px-9 py-4 text-[0.78rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold"
      >
        Back to the creamery
      </Link>
    </section>
  );
}
