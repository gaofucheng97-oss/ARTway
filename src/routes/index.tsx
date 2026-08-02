import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Navigation,
  X,
  QrCode,
  Zap,
  Sparkles,
  Mountain,
  ChevronRight,
  Route as RouteIcon,
  Bookmark,
} from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { City3DMap } from "@/components/city-map/City3DMap";
import { mapPoints, type MapPoint } from "@/data/map-points";
import { artworks, curatedRoutes, getArtwork, getRoute, type CuratedRoute } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";



export const Route = createFileRoute("/")({
  component: Home,
});




const routeTypeMeta: Record<CuratedRoute["type"], { label: string; icon: typeof Zap; desc: string }> = {
  quick: { label: "Quick Route", icon: Zap, desc: "A short intro between classes." },
  recommend: { label: "Recommended", icon: Sparkles, desc: "Personalised to your time & mood." },
  deep: { label: "Deep Route", icon: Mountain, desc: "The full story of a neighbourhood." },
};

// Pick one of each type for the Start Tour panel
const tourRoutes: CuratedRoute[] = [
  curatedRoutes.find((r) => r.type === "quick")!,
  { ...curatedRoutes.find((r) => r.type === "deep")!, type: "recommend" as const, id: "hidden-makers-trail", name: "Hidden Makers Trail" },
  curatedRoutes.find((r) => r.id === "temple-quarter-stories")!,
].filter(Boolean);

function Home() {
  const { startRoute, visited, activeRoute, isSaved, toggleSaved } = useJourney();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [highlightProgress, setHighlightProgress] = useState(false);

  const preview = selected;
  const saved = preview?.artworkId ? isSaved(preview.artworkId) : false;
  const nextArtwork = artworks.find((a) => !visited.includes(a.id)) ?? artworks[0];

  const active = activeRoute ? getRoute(activeRoute.routeId) : undefined;
  const activeStops = active?.artworkIds ?? [];
  const activeDone = activeRoute
    ? activeStops.filter((id) => activeRoute.completed.includes(id)).length
    : 0;
  const activePct = activeStops.length ? Math.round((activeDone / activeStops.length) * 100) : 0;

  const beginTour = (r: CuratedRoute) => {
    startRoute(r.id);
    navigate({ to: "/route-progress" });
  };

  return (
    <MobileShell className="relative">
      <AppHeader
        title="Bristol Guide"
        right={
          <button
            aria-label="Scan a QR code"
            onClick={() => navigate({ to: "/artwork/$id/scan", params: { id: nextArtwork.id } })}
            className="grid h-8 w-8 place-items-center"
          >
            <QrCode className="h-5 w-5" strokeWidth={1.6} />
          </button>
        }
      />

      {/* Map surface — stylised isometric 3D city */}
      <div className="relative flex-1 overflow-hidden bg-white">
        <City3DMap
          points={mapPoints}
          activeId={hovered ?? selected?.id ?? null}
          onHover={setHovered}
          onSelect={setSelected}
          resetKey={resetKey}
        />



        {/* Active route progress module — only when a route is in progress */}
        {active && (
          <div
            className={cn(
              "absolute top-4 left-4 z-10 w-[240px] rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-float)] transition-all duration-300",
              highlightProgress && "ring-2 ring-foreground bg-muted/80"
            )}
            aria-live="polite"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Your current route
            </p>
            <h2 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {active.name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div
                className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label={`${activeDone} of ${activeStops.length} stops completed`}
                aria-valuenow={activeDone}
                aria-valuemax={activeStops.length}
              >
                <div
                  className="h-full rounded-full bg-[var(--map-accent)] transition-[width] duration-700 ease-out"
                  style={{ width: `${activePct}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold tabular-nums text-foreground">
                {activePct}%
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {activeDone} / {activeStops.length} stops completed
              </span>
              <button
                onClick={() => {
                  setHighlightProgress(true);
                  setTimeout(() => navigate({ to: "/route-progress" }), 420);
                }}
                className="inline-flex items-center gap-0.5 whitespace-nowrap text-xs font-medium text-foreground underline underline-offset-2"
              >
                Continue exploring <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* recenter buttons */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          <button onClick={() => setResetKey((k) => k + 1)} aria-label="Locate" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              <path d="M12 2 v3 M12 19 v3 M2 12 h3 M19 12 h3" />
            </svg>
          </button>
          <button onClick={() => setResetKey((k) => k + 1)} aria-label="Compass" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card">
            <Navigation className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>

      </div>


      {/* Primary CTA — bottom centre of the map */}
      {!selected && !tourOpen && (
        <div className="animate-soft-in absolute inset-x-0 bottom-20 z-30 flex justify-center px-6">
          <button
            onClick={() => setTourOpen(true)}
            className="inline-flex w-full max-w-[300px] items-center justify-center gap-2 rounded-full bg-[var(--map-accent)] px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-float)] transition-transform active:scale-[0.98]"
          >
            <RouteIcon className="h-5 w-5" strokeWidth={1.8} /> Start a tour
          </button>
        </div>
      )}


      {/* Bottom sheet — route list */}
      {!selected && tourOpen && (
        <div className="animate-soft-in absolute inset-x-0 bottom-16 z-30 px-4 pb-3">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-float)]">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Choose a route</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Pick a curated route to begin</p>
              </div>
              <button
                onClick={() => setTourOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {tourRoutes.map((r) => {
                const meta = routeTypeMeta[r.type];
                const Icon = meta.icon;
                const stops = r.artworkIds
                  .map((id) => getArtwork(id)?.title)
                  .filter(Boolean)
                  .slice(0, 3)
                  .join(" · ");
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => beginTour(r)}
                      className="flex w-full items-center gap-3 px-3 py-3 text-left"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border">
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold">{meta.label}</span>
                          <span className="text-[11px] text-muted-foreground">· {r.duration} · {r.artworkCount} stops</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{stops}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <Link
              to="/routes"
              className="mt-3 block text-center text-xs text-muted-foreground underline underline-offset-2"
            >
              Browse all routes
            </Link>
          </div>
        </div>
      )}


      {/* Bottom sheet — tapped artwork preview */}
      {preview && (
        <div className="animate-soft-in absolute inset-x-0 bottom-16 z-30 px-4 pb-3">
          <div className="relative rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-float)]">
            {/* Header row: title/location + action buttons */}
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold leading-tight">{preview.title}</h2>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{preview.location}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {preview.artworkId && (
                  <button
                    type="button"
                    aria-label={saved ? "Remove from saved" : "Save artwork"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSaved(preview.artworkId!);
                    }}
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors",
                      saved ? "bg-[var(--map-accent)] text-white" : "bg-muted text-foreground",
                    )}
                  >
                    <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelected(null);
                    setHovered(null);
                  }}
                  aria-label="Close"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail + description */}
            <div className="mt-2 flex gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                {preview.thumb ? (
                  <img
                    src={preview.thumb}
                    alt={preview.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <p className="min-w-0 flex-1 text-xs leading-snug text-foreground/80">
                {preview.description}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {preview.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[var(--map-accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--map-accent-ink)]"
                >
                  {t}
                </span>
              ))}
            </div>
            {preview.artworkId ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/artwork/$id"
                  params={{ id: preview.artworkId }}
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--map-accent)] py-2.5 text-sm font-semibold text-white"
                >
                  View Room
                </Link>
                <Link
                  to="/artwork/$id/directions"
                  params={{ id: preview.artworkId }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card py-2.5 text-sm font-semibold"
                >
                  <Navigation className="h-4 w-4" strokeWidth={1.8} /> Directions
                </Link>
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-border py-2.5 text-center text-xs text-muted-foreground">
                Digital room coming soon
              </p>
            )}
          </div>
        </div>
      )}
    </MobileShell>
  );
}
