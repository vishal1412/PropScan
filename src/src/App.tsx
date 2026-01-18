import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel';
import CityPropertyPage from './pages/CityPropertyPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { DataService } from './services/dataService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <Alert className="max-w-lg border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
              </p>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                variant="outline"
              >
                Reload Application
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const gurgaonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/city/gurgaon',
  component: () => <CityPropertyPage citySlug="gurgaon" />,
});

const noidaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/city/noida',
  component: () => <CityPropertyPage citySlug="noida" />,
});

const dubaiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/city/dubai',
  component: () => <CityPropertyPage citySlug="dubai" />,
});

const projectDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/city/$cityName/project/$projectSlug',
  component: ProjectDetailsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  gurgaonRoute,
  noidaRoute,
  dubaiRoute,
  projectDetailsRoute,
]);

const router = createRouter({ 
  routeTree,
  basepath: '/PropScan'
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  // Clear old localStorage data on app startup
  useEffect(() => {
    DataService.clearLocalStorage();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
