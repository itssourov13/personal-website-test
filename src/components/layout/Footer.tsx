import Link from "next/link";

import { siteConfig } from "@/lib/site.config";

const socialEntries = Object.entries(siteConfig.socials).filter(
  ([key]) => key !== "rss",
) as Array<[string, string]>;

export default function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-12 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-fg font-medium">{siteConfig.name}</p>
            <p className="text-muted text-sm">{siteConfig.tagline}</p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 md:max-w-md md:justify-end"
          >
            {[...siteConfig.nav, ...siteConfig.secondaryNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted hover:text-fg text-sm"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={siteConfig.socials.rss}
              className="text-muted hover:text-fg text-sm"
            >
              RSS
            </Link>
          </nav>
        </div>

        <div className="flex gap-4">
          {socialEntries.map(([label, href]) => (
            <a
              key={label}
              href={href}
              rel="me noopener noreferrer"
              target="_blank"
              aria-label={`${label} (opens in a new tab)`}
              className="text-muted hover:text-fg text-sm capitalize"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-border border-t">
        <p className="text-faint mx-auto w-full max-w-[1200px] px-5 py-6 text-xs md:px-12">
          © {new Date().getFullYear()} {siteConfig.name}. No cookies, no
          trackers — just this page.
        </p>
      </div>
    </footer>
  );
}
