import { CodeLines } from "#components/code-block";
import { CopyButton } from "#components/copy-button";
import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";
import { docs } from "#constants";
import { sectionClassName } from "#lib/section";
import { useState } from "react";

type Example = {
  value: string;
  label: string;
  /** `src/oidc.user.ts`, adapted from the docs and trimmed to `createUser`. */
  code: string;
};

// From https://docs.oidc-spa.dev/docs/v11/features/user
const examples: Example[] = [
  {
    value: "claims",
    label: "Token claims",
    code: `import type { CreateUser } from "oidc-spa/core";
import { z } from "zod";

export type User = { displayName: string; avatarUrl?: string };

const DecodedIdToken = z.object({
    name: z.string(),
    picture: z.string().optional()
});

export const createUser: CreateUser<User> = ({ decodedIdToken }) => {
    const { name, picture } = DecodedIdToken.parse(decodedIdToken);
    return { displayName: name, avatarUrl: picture };
};`,
  },
  {
    value: "userinfo",
    label: "UserInfo",
    code: `import type { CreateUser } from "oidc-spa/core";
import { z } from "zod";

export type User = { id: string; email: string | undefined };

const UserInfo = z.object({
    sub: z.string(),
    email: z.string().email().optional()
});

export const createUser: CreateUser<User> = async ({ fetchUserInfo }) => {
    const { sub, email } = UserInfo.parse(await fetchUserInfo());
    return { id: sub, email };
};`,
  },
  {
    value: "api",
    label: "Your API",
    code: `import type { CreateUser } from "oidc-spa/core";
import { z } from "zod";

const UserFromApi = z.object({
    displayName: z.string(),
    canManageBilling: z.boolean()
});

export type User = z.infer<typeof UserFromApi>;

export const createUser: CreateUser<User> = async () => {
    const { fetchWithAuth } = await import("./oidc");
    const response = await fetchWithAuth("/api/user");
    return UserFromApi.parse(await response.json());
};`,
  },
];

// Every tab gets the height of the longest snippet, so switching doesn't move the page.
const maxLineCount = Math.max(...examples.map(({ code }) => code.split("\n").length));

export function UserObject() {
  const [selectedValue, setSelectedValue] = useState(examples[0].value);
  const selectedExample = examples.find(({ value }) => value === selectedValue) ?? examples[0];

  return (
    <section className={sectionClassName}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <SectionHeading
            align="start"
            eyebrow="Typed users"
            title={
              <>
                <span className="whitespace-nowrap">Your user object,</span> your way.
              </>
            }
          >
            <p>
              You decide what a user looks like in your application. Give oidc-spa one function that
              creates that representation, and use the result throughout your app with full
              TypeScript support.
            </p>
            <p>
              Build it from ID token claims, access token claims, the userinfo endpoint, your own
              API, or a combination of those sources.
            </p>
          </SectionHeading>
          <ExternalLink href={docs("/features/user")} className="self-start">
            Learn more about the user object
          </ExternalLink>
        </Reveal>

        <Reveal className="min-w-0">
          <Tabs
            value={selectedValue}
            onValueChange={(value) => setSelectedValue(String(value))}
            className="gap-0 overflow-hidden rounded-xl border bg-card text-card-foreground"
          >
            <div className="flex h-11 items-center justify-between gap-3 border-b bg-muted/40 ps-2 pe-1.5">
              <TabsList variant="line" aria-label="Where the user comes from">
                {examples.map(({ value, label }) => (
                  <TabsTrigger key={value} value={value} className="px-2">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground max-sm:hidden">
                  src/oidc.user.ts
                </span>
                <CopyButton text={selectedExample.code} />
              </span>
            </div>

            {examples.map(({ value, code }) => (
              <TabsContent key={value} value={value}>
                <CodeLines
                  code={code}
                  style={{ minHeight: `calc(${maxLineCount} * 1.5rem + 2rem)` }}
                />
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
