import { docs } from "#constants";

/** Identity providers with a dedicated setup guide in the docs. */
export const PROVIDERS = ["Keycloak", "Auth0", "Microsoft Entra ID", "Clerk", "Google"] as const;

export type Provider = (typeof PROVIDERS)[number];

const GUIDE_SLUGS: Record<Provider, string> = {
  Keycloak: "keycloak",
  Auth0: "auth0",
  "Microsoft Entra ID": "microsoft-entra-id",
  Clerk: "clerk",
  Google: "google-oauth",
};

export function getProviderGuideUrl(provider: Provider | "Other"): string {
  return docs(`/providers-configuration/${provider === "Other" ? "other" : GUIDE_SLUGS[provider]}`);
}
