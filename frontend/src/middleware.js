import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/login_confirmed(.*)',
  '/reset_password(.*)',
  '/reset_confirmed(.*)',
  '/signup(.*)',
  '/signup_confirmed(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If not public and not signed in, redirect to login
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
