import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import auth from './lib/auth/auth';
import { routes } from './lib/boiler-config';

const publicRoutes = [
  routes.auth.login,
  routes.home,
  routes.portfolio,
  routes.contact,
  routes.tarifs,
];

const uploadPaths = ['/admin/portfolio/media/create'];

const safePaths = ['/image', '/_next', '/fonts', '/svg'];

const isSafePath = (path: string): boolean =>
  safePaths.some(p => path.startsWith(p)) || path.includes('.');

const isProtectedRoute = (path: string): boolean =>
  !publicRoutes.some(route => path.toLowerCase() === route.toLowerCase());

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname.toLowerCase();

  if (isSafePath(path)) {
    return NextResponse.next();
  }

  if (
    (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') &&
    uploadPaths.some(p => path.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (path.startsWith('/admin')) {
    const userRoles = session?.user.role?.split(',') ?? [];

    if (!session) {
      return NextResponse.redirect(
        new URL(`${routes.auth.login}?returnUrl=${encodeURIComponent(path)}`, req.nextUrl),
      );
    }

    if (!userRoles.includes('admin')) {
      return NextResponse.redirect(new URL(routes.home, req.nextUrl));
    }

    return NextResponse.next();
  }

  if (isProtectedRoute(path)) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`${routes.auth.login}?returnUrl=${encodeURIComponent(path)}`, req.nextUrl),
      );
    }
  }

  if (path === routes.auth.login.toLowerCase() && session) {
    return NextResponse.redirect(new URL(routes.home, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
