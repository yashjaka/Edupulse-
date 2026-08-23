import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Students from '@/pages/students';
import Attendance from '@/pages/attendance';
import Performance from '@/pages/performance';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Login} /><Route path="/dashboard" component={Dashboard} /><Route path="/students" component={Students} /><Route path="/attendance" component={Attendance} /><Route path="/performance" component={Performance} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
