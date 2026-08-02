import { Link } from "@tanstack/react-router";
import { MapPin, Headphones, Sparkles, Bookmark, Check } from "lucide-react";
import type { Artwork } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const { isSaved, isVisited, toggleSaved } = useJourney();
  const saved = isSaved(artwork.id);
  const visited = isVisited(artwork.id);
  return (
    <Link
      to="/artwork/$id"
      params={{ id: artwork.id }}
      className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={artwork.image}
          alt={artwork.title}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {artwork.hasAudio && (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-teal/90 text-navy backdrop-blur">
              <Headphones className="h-4 w-4" />
            </span>
          )}
          {artwork.hasAR && (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary/90 text-secondary-foreground backdrop-blur">
              <Sparkles className="h-4 w-4" />
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save artwork"}
          onClick={(e) => {
            e.preventDefault();
            toggleSaved(artwork.id);
          }}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-colors",
            saved ? "bg-primary text-primary-foreground" : "bg-card/85 text-foreground",
          )}
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        </button>
        <h3 className="absolute bottom-2.5 left-3 right-3 font-display text-lg font-semibold text-white drop-shadow">
          {artwork.title}
        </h3>
      </div>
      <div className="space-y-2 p-3.5">
        <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {artwork.location}
        </p>
        <p className="text-sm text-foreground/80">{artwork.hook}</p>
        {visited && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal/25 px-2.5 py-1 text-xs font-semibold text-navy">
            <Check className="h-3.5 w-3.5" /> Visited
          </span>
        )}
      </div>
    </Link>
  );
}
