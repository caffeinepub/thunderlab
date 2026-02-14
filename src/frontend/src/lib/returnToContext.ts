const RETURN_TO_KEY = 'thunderlab_return_to';

export function setReturnTo(path: string): void {
  try {
    sessionStorage.setItem(RETURN_TO_KEY, path);
  } catch (error) {
    console.warn('Failed to store return path:', error);
  }
}

export function getReturnTo(): string | null {
  try {
    return sessionStorage.getItem(RETURN_TO_KEY);
  } catch (error) {
    console.warn('Failed to retrieve return path:', error);
    return null;
  }
}

export function clearReturnTo(): void {
  try {
    sessionStorage.removeItem(RETURN_TO_KEY);
  } catch (error) {
    console.warn('Failed to clear return path:', error);
  }
}
