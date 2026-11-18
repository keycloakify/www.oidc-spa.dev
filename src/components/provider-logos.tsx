import type { Provider } from "#lib/providers";
import { cn } from "#lib/utils";

// Keycloak and Auth0: Simple Icons (CC0), https://simpleicons.org.
// Microsoft Entra ID: selfh.st/icons (CC BY 4.0), https://github.com/selfhst/icons.
const LOGOS: Record<Provider, { viewBox: string; paths: { d: string; fill: string }[] }> = {
  Keycloak: {
    viewBox: "0 0 24 24",
    paths: [
      {
        fill: "#00b8e3",
        d: "m18.742 1.182-12.493.002C4.155 4.784 2.079 8.393 0 12.002c2.071 3.612 4.162 7.214 6.252 10.816l12.49-.004 3.089-5.404h2.158v-.002H24L23.996 6.59h-2.168zM8.327 4.792h2.081l1.04 1.8-3.12 5.413 3.117 5.403-1.035 1.81H8.327a2047.566 2047.566 0 0 0-4.168-7.204C5.547 9.606 6.937 7.2 8.327 4.792Zm6.241 0 2.086.003c1.393 2.405 2.78 4.813 4.166 7.222l-4.167 7.2h-2.08c-.382-.562-1.038-1.808-1.038-1.808l3.123-5.405-3.124-5.413z",
      },
    ],
  },
  Auth0: {
    viewBox: "0 0 24 24",
    paths: [
      {
        fill: "#eb5424",
        d: "M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58 2.343 7.45-6.157-4.597-6.158 4.58 2.358-7.433-6.188-4.55 7.63-.045L12.008 0l2.356 7.404 7.615.044z",
      },
    ],
  },
  "Microsoft Entra ID": {
    viewBox: "0 0 512 512",
    paths: [
      {
        fill: "#225086",
        d: "M108.1 399.1c11 6.9 29.4 14.5 48.8 14.5c17.7 0 34.1-5.1 47.7-13.9h.1l51.3-32.1v115.9c-8.1 0-16.3-2.2-23.4-6.7c0 .1-124.5-77.7-124.5-77.7",
      },
      {
        fill: "#66ddff",
        d: "M223.4 42.9L10 283.5c-16.5 18.6-12.2 46.7 9.2 60c0 0 79 49.4 88.9 55.6c11 6.9 29.4 14.5 48.8 14.5c17.7 0 34.1-5.1 47.7-13.9h.1l51.3-32.1L131.9 290L256 150V28.4c-12 0-24.1 4.9-32.6 14.5",
      },
      { fill: "#cbf8ff", d: "m131.9 290.1l1.4.9L256 367.7V150z" },
      {
        fill: "#074793",
        d: "M492.8 343.6c21.4-13.3 25.7-41.4 9.2-60l-140-158c-11.3-5.3-24-8.3-37.3-8.3c-26.3 0-49.8 11.3-65.5 29.2l-3.1 3.5l124.1 140.1L256 367.7v115.9c8.2 0 16.3-2.2 23.4-6.7z",
      },
      {
        fill: "#0294e4",
        d: "M256 28.4V150l3.1-3.5c15.6-17.8 39.2-29.2 65.5-29.2c13.4 0 26.1 3 37.3 8.3l-73.4-82.7c-8.4-9.6-20.5-14.4-32.5-14.5",
      },
      { fill: "#96bcc2", d: "M380.2 290.1L256 150.1v217.6z" },
    ],
  },
};

/** The platform's mark, in its brand colors. */
export function ProviderLogo(props: { provider: Provider; className?: string }) {
  const { provider, className } = props;

  const { viewBox, paths } = LOGOS[provider];

  return (
    <svg viewBox={viewBox} aria-hidden="true" className={cn("size-4 shrink-0", className)}>
      {paths.map(({ d, fill }) => (
        <path key={d} d={d} fill={fill} />
      ))}
    </svg>
  );
}
