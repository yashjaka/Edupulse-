import { lazy, Suspense, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

// Login loaded immediately for instant initial load
import Login from '@/pages/login';

// Lazy load secondary pages on demand
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Students = lazy(() => import('@/pages/students'));
const Attendance = lazy(() => import('@/pages/attendance'));
const Performance = lazy(() => import('@/pages/performance'));
const NotFound = lazy(() => import('@/pages/not-found'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache to prevent duplicate re-fetches
      refetchOnWindowFocus: false, // Prevent unnecessary refetches on window focus
    },
  },
});

function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs font-medium">Loading EduPulse...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/students" component={Students} />
          <Route path="/attendance" component={Attendance} />
          <Route path="/performance" component={Performance} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
