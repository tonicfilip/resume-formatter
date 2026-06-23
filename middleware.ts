import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// /resume requires sign-in; /api/generate also enforced server-side
const isProtectedRoute = createRouteMatcher(['/resume(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // The generate API route does its own auth check, but adding
  // middleware here prevents unauthenticated requests from hitting
  // the route handler at all — saves a DB roundtrip
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
