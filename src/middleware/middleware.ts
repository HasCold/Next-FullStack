import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req: request});
    const url = request.nextUrl;

    if(token && 
    (
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify") ||
        url.pathname.startsWith("/")
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }


}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',  // Allow all the path present in the dashboard route
    '/verify/:path*'  // Allow all the path present in the verify route
  ]
}