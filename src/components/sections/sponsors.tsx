import phaseTwoSvgUrl from "#assets/img/phasetwo.svg";
import gouvSvgUrl from "#assets/img/users/gouv.svg";
import onyxiaSvgUrl from "#assets/img/users/onyxia.svg";
import { Eyebrow } from "#components/eyebrow";
import { Reveal } from "#components/reveal";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "#components/ui/card";
import { sectionClassName } from "#lib/section";

const otherSponsors: { name: string; href: string; logo: React.ReactNode }[] = [
  {
    name: "Insee",
    href: "https://datalab.sspcloud.fr/",
    logo: (
      <img
        src={onyxiaSvgUrl}
        alt=""
        width={42}
        height={28}
        loading="lazy"
        // In the text color, like the Phase Two logo above.
        className="h-7 w-auto brightness-0 dark:invert"
      />
    ),
  },
  {
    name: "gouv.fr",
    href: "https://camino.developpement-durable.gouv.fr",
    logo: (
      <img
        src={gouvSvgUrl}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        className="size-7 rounded-sm"
      />
    ),
  },
];

export function Sponsors() {
  return (
    <section className={sectionClassName}>
      <Reveal className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>Sponsors</Eyebrow>
          <h2 className="text-3xl font-medium tracking-tight text-balance sm:text-5xl">
            Backed by our sponsors
          </h2>
        </div>

        <div className="flex w-full max-w-md flex-col gap-4">
          <Card>
            <CardContent className="flex flex-col items-center gap-6 text-center">
              <img
                src={phaseTwoSvgUrl}
                alt="Phase Two"
                width={130}
                height={33}
                className="my-6 h-auto w-full max-w-70 brightness-0 dark:invert"
              />
              <div className="flex flex-col gap-2">
                <CardTitle>Keycloak as a Service</CardTitle>
                <CardDescription className="text-pretty">
                  Keycloak community contributors building popular extensions, managed hosting, and
                  enterprise support. Get the flexibility of Keycloak with the expertise to run it
                  for businesses of all sizes.
                </CardDescription>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                nativeButton={false}
                render={
                  <a
                    href="https://phasetwo.io/?utm_source=oidc-spa"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Learn more about Phase Two
              </Button>
            </CardFooter>
          </Card>

          <ul className="grid grid-cols-2 gap-4">
            {otherSponsors.map(({ name, href, logo }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full items-center justify-center gap-2.5 rounded-xl border bg-card px-4 py-6 text-lg font-medium tracking-tight text-card-foreground transition-colors duration-200 ease-out outline-none hover:border-brand/40 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {logo}
                  {name}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
