import { CopyButton } from "#components/copy-button";
import { ExternalLink } from "#components/external-link";
import { ProviderLogo } from "#components/provider-logos";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { TechLogo } from "#components/tech-logos";
import { Button } from "#components/ui/button";
import { docs, DOCUMENTATION_URL, EXAMPLES_URL } from "#constants";
import { getProviderGuideUrl, type Provider, PROVIDERS } from "#lib/providers";
import { sectionClassName } from "#lib/section";
import { cn } from "#lib/utils";
import { ArrowUpRightIcon, SparklesIcon } from "lucide-react";
import * as m from "motion/react-m";
import { Fragment, useState } from "react";

const STACKS = [
  "Vite + React",
  "Vite + Vue",
  "Angular",
  "TanStack Start",
  "Next.js",
  "Nuxt",
  "React Router Framework",
  "Other framework",
] as const;
type Stack = (typeof STACKS)[number];

const REACT_ROUTERS = ["React Router", "TanStack Router"] as const;
type ReactRouter = (typeof REACT_ROUTERS)[number];

/** Every backend with a token validation guide in the documentation. */
const BACKEND_GUIDE_SLUGS = {
  "TanStack Start": "tanstack-start",
  tRPC: "trpc",
  NestJS: "nestjs",
  Express: "express.js",
  Fastify: "fastify",
  Hono: "hono",
  Koa: "koa",
  "Node.js http": "node-http",
  Bun: "bun.serve",
  Deno: "deno.serve",
  "Cloudflare Workers": "cloudflare-workers",
  "Vercel Edge": "vercel-edge",
} as const;
type Backend = keyof typeof BACKEND_GUIDE_SLUGS;

const FRAMEWORK_BACKENDS: Backend[] = ["tRPC", "NestJS", "Express", "Fastify", "Hono", "Koa"];
const RUNTIME_BACKENDS: Backend[] = [
  "Node.js http",
  "Bun",
  "Deno",
  "Cloudflare Workers",
  "Vercel Edge",
];

function getBackendGroups(stack: Stack): OptionRows<Backend> {
  return [
    {
      label: "Frameworks",
      options:
        stack === "TanStack Start" ? ["TanStack Start", ...FRAMEWORK_BACKENDS] : FRAMEWORK_BACKENDS,
    },
    { label: "Runtimes", options: RUNTIME_BACKENDS },
  ];
}

/** Documentation page for setting up oidc-spa in the picked frontend. */
function getFrontendGuidePath(stack: Stack, reactRouter: ReactRouter): string {
  switch (stack) {
    case "Vite + React":
      return reactRouter === "React Router"
        ? "/integration-guides/react-router"
        : "/integration-guides/tanstack-router-start";
    case "TanStack Start":
      return "/integration-guides/tanstack-router-start/tanstack-start";
    case "Angular":
      return "/integration-guides/angular";
    case "Next.js":
      return "/integration-guides/next.js";
    case "Nuxt":
      return "/integration-guides/nuxt";
    case "React Router Framework":
      return "/integration-guides/react-router";
    case "Vite + Vue":
    case "Other framework":
      return "/integration-guides/usage";
  }
}

/** Folder of the closest example in the oidc-spa repository. */
function getExampleFolder(stack: Stack, reactRouter: ReactRouter): string {
  switch (stack) {
    case "Vite + React":
      return reactRouter === "React Router" ? "react-router-data" : "tanstack-router";
    case "Vite + Vue":
      return "vue";
    case "Angular":
      return "angular";
    case "TanStack Start":
      return "tanstack-start";
    case "Next.js":
      return "next";
    case "Nuxt":
      return "nuxt";
    case "React Router Framework":
      return "react-router-framework";
    case "Other framework":
      return "framework-agnostic";
  }
}

/** A line of the prompt; `choice` is the part that comes from what was picked. */
type PromptLine = { prefix: string; choice?: string; suffix?: string };

function buildPromptLines(params: {
  provider: Provider;
  stack: Stack;
  reactRouter: ReactRouter;
  backend: Backend;
}): PromptLine[] {
  const { provider, stack, reactRouter, backend } = params;

  return [
    { prefix: "Set up a fresh todo app with this stack:" },
    provider === "Keycloak"
      ? {
          prefix: "- Identity provider: ",
          choice: "Keycloak",
          suffix: " (use offline token validation)",
        }
      : { prefix: "- Identity provider: ", choice: provider },
    { prefix: "- Auth library: oidc-spa" },
    stack === "Vite + React"
      ? { prefix: "- Frontend: Vite + React, with ", choice: reactRouter }
      : stack === "Other framework"
        ? { prefix: "- Frontend: ", choice: "Vite + another UI framework" }
        : { prefix: "- Frontend: ", choice: stack },
    { prefix: "- Backend: ", choice: backend },
    { prefix: "" },
    { prefix: "Start from the most relevant example in:" },
    { prefix: EXAMPLES_URL },
    { prefix: "" },
    { prefix: "Follow these guides:" },
    { prefix: getProviderGuideUrl(provider) },
    { prefix: docs(getFrontendGuidePath(stack, reactRouter)) },
    {
      prefix: docs(`/integration-guides/backend-token-validation/${BACKEND_GUIDE_SLUGS[backend]}`),
    },
  ];
}

function toText(lines: PromptLine[]): string {
  return lines
    .map(({ prefix, choice = "", suffix = "" }) => `${prefix}${choice}${suffix}`)
    .join("\n");
}

export function GettingStarted() {
  const [provider, setProvider] = useState<Provider>("Keycloak");
  const [stack, setStack] = useState<Stack>("Vite + React");
  const [reactRouter, setReactRouter] = useState<ReactRouter>("TanStack Router");
  const [selectedBackend, setSelectedBackend] = useState<Backend>("tRPC");

  const backendGroups = getBackendGroups(stack);
  // Switching stack can hide the selected backend, fall back to the first framework.
  const backend = backendGroups.some(({ options }) => options.includes(selectedBackend))
    ? selectedBackend
    : FRAMEWORK_BACKENDS[0];

  const promptLines = buildPromptLines({ provider, stack, reactRouter, backend });
  const prompt = toText(promptLines);
  const exampleFolder = getExampleFolder(stack, reactRouter);

  return (
    <section className={sectionClassName}>
      <Reveal>
        <SectionHeading eyebrow="Getting started" title="One library for all your auth needs.">
          <p>
            A single MIT library covering authentication and authorization. Build your setup prompt
            below, or head over to <ExternalLink href={DOCUMENTATION_URL}>the docs</ExternalLink>.
          </p>
        </SectionHeading>
      </Reveal>

      <Reveal className="mx-auto mt-12 grid max-w-6xl gap-10 sm:mt-16 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-8">
          <OptionGroup
            number={1}
            label="Your identity provider"
            rows={[{ options: PROVIDERS }]}
            value={provider}
            onChange={setProvider}
            renderIcon={(option) => <ProviderLogo provider={option} />}
          >
            <Note>
              Using another provider? Any standard OpenID Connect provider works,{" "}
              <ExternalLink href={docs("/providers-configuration/other")}>
                see the setup guide
              </ExternalLink>
              .
            </Note>
          </OptionGroup>
          <OptionGroup
            number={2}
            label="Your frontend"
            rows={[{ options: STACKS }]}
            value={stack}
            onChange={setStack}
            renderIcon={(option) => <TechLogo name={option} />}
          >
            {stack === "Vite + React" && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>Router</span>
                <SegmentedControl
                  label="Router"
                  options={REACT_ROUTERS}
                  value={reactRouter}
                  onChange={setReactRouter}
                />
              </div>
            )}
          </OptionGroup>
          <OptionGroup
            number={3}
            label="Your backend"
            rows={backendGroups}
            value={backend}
            onChange={setSelectedBackend}
            renderIcon={(option) => <TechLogo name={option} />}
          >
            <Note>
              Backend not in JavaScript? Validate the access token with any JWT library,{" "}
              <ExternalLink href={docs("/resources/jwt-of-the-access-token")}>
                here is how
              </ExternalLink>
              .
            </Note>
          </OptionGroup>
        </div>

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

type OptionRows<T extends string> = { label?: string; options: readonly T[] }[];

function Note(props: { children: React.ReactNode }) {
  const { children } = props;

  return <p className="text-xs text-pretty text-muted-foreground">{children}</p>;
}

function OptionGroup<T extends string>(props: {
  number: number;
  label: string;
  /** The options, optionally split in labeled rows. */
  rows: OptionRows<T>;
  value: T;
  onChange: (value: T) => void;
  /** A logo shown before each option's name. */
  renderIcon?: (option: T) => React.ReactNode;
  children?: React.ReactNode;
}) {
  const { number, label, rows, value, onChange, renderIcon, children } = props;

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 flex items-center gap-2.5 text-sm font-medium">
        <span className="flex size-6 items-center justify-center rounded-full border bg-muted/50 font-mono text-xs text-muted-foreground">
          {number}
        </span>
        {label}
      </legend>
      {rows.map(({ label: rowLabel, options }) => (
        <div key={rowLabel ?? "options"} className="flex flex-col gap-2">
          {rowLabel !== undefined && (
            <span className="text-xs text-muted-foreground">{rowLabel}</span>
          )}
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
        </div>
      ))}
      {children}
    </fieldset>
  );
}

/** A compact two-way choice that refines the option picked above it. */
function SegmentedControl<T extends string>(props: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { label, options, value, onChange } = props;

  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-lg border bg-muted/40 p-0.5">
      {options.map((option) => (
        <label
          key={option}
          className={cn(
            "cursor-pointer rounded-md px-2.5 py-1 text-xs transition-colors duration-200 ease-out has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
            option === value
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
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
          {option}
        </label>
      ))}
    </div>
  );
}
