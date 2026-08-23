import { AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-md">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive"><AlertCircle size={24} /></div>
        <div className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">Lost page</div>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-.04em]">This page is not in the register.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">The address may be outdated, or this workspace has moved on.</p>
        <Link href="/" data-testid="link-return-home" className="mt-7 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">Return to sign in</Link>
      </div>
    </div>
  );
}
