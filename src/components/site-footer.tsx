import { DiscordIcon, GithubIcon, NpmIcon } from "#components/brand-icons";
import {
  DISCORD_URL,
  DOCUMENTATION_URL,
  docs,
  EXAMPLES_URL,
  GITHUB_REPO_URL,
  LICENSE_URL,
  NPM_PACKAGE_URL,
} from "#constants";

const columns = [
  {
    title: "Get started",
    links: [
      { label: "Documentation", href: DOCUMENTATION_URL },
      { label: "Examples", href: EXAMPLES_URL },
      {
        label: "Provider configuration",
        href: docs("/providers-configuration/provider-configuration"),
      },
      {
        label: "Backend token validation",
        href: docs("/integration-guides/backend-token-validation"),
      },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "User object", href: docs("/features/user") },
      { label: "Auto logout", href: docs("/features/auto-logout") },
      { label: "Error management", href: docs("/features/error-management") },
      { label: "Keycloak utilities", href: docs("/features/keycloak-utils") },
    ],
  },
  {
    title: "Security",
    links: [
      { label: "Overview", href: docs("/security-features/overview") },
      { label: "DPoP", href: docs("/security-features/dpop") },
      { label: "Token substitution", href: docs("/security-features/token-substitution") },
      { label: "Browser runtime freeze", href: docs("/security-features/browser-runtime-freeze") },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Migrating from keycloak-js", href: docs("/resources/migrating-from-keycloak-js") },
      { label: "CSP configuration", href: docs("/resources/csp-configuration") },
      { label: "MIT license", href: LICENSE_URL },
    ],
  },
];

const socials = [
  { label: "GitHub", href: GITHUB_REPO_URL, Icon: GithubIcon },
  { label: "Discord", href: DISCORD_URL, Icon: DiscordIcon },
  { label: "npm", href: NPM_PACKAGE_URL, Icon: NpmIcon },
];

const titleClassName =
  "font-mono text-xs leading-none font-medium tracking-widest text-muted-foreground uppercase";

const linkClassName =
  "text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrapper grid grid-cols-2 gap-x-6 gap-y-10 border-t px-5 py-12 sm:px-10 sm:py-16 md:grid-cols-3 md:tick-left md:tick-right lg:grid-cols-[repeat(5,auto)] lg:justify-between lg:gap-x-16 lg:px-16">
        {columns.map(({ title, links }) => (
          <nav key={title} aria-label={title} className="flex flex-col gap-4">
            <span className={titleClassName}>{title}</span>
            <ul className="flex flex-col gap-2.5">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Social" className="flex flex-col gap-4">
          <span className={titleClassName}>Social</span>
          <ul className="flex flex-col gap-2.5">
            {socials.map(({ label, href, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 ${linkClassName}`}
                >
                  <Icon className="size-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
