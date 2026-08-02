import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Award } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { artworks, allStamps } from "@/data/content";
import { useJourney } from "@/lib/journey";

export const Route = createFileRoute("/account/visited")({
  component: Visited,
});

function Visited() {
  const { visited, stamps } = useJourney();
  const items = artworks.filter((a) => visited.includes(a.id));

  return (
    <MobileShell>
      <AppHeader title="Visited artworks" subtitle="My Map" back />
      <div className="px-4 py-5">
        {items.length ? (
          <div className="grid grid-cols-2 gap-3">
            {items.map((a) => {
              const stamp = allStamps.find((s) => s.id === a.stamp.id && stamps.includes(s.id));
              return (
                <Link key={a.id} to="/artwork/$id" params={{ id: a.id }} className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
                  <div className="relative aspect-square">
                    <img src={a.image} alt={a.title} width={800} height={600} className="h-full w-full object-cover" />
                    <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-teal text-navy shadow">{stamp ? stamp.emoji : <Check className="h-4 w-4" />}</span>
                  </div>
                  <div className="p-3">
                    <p className="truncate font-display text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">Visited · 12 Jul</p>
                    <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary"><Award className="h-3 w-3" /> Stamp collected</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <Empty text="No visits yet — scan a QR at an artwork to add your first." />
        )}
      </div>
    </MobileShell>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-3xl">🗺️</span>
      <p className="max-w-[26ch] text-sm text-muted-foreground">{text}</p>
      <Link to="/map" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Explore the map</Link>
    </div>
  );
}
