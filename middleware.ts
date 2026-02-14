import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { USER_ID_COOKIE } from './lib/cookies';

export function middleware(request: NextRequest) {
    const userId = request.cookies.get(USER_ID_COOKIE)?.value;
    const { pathname } = request.nextUrl;

    // Paths that don't require authentication
    const isPublicPath = pathname === '/welcome' || pathname.startsWith('/api/');

    if (!userId && !isPublicPath) {
        // Redirect to welcome if no session found
        return NextResponse.redirect(new URL('/welcome', request.url));
    }

    if (userId && pathname === '/welcome') {
        // Redirect to home if user already has a session
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|avatars|logo.png|.*\\.png$).*)',
    ],
};
