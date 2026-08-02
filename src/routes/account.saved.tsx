import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Navigation, Bookmark } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { artworks } from "@/data/content";
import { useJourney } from "@/lib/journey";

export const Route = createFileRoute("/account/saved")({
  component: Saved,
});

function Saved() {
  const navigate = useNavigate();
  const { saved, toggleSaved } = useJourney();
  const items = artworks.filter((a) => saved.includes(a.id));

  return (
    <MobileShell>
      <AppHeader title="Saved artworks" subtitle="My Map" back />
      <div className="space-y-3 px-4 py-5">
        {items.length ? (
          items.map((a) => (
            <article key={a.id} className="flex gap-3 rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
              <Link to="/artwork/$id" params={{ id: a.id }} className="shrink-0">
                <img src={a.image} alt={a.title} width={800} height={600} className="h-24 w-24 rounded-2xl object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to="/artwork/$id" params={{ id: a.id }} className="font-display text-base font-semibold">{a.title}</Link>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {a.location}</p>
                <div className="mt-auto flex gap-2 pt-2">
                  <button onClick={() => navigate({ to: "/artwork/$id/directions", params: { id: a.id } })} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground">
                    <Navigation className="h-3.5 w-3.5" /> Directions
                  </button>
                  <button onClick={() => toggleSaved(a.id)} aria-label="Remove saved" className="inline-flex items-center justify-center rounded-xl border border-primary bg-primary/12 px-3 py-2 text-primary">
                    <Bookmark className="h-4 w-4 fill-current" />
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-3xl">🔖</span>
            <p className="max-w-[26ch] text-sm text-muted-foreground">Nothing saved yet — tap the bookmark on any artwork.</p>
            <Link to="/map" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Explore the map</Link>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
