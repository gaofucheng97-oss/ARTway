import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Eye, Layers, Puzzle, BookOpen, User2, MapPin, Headphones, PenLine, X, ArrowRight, Camera, ChevronDown } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/artwork/$id/ar")({
  component: ARStory,
});

type Point = { id: string; n: number; label: string; icon: typeof Sparkles; x: number; y: number; body: string };

function ARStory() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const artwork = getArtwork(id);
  const [open, setOpen] = useState<Point | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!artwork) {
    return (
      <MobileShell>
        <AppHeader title="On-site story" back />
        <div className="p-8 text-center text-muted-foreground">Not found.</div>
      </MobileShell>
    );
  }

  const points: Point[] = [
    { id: "p1", n: 1, label: "The spark behind it", icon: Sparkles, x: 24, y: 30, body: artwork.hook + " " + artwork.stories[0].text },
    { id: "p2", n: 2, label: "Look closer", icon: Eye, x: 72, y: 22, body: "Look closely — the smallest patterns hold names, dates, and motifs chosen by residents. Each detail is a clue to who helped make it." },
    { id: "p3", n: 3, label: "A hidden layer", icon: Layers, x: 20, y: 66, body: artwork.stories[3]?.text ?? artwork.stories[2].text },
    { id: "p4", n: 4, label: "Surprising twist", icon: Puzzle, x: 76, y: 60, body: "Something most visitors miss: " + artwork.stories[2].text },
  ];

  const details: { id: string; label: string; icon: typeof BookOpen; body: string }[] = [
    { id: "story", label: "Story", icon: BookOpen, body: artwork.description },
    { id: "artist", label: "Artist", icon: User2, body: `${artwork.artist} — ${artwork.artistBio}` },
    { id: "place", label: "Place", icon: MapPin, body: `${artwork.location}. ${artwork.nearestBuilding}.` },
  ];

  return (
    <MobileShell className="bg-background">
      <AppHeader
        title="On-site story"
        back
        right={
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold">
            <Camera className="h-3 w-3" strokeWidth={1.8} /> AR
          </span>
        }
      />

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        {/* Artwork viewport */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/50">
          <div className="relative aspect-[3/4] w-full">
            {/* grayscale wireframe camera view */}
            <img
              src={artwork.image}
              alt={artwork.title}
              className="absolute inset-0 h-full w-full object-cover opacity-90 grayscale contrast-75"
            />
            {/* subtle scanning overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/30" />
            {/* corner brackets */}
            <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-foreground" />
            <span className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-foreground" />
            <span className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-foreground" />
            <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-foreground" />

            {/* Numbered points */}
            {points.map((p) => (
              <button
                key={p.id}
                onClick={() => setOpen(p)}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                aria-label={p.label}
              >
                <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-foreground/20" />
                <span
                  className={cn(
                    "relative grid h-8 w-8 place-items-center rounded-full bg-background text-xs font-semibold text-foreground ring-2 ring-foreground transition",
                    open?.id === p.id && "bg-foreground text-background",
                  )}
                >
                  {p.n}
                </span>
              </button>
            ))}
          </div>

          {/* caption */}
          <p className="border-t border-border bg-card px-4 py-2.5 text-center text-xs text-muted-foreground">
            Tap a numbered point to reveal its story
          </p>
        </div>

        {/* Legend */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Worth noticing</h3>
          <ul className="mt-2 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {points.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => setOpen(p)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-foreground text-[11px] font-semibold">
                      {p.n}
                    </span>
                    <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                    <span className="flex-1 text-sm">{p.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* More details — collapsible */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-border">
          <button
            onClick={() => setDetailsOpen((v) => !v)}
            className="flex w-full items-center gap-2 px-4 py-3 text-left"
            aria-expanded={detailsOpen}
          >
            <span className="flex-1 text-sm font-semibold">More details</span>
            <span className="text-[11px] text-muted-foreground">Story · Artist · Place</span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", detailsOpen && "rotate-180")} />
          </button>
          {detailsOpen && (
            <div className="divide-y divide-border border-t border-border">
              {details.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.id} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                      <h4 className="text-sm font-semibold">{d.label}</h4>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground/80">{d.body}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate({ to: "/artwork/$id/audio", params: { id: artwork.id } })}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-sm font-semibold"
          >
            <Headphones className="h-4 w-4" strokeWidth={1.8} /> Audio
          </button>
          <button
            onClick={() => navigate({ to: "/artwork/$id/reflect", params: { id: artwork.id } })}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background"
          >
            Reflect <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Detail sheet */}
      {open && (
        <button
          className="absolute inset-0 z-30 flex items-end bg-foreground/25 p-4"
          onClick={() => setOpen(null)}
          aria-label="Close"
        >
          <div
            className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-foreground text-[11px] font-semibold">
                {open.n}
              </span>
              <h3 className="text-base font-semibold">{open.label}</h3>
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="ml-auto grid h-8 w-8 place-items-center rounded-full text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{open.body}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate({ to: "/artwork/$id/audio", params: { id: artwork.id } })}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-xs font-semibold"
              >
                <Headphones className="h-4 w-4" strokeWidth={1.8} /> Listen
              </button>
              <button
                onClick={() => navigate({ to: "/artwork/$id/reflect", params: { id: artwork.id } })}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-foreground py-2.5 text-xs font-semibold text-background"
              >
                <PenLine className="h-4 w-4" strokeWidth={1.8} /> Reflect
              </button>
            </div>
          </div>
        </button>
      )}
    </MobileShell>
  );
}
