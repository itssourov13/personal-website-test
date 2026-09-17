import type { NextConfig } from "next";

// Security headers per project-planning/04-strategy/security-considerations.md
// §2. Content-Security-Policy is intentionally NOT set here: it now needs a
// fresh nonce on every request (so Next's inline hydration/RSC-streaming
// scripts and next-themes' theme script can run without 'unsafe-inline'),
// which only middleware can generate — see src/middleware.ts. Setting CSP
// in both places would send two Content-Security-Policy headers, and
// browsers require each directive to satisfy every policy independently,
// so the nonce-free static one here would still block the very scripts the
// middleware's nonce allows. Do not re-add it without removing it from
// src/middleware.ts first (or vice versa) — CSP must be set in exactly one
// place.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS: only meaningful once HTTPS is confirmed live in production (P7
  // launch checklist item). Submitting to the HSTS preload list is a
  // separate, deliberate step at launch — do not submit before then.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
