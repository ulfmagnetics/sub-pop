import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { refreshSession } from '@/services/cognito-service';

// These variables have module scope and are shared across all instances of the module.
// This is a simple way to implement a singleton pattern in TypeScript.
let isRefreshing = false;
let refreshPromise: Promise<CognitoUserSession> | null = null;

export async function ensureSessionValid(): Promise<CognitoUserSession> {
  if (isRefreshing) {
    return refreshPromise!;
  }

  isRefreshing = true;
  refreshPromise = refreshSession()
    .catch((error) => {
      console.error('Failed to refresh session:', error);
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}
