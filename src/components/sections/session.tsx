import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { YoutubeVideo } from "#components/youtube-video";
import { docs } from "#constants";
import { sectionClassName } from "#lib/section";
import { CheckIcon } from "lucide-react";

const perks = [
  "Automatic token renewal and session restoration.",
  "Login and logout propagation across tabs.",
  "Inactivity logout warnings with a countdown your UI can display.",
];

export function Session() {
  return (
    <section className={sectionClassName}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <SectionHeading
            align="start"
            eyebrow="Sessions"
            title="A great session experience out of the box."
          >
            <p>
              Give your users smooth authentication without building all the session plumbing
              yourself.
            </p>
          </SectionHeading>
          <ul className="flex flex-col gap-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-brand">
                  <CheckIcon aria-hidden="true" className="size-3" />
                </span>
                <span className="text-pretty">{perk}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-pretty text-muted-foreground">
            When a session is about to expire, give users a chance to keep working. Watch it in
            action, or read about{" "}
            <ExternalLink href={docs("/features/auto-logout")}>auto logout</ExternalLink>.
          </p>
        </Reveal>
        <Reveal>
          <YoutubeVideo id="GeZaZIr-d68" title="oidc-spa: Auto logout countdown" />
        </Reveal>
      </div>
    </section>
  );
}
