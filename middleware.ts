import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/api/user(.*)',
  '/api/rankings/(.*)/vote',
  '/api/rankings/(.*)/edit',
  '/create(.*)',
  '/premium(.*)',
  '/my-votes(.*)',
  '/liked(.*)',
])

export default clerkMiddleware((auth, req) => {
  // For protected routes, we'll let the individual API routes handle auth
  // The middleware just needs to be present for Clerk to work
  // Individual routes will use currentUser() to check authentication
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 