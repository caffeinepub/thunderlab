import { isLockedError } from './lockedError';
import { setReturnTo } from './returnToContext';

/**
 * Wrapper for backend calls that handles locked errors.
 * Redirects to unlock page while preserving navigation context.
 * Prefers caller-provided onLocked handlers to avoid navigation loops.
 */
export async function backendCallWithUnlock<T>(
  call: () => Promise<T>,
  onLocked?: () => void
): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (isLockedError(error)) {
      // Save current location for return navigation
      const currentPath = window.location.pathname;
      if (currentPath !== '/unlock') {
        setReturnTo(currentPath);
      }
      
      // Call custom handler or navigate
      if (onLocked) {
        onLocked();
      } else {
        // Only navigate if not already on unlock page
        if (currentPath !== '/unlock') {
          window.location.href = '/unlock';
        }
      }
    }
    throw error;
  }
}
