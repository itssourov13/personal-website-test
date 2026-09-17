import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Per-request CSP with a nonce for script-src. Next.js/React ship their
// hydration bootstrap and the App Router's RSC-payload streaming as inline
// <script> tags, and next-themes injects a small inline script to set the
// theme class before paint — all blocked by a nonce-free, unsafe-inline-free
// script-src (see project-planning/04-strategy/security-considerations.md
// §2 / D-018 / D-022, which predates this fix and should be updated
// alongside it). A nonce lets those specific scripts run without opening
// script-src up to arbitrary inline code the way 'unsafe-inline' would.
//
// Trade-off: nonces are generated per request, so Next.js requires dynamic
// rendering wherever the nonce is read (our root layout does, via
// headers()) — this site loses static generation/ISR while nonce-based CSP
// is in place. See the fix summary for details and the static-generation
// alternative (experimental SRI hashing).
//
// Next.js 15 convention: this file must be named `middleware.ts` and export
// `middleware` (Next.js 16 renames this to `proxy.ts` / `export function
// proxy`, but this project is pinned to next@^15.x).
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://plausible.io${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://plausible.io;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `;
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  // Forward the nonce to Server Components via a request header (read with
  // headers() in layout.tsx / page.tsx) so our own <Script>/<script> tags
  // can be nonced too — Next only auto-nonces scripts it generates itself.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}

export const config = {
  matcher: [
    {
      // Skip API routes, static/image assets, and the favicon — they're
      // not HTML documents and don't need a script-src nonce. Also skip
      // next/link prefetch requests so we don't burn a fresh nonce (and
      // force a dynamic render) on a payload that may never be shown.
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
