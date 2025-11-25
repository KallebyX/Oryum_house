import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Get the current session on the server side
 * Use this in Server Components and API routes
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from the session
 * Returns null if no user is logged in
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in API routes or Server Actions
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized - Please sign in');
  }
  return session;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string | string[]) {
  const user = await getCurrentUser();
  if (!user) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
}

/**
 * Require specific role - throws error if user doesn't have required role
 */
export async function requireRole(role: string | string[]) {
  const session = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];

  if (!roles.includes(session.user.role)) {
    throw new Error('Forbidden - Insufficient permissions');
  }

  return session;
}

// Re-export authOptions for convenience
export { authOptions } from '@/app/api/auth/[...nextauth]/route';
