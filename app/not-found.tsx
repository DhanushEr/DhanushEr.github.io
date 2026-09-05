import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vision">404 · no detection</p>
      <h1 className="text-display-lg font-display font-bold">That page isn’t on the site.</h1>
      <Link
        href="/"
        className="rounded-full border border-line px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink-mute"
      >
        Back to start
      </Link>
    </main>
  );
}
