import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Navigation, X, Headphones, Sparkles, Bookmark, MapPin, ArrowRight } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { Chip, Tag } from "@/components/primitives";
import { artworks, type Artwork } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  component: MapScreen,
});

type Filter = "near" | "campus" | "temple" | "audio" | "ar" | "saved" | "visited";

const filters: { id: Filter; label: string }[] = [
  { id: "near", label: "Near me" },
  { id: "campus", label: "Campus" },
  { id: "temple", label: "Temple Quarter" },
  { id: "audio", label: "Audio available" },
  { id: "ar", label: "AR available" },
  { id: "saved", label: "Saved" },
  { id: "visited", label: "Visited" },
];

function MapScreen() {
  const { isSaved, isVisited, toggleSaved } = useJourney();
  const navigate = useNavigate();
  const [active, setActive] = useState<Filter>("near");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Artwork | null>(null);

  const visible = artworks.filter((a) => {
    if (query && !a.title.toLowerCase().includes(query.toLowerCase())) return false;
    switch (active) {
      case "campus": return a.area === "campus";
      case "temple": return a.area === "temple";
      case "audio": return a.hasAudio;
      case "ar": return a.hasAR;
      case "saved": return isSaved(a.id);
      case "visited": return isVisited(a.id);
      default: return true;
    }
  });

  return (
    <MobileShell className="relative">
      <AppHeader title="Explore the map" subtitle="Guide" />

      {/* Search */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-sm">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks, places…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {filters.map((f) => (
          <Chip key={f.id} active={active === f.id} onClick={() => setActive(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {/* Map surface */}
      <div className="relative mx-4 mb-4 flex-1 overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, oklch(0.93 0.03 150), oklch(0.9 0.04 90) 55%, oklch(0.9 0.05 60))" }} />
        {/* faux river */}
        <div className="absolute -left-6 top-1/3 h-24 w-[130%] -rotate-6 rounded-full bg-teal/30" />
        {/* faux parks */}
        <div className="absolute left-6 top-8 h-24 w-28 rounded-[40%] bg-teal/25" />
        <div className="absolute bottom-10 right-8 h-20 w-24 rounded-[45%] bg-teal/20" />
        {/* faux roads */}
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-background/60" />
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-background/60" />
        <div className="absolute left-1/4 top-0 h-full w-0.5 bg-background/40" />

        {/* current location */}
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
          <span className="block h-4 w-4 rounded-full bg-secondary ring-4 ring-secondary/25" />
          <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-secondary/30" />
        </div>

        {/* pins */}
        {visible.map((a) => {
          const isSel = selected?.id === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              style={{ left: `${a.pin.x}%`, top: `${a.pin.y}%` }}
              className="animate-pin-drop absolute -translate-x-1/2 -translate-y-full"
              aria-label={a.title}
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border-2 border-white text-white shadow-lg transition-transform",
                  isSel ? "scale-125 bg-primary" : "bg-secondary",
                )}
              >
                <MapPin className="h-4 w-4 fill-white/20" />
              </span>
              <span className="mx-auto -mt-1 block h-2 w-2 rotate-45 border-b-2 border-r-2 border-white bg-inherit" />
            </button>
          );
        })}

        {/* recenter */}
        <button className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-secondary shadow-md" aria-label="Recenter">
          <Navigation className="h-5 w-5" />
        </button>

        {!visible.length && (
          <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-2xl bg-card/90 p-4 text-center text-sm text-muted-foreground">
            No artworks match this filter yet.
          </p>
        )}
      </div>

      {/* Preview card */}
      {selected && (
        <div className="animate-soft-in absolute inset-x-0 bottom-0 z-30 rounded-t-3xl border-t border-border bg-card p-4 shadow-[var(--shadow-float)]">
          <button
            onClick={() => setSelected(null)}
            aria-label="Close preview"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3">
            <img src={selected.image} alt={selected.title} width={800} height={600} className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1 pr-6">
              <h3 className="font-display text-lg font-semibold">{selected.title}</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {selected.location}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{selected.hook}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selected.hasAudio && <Tag label="Audio" />}
            {selected.hasAR && <Tag label="AR" />}
            {selected.tags.filter((t) => t === "Student favourite" || t === "Hidden story").map((t) => <Tag key={t} label={t} />)}
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
            <Link
              to="/artwork/$id"
              params={{ id: selected.id }}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              View Room <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => navigate({ to: "/artwork/$id/directions", params: { id: selected.id } })}
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-3 py-2.5 text-sm font-semibold"
              aria-label="Directions"
            >
              <Navigation className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleSaved(selected.id)}
              aria-label="Save"
              className={cn(
                "inline-flex items-center justify-center rounded-2xl border px-3 py-2.5 text-sm font-semibold",
                isSaved(selected.id) ? "border-primary bg-primary/12 text-primary" : "border-border bg-card",
              )}
            >
              <Bookmark className={cn("h-4 w-4", isSaved(selected.id) && "fill-current")} />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            {selected.hasAudio && <span className="inline-flex items-center gap-1"><Headphones className="h-3.5 w-3.5" /> Audio</span>}
            {selected.hasAR && <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> AR</span>}
          </div>
        </div>
      )}
    </MobileShell>
  );
}
