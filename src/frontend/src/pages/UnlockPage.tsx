import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUnlockStatus } from '../hooks/useUnlockStatus';
import { useIsCallerAdmin } from '../hooks/useCallerRole';
import { useAppPassword } from '../hooks/useAppPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getReturnTo, clearReturnTo } from '../lib/returnToContext';

export default function UnlockPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isUnlocked, isLoading: statusLoading, isFetched: unlockFetched } = useUnlockStatus();
  const { isAdmin, isLoading: roleLoading, isFetched: roleFetched } = useIsCallerAdmin();
  const { unlockAccount, savePassword, isUnlocking, isSaving } = useAppPassword();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isCreatingPassword, setIsCreatingPassword] = useState(false);

  const isFetched = unlockFetched && roleFetched;
  const isLoading = statusLoading || roleLoading;

  // Redirect if not authenticated
  useEffect(() => {
    if (!identity && isFetched) {
      navigate({ to: '/' });
    }
  }, [identity, isFetched, navigate]);

  // Admin users bypass unlock - redirect immediately
  useEffect(() => {
    if (identity && roleFetched && isAdmin) {
      const returnTo = getReturnTo();
      clearReturnTo();
      navigate({ to: returnTo || '/projects' });
    }
  }, [identity, isAdmin, roleFetched, navigate]);

  // Redirect if already unlocked
  useEffect(() => {
    if (isUnlocked && unlockFetched && !isAdmin) {
      const returnTo = getReturnTo();
      clearReturnTo();
      navigate({ to: returnTo || '/projects' });
    }
  }, [isUnlocked, unlockFetched, isAdmin, navigate]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password');
      return;
    }

    const success = await unlockAccount(password);
    if (success) {
      toast.success('Account unlocked');
      const returnTo = getReturnTo();
      clearReturnTo();
      navigate({ to: returnTo || '/projects' });
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const success = await savePassword(password);
    if (success) {
      toast.success('Password created successfully');
      // Now unlock with the new password
      await unlockAccount(password);
      const returnTo = getReturnTo();
      clearReturnTo();
      navigate({ to: returnTo || '/projects' });
    } else {
      setError('Failed to create password. Please try again.');
    }
  };

  // Show loading while checking authentication and role
  if (!identity || isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render unlock UI for admins (they'll be redirected)
  if (isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-accent/10">
              {isCreatingPassword ? <Shield className="w-8 h-8 text-accent-foreground" /> : <Lock className="w-8 h-8 text-accent-foreground" />}
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            {isCreatingPassword ? 'Create App Password' : 'Unlock Thunderlab'}
          </h1>
          <p className="text-muted-foreground">
            {isCreatingPassword
              ? 'Protect your projects and data with a password'
              : 'Enter your password to access your projects'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isCreatingPassword ? 'Set Your Password' : 'Enter Password'}</CardTitle>
            <CardDescription>
              {isCreatingPassword
                ? 'This password protects access to your Thunderlab data on this device'
                : 'Your password keeps your music projects secure'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isCreatingPassword ? handleCreatePassword : handleUnlock} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isCreatingPassword ? 'Create a strong password' : 'Enter your password'}
                  autoFocus
                />
              </div>

              {isCreatingPassword && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                  />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isUnlocking || isSaving}>
                {isUnlocking || isSaving ? 'Processing...' : isCreatingPassword ? 'Create Password' : 'Unlock'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setIsCreatingPassword(!isCreatingPassword);
                    setPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                >
                  {isCreatingPassword ? 'Already have a password?' : 'Need to create a password?'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Your password is never stored in plain text. It's hashed on your device before being sent to secure storage.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
