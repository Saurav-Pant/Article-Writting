// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { withAuth } from 'next-auth/middleware'

// export default withAuth(
//     function middleware(request: NextRequest) {
//         console.log('Middleware invoked');
//         return NextResponse.next()
//     },
//     {
//         callbacks: {
//             authorized: ({ token }) => {
//                 console.log('Token:', token);
//                 return !!token;
//             },
//         },
//     }
// )

// export const config = {
//     matcher: ['/write','/articles','/articles/:path*']
// }
