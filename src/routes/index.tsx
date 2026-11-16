import { createFileRoute } from "@tanstack/react-router";
import { EasySetup } from "#components/sections/easy-setup";
import { GettingStarted } from "#components/sections/getting-started";
import { Hero } from "#components/sections/hero";
import { HowItWorks } from "#components/sections/how-it-works";
import { KeycloakSection } from "#components/sections/keycloak";
import { MultipleApis } from "#components/sections/multiple-apis";
import { Security } from "#components/sections/security";
import { Session } from "#components/sections/session";
import { Sponsors } from "#components/sections/sponsors";
import { Testability } from "#components/sections/testability";
import { TrustedBy } from "#components/sections/trusted-by";
import { UserObject } from "#components/sections/user-object";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <TrustedBy />
      <GettingStarted />
      <Security />
      <Session />
      <EasySetup />
      <UserObject />
      <Testability />
      <MultipleApis />
      <KeycloakSection />
      <Sponsors />
    </>
  );
}
