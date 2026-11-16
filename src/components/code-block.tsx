import { CopyButton } from "#components/copy-button";
import { cn } from "#lib/utils";
import { highlight } from "sugar-high";

/**
 * Syntax highlighted code, rendered at build time by the prerender.
 * `isLineDimmed` fades the lines that are not the point of the example.
 */
export function CodeBlock(props: {
  code: string;
  fileName?: string;
  isLineDimmed?: (lineIndex: number) => boolean;
  /** Tints lines starting with "-" or "+" like a diff. */
  isDiff?: boolean;
  className?: string;
}) {
  const { code, fileName, isLineDimmed, isDiff = false, className } = props;

  return (
    <div
      className={cn("overflow-hidden rounded-xl border bg-card text-card-foreground", className)}
    >
      <div className="flex h-10 items-center justify-between gap-3 border-b bg-muted/40 ps-4 pe-1.5">
        <span className="truncate font-mono text-xs text-muted-foreground">{fileName ?? ""}</span>
        <CopyButton text={isDiff ? getDiffResult(code) : code} />
      </div>
      <CodeLines code={code} isLineDimmed={isLineDimmed} isDiff={isDiff} />
    </div>
  );
}

/** The highlighted lines alone, for cards that bring their own header. */
export function CodeLines(props: {
  code: string;
  isLineDimmed?: (lineIndex: number) => boolean;
  isDiff?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { code, isLineDimmed, isDiff = false, className, style } = props;

  const sourceLines = code.split("\n");
  const htmlLines = highlight(code).split("\n");

  return (
    <pre
      className={cn("overflow-x-auto py-4 font-mono text-[0.8125rem] leading-6", className)}
      style={style}
    >
      <code className="block min-w-max">
        {htmlLines.map((html, index) => {
          const sourceLine = sourceLines[index] ?? "";
          const diffKind = !isDiff
            ? undefined
            : sourceLine.startsWith("-")
              ? "removed"
              : sourceLine.startsWith("+")
                ? "added"
                : undefined;

          return (
            <span
              key={index}
              className={cn(
                "block min-h-lh px-4 transition-opacity duration-300 ease-out",
                isLineDimmed?.(index) && "opacity-30",
                diffKind === "removed" && "bg-destructive/10",
                diffKind === "added" && "bg-emerald-500/10",
              )}
              // The code is a static string from this repository.
              // oxlint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        })}
      </code>
    </pre>
  );
}

/** The code once the diff is applied: removed lines dropped, "+" markers stripped. */
function getDiffResult(diff: string): string {
  return diff
    .split("\n")
    .filter((line) => !line.startsWith("-"))
    .map((line) => (line.startsWith("+") ? line.slice(1) : line))
    .join("\n");
}
