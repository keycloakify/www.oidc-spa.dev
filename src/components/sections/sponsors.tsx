import phaseTwoSvgUrl from "#assets/img/phasetwo.svg";
import { Eyebrow } from "#components/eyebrow";
import { Reveal } from "#components/reveal";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "#components/ui/card";
import { sectionClassName } from "#lib/section";

export function Sponsors() {
  return (
    <section className={sectionClassName}>
      <Reveal className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>Sponsor</Eyebrow>
          <h2 className="text-3xl font-medium tracking-tight text-balance sm:text-5xl">
            Backed by our sponsor
          </h2>
        </div>

        <div className="w-full max-w-md">
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
        </div>
      </Reveal>
    </section>
  );
}
