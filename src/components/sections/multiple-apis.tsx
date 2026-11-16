import { CodeLines } from "#components/code-block";
import { CopyButton } from "#components/copy-button";
import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { docs } from "#constants";
import { sectionClassName } from "#lib/section";
import { cn } from "#lib/utils";
import { DatabaseIcon, GlobeIcon, KeyRoundIcon, type LucideIcon, ServerIcon } from "lucide-react";
import { useState } from "react";

const CODE = `import { getOidc } from "./oidc";

const oidc = await getOidc({ assert: "user logged in" });

const myApiToken = await oidc.getAccessToken({
    scopes: ["resource:myapp-api"]
});

const vaultToken = await oidc.getAccessToken({
    scopes: ["resource:vault"]
});

const s3Token = await oidc.getAccessToken({
    scopes: ["resource:aws-s3"]
});`;

const apis: {
  Icon: LucideIcon;
  name: string;
  scope: string;
  audience: string;
  /** Lines of `CODE` that request this API's token. */
  lines: [first: number, last: number];
}[] = [
  {
    Icon: ServerIcon,
    name: "MyApi",
    scope: "resource:myapp-api",
    audience: "myapp-api",
    lines: [4, 6],
  },
  { Icon: KeyRoundIcon, name: "Vault", scope: "resource:vault", audience: "vault", lines: [8, 10] },
  {
    Icon: DatabaseIcon,
    name: "AWS S3",
    scope: "resource:aws-s3",
    audience: "sts.amazonaws.com",
    lines: [12, 14],
  },
];

export function MultipleApis() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const activeApi = activeIndex === undefined ? undefined : apis[activeIndex];

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

      <div className="mx-auto mt-12 grid max-w-6xl items-center gap-10 sm:mt-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <TokenWallet activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} />
        </Reveal>
        <Reveal className="flex min-w-0 flex-col gap-3">
          <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
            <div className="flex h-10 items-center justify-between gap-3 border-b bg-muted/40 ps-4 pe-1.5">
              <span className="font-mono text-xs text-muted-foreground">src/api.ts</span>
              <CopyButton text={CODE} />
            </div>
            <CodeLines
              code={CODE}
              isLineDimmed={
                activeApi === undefined
                  ? undefined
                  : (index) => index < activeApi.lines[0] || index > activeApi.lines[1]
              }
            />
          </div>
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
  activeIndex: number | undefined;
  onActiveIndexChange: (index: number | undefined) => void;
}) {
  const { activeIndex, onActiveIndexChange } = props;

  return (
    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-brand">
          <GlobeIcon aria-hidden="true" className="size-4" />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium">Your app</span>
          <span className="font-mono text-xs text-muted-foreground">One token per API</span>
        </span>
      </div>

      <ul className="flex flex-col p-1.5">
        {apis.map(({ Icon, name, scope, audience }, index) => {
          const isActive = activeIndex === index;

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
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">
                    {scope}
                  </span>
                </span>
                <span className="max-w-[45%] truncate rounded-md border bg-background px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
                  aud: {audience}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
