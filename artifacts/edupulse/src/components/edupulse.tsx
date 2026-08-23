import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  BarChart3,
  CalendarCheck2,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  Settings2,
  SlidersHorizontal,
  UsersRound,
  X,
} from 'lucide-react';

export const SUBJECTS = ['WAD', 'DBMS', 'COA', 'DMGT'];

export function AppShell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('edupulse-theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('edupulse-theme', dark ? 'dark' : 'light');
  }, [dark]);
  const nav = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/students', label: 'Students', icon: UsersRound },
    { href: '/attendance', label: 'Attendance', icon: CalendarCheck2 },
    { href: '/performance', label: 'Performance', icon: BarChart3 },
  ];
  const closeOnMobile = () => setMobileOpen(false);
  return (
    <div className="min-h-[100dvh] bg-background">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[92px] items-center gap-3 border-b border-sidebar-border px-7">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"><GraduationCap size={22} /></div>
          <div><div className="font-serif text-[21px] font-semibold tracking-tight">EduPulse</div><div className="font-mono text-[9px] uppercase tracking-[.22em] text-sidebar-foreground/55">Faculty workspace</div></div>
          <button data-testid="button-close-menu" onClick={closeOnMobile} className="ml-auto rounded-md p-1 text-sidebar-foreground/60 md:hidden"><X size={18} /></button>
        </div>
        <div className="px-4 pt-8">
          <div className="px-3 pb-3 font-mono text-[10px] uppercase tracking-[.2em] text-sidebar-foreground/40">Workspace</div>
          <nav className="space-y-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} data-testid={`link-${label.toLowerCase()}`} onClick={closeOnMobile} className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${location === href ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
                <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{location === href && <ChevronRight className="ml-auto" size={15} />}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto space-y-1 border-t border-sidebar-border p-4">
          <div data-testid="text-help" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-sidebar-foreground/45"><CircleHelp size={17} />Help & guide</div>
          <div data-testid="text-settings" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-sidebar-foreground/45"><Settings2 size={17} />Workspace settings</div>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-sidebar-accent/70 p-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-sidebar-primary font-serif text-sm font-semibold text-sidebar-primary-foreground">AK</div>
            <div className="min-w-0"><div className="truncate text-xs font-semibold">Dr. Ananya Kulkarni</div><div className="truncate text-[10px] text-sidebar-foreground/50">Faculty · CSE</div></div>
          </div>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" data-testid="button-overlay" onClick={closeOnMobile} className="fixed inset-0 z-30 bg-foreground/30 md:hidden" />}
      <main className="min-h-[100dvh] md:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-md md:px-10">
          <div className="flex items-center gap-3"><button data-testid="button-open-menu" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-muted md:hidden"><Menu size={21} /></button><div className="hidden font-mono text-[10px] uppercase tracking-[.22em] text-muted-foreground sm:block">B.Tech · Semester 04</div></div>
          <div className="flex items-center gap-3"><button data-testid="button-theme" onClick={() => setDark(!dark)} className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted">{dark ? 'Light view' : 'Quiet mode'}</button><div className="grid h-9 w-9 place-items-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground">AK</div></div>
        </header>
        <div className="mx-auto max-w-[1440px] p-5 md:p-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.22em] text-primary"><span className="h-px w-5 bg-primary" />{eyebrow}</div><h1 className="font-serif text-3xl font-semibold tracking-[-.04em] text-foreground md:text-[40px]">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>{action}</div>;
}

export function Button({ children, variant = 'primary', ...props }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'quiet' | 'danger' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = { primary: 'bg-primary text-primary-foreground hover:brightness-110 shadow-sm', secondary: 'border border-border bg-card text-foreground hover:bg-muted', quiet: 'text-muted-foreground hover:bg-muted hover:text-foreground', danger: 'text-destructive hover:bg-destructive/10' };
  return <button {...props} className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-[.98] disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${props.className ?? ''}`}>{children}</button>;
}

export function StatCard({ label, value, detail, icon: Icon, accent = 'gold' }: { label: string; value: string; detail: string; icon: typeof UsersRound; accent?: 'gold' | 'green' | 'blue' | 'red' }) {
  const colors = { gold: 'bg-accent text-accent-foreground', green: 'bg-primary text-primary-foreground', blue: 'bg-chart-3 text-primary-foreground', red: 'bg-destructive text-destructive-foreground' };
  return <div data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`} className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sm"><div className="flex items-start justify-between"><div className="font-mono text-[10px] uppercase tracking-[.17em] text-muted-foreground">{label}</div><div className={`grid h-9 w-9 place-items-center rounded-lg ${colors[accent]}`}><Icon size={17} /></div></div><div className="mt-5 font-serif text-3xl font-semibold tracking-[-.04em]">{value}</div><div className="mt-1 text-xs text-muted-foreground">{detail}</div></div>;
}

export function SkeletonBlock({ className = '' }: { className?: string }) { return <div className={`skeleton rounded-lg ${className}`} />; }
export function LoadingPanel() { return <div className="space-y-4"><SkeletonBlock className="h-28 w-full" /><div className="grid gap-4 md:grid-cols-3"><SkeletonBlock className="h-36" /><SkeletonBlock className="h-36" /><SkeletonBlock className="h-36" /></div></div>; }
export function ErrorState({ message = 'We could not load this workspace right now.', retry }: { message?: string; retry?: () => void }) { return <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-10 text-center"><div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive">!</div><h3 className="font-serif text-lg font-semibold">A small interruption</h3><p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{message}</p>{retry && <Button onClick={retry} variant="secondary" className="mt-5">Try again</Button>}</div>; }
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-14 text-center"><div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-xl bg-muted text-primary"><ClipboardList size={20} /></div><h3 className="font-serif text-lg font-semibold">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>{action && <div className="mt-5">{action}</div>}</div>; }

export function Modal({ title, description, children, onClose }: { title: string; description?: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="page-enter max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-border bg-card p-6 shadow-md sm:rounded-2xl md:p-8"><div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="font-serif text-2xl font-semibold tracking-[-.03em]">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div><button data-testid="button-close-modal" onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X size={18} /></button></div>{children}</div></div>;
}

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><input data-testid="input-search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="focus-ring h-11 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary sm:w-[300px]" /></div>; }
export function FilterSelect({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: string[]; label: string }) { return <label className="flex h-11 items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm"><SlidersHorizontal size={15} className="text-muted-foreground" /><span className="sr-only">{label}</span><select data-testid={`select-${label.toLowerCase()}`} value={value} onChange={(event) => onChange(event.target.value)} className="bg-transparent font-medium outline-none">{options.map((option) => <option key={option} value={option}>{option === 'all' ? 'All subjects' : option}</option>)}</select></label>; }
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block space-y-2"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</span>{children}</label>; }
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`focus-ring h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary ${props.className ?? ''}`} />; }
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={`focus-ring h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary ${props.className ?? ''}`} />; }
export function Toast({ message }: { message: string }) { return <div role="status" data-testid="status-toast" className="fixed bottom-5 right-5 z-[60] rounded-lg bg-sidebar px-4 py-3 text-sm font-medium text-sidebar-foreground shadow-md">{message}</div>; }