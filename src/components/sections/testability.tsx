import { CodeLines } from "#components/code-block";
import { CopyButton } from "#components/copy-button";
import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { Tabs, TabsList, TabsTrigger } from "#components/ui/tabs";
import { docs } from "#constants";
import { sectionClassName } from "#lib/section";
import { useState } from "react";

type Mode = "real" | "mock";

/**
 * The TanStack Start setup, split in chunks so each toggle can bring its own branches forward.
 */
const chunks: { mode: Mode | "none"; code: string }[] = [
  {
    mode: "none",
    code: `import { oidcSpa } from "oidc-spa/tanstack-start-react";

type User_client = { displayName: string; avatar: string };
type User_server = { id: string; isAdmin: boolean };

export const { useOidc, getOidc } = oidcSpa
    .withClientUser<User_client>(({ isMock, idTokenClaims }) => {`,
  },
  {
    mode: "mock",
    code: `        if (isMock) {
            return {
                displayName: "John Doe",
                avatar: "/default-avatar.svg"
            };
        }`,
  },
  {
    mode: "real",
    code: `        return {
            displayName: idTokenClaims.name,
            avatar: idTokenClaims.picture
        };`,
  },
  {
    mode: "none",
    code: `    })
    .withServerUser<User_server>(({ isMock, accessTokenClaims }) => {`,
  },
  { mode: "mock", code: `        if (isMock) return { id: "1234", isAdmin: true };` },
  {
    mode: "real",
    code: `        return {
            id: accessTokenClaims.sub,
            isAdmin: accessTokenClaims.roles.includes("admin")
        };`,
  },
  {
    mode: "none",
    code: `    })
    .withRuntimeConfigs(({ process }) => {`,
  },
  {
    mode: "mock",
    code: `        if (process.env["OIDC_MOCK"] === "true") {
            return {
                mode: "mock",
                client: { isUserInitiallyLoggedIn: true }
            };
        }`,
  },
  {
    mode: "real",
    code: `        return {
            mode: "real",
            issuerUri: "https://auth.mycompany.com/realms/myrealm",
            client: { clientId: "myclient" },
            server: {
                accessTokenValidationMethod: "offline JWT validation",
                expectedAccessTokenAudience: "myclient-api"
            }
        };`,
  },
  {
    mode: "none",
    code: `    })
    .createUtils();`,
  },
];

const code = chunks.map((chunk) => chunk.code).join("\n");

/** Mode each line of `code` belongs to. */
const lineModes = chunks.flatMap((chunk) => chunk.code.split("\n").map(() => chunk.mode));

export function Testability() {
  const [mode, setMode] = useState<Mode>("mock");

  return (
    <section className={sectionClassName}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <SectionHeading align="start" eyebrow="Testing" title="Built with testability in mind.">
            <p>
              Develop and test your app without connecting to a live authentication server. Mock
              mode gives you realistic users and control over the initial login state, on both the
              frontend and backend.
            </p>
            <p>
              Use it for automated tests, local development, demos, or a deliberately configured
              mode that does not require real authentication.
            </p>
          </SectionHeading>
          <ExternalLink
            href={docs("/integration-guides/backend-token-validation/mock-modes")}
            className="self-start"
          >
            Learn more about mock modes
          </ExternalLink>
        </Reveal>

        <Reveal className="min-w-0">
          <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
            <div className="flex h-11 items-center justify-between gap-3 border-b bg-muted/40 ps-2 pe-1.5">
              <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
                <TabsList variant="line" aria-label="Authentication mode">
                  <TabsTrigger value="real" className="px-2">
                    Real
                  </TabsTrigger>
                  <TabsTrigger value="mock" className="px-2">
                    Mock
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">src/oidc.ts</span>
                <CopyButton text={code} />
              </span>
            </div>
            <CodeLines code={code} isLineDimmed={(index) => lineModes[index] !== mode} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
