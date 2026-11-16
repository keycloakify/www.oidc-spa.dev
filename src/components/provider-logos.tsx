import type { Provider } from "#lib/providers";
import { cn } from "#lib/utils";

// Paths from Simple Icons (CC0), https://simpleicons.org. Microsoft's is its four squares.
const PATHS: Record<Exclude<Provider, "Microsoft Entra ID">, { path: string; color: string }> = {
  Keycloak: {
    color: "#00b8e3",
    path: "m18.742 1.182-12.493.002C4.155 4.784 2.079 8.393 0 12.002c2.071 3.612 4.162 7.214 6.252 10.816l12.49-.004 3.089-5.404h2.158v-.002H24L23.996 6.59h-2.168zM8.327 4.792h2.081l1.04 1.8-3.12 5.413 3.117 5.403-1.035 1.81H8.327a2047.566 2047.566 0 0 0-4.168-7.204C5.547 9.606 6.937 7.2 8.327 4.792Zm6.241 0 2.086.003c1.393 2.405 2.78 4.813 4.166 7.222l-4.167 7.2h-2.08c-.382-.562-1.038-1.808-1.038-1.808l3.123-5.405-3.124-5.413z",
  },
  Auth0: {
    color: "#eb5424",
    path: "M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58 2.343 7.45-6.157-4.597-6.158 4.58 2.358-7.433-6.188-4.55 7.63-.045L12.008 0l2.356 7.404 7.615.044z",
  },
  Clerk: {
    color: "#6c47ff",
    path: "m21.47 20.829-2.881-2.881a.572.572 0 0 0-.7-.084 6.854 6.854 0 0 1-7.081 0 .576.576 0 0 0-.7.084l-2.881 2.881a.576.576 0 0 0-.103.69.57.57 0 0 0 .166.186 12 12 0 0 0 14.113 0 .58.58 0 0 0 .239-.423.576.576 0 0 0-.172-.453Zm.002-17.668-2.88 2.88a.569.569 0 0 1-.701.084A6.857 6.857 0 0 0 8.724 8.08a6.862 6.862 0 0 0-1.222 3.692 6.86 6.86 0 0 0 .978 3.764.573.573 0 0 1-.083.699l-2.881 2.88a.567.567 0 0 1-.864-.063A11.993 11.993 0 0 1 6.771 2.7a11.99 11.99 0 0 1 14.637-.405.566.566 0 0 1 .232.418.57.57 0 0 1-.168.448Zm-7.118 12.261a3.427 3.427 0 1 0 0-6.854 3.427 3.427 0 0 0 0 6.854Z",
  },
  Google: {
    color: "#4285f4",
    path: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z",
  },
};

const MICROSOFT_SQUARES = [
  { x: 1, y: 1, color: "#f25022" },
  { x: 12.5, y: 1, color: "#7fba00" },
  { x: 1, y: 12.5, color: "#00a4ef" },
  { x: 12.5, y: 12.5, color: "#ffb900" },
];

/** The provider's mark, in its brand colors. */
export function ProviderLogo(props: { provider: Provider; className?: string }) {
  const { provider, className } = props;

  if (provider === "Microsoft Entra ID") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
        {MICROSOFT_SQUARES.map(({ x, y, color }) => (
          <rect key={color} x={x} y={y} width={10.5} height={10.5} fill={color} />
        ))}
      </svg>
    );
  }

  const { path, color } = PATHS[provider];

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={color}
      className={cn("size-4 shrink-0", className)}
    >
      <path d={path} />
    </svg>
  );
}
