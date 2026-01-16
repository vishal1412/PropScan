import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { useAdminLogin } from '../hooks/useQueries';
import { toast } from 'sonner';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ open, onOpenChange, onLoginSuccess }: AdminLoginModalProps) {
  const adminLoginMutation = useAdminLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    try {
      console.log('Attempting admin login with credentials...');
      await adminLoginMutation.mutateAsync({ username, password });
      console.log('Admin login mutation completed successfully');
      toast.success('Admin login successful! Redirecting to admin panel...');
      setUsername('');
      setPassword('');
      // Call the success callback which will close the modal
      onLoginSuccess();
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Admin Login
          </DialogTitle>
          <DialogDescription>
            Enter your admin credentials to access the admin panel
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              disabled={adminLoginMutation.isPending}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={adminLoginMutation.isPending}
              autoComplete="current-password"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={adminLoginMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={adminLoginMutation.isPending}>
              {adminLoginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
