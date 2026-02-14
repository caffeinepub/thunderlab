/**
 * Detect if an error is a "locked" rejection from the backend
 */
export function isLockedError(error: unknown): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return (
    errorMessage.includes('unlock your account') ||
    errorMessage.includes('Session expired') ||
    errorMessage.includes('Locked')
  );
}
