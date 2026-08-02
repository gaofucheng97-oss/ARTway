import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, X } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { allStamps, type Stamp } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/stamps")({
  component: Stamps,
});

function Stamps() {
  const { stamps } = useJourney();
  const [active, setActive] = useState<Stamp | null>(null);
  const collectedCount = allStamps.filter((s) => stamps.includes(s.id)).length;
  const activeGot = active ? stamps.includes(active.id) : false;

  return (
    <MobileShell>
      <AppHeader title="Digital stamps" subtitle="Account" back />
      <div className="px-4 py-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Collection</p>
          <p className="font-display text-3xl font-semibold">{collectedCount} / {allStamps.length}</p>
          <p className="text-sm text-muted-foreground">Tap a locked stamp to see how to unlock it.</p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4">
          {allStamps.map((s) => {
            const got = stamps.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => setActive(s)}
                aria-label={got ? `${s.name} — collected` : `${s.name} — locked. ${s.unlock}`}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span
                  className={cn(
                    "grid h-20 w-20 place-items-center rounded-full text-3xl transition-transform active:scale-95",
                    got
                      ? "bg-card shadow-[var(--shadow-card)] ring-2 ring-foreground/20"
                      : "border border-dashed border-border bg-muted text-muted-foreground",
                  )}
                >
                  {got ? s.emoji : <Lock className="h-6 w-6" strokeWidth={1.6} />}
                </span>
                <span className={cn("text-[11px] font-semibold leading-tight", got ? "text-foreground" : "text-muted-foreground")}>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* unlock bottom sheet */}
      {active && (
        <>
          <button
            aria-label="Close"
            onClick={() => setActive(null)}
            className="absolute inset-0 z-40 bg-foreground/20"
          />
          <div className="animate-soft-in absolute inset-x-0 bottom-16 z-50 px-4 pb-3">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-float)]">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-7 top-6 grid h-6 w-6 place-items-center rounded-full text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl",
                  activeGot ? "bg-muted" : "border border-dashed border-border bg-muted text-muted-foreground",
                )}>
                  {activeGot ? active.emoji : <Lock className="h-5 w-5" strokeWidth={1.6} />}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{active.name}</h3>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {activeGot ? "Collected" : "Locked"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{active.description}</p>
              {!activeGot && (
                <div className="mt-3 rounded-2xl border border-border bg-muted/50 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">How to unlock</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{active.unlock}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </MobileShell>
  );
}
