import { Popover } from "@base-ui/react/popover";
import phaseTwoSvgUrl from "#assets/img/phasetwo.svg";
import gouvSvgUrl from "#assets/img/users/gouv.svg";
import inseeSvgUrl from "#assets/img/users/insee.svg";
import onyxiaSvgUrl from "#assets/img/users/onyxia.svg";
import { Eyebrow } from "#components/eyebrow";
import { ExternalLink } from "#components/external-link";

type User = {
  name: string;
  logo: React.ReactNode;
  /** The logo already spells the name. */
  hasWordmark: boolean;
  description: React.ReactNode;
  links: { label: string; href: string }[];
};

// Logos are rendered in the text color so the strip reads as one row in both themes.
const monochromeClassName = "w-auto brightness-0 dark:invert";

const users: User[] = [
  {
    name: "gouv.fr",
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
    description: "Several projects in the French government's digital ecosystem use oidc-spa.",
    links: [
      { label: "Messages, La Suite numérique", href: "https://github.com/suitenumerique/messages" },
      {
        label: "cartes.gouv.fr",
        href: "https://github.com/IGNF/cartes.gouv.fr-guichet-collaboratif",
      },
    ],
  },
  {
    name: "Insee",
    logo: (
      <img
        src={inseeSvgUrl}
        alt=""
        width={100}
        height={24}
        loading="lazy"
        className={`h-6 ${monochromeClassName}`}
      />
    ),
    hasWordmark: true,
    description:
      "The French National Institute of Statistics and Economic Studies runs more than 100 web applications, and over 30% already use oidc-spa. An internal circular asks teams to migrate the remaining keycloak-js applications to oidc-spa, and to use it for new projects.",
    links: [{ label: "insee.fr", href: "https://www.insee.fr/" }],
  },
  {
    name: "Onyxia",
    logo: (
      <img
        src={onyxiaSvgUrl}
        alt=""
        width={42}
        height={28}
        loading="lazy"
        className={`h-7 ${monochromeClassName}`}
      />
    ),
    hasWordmark: false,
    description:
      "An open-source project funded by the European Union for creating data science platforms. oidc-spa was created because Onyxia needed a strong OIDC client that wouldn't lock it to one IAM platform. It is deployed at scale by Statistics Norway, the United Nations, the European Parliament and France's Ministry of Economy and Finance.",
    links: [{ label: "onyxia.sh", href: "https://www.onyxia.sh/" }],
  },
  {
    name: "Phase Two",
    logo: (
      <img
        src={phaseTwoSvgUrl}
        alt=""
        width={130}
        height={33}
        loading="lazy"
        className={`h-7 ${monochromeClassName}`}
      />
    ),
    hasWordmark: true,
    description:
      "A long-term backer of the project and a Keycloak as a Service company. They build their solutions with oidc-spa and made it the default for their customers' applications.",
    links: [{ label: "phasetwo.io", href: "https://phasetwo.io/?utm_source=oidc-spa" }],
  },
];

export function TrustedBy() {
  return (
    <section className="wrapper border-t md:tick-left md:tick-right">
      <div className="px-5 pt-8 pb-5 text-center sm:px-10">
        <Eyebrow>Trusted in production by</Eyebrow>
      </div>
      {/* The gaps show the background through, drawing the dividers in any layout. */}
      <ul className="grid grid-cols-2 gap-px border-t bg-border sm:grid-cols-4">
        {users.map((user) => (
          <li key={user.name} className="bg-background">
            <UserItem user={user} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A logo that tells how the organization uses oidc-spa, on hover or on tap. */
function UserItem(props: { user: User }) {
  const { name, logo, hasWordmark, description, links } = props.user;

  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover
        delay={150}
        className="flex size-full cursor-default items-center justify-center gap-2.5 px-4 py-6 text-lg font-medium tracking-tight text-foreground opacity-70 transition-[opacity,background-color] duration-200 ease-out outline-none hover:bg-muted/40 hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset data-popup-open:bg-muted/40 data-popup-open:opacity-100"
      >
        {logo}
        {hasWordmark ? <span className="sr-only">{name}</span> : name}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" sideOffset={8} collisionPadding={16} className="z-50">
          <Popover.Popup className="flex w-80 max-w-[calc(100vw-2rem)] origin-(--transform-origin) flex-col gap-3 rounded-xl border bg-popover p-4 text-sm text-popover-foreground shadow-lg transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Popover.Title className="font-medium">{name}</Popover.Title>
            <Popover.Description className="text-pretty text-muted-foreground">
              {description}
            </Popover.Description>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <ExternalLink href={href}>{label}</ExternalLink>
                </li>
              ))}
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
