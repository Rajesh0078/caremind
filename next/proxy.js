import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
];

function extractSubdomain(request) {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const rootDomain = process.env.ROOT_DOMAIN;

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const match = url.match(/http:\/\/([^.]+)\.localhost/);
    if (match?.[1]) return match[1];

    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    return hostname.split("---")[0];
  }

  const rootDomainFormatted = rootDomain.split(":")[0];

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain
    ? hostname.replace(`.${rootDomainFormatted}`, "")
    : null;
}

export const proxy = async(req) => {
  const subdomain = extractSubdomain(req);
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  const isAdmin = subdomain === "admin";
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (!subdomain) {
    const isAllowed = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const basePath = isAdmin ? '/admin' : `/tenant/${subdomain}`;
    return NextResponse.rewrite(
      new URL(`${basePath}${pathname}`, req.url)
    );
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  const basePath = isAdmin ? "/admin" : `/tenant/${subdomain}`;
  return NextResponse.rewrite(
    new URL(`${basePath}${pathname}`, req.url)
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};