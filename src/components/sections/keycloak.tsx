import { CodeBlock } from "#components/code-block";
import { ExternalLink } from "#components/external-link";
import { Reveal } from "#components/reveal";
import { SectionHeading } from "#components/section-heading";
import { docs } from "#constants";
import { sectionClassName } from "#lib/section";

const POLYFILL_DIFF = `-import Keycloak from "keycloak-js";
+import { Keycloak } from "oidc-spa/keycloak-js";`;

const KEYCLOAK_UTILS = `import { createKeycloakUtils } from "oidc-spa/keycloak";
import { getOidc } from "./oidc";

const oidc = await getOidc({ assert: "user logged in" });
const keycloakUtils = createKeycloakUtils({ issuerUri: oidc.issuerUri });

const userProfile = await keycloakUtils.fetchUserProfile({
    accessToken: await oidc.getAccessToken()
});

const accountConsoleUrl = keycloakUtils.getAccountUrl({
    clientId: oidc.clientId,
    validRedirectUri: oidc.validRedirectUri,
    locale: "fr"
});`;

export function KeycloakSection() {
  return (
    <section className={sectionClassName}>
      <Reveal>
        <SectionHeading eyebrow="Keycloak" title="Built with Keycloak users in mind.">
          <p>
            Already using <code className="font-mono text-foreground">keycloak-js</code>? Bring
            oidc-spa&apos;s session handling and security features into your application without{" "}
            <strong className="font-medium text-foreground">any</strong> migration work. We provide
            a polyfill for it.
          </p>
        </SectionHeading>
      </Reveal>

      <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-10 sm:mt-16">
        <Reveal className="flex flex-col gap-3">
          <CodeBlock code={POLYFILL_DIFF} fileName="src/keycloak.ts" isDiff />
          <ExternalLink
            href={docs("/resources/migrating-from-keycloak-js")}
            className="self-start text-sm"
          >
            Migrating from keycloak-js
          </ExternalLink>
        </Reveal>

        <Reveal className="flex flex-col gap-4">
          <p className="text-pretty text-muted-foreground">
            And when you are ready to actually migrate, oidc-spa exposes Keycloak-specific
            utilities, available independently. Fetch user profiles, open the account console, or
            direct users to registration with a small set of dedicated helpers.
          </p>
          <CodeBlock code={KEYCLOAK_UTILS} fileName="src/account.ts" />
          <ExternalLink href={docs("/features/keycloak-utils")} className="self-start text-sm">
            Learn more about the Keycloak utilities
          </ExternalLink>
        </Reveal>
      </div>
    </section>
  );
}
