import { CodeBlock, CodeLines } from "#components/code-block";
import { CopyButton } from "#components/copy-button";
import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";
import { docs } from "#constants";
import { sectionClassName } from "#lib/section";
import { useState } from "react";

const USER_TYPE = `// App-specific user model exposed by \`useUser()\`.
// Shape it around the information the UI needs to render.
export type User = {
    displayName: string;
    avatarImgUrl: string;
    canSeeAdminNavigation: boolean;
};`;

const RUNTIME_CONFIGS = `    .withRuntimeConfigs({
        mode: "real",
        issuerUri: "https://auth.mycompany.com/realms/myrealm",
        clientId: "myclient"
    })
    .createUtils();`;

type Example = { value: string; label: string; code: string };

// From https://docs.oidc-spa.dev/docs/v11/features/user
const examples: Example[] = [
  {
    value: "claims",
    label: "Token claims",
    code: `import { oidcSpa } from "oidc-spa/client";
import { decodeJwt } from "oidc-spa/decode-jwt";

${USER_TYPE}

export const { getOidc } = oidcSpa
    .withUser<User>(({ idTokenClaims, accessToken }) => {

        const accessTokenClaims = decodeJwt(accessToken);

        return {
            displayName: idTokenClaims.name,
            avatarImgUrl: idTokenClaims.picture,
            canSeeAdminNavigation: accessTokenClaims.roles.includes("admin")
        };

    })
${RUNTIME_CONFIGS}`,
  },
  {
    value: "userinfo",
    label: "UserInfo",
    code: `import { oidcSpa } from "oidc-spa/client";

${USER_TYPE}

export const { getOidc } = oidcSpa
    .withUser<User>(async ({ fetchUserInfo }) => {

        const userInfo = await fetchUserInfo();

        return {
            displayName: userInfo.name,
            avatarImgUrl: userInfo.picture,
            canSeeAdminNavigation: userInfo.roles.includes("admin")
        };

    })
${RUNTIME_CONFIGS}`,
  },
  {
    value: "api",
    label: "Your API",
    code: `import { oidcSpa } from "oidc-spa/client";

${USER_TYPE}

export const { getOidc } = oidcSpa
    .withUser<User>(() => fetchWithAuth("/api/user").then(r => r.json()))
${RUNTIME_CONFIGS}

// Attaches the access token when logged in; otherwise behaves like fetch.
export const fetchWithAuth: typeof fetch = async (input, init) => {
    const request = new Request(input, init);
    const oidc = await getOidc();

    if (oidc.isUserLoggedIn) {
        request.headers.set("Authorization", \`Bearer \${await oidc.getAccessToken()}\`);
    }

    return fetch(request);
};`,
  },
  {
    value: "keycloak",
    label: "Keycloak User Profile",
    code: `import { oidcSpa } from "oidc-spa/client";
import { createKeycloakUtils } from "oidc-spa/keycloak-utils";

${USER_TYPE}

export const { getOidc } = oidcSpa
    .withUser<User>(async ({ issuerUri, accessToken }) => {

        const keycloakUtils = createKeycloakUtils({ issuerUri });

        const kcUserProfile = await keycloakUtils.fetchUserProfile({ accessToken });

        return {
            displayName: \`\${kcUserProfile.firstName} \${kcUserProfile.lastName}\`,
            avatarImgUrl: kcUserProfile.attributes.picture,
            canSeeAdminNavigation: kcUserProfile.roles.includes("admin")
        };

    })
${RUNTIME_CONFIGS}`,
  },
];

const USAGE_CODE = `import { getOidc, useOidc } from "~/oidc";

async function greetings() {
    const oidc = await getOidc();

    if (!oidc.isUserLoggedIn) {
        return;
    }

    const user = await oidc.getUser();

    alert(\`Hello \${user.displayName}\`);
}

function Greeting() {
    const { isUserLoggedIn, user } = useOidc();

    if (!isUserLoggedIn) {
        return null;
    }

    return (
        <div>
            <img src={user.avatarImgUrl} />
            <h1>Hello {user.displayName}</h1>
        </div>
    );
}`;

// Every tab gets the height of the longest snippet, so switching doesn't move the page.
const maxLineCount = Math.max(...examples.map(({ code }) => code.split("\n").length));

export function UserObject() {
  const [selectedValue, setSelectedValue] = useState(examples[0].value);
  const selectedExample = examples.find(({ value }) => value === selectedValue) ?? examples[0];

  return (
    <section className={sectionClassName}>
      <Reveal className="flex flex-col items-center gap-6">
        <SectionHeading eyebrow="Typed users" title="Your user object, your way.">
          <p>
            You decide what a user looks like in your application. Give oidc-spa one function that
            creates that representation, and use the result throughout your app with full TypeScript
            support. Build it from ID token claims, access token claims, the userinfo endpoint, your
            own API, or a combination of those sources.
          </p>
        </SectionHeading>
        <ExternalLink href={docs("/features/user")}>Learn more about the user object</ExternalLink>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-6xl gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-6">
        <Reveal className="flex min-w-0 flex-col gap-3">
          <StepLabel number={1}>Create it, from the source of your choice</StepLabel>
          <Tabs
            value={selectedValue}
            onValueChange={(value) => setSelectedValue(String(value))}
            className="flex-1 gap-0 overflow-hidden rounded-xl border bg-card text-card-foreground"
          >
            <div className="flex min-h-11 items-center justify-between gap-3 border-b bg-muted/40 ps-2 pe-1.5">
              <TabsList
                variant="line"
                aria-label="Where the user comes from"
                className="no-scrollbar h-11 max-w-full overflow-x-auto overflow-y-hidden"
              >
                {examples.map(({ value, label }) => (
                  <TabsTrigger key={value} value={value} className="px-2">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground max-xl:hidden">
                  src/oidc.ts
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

        <Reveal className="flex min-w-0 flex-col gap-3">
          <StepLabel number={2}>Use it anywhere, fully typed</StepLabel>
          <CodeBlock code={USAGE_CODE} fileName="src/components/Greeting.tsx" className="flex-1" />
        </Reveal>
      </div>
    </section>
  );
}

function StepLabel(props: { number: number; children: React.ReactNode }) {
  const { number, children } = props;

  return (
    <span className="flex items-center gap-2.5 text-sm font-medium">
      <span className="flex size-6 items-center justify-center rounded-full border bg-muted/50 font-mono text-xs text-muted-foreground">
        {number}
      </span>
      {children}
    </span>
  );
}
