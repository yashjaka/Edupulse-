import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, CheckCircle2, GraduationCap, LockKeyhole, Mail } from 'lucide-react';
import { useHealthCheck } from '@workspace/api-client-react';
import { Button, Input } from '@/components/edupulse';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('faculty@edupulse.edu');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const health = useHealthCheck();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || password.length < 4) { setError('Enter your faculty email and a password with at least 4 characters.'); return; }
    localStorage.setItem('edupulse-session', 'active');
    setLocation('/dashboard');
  };
  return <div className="min-h-[100dvh] bg-sidebar text-sidebar-foreground lg:grid lg:grid-cols-[1.1fr_.9fr]">
    <section className="relative hidden overflow-hidden border-r border-sidebar-border px-12 py-12 lg:flex lg:flex-col lg:justify-between xl:px-20">
      <div className="absolute -right-28 top-24 h-72 w-72 rounded-full border border-sidebar-primary/20" /><div className="absolute -right-12 top-40 h-44 w-44 rounded-full border border-sidebar-primary/20" />
      <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><GraduationCap size={22} /></div><span className="font-serif text-xl font-semibold">EduPulse</span></div>
      <div className="relative max-w-xl"><div className="mb-7 font-mono text-[10px] uppercase tracking-[.25em] text-sidebar-primary">Academic pulse / 04</div><h1 className="font-serif text-6xl font-semibold leading-[.98] tracking-[-.065em] xl:text-7xl">Make progress<br /><span className="text-sidebar-primary">visible.</span></h1><p className="mt-7 max-w-md text-base leading-7 text-sidebar-foreground/60">A clear place to notice the students who are thriving, the ones who need a nudge, and what to do next.</p><div className="mt-12 flex gap-8 text-xs text-sidebar-foreground/55"><div><div className="font-mono text-2xl text-sidebar-primary">04</div><div className="mt-1">Core subjects</div></div><div><div className="font-mono text-2xl text-sidebar-primary">01</div><div className="mt-1">Faculty workspace</div></div></div></div>
      <div className="font-mono text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/35">B.Tech · Computer Science & Engineering</div>
    </section>
    <section className="flex min-h-[100dvh] items-center justify-center bg-background px-6 py-10 text-foreground sm:px-12">
      <div className="w-full max-w-[410px]">
        <div className="mb-12 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><GraduationCap size={22} /></div><span className="font-serif text-xl font-semibold">EduPulse</span></div>
        <div className="mb-9"><div className="mb-3 font-mono text-[10px] uppercase tracking-[.22em] text-primary">Welcome back</div><h2 className="font-serif text-4xl font-semibold tracking-[-.05em]">Your desk is ready.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to pick up where you left off.</p></div>
        <form onSubmit={submit} className="space-y-5">
          <label className="block space-y-2"><span className="flex items-center gap-2 text-sm font-semibold"><Mail size={15} className="text-primary" />Faculty email</span><Input data-testid="input-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" /></label>
          <label className="block space-y-2"><span className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole size={15} className="text-primary" />Password</span><Input data-testid="input-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /></label>
          {error && <div data-testid="status-login-error" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}
          <Button data-testid="button-login" type="submit" className="mt-2 h-12 w-full">Open workspace <ArrowRight size={17} /></Button>
        </form>
        <div className="mt-8 flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><CheckCircle2 size={15} className={health.isError ? 'text-destructive' : 'text-primary'} />{health.isLoading ? 'Checking workspace connection…' : health.isError ? 'Workspace is offline right now' : 'Workspace connection secure'}</div>
        <p className="mt-8 text-center font-mono text-[9px] uppercase tracking-[.15em] text-muted-foreground/60">Demo access · enter any valid faculty details</p>
      </div>
    </section>
  </div>;
}