import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { Badge } from "#components/ui/badge";
import { sectionClassName } from "#lib/section";
import { CheckIcon, MinusIcon } from "lucide-react";

type Approach = {
  title: string;
  badge: string;
  description: string;
  advantages: React.ReactNode[];
  tradeoffs: React.ReactNode[];
  tools: { name: string; href?: string }[];
  fit: { title: string; description: React.ReactNode };
};

const approaches: Approach[] = [
  {
    title: "Server-side OIDC",
    badge: "The backend is the client",
    description:
      "A confidential client, typically configured with a client secret. The backend obtains and holds the tokens, and the browser authenticates to it with an application session cookie.",
    advantages: [
      "The frontend code is never exposed to the OIDC tokens.",
      "The server knows who the user is when rendering authenticated content through SSR or Server Components.",
      "Widely supported by IAM platforms.",
    ],
    tradeoffs: [
      "Often requires a shared session store, such as a database, depending on the session strategy.",
      "Calls to other OAuth-protected APIs have to go through your backend.",
    ],
    tools: [
      { name: "Better Auth" },
      { name: "Auth.js / NextAuth" },
      { name: "nuxt-oidc-auth", href: "https://nuxtoidc.cloud/" },
      { name: "keycloak-connect", href: "https://www.npmjs.com/package/keycloak-connect" },
    ],
    fit: {
      title: "Likely a better fit if",
      description: (
        <>
          you follow the default server-oriented model of Next.js, Nuxt or SvelteKit: render as much
          as possible on the server, use SSR or Server Components for authenticated data, and send
          minimal JavaScript to the browser. If the backend <em>is</em> the application in your
          mental model, a solution such as Better Auth is likely a better fit.
        </>
      ),
    },
  },
  {
    title: "Browser-side OIDC",
    badge: "The frontend is the client",
    description:
      "A public client, with no client secret. The browser exchanges the authorization code for tokens directly with the IAM platform, then attaches an access token when calling an API.",
    advantages: [
      "Lightweight infrastructure: the frontend communicates directly with the IAM platform.",
      "The frontend can be served as static files through a CDN.",
      "The browser can call several compatible OAuth-protected APIs directly, such as your own API, HashiCorp Vault, S3 or Open WebUI.",
    ],
    tradeoffs: [
      "Authenticated user data can't be rendered through SSR or Server Components: the rendering process doesn't know who the user is.",
      "Not every IAM platform supports the required public client configuration.",
      "Tokens are handled in the browser, which is what oidc-spa's security features are built for.",
    ],
    tools: [
      { name: "oidc-spa" },
      { name: "keycloak-js" },
      { name: "angular-oauth2-oidc" },
      { name: "@auth0/auth0-spa-js" },
      { name: "@azure/msal-browser" },
      { name: "@axa-fr/oidc-client" },
    ],
    fit: {
      title: "oidc-spa is a great fit if",
      description: (
        <>
          you want a frontend served through a CDN, perhaps with public pages such as{" "}
          <code className="font-mono text-[0.8125rem]">/pricing</code> and the layout prerendered,
          while authenticated content renders in the browser. Or when the browser needs to talk
          directly to several existing OAuth-protected APIs.
        </>
      ),
    },
  },
];

export function HowItWorks() {
  return (
    <section className={sectionClassName}>
      <Reveal>
        <SectionHeading eyebrow="How it works" title="Your frontend is the OpenID Connect client.">
          <p>
            With oidc-spa, your frontend obtains tokens directly from your IAM platform and uses
            them to call your APIs. Server-side OIDC is the other common architecture. Both are
            valid, here is how to choose.
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
  const { title, badge, description, advantages, tradeoffs, tools, fit } = props.approach;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-medium">{title}</h3>
            <Badge variant="outline">{badge}</Badge>
          </div>
          <p className="text-sm text-pretty text-muted-foreground">{description}</p>
        </div>

        <List label="Advantages" items={advantages} isPositive />
        <List label="Tradeoffs" items={tradeoffs} isPositive={false} />

        <p className="text-xs text-pretty text-muted-foreground">
          <span className="font-medium text-foreground">Typical tools: </span>
          {tools.map(({ name, href }, index) => (
            <span key={name}>
              {href === undefined ? name : <ExternalLink href={href}>{name}</ExternalLink>}
              {index < tools.length - 1 && ", "}
            </span>
          ))}
        </p>
      </div>

      <p className="mt-auto border-t bg-muted/40 px-5 py-4 text-sm text-pretty text-muted-foreground sm:px-6">
        <span className="font-medium text-foreground">{fit.title}</span> {fit.description}
      </p>
    </article>
  );
}

function List(props: { label: string; items: React.ReactNode[]; isPositive: boolean }) {
  const { label, items, isPositive } = props;

  const Icon = isPositive ? CheckIcon : MinusIcon;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm">
            <Icon
              aria-hidden="true"
              className={
                isPositive
                  ? "mt-0.5 size-4 shrink-0 text-brand"
                  : "mt-0.5 size-4 shrink-0 text-muted-foreground"
              }
            />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
