import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Check, Bookmark, Award, RouteIcon } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { artworks, allStamps, getRoute } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/map")({
  component: MyMap,
});

function MyMap() {
  const { visited, saved, stamps, activeRoute } = useJourney();
  const route = activeRoute ? getRoute(activeRoute.routeId) : null;
  const collected = allStamps.filter((s) => stamps.includes(s.id));

  return (
    <MobileShell>
      <AppHeader title="My Map" subtitle="Your journey" back />
      <div className="space-y-6 px-4 py-5">
        {/* map */}
        <div className="relative h-64 overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, oklch(0.93 0.03 150), oklch(0.9 0.04 90) 55%, oklch(0.9 0.05 60))" }} />
          <div className="absolute -left-6 top-1/3 h-20 w-[130%] -rotate-6 rounded-full bg-teal/30" />
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-background/60" />
          <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-background/60" />
          {artworks.map((a) => {
            const isV = visited.includes(a.id);
            const isS = saved.includes(a.id);
            if (!isV && !isS) return null;
            return (
              <span
                key={a.id}
                style={{ left: `${a.pin.x}%`, top: `${a.pin.y}%` }}
                className={cn(
                  "absolute grid h-8 w-8 -translate-x-1/2 -translate-y-full place-items-center rounded-full border-2 border-white text-white shadow-lg",
                  isV ? "bg-teal" : "bg-primary",
                )}
              >
                {isV ? <Check className="h-4 w-4" /> : <Bookmark className="h-3.5 w-3.5" />}
              </span>
            );
          })}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-navy backdrop-blur"><span className="h-2.5 w-2.5 rounded-full bg-teal" /> Visited</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Saved</span>
          </div>
        </div>

        {/* routes */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-border bg-card p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><RouteIcon className="h-3.5 w-3.5" /> In progress</p>
            {route ? (
              <Link to="/route-progress" className="mt-1 block font-display text-sm font-semibold text-primary">{route.name}</Link>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">None active</p>
            )}
          </div>
          <div className="rounded-3xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completed routes</p>
            <p className="mt-1 font-display text-2xl font-semibold">1</p>
          </div>
        </section>

        {/* quick nav */}
        <section className="grid grid-cols-2 gap-3">
          <Link to="/account/visited" className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="font-display text-2xl font-semibold">{visited.length}</p>
            <p className="text-xs text-muted-foreground">Visited artworks</p>
          </Link>
          <Link to="/account/saved" className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="font-display text-2xl font-semibold">{saved.length}</p>
            <p className="text-xs text-muted-foreground">Saved artworks</p>
          </Link>
        </section>

        {/* stamps */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold"><Award className="h-4 w-4 text-primary" /> Digital stamps</h2>
            <Link to="/account/stamps" className="text-sm font-semibold text-primary">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {collected.map((s) => (
              <div key={s.id} className="flex w-16 shrink-0 flex-col items-center gap-1 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-card text-2xl shadow-sm ring-2 ring-primary/30">{s.emoji}</span>
                <span className="text-[10px] font-semibold leading-tight text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
