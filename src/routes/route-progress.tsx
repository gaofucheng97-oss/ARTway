import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MapPin, PauseCircle, ArrowRight, Award, Circle } from "lucide-react";
import { toast } from "sonner";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getRoute, getArtwork, allStamps } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/route-progress")({
  component: RouteProgress,
});

function RouteProgress() {
  const navigate = useNavigate();
  const { activeRoute, clearRoute, stamps } = useJourney();

  if (!activeRoute) {
    return (
      <MobileShell>
        <AppHeader title="Route progress" subtitle="Guide" back />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-3xl">🧭</span>
          <p className="font-display text-lg font-semibold">No active route</p>
          <p className="text-sm text-muted-foreground">Pick a curated walk to begin your journey.</p>
          <Link to="/routes" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            Browse routes
          </Link>
        </div>
      </MobileShell>
    );
  }

  const route = getRoute(activeRoute.routeId)!;
  const done = activeRoute.completed;
  const artworks = route.artworkIds.map((id) => getArtwork(id)!);
  const remaining = artworks.filter((a) => !done.includes(a.id));
  const next = remaining[0] ?? artworks[artworks.length - 1];
  const lastDone = [...artworks].reverse().find((a) => done.includes(a.id));

  const pct = Math.round((done.length / artworks.length) * 100);
  const routeStamps = allStamps.filter((s) => done.includes(s.id) && stamps.includes(s.id));

  return (
    <MobileShell>
      <AppHeader title={route.name} subtitle="On your route" back />

      <div className="space-y-6 px-4 py-5">
        {/* Route map preview */}
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Route map</p>
            <p className="text-[11px] text-muted-foreground">{artworks.length} stops · {route.distance}</p>
          </div>
          <div className="relative aspect-[4/3] w-full bg-muted/40">
            {/* faux street grid */}
            <svg className="absolute inset-0 h-full w-full text-border" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M0 40 Q 60 50 140 30 T 320 40" />
              <path d="M0 120 Q 80 100 180 130 T 360 110" />
              <path d="M0 200 Q 100 190 200 210 T 400 200" />
              <path d="M60 0 L 60 300" />
              <path d="M160 0 L 180 300" />
              <path d="M260 0 L 240 300" />
            </svg>
            {/* dashed route line connecting pins in order */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={artworks.map((a) => `${a.pin.x},${a.pin.y}`).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeDasharray="1.5 1.5"
                className="text-foreground"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* numbered pins */}
            {artworks.map((a, i) => {
              const complete = done.includes(a.id);
              return (
                <span
                  key={a.id}
                  style={{ left: `${a.pin.x}%`, top: `${a.pin.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ring-2 ring-background",
                      complete ? "bg-foreground text-background" : "bg-background text-foreground border border-foreground",
                    )}
                  >
                    {complete ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                </span>
              );
            })}
          </div>
          {/* ordered stop labels */}
          <ol className="flex gap-1.5 overflow-x-auto border-t border-border px-3 py-2.5 no-scrollbar">
            {artworks.map((a, i) => {
              const complete = done.includes(a.id);
              return (
                <li key={a.id} className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2 py-1">
                  <span className={cn(
                    "grid h-4 w-4 place-items-center rounded-full text-[9px] font-bold",
                    complete ? "bg-foreground text-background" : "border border-foreground text-foreground",
                  )}>{i + 1}</span>
                  <span className="text-[11px] text-foreground whitespace-nowrap">{a.title}</span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Progress */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">You are on</p>
          <p className="font-display text-xl font-semibold">{route.name}</p>
          <div className="mt-3 flex items-end justify-between">
            <p className="text-sm font-semibold text-foreground">
              {done.length} / {artworks.length} stops completed
            </p>
            <span className="font-display text-2xl font-semibold text-primary tabular-nums">{pct}%</span>
          </div>
          <div
            className="mt-2 h-3 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label={`${done.length} of ${artworks.length} stops completed`}
            aria-valuenow={done.length}
            aria-valuemax={artworks.length}
          >
            <div className="h-full rounded-full bg-foreground transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
          </div>
          {lastDone && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5" /> Just completed: <span className="font-semibold text-foreground">{lastDone.title}</span>
            </p>
          )}
        </section>

        {/* Next artwork */}
        {next && (
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Next stop · {Math.min(done.length + 1, artworks.length)} of {artworks.length}
            </p>
            <Link
              to="/artwork/$id"
              params={{ id: next.id }}
              className="flex gap-3 overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <img src={next.image} alt={next.title} width={800} height={600} className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-semibold">{next.title}</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {next.location}</p>
                <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{next.hook}</p>
              </div>
            </Link>
            <button
              onClick={() => navigate({ to: "/artwork/$id/scan", params: { id: next.id } })}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3.5 text-sm font-bold text-background"
            >
              Continue route <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        )}


        {/* Stops list */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">All stops</p>
          <ol className="space-y-2">
            {artworks.map((a, i) => {
              const complete = done.includes(a.id);
              return (
                <li key={a.id}>
                  <Link
                    to="/artwork/$id"
                    params={{ id: a.id }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                        complete ? "bg-teal text-navy" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {complete ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className={cn("flex-1 truncate font-semibold", complete && "text-muted-foreground line-through")}>
                      {a.title}
                    </span>
                    {complete ? (
                      <span className="text-xs font-semibold text-teal-foreground">Done</span>
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Stamps */}
        <section className="rounded-3xl border border-border bg-accent/40 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Award className="h-4 w-4 text-primary" /> Stamps collected on this route</p>
          {routeStamps.length ? (
            <div className="flex flex-wrap gap-3">
              {routeStamps.map((s) => (
                <div key={s.id} className="flex w-16 flex-col items-center gap-1 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-card text-2xl shadow-sm ring-2 ring-primary/30">{s.emoji}</span>
                  <span className="text-[10px] font-semibold leading-tight text-muted-foreground">{s.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Visit an artwork to collect your first stamp.</p>
          )}
        </section>

        <button
          onClick={() => { clearRoute(); toast("Route paused and saved for later"); navigate({ to: "/routes" }); }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground"
        >
          <PauseCircle className="h-4 w-4" /> Pause & save for later
        </button>
      </div>
    </MobileShell>
  );
}
