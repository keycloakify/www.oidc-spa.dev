import phaseTwoSvgUrl from "#assets/img/phasetwo.svg";
import gouvSvgUrl from "#assets/img/users/gouv.svg";
import onyxiaSvgUrl from "#assets/img/users/onyxia.svg";
import { Eyebrow } from "#components/eyebrow";

// Logos are rendered in the text color so the strip reads as one row in both themes.
const users: { name: string; href: string; logo: React.ReactNode; hasWordmark: boolean }[] = [
  {
    name: "gouv.fr",
    href: "https://camino.developpement-durable.gouv.fr",
    logo: (
      <img
        src={gouvSvgUrl}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        className="size-7 rounded-sm"
      />
    ),
    hasWordmark: false,
  },
  {
    name: "Insee",
    href: "https://datalab.sspcloud.fr/",
    logo: (
      <img
        src={onyxiaSvgUrl}
        alt=""
        width={42}
        height={28}
        loading="lazy"
        className="h-7 w-auto brightness-0 dark:invert"
      />
    ),
    hasWordmark: false,
  },
  {
    name: "Phase Two",
    href: "https://phasetwo.io/?utm_source=oidc-spa",
    logo: (
      <img
        src={phaseTwoSvgUrl}
        alt=""
        width={130}
        height={33}
        loading="lazy"
        className="h-7 w-auto brightness-0 dark:invert"
      />
    ),
    hasWordmark: true,
  },
];

export function TrustedBy() {
  return (
    <section className="wrapper border-t md:tick-left md:tick-right">
      <div className="px-5 pt-8 pb-5 text-center sm:px-10">
        <Eyebrow>Trusted in production by</Eyebrow>
      </div>
      <ul className="grid border-t sm:grid-cols-3">
        {users.map(({ name, href, logo, hasWordmark }) => (
          <li
            key={name}
            className="border-b last:border-b-0 sm:border-e sm:border-b-0 sm:last:border-e-0"
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full items-center justify-center gap-2.5 px-4 py-6 text-lg font-medium tracking-tight text-foreground opacity-70 transition-[opacity,background-color] duration-200 ease-out hover:bg-muted/40 hover:opacity-100"
            >
              {logo}
              {hasWordmark ? <span className="sr-only">{name}</span> : name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
