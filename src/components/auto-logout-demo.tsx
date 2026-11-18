import { Button } from "#components/ui/button";
import { cn } from "#lib/utils";
import { LogOutIcon, MousePointer2Icon } from "lucide-react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const IDLE_BEFORE_WARNING_MS = 2500;
const COUNTDOWN_SECONDS = 10;
const TABS = ["Dashboard", "Billing"];

type State = { kind: "active" } | { kind: "warning"; secondsLeft: number } | { kind: "logged out" };

/**
 * Plays the inactivity flow in a fake browser window:
 * moving the pointer over it counts as activity and dismisses the warning.
 */
export function AutoLogoutDemo(props: { className?: string }) {
  const { className } = props;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });
  // Activity sets a new "active" state, which restarts the idle timer.
  const [state, setState] = useState<State>({ kind: "active" });

  useEffect(() => {
    if (!isInView || state.kind !== "active") {
      return;
    }

    const timer = setTimeout(
      () => setState({ kind: "warning", secondsLeft: COUNTDOWN_SECONDS }),
      IDLE_BEFORE_WARNING_MS,
    );

    return () => clearTimeout(timer);
  }, [isInView, state]);

  // Moving the pointer over the window or typing counts as activity, like on a real page.
  useEffect(() => {
    const element = ref.current;

    if (element === null) {
      return;
    }

    const onActivity = () =>
      setState((current) => (current.kind === "logged out" ? current : { kind: "active" }));

    element.addEventListener("pointermove", onActivity);
    element.addEventListener("keydown", onActivity);

    return () => {
      element.removeEventListener("pointermove", onActivity);
      element.removeEventListener("keydown", onActivity);
    };
  }, []);

  useEffect(() => {
    if (!isInView || state.kind !== "warning") {
      return;
    }

    const timer = setTimeout(
      () =>
        setState(
          state.secondsLeft <= 1
            ? { kind: "logged out" }
            : { kind: "warning", secondsLeft: state.secondsLeft - 1 },
        ),
      1000,
    );

    return () => clearTimeout(timer);
  }, [isInView, state]);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      {/* Two tabs of the same app: logging out in one logs out the other. */}
      <div className="flex items-end gap-1 bg-muted/60 px-2 pt-2">
        {TABS.map((tab, index) => (
          <span
            key={tab}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-1.5 rounded-t-md px-3 py-1.5 text-xs transition-colors duration-300 sm:max-w-44",
              index === 0 ? "bg-card text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full transition-colors duration-300",
                state.kind === "logged out" ? "bg-muted-foreground/40" : "bg-emerald-500",
              )}
            />
            <span className="truncate">{state.kind === "logged out" ? "Logged out" : tab}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center border-b px-3 py-2">
        <span className="flex-1 truncate rounded-md border bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground">
          {state.kind === "logged out" ? "app.example.com/logged-out" : "app.example.com/dashboard"}
        </span>
      </div>

      <div className="relative h-72">
        {state.kind === "logged out" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-muted">
              <LogOutIcon aria-hidden="true" className="size-4" />
            </span>
            <span className="font-medium">You have been logged out</span>
            <span className="max-w-64 text-sm text-pretty text-muted-foreground">
              Your session ended after a period of inactivity, in every open tab.
            </span>
            <Button size="sm" onClick={() => setState({ kind: "active" })}>
              Sign in again
            </Button>
          </div>
        ) : (
          <>
            <div aria-hidden="true" className="flex h-full flex-col gap-3 p-5">
              <span className="h-4 w-1/3 rounded bg-muted" />
              <div className="grid grid-cols-3 gap-3">
                <span className="h-16 rounded-lg border bg-muted/40" />
                <span className="h-16 rounded-lg border bg-muted/40" />
                <span className="h-16 rounded-lg border bg-muted/40" />
              </div>
              <span className="h-3 w-full rounded bg-muted/70" />
              <span className="h-3 w-5/6 rounded bg-muted/70" />
              <span className="h-3 w-2/3 rounded bg-muted/70" />
            </div>

            <div
              aria-hidden={state.kind !== "warning"}
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm transition-opacity duration-300",
                state.kind === "warning" ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <div
                role="alert"
                className="flex max-w-72 flex-col items-center gap-2 rounded-xl border bg-popover p-5 text-center shadow-lg"
              >
                <span className="font-medium">Are you still there?</span>
                <span className="text-sm text-muted-foreground">
                  You will be logged out in{" "}
                  <span className="font-mono font-medium text-foreground tabular-nums">
                    {state.kind === "warning" ? state.secondsLeft : COUNTDOWN_SECONDS}
                  </span>{" "}
                  seconds.
                </span>
              </div>
            </div>

            {state.kind === "active" && (
              <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                <MousePointer2Icon aria-hidden="true" className="size-3" />
                Stop moving your pointer to see the warning
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
