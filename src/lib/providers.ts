import { docs } from "#constants";

/** IAM platforms confirmed to work with oidc-spa, each with a setup guide in the docs. */
export const PROVIDERS = ["Keycloak", "Auth0", "Microsoft Entra ID"] as const;

export type Provider = (typeof PROVIDERS)[number];

const GUIDE_SLUGS: Record<Provider, string> = {
  Keycloak: "keycloak",
  Auth0: "auth0",
  "Microsoft Entra ID": "microsoft-entra-id",
};

/** `"Other"`: any spec-compliant provider supporting public clients, see its guide for the requirements. */
export function getProviderGuideUrl(provider: Provider | "Other"): string {
  return docs(`/providers-configuration/${provider === "Other" ? "other" : GUIDE_SLUGS[provider]}`);
}
