const PASSWORD_STORAGE_KEY = 'biobusiness_admin_password_v1';
const SESSION_AUTH_KEY = 'biobusiness_admin_authenticated_v1';
const DEFAULT_PASSWORD = 'biobusiness';

/**
 * Get current admin dashboard password from localStorage or fallback to default 'biobusiness'
 */
export function getStoredPassword(): string {
  try {
    const raw = localStorage.getItem(PASSWORD_STORAGE_KEY);
    return raw || DEFAULT_PASSWORD;
  } catch (err) {
    return DEFAULT_PASSWORD;
  }
}

/**
 * Update stored admin password
 */
export function saveStoredPassword(newPassword: string): boolean {
  try {
    localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
    return true;
  } catch (err) {
    console.error('Error saving admin password:', err);
    return false;
  }
}

/**
 * Verify input password against stored password
 */
export function verifyPassword(input: string): boolean {
  const current = getStoredPassword();
  return input === current;
}

/**
 * Check if current browser session is authenticated
 */
export function isSessionAuthenticated(): boolean {
  try {
    return (
      sessionStorage.getItem(SESSION_AUTH_KEY) === 'true' ||
      localStorage.getItem(SESSION_AUTH_KEY) === 'true'
    );
  } catch (err) {
    return false;
  }
}

/**
 * Set browser authentication status
 */
export function setSessionAuthenticated(authenticated: boolean, remember: boolean = false): void {
  try {
    if (authenticated) {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      if (remember) {
        localStorage.setItem(SESSION_AUTH_KEY, 'true');
      }
    } else {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      localStorage.removeItem(SESSION_AUTH_KEY);
    }
  } catch (err) {
    console.error('Error updating auth session status:', err);
  }
}
