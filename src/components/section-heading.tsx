import { Eyebrow } from "#components/eyebrow";
import { cn } from "#lib/utils";

/** Eyebrow, title and lead paragraph shared by every section. */
export function SectionHeading(props: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  const { eyebrow, title, children, align = "center", className } = props;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-medium tracking-tight text-balance sm:text-5xl">{title}</h2>
      {children !== undefined && (
        <div className="flex max-w-2xl flex-col gap-3 text-pretty text-muted-foreground sm:text-lg">
          {children}
        </div>
      )}
    </div>
  );
}
