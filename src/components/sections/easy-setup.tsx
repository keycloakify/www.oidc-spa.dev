import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { docs } from "#constants";
import { sectionClassName } from "#lib/section";
import { CookieIcon, HouseIcon, StethoscopeIcon, type LucideIcon } from "lucide-react";

// Rendered by oidc-spa (src/core/diagnostic.ts) for a Keycloak client missing its redirect URI.
const DIAGNOSTIC_MESSAGE = `The silent sign-in process timed out.
Based on the diagnostic performed by oidc-spa the more likely causes are:
- Either the client ID "myclient" does not exist, or
- You forgot to add the OIDC callback URL to the list of Valid Redirect URIs.
Client ID: "myclient"
Callback URL to add to the list of Valid Redirect URIs: "https://my-app.example.com/"

It seems you are using Keycloak. Follow these steps to resolve the issue:

1. Go to the Keycloak admin console: https://auth.example.com/admin/master/console
2. Log in as an admin user.
3. In the top left corner select the realm "myrealm".
4. In the left menu, click on "Clients".
5. Locate the client "myclient" in the list and click on it.
6. Find "Valid Redirect URIs" and add "https://my-app.example.com/" to the list.
7. Save the changes.`;

const points: { Icon: LucideIcon; title: string; description: React.ReactNode }[] = [
  {
    Icon: HouseIcon,
    title: "One single redirect URI",
    description: "The home of your app. That's it.",
  },
  {
    Icon: CookieIcon,
    title: "No third-party cookie worries",
    description: (
      <>
        oidc-spa automatically uses the{" "}
        <ExternalLink href={docs("/resources/third-party-cookies-and-session-restoration")}>
          best session restoration strategy
        </ExternalLink>{" "}
        your deployment configuration allows.
      </>
    ),
  },
  {
    Icon: StethoscopeIcon,
    title: "Built-in diagnostics",
    description:
      "When the provider configuration needs attention, get actionable guidance about discovery, redirect URIs and iframe restrictions.",
  },
];

export function EasySetup() {
  return (
    <section className={sectionClassName}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading align="start" eyebrow="Setup" title="Remarkably easy to set up." />
          <ul className="flex flex-col gap-6">
            {points.map(({ Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{title}</span>
                  <span className="text-sm text-pretty text-muted-foreground">{description}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="flex h-10 items-center gap-2 border-b bg-muted/40 px-4">
              <span className="font-mono text-xs text-muted-foreground">Console</span>
            </div>
            <pre className="overflow-x-auto border-s-2 border-destructive/60 bg-destructive/5 px-4 py-4 font-mono text-xs leading-5 text-pretty whitespace-pre-wrap">
              {DIAGNOSTIC_MESSAGE}
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
