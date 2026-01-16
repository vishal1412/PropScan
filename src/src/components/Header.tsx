import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Shield, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched: isAdminFetched, refetch: refetchAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  useEffect(() => {
    if (isAuthenticated && identity) {
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      
      const refetchAttempts = [50, 150, 300, 600, 1000, 1500];
      const timers = refetchAttempts.map(delay => 
        setTimeout(() => {
          console.log(`Refetching admin status at ${delay}ms`);
          refetchAdmin();
        }, delay)
      );
      
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [isAuthenticated, identity, queryClient, refetchAdmin]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
          refetchAdmin();
        }, 100);
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const showAdminButton = isAuthenticated && isAdminFetched && isAdmin === true;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate({ to: '/' })}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
            <img src="/assets/generated/propscan-logo-transparent.dim_200x200.png" alt="PropScan Intelligence" className="h-12 w-12 relative" />
          </div>
          <div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              PropScan Intelligence
            </span>
            <p className="text-xs text-slate-500 font-medium">Smart Property Decisions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && isAdminLoading && !isAdminFetched && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 px-3 py-2 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking permissions...</span>
            </div>
          )}
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="lg"
            className={isAuthenticated ? '' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all'}
          >
            {disabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {text}
          </Button>
        </div>
      </div>
    </header>
  );
}
