import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useCallerRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, Mic, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { identity, login, isLoggingIn, isLoginError, loginError } = useInternetIdentity();
  const { isAdmin, isLoading: roleLoading, isFetched: roleFetched } = useIsCallerAdmin();
  const navigate = useNavigate();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for role to be fetched before redirecting
    if (identity && roleFetched) {
      if (isAdmin) {
        // Admin users go directly to projects
        navigate({ to: '/projects' });
      } else {
        // Non-admin users go to unlock page
        navigate({ to: '/unlock' });
      }
    }
  }, [identity, isAdmin, roleFetched, navigate]);

  const handleLogin = useCallback(async () => {
    setLocalError(null);
    setIsConnecting(true);

    // Set a timeout to detect if popup was blocked or failed to open
    const popupTimeout = setTimeout(() => {
      if (isConnecting && !identity) {
        setIsConnecting(false);
        setLocalError(
          'Unable to open sign-in window. Please allow popups for this site and try again.'
        );
      }
    }, 3000);

    try {
      await login();
      clearTimeout(popupTimeout);
    } catch (error) {
      clearTimeout(popupTimeout);
      setIsConnecting(false);
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setLocalError(errorMessage);
    }
  }, [login, isConnecting, identity]);

  // Clear connecting state when login succeeds or errors
  useEffect(() => {
    if (identity || isLoginError) {
      setIsConnecting(false);
    }
  }, [identity, isLoginError]);

  // Display error from hook or local error
  const displayError = localError || (isLoginError && loginError ? sanitizeErrorMessage(loginError.message) : null);

  const buttonDisabled = isLoggingIn || isConnecting;
  const buttonText = isLoggingIn || isConnecting ? 'Connecting...' : 'Sign In';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full max-w-md space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <img src="/assets/generated/thunderlab-app-icon.dim_512x512.png" alt="Thunderlab" className="w-24 h-24 rounded-2xl shadow-2xl" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Thunderlab</h1>
          <p className="text-lg text-muted-foreground">
            Professional music production, anywhere
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-4">
          <Card className="border-accent/20">
            <CardContent className="flex items-start gap-3 pt-6">
              <div className="p-2 rounded-lg bg-accent/10">
                <Mic className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Multi-track Recording</h3>
                <p className="text-sm text-muted-foreground">Record vocals, import beats, layer your sound</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardContent className="flex items-start gap-3 pt-6">
              <div className="p-2 rounded-lg bg-accent/10">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Studio Effects</h3>
                <p className="text-sm text-muted-foreground">Autotune, EQ, compression, reverb & more</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardContent className="flex items-start gap-3 pt-6">
              <div className="p-2 rounded-lg bg-accent/10">
                <Music className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Cloud Projects</h3>
                <p className="text-sm text-muted-foreground">Save, export, and share your music</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Sign in to access your studio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {displayError}
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={handleLogin} disabled={buttonDisabled} className="w-full" size="lg">
              {buttonText}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Secure authentication powered by Internet Identity
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Founder: Gerald Lionel LeGrange
        </p>
      </div>
    </div>
  );
}

/**
 * Sanitize error messages to avoid exposing sensitive details
 */
function sanitizeErrorMessage(message: string): string {
  // Remove any potential sensitive data while keeping the message helpful
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('popup') || lowerMessage.includes('blocked')) {
    return 'Sign-in popup was blocked. Please allow popups for this site and try again.';
  }
  
  if (lowerMessage.includes('already authenticated')) {
    return 'You are already signed in. Please refresh the page.';
  }
  
  if (lowerMessage.includes('not initialized')) {
    return 'Authentication system is loading. Please wait a moment and try again.';
  }
  
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Generic fallback for other errors
  return 'Sign in failed. Please try again or contact support if the problem persists.';
}
