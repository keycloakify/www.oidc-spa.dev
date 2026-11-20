import { CodeLines } from "#components/code-block";
import { CopyButton } from "#components/copy-button";
import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";
import { docs } from "#constants";
import { sectionClassName } from "#lib/section";
import { cn } from "#lib/utils";
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

type Example = {
  value: string;
  label: string;
  fileName: string;
  code: string;
  isLineDimmed?: (lineIndex: number) => boolean;
};

// From https://docs.oidc-spa.dev/docs/v11/features/user
const creations: Example[] = [
  {
    value: "claims",
    label: "Token claims",
    fileName: "src/oidc.ts",
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
    fileName: "src/oidc.ts",
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
    fileName: "src/oidc.ts",
    code: `import { oidcSpa } from "oidc-spa/client";

${USER_TYPE}

export const { getOidc } = oidcSpa
    .withUser<User>(() => fetchWithAuth("/api/user")
        .then(r => r.json()))
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
    fileName: "src/oidc.ts",
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
].map((example) => {
  const lines = example.code.split("\n");
  const userTypeStart = lines.indexOf(USER_TYPE.split("\n")[0]);
  const userTypeEnd = userTypeStart + USER_TYPE.split("\n").length;
  const withUserStart = lines.findIndex((line) => line.includes(".withUser<User>"));
  const withUserEnd = lines.findIndex((line) => line.includes(".withRuntimeConfigs("));

  return {
    ...example,
    isLineDimmed: (index: number) =>
      !(
        (index >= userTypeStart && index < userTypeEnd) ||
        (index >= withUserStart && index < withUserEnd)
      ),
  };
});

const usages: Example[] = [
  {
    value: "agnostic",
    label: "Framework agnostic",
    fileName: "src/main.ts",
    code: `async function updateUser() {
    const oidc = await getOidc({ assert: "user logged in" });
    const user = await oidc.getUser();
    document.querySelector("img").src = user.avatarImgUrl;
    document.querySelector("h1").textContent = 
      \`Hello \${user.displayName}\`;
}`,
  },
  {
    value: "react",
    label: "React",
    fileName: "src/components/ShowUser.tsx",
    code: `function ShowUser() {
    const { user } = useOidc({ assert: "user logged in" });
    return (
        <div>
            <img src={user.avatarImgUrl} />
            <h1>Hello {user.displayName}</h1>
        </div>
    );
}`,
  },
  {
    value: "vue",
    label: "Vue",
    fileName: "src/components/ShowUser.vue",
    code: `<script setup>
const { user } = useOidc({ assert: "user logged in" });
</script>

<template>
    <img :src="user.avatarImgUrl" />
    <h1>Hello {{ user.displayName }}</h1>
</template>`,
  },
  {
    value: "angular",
    label: "Angular",
    fileName: "src/app/show-user.component.ts",
    code: `@Component({
    template: \`
        <img [src]="oidc.user().avatarImgUrl" />
        <h1>Hello {{ oidc.user().displayName }}</h1>
    \`
})
class ShowUserComponent {
    readonly oidc = injectOidc({ assert: "user logged in" });
}`,
  },
];

export function UserObject() {
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
          <TabbedCode
            ariaLabel="Where the user comes from"
            examples={creations}
            className="flex-1"
          />
        </Reveal>

        <Reveal className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
          <StepLabel number={2}>Use it anywhere, fully typed</StepLabel>
          <TabbedCode ariaLabel="Where the user is used" examples={usages} />
        </Reveal>
      </div>
    </section>
  );
}

/** Code examples in tabs, each tab as tall as the longest so switching doesn't move the page. */
function TabbedCode(props: { ariaLabel: string; examples: Example[]; className?: string }) {
  const { ariaLabel, examples, className } = props;

  const [selectedValue, setSelectedValue] = useState(examples[0].value);
  const selectedExample = examples.find(({ value }) => value === selectedValue) ?? examples[0];
  const maxLineCount = Math.max(...examples.map(({ code }) => code.split("\n").length));

  return (
    <Tabs
      value={selectedValue}
      onValueChange={(value) => setSelectedValue(String(value))}
      className={cn(
        "gap-0 overflow-hidden rounded-xl border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex min-h-11 items-center justify-between gap-3 border-b bg-muted/40 ps-2 pe-1.5">
        <TabsList
          variant="line"
          aria-label={ariaLabel}
          className="no-scrollbar h-11 max-w-full overflow-x-auto overflow-y-hidden"
        >
          {examples.map(({ value, label: tabLabel }) => (
            <TabsTrigger key={value} value={value} className="px-2">
              {tabLabel}
            </TabsTrigger>
          ))}
        </TabsList>
        <span className="flex items-center gap-2">
          <span className="truncate font-mono text-xs text-muted-foreground max-xl:hidden">
            {selectedExample.fileName}
          </span>
          <CopyButton text={selectedExample.code} />
        </span>
      </div>

      {examples.map(({ value, code, isLineDimmed }) => (
        <TabsContent key={value} value={value}>
          <CodeLines
            code={code}
            isLineDimmed={isLineDimmed}
            style={{ minHeight: `calc(${maxLineCount} * 1.5rem + 2rem)` }}
          />
        </TabsContent>
      ))}
    </Tabs>
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
