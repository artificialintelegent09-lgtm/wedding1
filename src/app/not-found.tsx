import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-deep bg-damask px-6 text-center text-paper">
      <div>
        <p className="font-script text-6xl text-gold-gradient">Oh dear</p>
        <h1 className="mt-4 font-display text-2xl uppercase tracking-[0.25em]">Invitation not found</h1>
        <p className="mx-auto mt-4 max-w-sm font-light text-paper/70">
          This link doesn&apos;t match an invitation. Please check the link you were sent.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-full border border-gold/70 px-6 text-xs uppercase tracking-[0.2em] text-gold-light hover:bg-gold hover:text-deep"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
