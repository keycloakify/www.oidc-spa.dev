import { Popover } from "@base-ui/react/popover";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { Badge } from "#components/ui/badge";
import { sectionClassName } from "#lib/section";
import { cn } from "#lib/utils";
import { CheckIcon, MinusIcon } from "lucide-react";

/** A short point, and the explanation revealed on hover or tap. */
type Point = { label: string; detail: string };

type Approach = {
  title: string;
  badge: string;
  tools: { name: string; href: string; isOidcSpa?: boolean }[];
  description: string;
  advantages: Point[];
  tradeoffs: Point[];
  fit: Point;
};

const approaches: Approach[] = [
  {
    title: "Server-side OIDC",
    badge: "The backend is the client",
    tools: [
      { name: "Better Auth", href: "https://better-auth.com/" },
      { name: "Auth.js", href: "https://authjs.dev/" },
      { name: "nuxt-oidc-auth", href: "https://nuxtoidc.cloud/" },
      { name: "keycloak-connect", href: "https://www.npmjs.com/package/keycloak-connect" },
      { name: "oidc-client-ts (with client secret)", href: "https://github.com/authts/oidc-client-ts" },
    ],
    description:
      "A confidential client with a client secret. The backend holds the tokens, the browser gets a session cookie.",
    advantages: [
      {
        label: "Tokens stay on the server",
        detail:
          "The backend obtains and holds the OIDC tokens. The frontend code is never exposed to them.",
      },
      {
        label: "Authenticated SSR",
        detail:
          "The server knows who the user is when rendering authenticated content through SSR or Server Components.",
      },
      {
        label: "Supported by every IAM platform",
        detail: "Confidential clients are widely supported by IAM platforms.",
      },
    ],
    tradeoffs: [
      {
        label: "Often needs a session store",
        detail:
          "Depending on the session strategy, it often requires a shared session store, such as a database.",
      },
      {
        label: "Other APIs go through your backend",
        detail:
          "The frontend authenticates to your backend only. Calls to other OAuth-protected APIs have to go through it.",
      },
    ],
    fit: {
      label: "your server renders most of the app.",
      detail:
        "The default model of Next.js, Nuxt or SvelteKit: render as much as possible on the server, use SSR or Server Components for authenticated data, send minimal JavaScript. If the backend is the application in your mental model, Better Auth is likely a better fit.",
    },
  },
  {
    title: "Browser-side OIDC",
    badge: "The frontend is the client",
    tools: [
      { name: "oidc-spa", href: "https://github.com/keycloakify/oidc-spa", isOidcSpa: true },
      { name: "keycloak-js", href: "https://www.npmjs.com/package/keycloak-js" },
      { name: "angular-oauth2-oidc", href: "https://www.npmjs.com/package/angular-oauth2-oidc" },
      { name: "auth0-spa-js", href: "https://www.npmjs.com/package/@auth0/auth0-spa-js" },
      { name: "msal-browser", href: "https://www.npmjs.com/package/@azure/msal-browser" },
    ],
    description:
      "A public client with no secret. The browser gets tokens from your IAM platform and sends an access token to your APIs.",
    advantages: [
      {
        label: "Lightweight infrastructure",
        detail: "The frontend communicates directly with the IAM platform. No need of a backend session store.",
      },
      {
        label: "Static hosting on a CDN",
        detail: "The frontend can be served as static files through a CDN. Public pages and layout can be pre rendered at build time.",
      },
      {
        label: "Calls OAuth APIs directly",
        detail:
          "The browser can call several compatible OAuth-protected APIs directly, without going through your backend: your own API, HashiCorp Vault, S3, Open WebUI…",
      },
    ],
    tradeoffs: [
      {
        label: "No authenticated SSR",
        detail:
          "Authenticated user data can't be rendered through SSR or Server Components: the rendering process doesn't know who the user is. Public pages and the layout still can be.",
      },
      {
        label: "Needs public client support",
        detail: "Not every IAM platform check all the box to support public client securely. Example Clerk and WorkOS cannot in good conscience be recommended (yet) for this usecase.",
      },
      {
        label: "Tokens live in the browser",
        detail:
          "This is what oidc-spa's security features are built for: in-memory tokens, DPoP, token substitution and browser runtime freeze, but they do not constitute a silver bullet.",
      },
    ],
    fit: {
      label: "your frontend is served from a CDN, or talks to several APIs.",
      detail:
        "Public pages such as /pricing and the layout can be prerendered, while authenticated content renders in the browser. It's also a strong fit when the browser talks directly to several existing OAuth-protected APIs.",
    },
  },
];

export function HowItWorks() {
  return (
    <section className={sectionClassName}>
      <Reveal>
        <SectionHeading eyebrow="How it works" title="Your frontend is the OpenID Connect client.">
          <p>
            With oidc-spa, your frontend gets tokens directly from your IAM platform and uses them
            to call your APIs. Here is how that compares to server-side OIDC, so you can pick what
            fits.
          </p>
        </SectionHeading>
      </Reveal>

      <Reveal className="mx-auto mt-12 grid max-w-5xl gap-4 sm:mt-16 md:grid-cols-2">
        {approaches.map((approach) => (
          <ApproachCard key={approach.title} approach={approach} />
        ))}
      </Reveal>
    </section>
  );
}

function ApproachCard(props: { approach: Approach }) {
  const { title, badge, tools, description, advantages, tradeoffs, fit } = props.approach;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-medium">{title}</h3>
          <Badge variant="outline">{badge}</Badge>
        </div>

        <ul aria-label="Typical tools" className="flex flex-wrap gap-1.5">
          {tools.map(({ name, href, isOidcSpa = false }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex rounded-md border px-2 py-1 font-mono text-xs transition-colors duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isOidcSpa
                    ? "border-brand/50 bg-primary/10 text-foreground hover:bg-primary/15"
                    : "bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-sm text-pretty text-muted-foreground">{description}</p>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <PointList label="Advantages" points={advantages} isPositive />
          <PointList label="Tradeoffs" points={tradeoffs} isPositive={false} />
        </div>
      </div>

      <p className="mt-auto border-t bg-muted/40 px-5 py-4 text-sm text-pretty sm:px-6">
        <span className="text-muted-foreground">Good fit if </span>
        <Detail point={fit} />
      </p>
    </article>
  );
}

function PointList(props: { label: string; points: Point[]; isPositive: boolean }) {
  const { label, points, isPositive } = props;

  const Icon = isPositive ? CheckIcon : MinusIcon;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <ul className="flex flex-col gap-1.5">
        {points.map((point) => (
          <li key={point.label} className="flex items-start gap-2 text-sm">
            <Icon
              aria-hidden="true"
              className={cn(
                "mt-0.5 size-4 shrink-0",
                isPositive ? "text-brand" : "text-muted-foreground",
              )}
            />
            <Detail point={point} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A short label that reveals its explanation on hover, focus or tap. */
function Detail(props: { point: Point }) {
  const { label, detail } = props.point;

  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover
        delay={100}
        className="cursor-help rounded-sm text-start text-pretty underline decoration-muted-foreground/40 decoration-dotted underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:decoration-foreground"
      >
        {label}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="top" sideOffset={6} collisionPadding={16} className="z-50">
          <Popover.Popup className="w-72 max-w-[calc(100vw-2rem)] origin-(--transform-origin) rounded-lg border bg-popover px-3 py-2 text-xs text-pretty text-popover-foreground shadow-lg transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            {detail}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
