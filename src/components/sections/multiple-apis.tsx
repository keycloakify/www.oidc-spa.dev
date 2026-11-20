import { CodeLines } from "#components/code-block";
import { CopyButton } from "#components/copy-button";
import { ExternalLink } from "#components/external-link";
import { ProviderLogo } from "#components/provider-logos";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { Tabs, TabsList, TabsTrigger } from "#components/ui/tabs";
import { docs } from "#constants";
import { type Provider, PROVIDERS } from "#lib/providers";
import { sectionClassName } from "#lib/section";
import { cn } from "#lib/utils";
import { DatabaseIcon, GlobeIcon, KeyRoundIcon, type LucideIcon, ServerIcon } from "lucide-react";
import { useState } from "react";

const APIS: { Icon: LucideIcon; name: string; variable: string }[] = [
  { Icon: ServerIcon, name: "MyApi", variable: "myApiToken" },
  { Icon: KeyRoundIcon, name: "Open WebUI", variable: "openWebUiToken" },
  { Icon: DatabaseIcon, name: "AWS S3", variable: "s3Token" },
];

/** How each platform tells which API a token is for: the request, and the audience it yields. */
const TOKEN_REQUESTS: Record<Provider, { request: string; audience: string }[]> = {
  Keycloak: [
    { request: `scopes: ["resource:myapp-api"]`, audience: "myapp-api" },
    { request: `scopes: ["resource:aws-s3"]`, audience: "sts.amazonaws.com" },
    { request: `scopes: ["resource:openwebui"],\n    disableDPoP: true`, audience: "openwebui" },
  ],
  Auth0: [
    {
      request: `authorizationParams: { audience: "https://dashboard.mycompany.com/api" }`,
      audience: "https://dashboard.mycompany.com/api",
    },
    {
      request: `authorizationParams: { audience: "https://s3.amazon.com" }`,
      audience: "https://s3.amazon.com",
    },
    {
      request: `authorizationParams: { audience: "https://ai.mycompany.com" },\n    disableDPoP: true`,
      audience: "https://ai.mycompany.com",
    },
  ],
  "Microsoft Entra ID": [
    {
      request: `scopes: ["https://dashboard.mycompany.com/api/access_as_user"]`,
      audience: "xxxx-xxxx-xxxx",
    },
    {
      request: `scopes: ["https://s3.amazon.com/access_as_user"]`,
      audience: "zzzz-zzzz-zzzz",
    },
    {
      request: `scopes: ["https://ai.mycompany.com/access_as_user"],\n    disableDPoP: true`,
      audience: "yyyy-yyyy-yyyy",
    },
  ],
};

/** Each token request takes three lines, after a four line header and a blank line between them. */
function getCode(provider: Provider): string {
  const requests = TOKEN_REQUESTS[provider]
    .map(
      ({ request }, index) => `const ${APIS[index].variable} = await oidc.getAccessToken({
    ${request}
});`,
    )
    .join("\n\n");

  return `import { getOidc } from "./oidc";

const oidc = await getOidc({ assert: "user logged in" });

${requests}`;
}

/** First and last line of the request for the API at `index`. */
function getRequestLines(index: number): [first: number, last: number] {
  const first = 4 + index * 4;
  return [first, first + 2];
}

export function MultipleApis() {
  const [provider, setProvider] = useState<Provider>("Keycloak");
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const code = getCode(provider);
  const activeLines = activeIndex === undefined ? undefined : getRequestLines(activeIndex);

  return (
    <section className={sectionClassName}>
      <Reveal>
        <SectionHeading eyebrow="Multiple APIs" title="Talk to multiple APIs.">
          <p>
            Your app may need more than one access token. Request the scopes or authorization
            parameters required by each API, and let oidc-spa manage the corresponding tokens and
            their renewal.
          </p>
        </SectionHeading>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-6xl items-center gap-10 sm:mt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal>
          <TokenWallet
            provider={provider}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
          />
        </Reveal>
        <Reveal className="flex min-w-0 flex-col gap-3">
          <Tabs
            value={provider}
            onValueChange={(value) => setProvider(value as Provider)}
            className="gap-0 overflow-hidden rounded-xl border bg-card text-card-foreground"
          >
            <div className="flex min-h-11 items-center justify-between gap-3 border-b bg-muted/40 ps-2 pe-1.5">
              <TabsList
                variant="line"
                aria-label="IAM platform"
                className="no-scrollbar h-11 max-w-full overflow-x-auto overflow-y-hidden"
              >
                {PROVIDERS.map((option) => (
                  <TabsTrigger key={option} value={option} className="px-2">
                    <ProviderLogo provider={option} className="size-3.5" />
                    {option}
                  </TabsTrigger>
                ))}
              </TabsList>
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground max-xl:hidden">
                  src/api.ts
                </span>
                <CopyButton text={code} />
              </span>
            </div>
            <CodeLines
              code={code}
              isLineDimmed={
                activeLines === undefined
                  ? undefined
                  : (index) => index < activeLines[0] || index > activeLines[1]
              }
            />
          </Tabs>
          <ExternalLink
            href={docs("/features/talking-to-multiple-apis-with-different-access-tokens")}
            className="self-start text-sm"
          >
            Learn more about multiple access tokens
          </ExternalLink>
        </Reveal>
      </div>
    </section>
  );
}

/** One row per API, each with its own token. Pointing at a row highlights its request. */
function TokenWallet(props: {
  provider: Provider;
  activeIndex: number | undefined;
  onActiveIndexChange: (index: number | undefined) => void;
}) {
  const { provider, activeIndex, onActiveIndexChange } = props;

  return (
    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-brand">
          <GlobeIcon aria-hidden="true" className="size-4" />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium">Your app</span>
          <span className="text-xs text-muted-foreground">One access token per API</span>
        </span>
      </div>

      <ul className="flex flex-col p-1.5">
        {APIS.map(({ Icon, name }, index) => {
          const isActive = activeIndex === index;
          const { audience } = TOKEN_REQUESTS[provider][index];

          return (
            <li key={name}>
              <button
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => onActiveIndexChange(index)}
                onMouseLeave={() => onActiveIndexChange(undefined)}
                onFocus={() => onActiveIndexChange(index)}
                onBlur={() => onActiveIndexChange(undefined)}
                onClick={() => onActiveIndexChange(isActive ? undefined : index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2.5 py-3 text-start transition-colors duration-200 ease-out outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive && "bg-muted/50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors duration-200",
                    isActive && "border-brand/40 text-brand",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="self-start rounded-md border bg-background px-1.5 py-0.5 font-mono text-[0.6875rem] break-all text-muted-foreground">
                    aud: {audience}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
