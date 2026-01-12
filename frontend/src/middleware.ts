import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Next.js
 *
 * Note: With Laravel Sanctum SPA authentication, cookies are set on the API domain,
 * not the frontend domain. Therefore, we cannot reliably check authentication status
 * in middleware. Auth redirects are handled client-side by:
 * - useAuth hook in dashboard shells (redirects to login if not authenticated)
 * - useLogin/useRegister hooks (redirects after successful auth)
 * - DashboardShell component (checks onboarding status)
 */
export function middleware(request: NextRequest) {
  // Currently, middleware just passes through all requests
  // Auth protection is handled client-side due to Sanctum SPA cross-origin cookie limitations
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};
