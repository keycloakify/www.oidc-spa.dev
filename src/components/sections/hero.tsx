import logoSvgUrl from "#assets/img/logo.svg";
import { ArchitectureDiagram } from "#components/architecture-diagram";
import { GithubIcon } from "#components/brand-icons";
import { ProviderLogo } from "#components/provider-logos";
import { getProviderGuideUrl, PROVIDERS } from "#lib/providers";
import { Button } from "#components/ui/button";
import { DOCUMENTATION_URL, EXAMPLES_URL, GITHUB_REPO_URL } from "#constants";
import { revealVariants, staggerVariants } from "#lib/motion";
import { BookOpenIcon, PlusIcon } from "lucide-react";
import * as m from "motion/react-m";

export function Hero() {
  return (
    <section className="wrapper overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto aspect-square w-full max-w-3xl -translate-y-2/3 rounded-full bg-primary/20 blur-[120px]"
      />
      <m.div
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-14 px-5 pt-16 pb-14 sm:px-10 sm:pt-24 sm:pb-20 lg:px-16"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <m.span
            variants={revealVariants}
            className="flex items-center gap-2 rounded-full border bg-card py-1 ps-1.5 pe-3 text-sm font-medium"
          >
            <img src={logoSvgUrl} alt="" className="size-5" />
            oidc-spa
          </m.span>
          <m.h1
            variants={revealVariants}
            className="text-4xl font-medium tracking-tighter text-balance sm:text-6xl"
          >
            The OpenID Connect TypeScript toolkit{" "}
            <span className="text-brand">for apps that live in the browser.</span>
          </m.h1>
          <m.p
            variants={revealVariants}
            className="max-w-2xl text-pretty text-muted-foreground sm:text-lg"
          >
            A single MIT library to connect your frontend to your identity provider, deliver a
            smooth sign-in experience, and authenticate requests to your APIs.
          </m.p>
          <m.div
            variants={revealVariants}
            className="mt-2 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer" />}
              className="h-10 px-4"
            >
              Get started
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<a href={EXAMPLES_URL} target="_blank" rel="noopener noreferrer" />}
              className="h-10 px-4"
            >
              <BookOpenIcon data-icon="inline-start" />
              Explore the examples
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" />}
              className="h-10 px-4"
            >
              <GithubIcon data-icon="inline-start" />
              GitHub
            </Button>
          </m.div>
          <m.div variants={revealVariants} className="mt-6 flex flex-col items-center gap-3">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Works with any OpenID Connect provider
            </span>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {PROVIDERS.map((provider) => (
                <li key={provider}>
                  <ProviderLink href={getProviderGuideUrl(provider)}>
                    <ProviderLogo provider={provider} className="size-5" />
                    {provider}
                  </ProviderLink>
                </li>
              ))}
              <li>
                <ProviderLink href={getProviderGuideUrl("Other")}>
                  <PlusIcon aria-hidden="true" className="size-4" />
                  Any OIDC provider
                </ProviderLink>
              </li>
            </ul>
          </m.div>
        </div>

        <m.div variants={revealVariants}>
          <ArchitectureDiagram className="mx-auto w-full max-w-6xl" />
        </m.div>
      </m.div>
    </section>
  );
}

/** A provider in the hero row, linking to its setup guide. */
function ProviderLink(props: { href: string; children: React.ReactNode }) {
  const { href, children } = props;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-200 ease-out outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {children}
      <span className="sr-only">setup guide (opens in a new tab)</span>
    </a>
  );
}
