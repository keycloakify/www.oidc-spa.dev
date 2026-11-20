import { CopyButton } from "#components/copy-button";
import { ExternalLink } from "#components/external-link";
import { ProviderLogo } from "#components/provider-logos";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { TechLogo } from "#components/tech-logos";
import { Button } from "#components/ui/button";
import { docs, DOCUMENTATION_URL, EXAMPLES_URL, GITHUB_REPO_URL } from "#constants";
import { getProviderGuideUrl, type Provider, PROVIDERS } from "#lib/providers";
import { GETTING_STARTED_ID, sectionClassName } from "#lib/section";
import { cn } from "#lib/utils";
import { ArrowUpRightIcon, CodeIcon, InfoIcon, PlusIcon, SparklesIcon } from "lucide-react";
import * as m from "motion/react-m";
import { Fragment, useState } from "react";

const OTHER_PLATFORM = "Other provider supporting public OIDC clients";
const PLATFORMS = [...PROVIDERS, OTHER_PLATFORM] as const;
type Platform = (typeof PLATFORMS)[number];

function isProvider(platform: Platform): platform is Provider {
  return platform !== OTHER_PLATFORM;
}

const STACKS = [
  "Vite + React",
  "Vite + Vue",
  "Angular",
  "TanStack Start",
  "Next.js",
  "Nuxt",
  "React Router Framework",
  "Vite + Other UI Framework",
] as const;
type Stack = (typeof STACKS)[number];

const ROUTERS = ["React Router", "TanStack Router"] as const;
type Router = (typeof ROUTERS)[number];

const DEPLOYMENTS = ["SSR", "SSG"] as const;
type Deployment = (typeof DEPLOYMENTS)[number];

const DEPLOYMENT_DESCRIPTIONS: Record<Deployment, string> = {
  SSR: "A JavaScript process generates the HTML for each request. Authenticated user data still renders on the client.",
  SSG: "The frontend is served as static files through a CDN. Public pages and the layout are rendered at build time.",
};

const BACKEND_GUIDE = (slug: string) =>
  docs(`/integration-guides/backend-token-validation/${slug}`);

/** Every API backend, with the guide for validating access tokens in it. */
const BACKEND_GUIDE_URLS = {
  "TanStack Start Server Functions and API Routes": BACKEND_GUIDE("tanstack-start"),
  "Next.js API Routes": docs("/integration-guides/next.js"),
  "Nuxt Server Routes": docs("/integration-guides/nuxt"),
  "React Router Framework Server Loaders and Server Actions": docs(
    "/integration-guides/react-router",
  ),
  tRPC: BACKEND_GUIDE("trpc"),
  NestJS: BACKEND_GUIDE("nestjs"),
  Express: BACKEND_GUIDE("express.js"),
  Fastify: BACKEND_GUIDE("fastify"),
  Hono: BACKEND_GUIDE("hono"),
  Koa: BACKEND_GUIDE("koa"),
  "Non-JS API Server": docs("/resources/jwt-of-the-access-token"),
} as const;
type Backend = keyof typeof BACKEND_GUIDE_URLS;

const STANDALONE_BACKENDS: Backend[] = ["tRPC", "NestJS", "Express", "Fastify", "Hono", "Koa"];

/** The API backends that make sense with a frontend, the first one is preselected. */
function getBackends(stack: Stack): Backend[] {
  switch (stack) {
    case "TanStack Start":
      return ["TanStack Start Server Functions and API Routes", "tRPC", "Non-JS API Server"];
    case "Next.js":
      return ["Next.js API Routes", "tRPC", "Non-JS API Server"];
    case "Nuxt":
      return ["Nuxt Server Routes", "tRPC", "Non-JS API Server"];
    case "React Router Framework":
      // Server loaders and actions are limited, so the standalone frameworks stay available.
      return [
        "React Router Framework Server Loaders and Server Actions",
        ...STANDALONE_BACKENDS,
        "Non-JS API Server",
      ];
    case "Vite + React":
    case "Vite + Vue":
    case "Angular":
    case "Vite + Other UI Framework":
      return [...STANDALONE_BACKENDS, "Non-JS API Server"];
  }
}

/** The logo shown next to an option, when it isn't keyed by the option's own label. */
const LOGO_NAMES: Partial<Record<string, string>> = {
  "TanStack Start Server Functions and API Routes": "TanStack Start",
  "Next.js API Routes": "Next.js",
  "Nuxt Server Routes": "Nuxt",
  "React Router Framework Server Loaders and Server Actions": "React Router Framework",
  "React Router": "React Router Framework",
  "TanStack Router": "TanStack Start",
};

function OptionLogo(props: { option: string }) {
  const { option } = props;

  if (option === "Non-JS API Server") {
    return <CodeIcon aria-hidden="true" className="size-4 shrink-0" />;
  }

  return <TechLogo name={LOGO_NAMES[option] ?? option} />;
}

/** Folder of the closest example in the oidc-spa repository. */
function getExampleFolder(stack: Stack, router: Router, deployment: Deployment): string {
  switch (stack) {
    case "Vite + React":
      return router === "React Router" ? "react-router-data" : "tanstack-router";
    case "Vite + Vue":
      return "vue";
    case "Angular":
      return "angular";
    case "TanStack Start":
      return deployment === "SSG" ? "tanstack-start-ssg" : "tanstack-start";
    case "Next.js":
      return "next";
    case "Nuxt":
      return "nuxt";
    case "React Router Framework":
      return "react-router-framework";
    case "Vite + Other UI Framework":
      return "framework-agnostic";
  }
}

/** What to know about rendering with this frontend, if anything. */
function getRenderingNotice(stack: Stack): React.ReactNode {
  switch (stack) {
    case "TanStack Start":
    case "Next.js": {
      const exampleUrl =
        stack === "Next.js"
          ? "https://next.oidc-spa.dev/"
          : "https://tanstack-start.oidc-spa.dev/";

      return (
        <p>
          With oidc-spa, protected content renders only in the browser. {stack} still prerenders the
          shared layout and public pages by default, so visitors see them right away. Try the{" "}
          <ExternalLink href={exampleUrl}>live example</ExternalLink> to see for yourself.
        </p>
      );
    }
    case "Nuxt":
      return (
        <p>
          Nuxt is currently supported with <code className="font-mono">ssr: false</code>.
        </p>
      );
    case "React Router Framework":
      return (
        <p>
          React Router Framework is supported with <code className="font-mono">ssr: false</code> or{" "}
          <code className="font-mono">ssr: "api-only"</code>, with or without static prerendering.
          See the{" "}
          <ExternalLink href="https://reactrouter.com/start/framework/rendering">
            rendering documentation
          </ExternalLink>
          .
        </p>
      );
    default:
      return undefined;
  }
}

/** Tells coding agents which example to start from, and how to adapt it to the picked stack. */
const AGENTS_GUIDE_URL = `${GITHUB_REPO_URL}/blob/v11_overhaul/examples/AGENTS.md`;

/** A line of the prompt; `choice` is the part that comes from what was picked. */
type PromptLine = { prefix: string; choice?: string; suffix?: string };

function buildPromptLines(params: {
  platform: Platform;
  stack: Stack;
  router: Router | undefined;
  backend: Backend;
  deployment: Deployment | undefined;
}): PromptLine[] {
  const { platform, stack, router, backend, deployment } = params;

  return [
    { prefix: "Build a fresh, runnable todo app in this workspace using the stack below." },
    { prefix: "" },
    platform === "Keycloak"
      ? {
          prefix: "- IAM platform: ",
          choice: "Keycloak",
          suffix: " (use offline token validation)",
        }
      : isProvider(platform)
        ? { prefix: "- IAM platform: ", choice: platform }
        : { prefix: "- IAM platform: ", choice: "an OIDC provider supporting public clients" },
    { prefix: "- Auth library: oidc-spa" },
    router !== undefined
      ? { prefix: "- Frontend: Vite + React, with ", choice: router }
      : { prefix: "- Frontend: ", choice: stack },
    { prefix: "- API backend: ", choice: backend },
    ...(deployment === undefined ? [] : [{ prefix: "- Deployment: ", choice: deployment }]),
    { prefix: "" },
    {
      prefix:
        "Read this oidc-spa guide first. It explains which example to start from and how to adapt it to the selected stack.",
    },
    { prefix: AGENTS_GUIDE_URL },
  ];
}

function toText(lines: PromptLine[]): string {
  return lines
    .map(({ prefix, choice = "", suffix = "" }) => `${prefix}${choice}${suffix}`)
    .join("\n");
}

export function GettingStarted() {
  const [platform, setPlatform] = useState<Platform>("Keycloak");
  const [stack, setStack] = useState<Stack>("Vite + React");
  const [selectedRouter, setSelectedRouter] = useState<Router>("TanStack Router");
  const [backend, setBackend] = useState<Backend>(getBackends("Vite + React")[0]);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment>("SSR");

  // Only asked when they apply to the picked frontend.
  const router = stack === "Vite + React" ? selectedRouter : undefined;
  const deployment = stack === "TanStack Start" ? selectedDeployment : undefined;

  const promptLines = buildPromptLines({ platform, stack, router, backend, deployment });
  const prompt = toText(promptLines);
  const exampleFolder = getExampleFolder(stack, selectedRouter, selectedDeployment);
  const renderingNotice = getRenderingNotice(stack);

  // Numbered as they come, so the numbers stay consecutive whatever is picked.
  const steps: React.ReactNode[] = [
    <OptionGroup
      key="platform"
      label="Your IAM platform"
      options={PLATFORMS}
      value={platform}
      onChange={setPlatform}
      renderIcon={(option) =>
        isProvider(option) ? (
          <ProviderLogo provider={option} />
        ) : (
          <PlusIcon aria-hidden="true" className="size-4 shrink-0" />
        )
      }
    >
      {platform === OTHER_PLATFORM && (
        <Note>
          It needs to support public clients: Authorization Code Flow with PKCE, no client secret,
          silent session restoration with <code className="font-mono">prompt=none</code>, and
          configurable CORS on the token endpoint.{" "}
          <ExternalLink href={getProviderGuideUrl("Other")}>See the requirements</ExternalLink>.
        </Note>
      )}
    </OptionGroup>,
    <OptionGroup
      key="frontend"
      label="Your frontend"
      options={STACKS}
      value={stack}
      onChange={(value) => {
        setStack(value);
        setBackend(getBackends(value)[0]);
      }}
      renderIcon={(option) => <OptionLogo option={option} />}
    >
      {renderingNotice !== undefined && <Notice>{renderingNotice}</Notice>}
    </OptionGroup>,
    ...(router === undefined
      ? []
      : [
          <OptionGroup
            key="router"
            label="Routing library"
            options={ROUTERS}
            value={router}
            onChange={setSelectedRouter}
            renderIcon={(option) => <OptionLogo option={option} />}
          />,
        ]),
    <OptionGroup
      key="backend"
      label="Your API backend"
      options={getBackends(stack)}
      value={backend}
      onChange={setBackend}
      renderIcon={(option) => <OptionLogo option={option} />}
    >
      {backend === "Non-JS API Server" && (
        <Note>
          Validate the access token with any JWT library,{" "}
          <ExternalLink href={BACKEND_GUIDE_URLS["Non-JS API Server"]}>here is how</ExternalLink>.
        </Note>
      )}
    </OptionGroup>,
    ...(deployment === undefined
      ? []
      : [
          <OptionGroup
            key="deployment"
            label="Deployment mode"
            options={DEPLOYMENTS}
            value={deployment}
            onChange={setSelectedDeployment}
          >
            <Note>{DEPLOYMENT_DESCRIPTIONS[deployment]}</Note>
          </OptionGroup>,
        ]),
  ];

  return (
    <section id={GETTING_STARTED_ID} className={cn(sectionClassName, "scroll-mt-16")}>
      <Reveal>
        <SectionHeading eyebrow="Getting started" title="One library for all your auth needs.">
          <p>
            A single MIT library covering authentication and authorization. Build your setup prompt
            below, or head over to <ExternalLink href={DOCUMENTATION_URL}>the docs</ExternalLink>.
          </p>
        </SectionHeading>
      </Reveal>

      <Reveal className="mx-auto mt-12 grid max-w-6xl gap-10 sm:mt-16 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <ol className="flex flex-col gap-8">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-muted/50 font-mono text-xs text-muted-foreground"
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">{step}</div>
            </li>
          ))}
        </ol>

        <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="flex h-10 items-center justify-between gap-3 border-b bg-muted/40 ps-4 pe-1.5">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <SparklesIcon aria-hidden="true" className="size-3.5 text-brand" />
                Your prompt
              </span>
              <CopyButton text={prompt} />
            </div>
            <p
              aria-live="polite"
              className="px-4 py-4 font-mono text-xs leading-6 whitespace-pre-wrap"
            >
              {promptLines.map(({ prefix, choice, suffix }, index) => (
                <Fragment key={index}>
                  {prefix.startsWith("https://") ? <BreakableUrl url={prefix} /> : prefix}
                  {choice !== undefined && <Choice value={choice} />}
                  {suffix}
                  {index < promptLines.length - 1 && "\n"}
                </Fragment>
              ))}
            </p>
            <div className="flex border-t bg-muted/20 p-1.5">
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={
                  <a
                    href={`${EXAMPLES_URL}/${exampleFolder}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                className="text-muted-foreground"
              >
                Or open the closest example on GitHub
                <ArrowUpRightIcon aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-pretty text-muted-foreground">
            Paste it into your coding agent of choice. It will start from the closest example and
            set everything up.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/**
 * A URL that may only wrap after a "/", so long links stay readable without a scrollbar.
 * `<wbr>` adds no character, the copied prompt is unchanged.
 */
function BreakableUrl(props: { url: string }) {
  const { url } = props;

  const [scheme, rest] = url.split("://");

  return (
    <>
      {scheme}://
      {rest.split("/").map((part, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <>
              /<wbr />
            </>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}

/** A picked value inside the prompt, flashing briefly when it changes. */
function Choice(props: { value: string }) {
  const { value } = props;

  return (
    <m.span
      key={value}
      initial={{ backgroundColor: "oklch(0.714 0.203 305.504 / 0.35)" }}
      animate={{ backgroundColor: "oklch(0.714 0.203 305.504 / 0)" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="rounded-sm font-medium text-brand"
    >
      {value}
    </m.span>
  );
}

function Note(props: { children: React.ReactNode }) {
  const { children } = props;

  return <p className="text-xs text-pretty text-muted-foreground">{children}</p>;
}

/** What to know before picking this option, standing out more than a note. */
function Notice(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className="flex gap-2.5 rounded-lg border bg-muted/40 p-3 text-xs text-pretty text-muted-foreground">
      <InfoIcon aria-hidden="true" className="mt-px size-3.5 shrink-0 text-brand" />
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function OptionGroup<T extends string>(props: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** A logo shown before each option's name. */
  renderIcon?: (option: T) => React.ReactNode;
  children?: React.ReactNode;
}) {
  const { label, options, value, onChange, renderIcon, children } = props;

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 flex min-h-6 items-center text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors duration-200 ease-out has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
              option === value
                ? "border-brand/60 bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <input
              type="radio"
              name={label}
              value={option}
              checked={option === value}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {renderIcon?.(option)}
            {option}
          </label>
        ))}
      </div>
      {children}
    </fieldset>
  );
}
