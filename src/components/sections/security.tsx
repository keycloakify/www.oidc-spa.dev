import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { docs } from "#constants";
import { revealVariants, revealViewport, staggerVariants } from "#lib/motion";
import { sectionClassName } from "#lib/section";
import { cn } from "#lib/utils";
import {
  ArrowUpRightIcon,
  CpuIcon,
  FingerprintIcon,
  type LucideIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  SnowflakeIcon,
} from "lucide-react";
import * as m from "motion/react-m";

const protections: {
  Icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className: string;
}[] = [
  {
    Icon: ShieldCheckIcon,
    title: "Authorization Code Flow with PKCE",
    description:
      "The OpenID Connect flow designed for public clients. An intercepted code is useless without the verifier only your app holds.",
    href: docs("/resources/why-no-client-secret"),
    className: "lg:col-span-3",
  },
  {
    Icon: CpuIcon,
    title: "In-memory tokens by default",
    description:
      "Tokens never touch localStorage or sessionStorage, and sessions are still restored transparently on reload.",
    href: docs("/resources/third-party-cookies-and-session-restoration"),
    className: "lg:col-span-3",
  },
  {
    Icon: FingerprintIcon,
    title: "DPoP",
    description:
      "Tokens are bound to a private key held by your app. In auto mode, it is used whenever your provider supports it.",
    href: docs("/security-features/dpop"),
    className: "lg:col-span-2",
  },
  {
    Icon: RefreshCcwIcon,
    title: "Token substitution",
    description:
      "Your code only ever sees tokens with a fake signature. The real one is restored as the request leaves, for trusted hosts only.",
    href: docs("/security-features/token-substitution"),
    className: "lg:col-span-2",
  },
  {
    Icon: SnowflakeIcon,
    title: "Browser runtime freeze",
    description:
      "Core APIs like fetch are frozen before your app loads, so no script can patch them to steal tokens.",
    href: docs("/security-features/browser-runtime-freeze"),
    className: "lg:col-span-2",
  },
];

export function Security() {
  return (
    <section className={sectionClassName}>
      <Reveal>
        <SectionHeading eyebrow="Security" title="Security built for browser-first apps.">
          <p>
            Keeping tokens safe in the browser takes more than implementing a login flow. oidc-spa
            brings together protections designed for this architecture.
          </p>
        </SectionHeading>
      </Reveal>

      <m.ul
        variants={staggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className="mx-auto mt-12 grid max-w-6xl gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-6"
      >
        {protections.map(({ Icon, title, description, href, className }, index) => (
          <m.li
            key={title}
            variants={revealVariants}
            className={cn(index === protections.length - 1 && "sm:col-span-2", className)}
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground transition-colors duration-200 ease-out outline-none hover:border-brand/40 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-brand">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
              </span>
              <span className="font-medium">{title}</span>
              <span className="text-sm text-pretty text-muted-foreground">{description}</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
}
