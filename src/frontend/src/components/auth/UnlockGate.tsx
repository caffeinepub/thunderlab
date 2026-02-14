import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useUnlockStatus } from '../../hooks/useUnlockStatus';
import { useIsCallerAdmin } from '../../hooks/useCallerRole';
import { setReturnTo } from '../../lib/returnToContext';

interface UnlockGateProps {
  children: ReactNode;
}

export default function UnlockGate({ children }: UnlockGateProps) {
  const { identity } = useInternetIdentity();
  const { data: isUnlocked, isLoading: unlockLoading, isFetched: unlockFetched } = useUnlockStatus();
  const { isAdmin, isLoading: roleLoading, isFetched: roleFetched } = useIsCallerAdmin();
  const navigate = useNavigate();

  const isLoading = unlockLoading || roleLoading;
  const isFetched = unlockFetched && roleFetched;

  useEffect(() => {
    // Not authenticated - redirect to login
    if (!identity && isFetched) {
      navigate({ to: '/' });
      return;
    }

    // Admin users bypass unlock requirement
    if (identity && roleFetched && isAdmin) {
      // Admin is allowed through without unlock check
      return;
    }

    // Non-admin users must be unlocked
    if (identity && isFetched && !isAdmin && !isUnlocked && !isLoading) {
      // Save current location to return after unlock
      setReturnTo(window.location.pathname);
      navigate({ to: '/unlock' });
    }
  }, [identity, isUnlocked, isAdmin, isLoading, isFetched, roleFetched, navigate]);

  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access if:
  // 1. User is authenticated AND is admin (bypass unlock)
  // 2. User is authenticated AND is unlocked (normal flow)
  if (!identity || (!isAdmin && !isUnlocked)) {
    return null;
  }

  return <>{children}</>;
}
