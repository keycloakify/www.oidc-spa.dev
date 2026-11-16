import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { Badge } from "#components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { sectionClassName } from "#lib/section";
import { cn } from "#lib/utils";
import { ArrowDownIcon } from "lucide-react";

const flows = [
  {
    title: "Typical server-side OIDC",
    badge: "Backend is the client",
    isHighlighted: false,
    steps: [
      "The browser is redirected to the identity provider",
      "Your backend exchanges the code and keeps the tokens",
      "The browser gets an application session cookie",
      "Every request is checked against your session store",
    ],
  },
  {
    title: "With oidc-spa",
    badge: "Frontend is the client",
    isHighlighted: true,
    steps: [
      "The browser is redirected to the identity provider",
      "Your frontend exchanges the code for tokens (PKCE)",
      "Requests to your API carry an access token",
      "Your API validates the token, no session store needed",
    ],
  },
];

export function HowItWorks() {
  return (
    <section className={sectionClassName}>
      <Reveal>
        <SectionHeading eyebrow="How it works" title="Your frontend is the OpenID Connect client.">
          <p>
            It obtains tokens directly from your identity provider and uses them to call your APIs.
          </p>
        </SectionHeading>
      </Reveal>

      <Reveal className="mx-auto mt-12 grid max-w-4xl gap-4 sm:mt-16 md:grid-cols-2">
        {flows.map(({ title, badge, isHighlighted, steps }) => (
          <Card key={title} className={cn(isHighlighted && "ring-brand/50")}>
            <CardHeader className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>{title}</CardTitle>
              <Badge variant={isHighlighted ? "default" : "outline"}>{badge}</Badge>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col items-start gap-1">
                {steps.map((step, index) => (
                  <li key={step} className="flex flex-col items-start gap-1">
                    <span className="flex items-start gap-2.5 text-sm">
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] tabular-nums",
                          isHighlighted && "border-brand/50 text-brand",
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="text-pretty text-muted-foreground">{step}</span>
                    </span>
                    {index !== steps.length - 1 && (
                      <ArrowDownIcon
                        aria-hidden="true"
                        className="ms-1 size-3 text-muted-foreground/50"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </Reveal>
    </section>
  );
}
