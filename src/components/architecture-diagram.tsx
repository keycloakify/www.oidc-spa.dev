import { ProviderLogo } from "#components/provider-logos";
import { PROVIDERS, type Provider } from "#lib/providers";
import { cn } from "#lib/utils";
import { CheckIcon, GlobeIcon, PauseIcon, PlayIcon, ServerIcon } from "lucide-react";
import { AnimatePresence, useInView, useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";

type Travel = {
  connector: "left" | "right";
  /** Moves right to left (bottom to top on small screens). */
  isReversed: boolean;
  /** One label for a one way trip, two for a request and its response. */
  chips: [string] | [string, string];
};

type Focus = "provider" | "browser" | "api";

/** Time for a request to cross a connector. */
const TRAVEL_S = 0.8;

const STEPS: { label: string; focus: Focus; durationMs: number; travel: Travel | undefined }[] = [
  {
    label: "The app redirects to the provider",
    focus: "provider",
    durationMs: 2400,
    travel: { connector: "left", isReversed: true, chips: ["GET /authorize"] },
  },
  {
    label: "The user signs in on the provider's page",
    focus: "browser",
    durationMs: 3200,
    travel: undefined,
  },
  {
    label: "The provider redirects back with a code",
    focus: "browser",
    durationMs: 2400,
    travel: { connector: "left", isReversed: false, chips: ["302 ?code=…"] },
  },
  {
    label: "The app exchanges the code for tokens",
    focus: "provider",
    durationMs: 3000,
    travel: { connector: "left", isReversed: true, chips: ["code + PKCE", "tokens"] },
  },
  {
    label: "The app calls the API with the access token in the Authorization request header",
    focus: "api",
    durationMs: 2600,
    travel: { connector: "right", isReversed: false, chips: ["access token"] },
  },
  {
    label:
      "The API uses oidc-spa/server to validate the access token, either offline by checking its signature or through the introspection endpoint. It also validates the DPoP proof when present",
    focus: "api",
    durationMs: 4200,
    travel: undefined,
  },
  {
    label: "The API processes the request and returns the data",
    focus: "browser",
    durationMs: 2800,
    travel: { connector: "right", isReversed: true, chips: ["200 · 3 todos"] },
  },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** When the user presses the provider's sign-in button, in seconds into step 2. */
const SUBMIT_S = 2;

const TODOS = ["Ship the release", "Review the PR", "Book the venue"];

type LogEntry = { step: number; text: string; delay?: number; isSuccess?: boolean };

const PROVIDER_LOG: LogEntry[] = [
  { step: 0, text: "GET /authorize", delay: TRAVEL_S },
  { step: 1, text: "Credentials valid", delay: SUBMIT_S + 0.3, isSuccess: true },
  { step: 2, text: "302 → app.example.com" },
  { step: 3, text: "POST /token · 200", delay: TRAVEL_S, isSuccess: true },
];

const API_LOG: LogEntry[] = [
  { step: 4, text: "GET /api/todos", delay: TRAVEL_S },
  { step: 5, text: "Validating access token…" },
  { step: 5, text: "Signature valid", delay: 1.2, isSuccess: true },
  { step: 5, text: "DPoP proof valid", delay: 2, isSuccess: true },
  { step: 6, text: "200 · 3 todos" },
];

export function ArchitectureDiagram(props: { className?: string }) {
  const { className } = props;

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.4 });
  const isReducedMotion = useReducedMotion() ?? false;
  const [stepIndex, setStepIndex] = useState(0);
  const [providerIndex, setProviderIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // isInView is false on the server and on the first client render, so the markup matches on hydration.
  const isRunning = isPlaying && isInView && !isReducedMotion;

  const step = STEPS[stepIndex];

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setTimeout(() => {
      if (stepIndex === STEPS.length - 1) {
        setProviderIndex((index) => (index + 1) % PROVIDERS.length);
      }
      setStepIndex((index) => (index + 1) % STEPS.length);
    }, step.durationMs);

    return () => clearTimeout(timer);
  }, [isRunning, stepIndex, step.durationMs]);

  const provider = PROVIDERS[providerIndex];

  return (
    <figure ref={ref} className={cn("flex flex-col gap-8", className)}>
      <div className="grid items-center lg:grid-cols-[1fr_minmax(7rem,9rem)_1.3fr_minmax(7rem,9rem)_1fr]">
        <Node
          icon={<ProviderLogos activeProvider={provider} />}
          title="Your IAM platform"
          subtitle="Keycloak, Auth0, Microsoft Entra ID…"
          isActive={step.focus === "provider"}
        >
          <ServerLog
            host="auth.example.com"
            entries={PROVIDER_LOG}
            stepIndex={stepIndex}
            cycle={providerIndex}
          />
        </Node>

        <Connector
          stepIndex={stepIndex}
          travel={step.travel?.connector === "left" ? step.travel : undefined}
        />

        <Node
          icon={
            <IconBox>
              <GlobeIcon aria-hidden="true" className="size-4" />
            </IconBox>
          }
          title="Your app in the browser"
          subtitle={
            <>
              One tab, using <code className="font-mono">oidc-spa/client</code>
            </>
          }
          isActive={step.focus === "browser"}
        >
          <BrowserWindow stepIndex={stepIndex} provider={provider} />
        </Node>

        <Connector
          stepIndex={stepIndex}
          travel={step.travel?.connector === "right" ? step.travel : undefined}
        />

        <Node
          icon={
            <IconBox>
              <ServerIcon aria-hidden="true" className="size-4" />
            </IconBox>
          }
          title="Your API"
          subtitle={
            <>
              using <code className="font-mono">oidc-spa/server</code>
            </>
          }
          isActive={step.focus === "api"}
        >
          <ServerLog
            host="api.example.com"
            entries={API_LOG}
            stepIndex={stepIndex}
            cycle={providerIndex}
          />
        </Node>
      </div>

      <figcaption className="mx-auto flex w-full max-w-2xl flex-col gap-1">
        <ol className="flex gap-1.5">
          {STEPS.map(({ label, durationMs }, index) => (
            <li key={label} className="flex-1">
              <button
                type="button"
                aria-label={`Step ${index + 1}: ${label}`}
                aria-current={index === stepIndex ? "step" : undefined}
                onClick={() => {
                  setStepIndex(index);
                  setIsPlaying(false);
                }}
                className="group block w-full py-2"
              >
                <span className="block h-1 overflow-hidden rounded-full bg-muted transition-colors group-hover:bg-muted-foreground/25">
                  {index < stepIndex || (index === stepIndex && !isPlaying) ? (
                    <span className="block size-full bg-brand" />
                  ) : index === stepIndex && !isRunning ? (
                    // Not started yet (offscreen), or no autoplay because of reduced motion.
                    <span className="block size-full origin-left scale-x-0 bg-brand motion-reduce:scale-x-100" />
                  ) : index === stepIndex ? (
                    <m.span
                      key={stepIndex}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: durationMs / 1000, ease: "linear" }}
                      className="block size-full origin-left bg-brand"
                    />
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="grid min-w-0 flex-1">
            {/* Invisible copies of every label keep the caption at the height of the longest one. */}
            {STEPS.map(({ label }, index) => (
              <span key={label} aria-hidden="true" className="invisible col-start-1 row-start-1">
                <StepLabel index={index} label={label} />
              </span>
            ))}
            <span className="col-start-1 row-start-1 flex">
              <Swap id={String(stepIndex)} className="items-start justify-start text-start">
                <StepLabel index={stepIndex} label={step.label} />
              </Swap>
            </span>
          </span>
          {/* Hidden with CSS rather than the hook so the prerendered markup matches on hydration. */}
          <button
            type="button"
            onClick={() => setIsPlaying((value) => !value)}
            className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground motion-reduce:hidden"
          >
            {isPlaying ? (
              <PauseIcon aria-hidden="true" className="size-3" />
            ) : (
              <PlayIcon aria-hidden="true" className="size-3" />
            )}
            {isPlaying ? "Pause" : "Play"}
            <span className="sr-only"> animation</span>
          </button>
        </div>
      </figcaption>
    </figure>
  );
}

function StepLabel(props: { index: number; label: string }) {
  const { index, label } = props;

  return (
    <span className="text-pretty">
      <span className="me-2 font-mono text-xs text-muted-foreground tabular-nums">
        {index + 1}/{STEPS.length}
      </span>
      {label}
    </span>
  );
}

// The delay comes through `custom` so the outgoing content uses the current step's timing,
// not the one it was last rendered with.
const swapVariants: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(2px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay, duration: 0.22, ease: EASE_OUT },
  }),
  exit: (delay: number) => ({
    opacity: 0,
    y: -6,
    filter: "blur(2px)",
    transition: { delay, duration: 0.22, ease: EASE_OUT },
  }),
};

/** Crossfades its content whenever `id` changes. */
function Swap(props: {
  id: string;
  /** Seconds to wait before swapping, e.g. until a request reaches the node. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const { id, delay = 0, className, children } = props;

  return (
    <span className="grid w-full min-w-0">
      <AnimatePresence initial={false} custom={delay}>
        <m.span
          key={id}
          custom={delay}
          variants={swapVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn("col-start-1 row-start-1 flex items-center justify-center", className)}
        >
          {children}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: (delay: number) => ({ opacity: 0, transition: { delay, duration: 0.15 } }),
};

/** The one tab the user sees: it leaves the app for the provider's page and comes back. */
function BrowserWindow(props: { stepIndex: number; provider: Provider }) {
  const { stepIndex, provider } = props;

  const isOnProvider = stepIndex === 1;
  // Back to the app once the redirect from the provider arrives.
  const navigationDelay = stepIndex === 2 ? TRAVEL_S : 0;

  const url =
    stepIndex === 1
      ? "auth.example.com/authorize?…"
      : stepIndex === 2
        ? "app.example.com/?code=…"
        : "app.example.com";

  return (
    <div className="mx-auto flex w-full max-w-64 flex-col overflow-hidden rounded-lg border bg-background shadow-xs">
      <div className="flex h-7 items-center gap-1 border-b bg-muted/50 px-2">
        <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
        <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
        <span className="ms-1 flex h-4.5 min-w-0 flex-1 items-center rounded border bg-background px-1.5 font-mono text-[0.625rem] text-muted-foreground">
          <Swap id={url} delay={navigationDelay} className="justify-start">
            <span className="truncate">{url}</span>
          </Swap>
        </span>
      </div>
      <div className="relative grid min-h-44 overflow-hidden">
        {/*
          Invisible copies of the login pages give the window the height of the tallest one,
          whatever the screen width and font size, so no page ever gets cropped.
        */}
        <div aria-hidden="true" className="invisible col-start-1 row-start-1 grid">
          {PROVIDERS.map((name) => (
            <div key={name} className="col-start-1 row-start-1">
              <LoginPage provider={name} />
            </div>
          ))}
        </div>
        <AnimatePresence initial={false} mode="wait" custom={navigationDelay}>
          <m.div
            key={isOnProvider ? `provider-${provider}` : "app"}
            custom={navigationDelay}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Page load bar, so each navigation reads as a redirect. */}
            <m.span
              aria-hidden="true"
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: [1, 1, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left bg-brand"
            />
            {isOnProvider ? <LoginPage provider={provider} /> : <AppPage stepIndex={stepIndex} />}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AppPage(props: { stepIndex: number }) {
  const { stepIndex } = props;

  // Signed in once the tokens come back from the provider.
  const signedInDelay = stepIndex === 3 ? 2 * TRAVEL_S : 0;

  // During step 2 the tab shows the provider's page instead.
  const screen =
    stepIndex <= 1
      ? "signed out"
      : stepIndex === 2
        ? "signing in"
        : stepIndex === 3
          ? "signed in"
          : stepIndex <= 5
            ? "loading"
            : "todos";

  return (
    <div className="flex h-full flex-col text-xs">
      <div className="flex h-8 items-center justify-between border-b px-3">
        <span className="font-semibold">Todos</span>
        <AnimatePresence initial={false}>
          {stepIndex >= 3 && (
            <m.span
              key="avatar"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ delay: signedInDelay, duration: 0.25, ease: EASE_OUT }}
              className="flex size-5 items-center justify-center rounded-full bg-primary text-[0.625rem] font-semibold text-primary-foreground"
            >
              J
            </m.span>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-1 px-3">
        <Swap
          id={screen}
          delay={screen === "signed in" ? signedInDelay : screen === "todos" ? TRAVEL_S : 0}
        >
          {screen === "signed out" ? (
            <span className="flex flex-col items-center gap-2">
              <span className="text-muted-foreground">Sign in to see your todos</span>
              <m.span
                animate={{ scale: [1, 0.92, 1] }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground"
              >
                Sign in
              </m.span>
            </span>
          ) : screen === "signing in" ? (
            <span className="text-muted-foreground">Signing you in…</span>
          ) : screen === "signed in" ? (
            <span className="flex items-center gap-1 font-medium">
              <CheckIcon
                aria-hidden="true"
                className="size-3.5 text-emerald-600 dark:text-emerald-400"
              />
              Signed in as Jane
            </span>
          ) : screen === "loading" ? (
            <span className="text-muted-foreground">Loading your todos…</span>
          ) : (
            <ul className="flex w-full flex-col gap-2 text-start">
              {TODOS.map((todo, index) => (
                <m.li
                  key={todo}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: TRAVEL_S + index * 0.12,
                    duration: 0.3,
                    ease: EASE_OUT,
                  }}
                  className="flex items-center gap-2"
                >
                  <span className="size-3 shrink-0 rounded-sm border border-muted-foreground/40" />
                  <span className="truncate">{todo}</span>
                </m.li>
              ))}
            </ul>
          )}
        </Swap>
      </div>
    </div>
  );
}

/**
 * The provider's own sign-in page, styled after each provider's default look.
 * It is always light, like the real ones, which also makes it read as another site.
 */
function LoginPage(props: { provider: Provider }) {
  const { provider } = props;

  switch (provider) {
    case "Keycloak":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 bg-zinc-100 px-4 py-3 text-zinc-900">
          <span className="text-[0.625rem] font-semibold tracking-[0.2em] text-zinc-500">
            MYREALM
          </span>
          <div className="flex w-full flex-col gap-1.5 border-t-2 border-[#0066cc] bg-white p-2.5 shadow-sm">
            <span className="text-[0.6875rem] font-semibold">Sign in to your account</span>
            <Field label="Username or email" value="jane@example.com" delay={0.3} />
            <Field label="Password" value="••••••••" delay={1.1} />
            <SubmitButton className="mt-1 rounded-sm bg-[#0066cc]">Sign In</SubmitButton>
          </div>
        </div>
      );
    case "Auth0":
      return (
        <div className="flex h-full items-center justify-center bg-zinc-100 px-4 py-3 text-zinc-900">
          <div className="flex w-full flex-col items-center gap-1.5 rounded-md bg-white px-3 py-2.5 shadow-sm">
            <span className="size-5 rounded-full bg-zinc-200" />
            <span className="text-[0.6875rem] font-semibold">Welcome</span>
            <span className="text-[0.5625rem] text-zinc-500">Log in to continue to Todos.</span>
            <Field value="jane@example.com" delay={0.3} className="rounded" />
            <Field value="••••••••" delay={1.1} className="rounded" />
            <SubmitButton className="w-full rounded bg-[#635dff]">Continue</SubmitButton>
          </div>
        </div>
      );
    case "Microsoft Entra ID":
      return (
        <div className="flex h-full items-center justify-center bg-zinc-100 px-4 py-3 text-zinc-900">
          <div className="flex w-full flex-col gap-2 bg-white p-3 shadow-sm">
            <span className="h-3 w-14 rounded-sm bg-zinc-200" />
            <span className="text-sm font-semibold">Sign in</span>
            <Field
              value="jane@example.com"
              delay={0.3}
              className="rounded-none border-0 border-b border-zinc-400 bg-transparent px-0"
            />
            <span className="text-[0.5625rem] text-[#0067b8]">Can't access your account?</span>
            <SubmitButton className="self-end bg-[#0067b8] px-4">Next</SubmitButton>
          </div>
        </div>
      );
  }
}

function Field(props: { label?: string; value: string; delay: number; className?: string }) {
  const { label, value, delay, className } = props;

  return (
    <span className="flex w-full flex-col gap-0.5">
      {label !== undefined && <span className="text-[0.5625rem] text-zinc-600">{label}</span>}
      <span
        className={cn(
          "flex h-5 items-center overflow-hidden border border-zinc-300 bg-white px-1.5 font-mono text-[0.5625rem]",
          className,
        )}
      >
        <m.span
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay, duration: 0.6, ease: "linear" }}
          className="whitespace-nowrap"
        >
          {value}
        </m.span>
      </span>
    </span>
  );
}

function SubmitButton(props: { className?: string; children: React.ReactNode }) {
  const { className, children } = props;

  return (
    <m.span
      animate={{
        scale: [1, 0.92, 1],
        filter: ["brightness(1)", "brightness(0.8)", "brightness(1)"],
      }}
      transition={{ delay: SUBMIT_S, duration: 0.3 }}
      className={cn(
        "flex h-5.5 items-center justify-center text-[0.625rem] font-medium text-white",
        className,
      )}
    >
      {children}
    </m.span>
  );
}

/** What the server sees, one line per request, kept until the flow starts over. */
function ServerLog(props: {
  host: string;
  entries: LogEntry[];
  stepIndex: number;
  /** Changes when the flow starts over, so every line comes in again. */
  cycle: number;
}) {
  const { host, entries, stepIndex, cycle } = props;

  const visibleEntries = entries.filter((entry) => entry.step <= stepIndex);

  return (
    <div className="mx-auto flex min-h-36 w-full max-w-52 flex-col gap-1.5 overflow-hidden rounded-lg border bg-background p-3 font-mono text-[0.6875rem] shadow-xs">
      <span className="text-muted-foreground">{host}</span>
      <ul className="flex flex-col gap-0.5">
        <AnimatePresence>
          {visibleEntries.length === 0 ? (
            <m.li
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="text-muted-foreground"
            >
              Waiting…
            </m.li>
          ) : (
            visibleEntries.map((entry) => (
              <m.li
                key={`${cycle}-${entry.text}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: entry.step === stepIndex ? (entry.delay ?? 0) : 0,
                    duration: 0.25,
                    ease: EASE_OUT,
                  },
                }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className={cn(
                  "flex items-center gap-1 truncate",
                  entry.isSuccess === true && "text-emerald-600 dark:text-emerald-400",
                )}
              >
                {entry.isSuccess === true && <CheckIcon aria-hidden="true" className="size-3" />}
                {entry.text}
              </m.li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Node(props: {
  icon: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const { icon, title, subtitle, isActive, children } = props;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground transition-[box-shadow,border-color] duration-500 ease-out",
        isActive && "border-brand/50 shadow-[0_0_0_4px] shadow-primary/10",
      )}
    >
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex min-w-0 flex-col">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-pretty text-muted-foreground">{subtitle}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function IconBox(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand">
      {children}
    </span>
  );
}

/** Every supported platform side by side, the one used in the current run brought forward. */
function ProviderLogos(props: { activeProvider: Provider }) {
  const { activeProvider } = props;

  return (
    <span className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-2">
      {PROVIDERS.map((provider) => (
        <ProviderLogo
          key={provider}
          provider={provider}
          className={cn(
            "transition-[opacity,filter,scale] duration-300 ease-out",
            provider === activeProvider ? "scale-110" : "scale-90 opacity-40 grayscale",
          )}
        />
      ))}
    </span>
  );
}

/**
 * Line between two nodes, horizontal on large screens and vertical below.
 * A chip carrying what is sent crosses it, driven by `--p` (0 at the start, 1 at the end).
 */
function Connector(props: { stepIndex: number; travel: Travel | undefined }) {
  const { stepIndex, travel } = props;

  const from = travel?.isReversed === true ? 1 : 0;
  const isRoundTrip = travel?.chips.length === 2;

  return (
    <div aria-hidden="true" className="relative h-20 lg:h-full">
      <span className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed lg:top-1/2 lg:right-0 lg:bottom-auto lg:left-0 lg:translate-x-0 lg:border-t lg:border-l-0" />
      <AnimatePresence>
        {travel !== undefined && (
          <m.div
            key={stepIndex}
            className="absolute inset-0"
            initial={{ "--p": from, opacity: 1 }}
            animate={{ "--p": isRoundTrip ? [from, 1 - from, from] : 1 - from }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isRoundTrip ? 2 * TRAVEL_S : TRAVEL_S,
              ease: EASE_OUT,
              opacity: { duration: 0.2 },
            }}
          >
            {/* The part of the line already travelled, from the source to the chip. */}
            <span
              className={cn(
                "absolute bg-brand max-lg:left-1/2 max-lg:w-px max-lg:-translate-x-1/2 lg:top-1/2 lg:h-px",
                isRoundTrip
                  ? "max-lg:inset-y-0 lg:inset-x-0"
                  : travel.isReversed
                    ? "max-lg:bottom-0 max-lg:h-[calc((1-var(--p))*100%)] lg:right-0 lg:w-[calc((1-var(--p))*100%)]"
                    : "max-lg:top-0 max-lg:h-[calc(var(--p)*100%)] lg:left-0 lg:w-[calc(var(--p)*100%)]",
              )}
            />
            <span className="absolute grid rounded-full border border-brand/50 bg-background px-2 py-0.5 font-mono text-[0.625rem] whitespace-nowrap text-foreground shadow-[0_0_14px] shadow-primary/25 max-lg:top-[calc(var(--p)*100%)] max-lg:left-1/2 max-lg:[translate:-50%_calc(var(--p)*-100%)] lg:top-1/2 lg:left-[calc(var(--p)*100%)] lg:[translate:calc(var(--p)*-100%)_-50%]">
              {isRoundTrip ? (
                <>
                  {/* The request label on the way out, the response label on the way back. */}
                  <m.span
                    className="col-start-1 row-start-1 text-center"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 2 * TRAVEL_S, times: [0, 0.45, 0.55, 1] }}
                  >
                    {travel.chips[0]}
                  </m.span>
                  <m.span
                    className="col-start-1 row-start-1 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 1, 1] }}
                    transition={{ duration: 2 * TRAVEL_S, times: [0, 0.45, 0.55, 1] }}
                  >
                    {travel.chips[1]}
                  </m.span>
                </>
              ) : (
                travel.chips[0]
              )}
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
