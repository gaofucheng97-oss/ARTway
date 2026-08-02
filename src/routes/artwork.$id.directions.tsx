import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation, Clock, Building2, Accessibility, QrCode, MapPin } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";

export const Route = createFileRoute("/artwork/$id/directions")({
  component: Directions,
});

function Directions() {
  const { id } = Route.useParams();
  const artwork = getArtwork(id);
  if (!artwork) return <MobileShell><AppHeader title="Directions" back /><div className="p-8 text-center text-muted-foreground">Not found.</div></MobileShell>;

  return (
    <MobileShell hideNav>
      <AppHeader title="Directions" subtitle={artwork.title} back />
      <div className="px-4 py-4">
        {/* mini map */}
        <div className="relative h-56 overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, oklch(0.93 0.03 150), oklch(0.9 0.04 90) 55%, oklch(0.9 0.05 60))" }} />
          <div className="absolute -left-6 top-1/2 h-16 w-[130%] -rotate-6 rounded-full bg-teal/30" />
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-background/60" />
          {/* dashed route */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M25 80 C 40 60, 55 55, 70 30" fill="none" stroke="var(--primary)" strokeWidth="1.4" strokeDasharray="3 3" strokeLinecap="round" />
          </svg>
          <span className="absolute bottom-[18%] left-[24%] h-4 w-4 -translate-x-1/2 rounded-full bg-secondary ring-4 ring-secondary/25" />
          <span className="absolute right-[28%] top-[26%] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-primary text-white shadow-lg">
            <MapPin className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <Row icon={<Clock className="h-5 w-5 text-primary" />} label="Walking time" value={artwork.walkingTime} />
          <Row icon={<Building2 className="h-5 w-5 text-primary" />} label="Nearest landmark" value={artwork.nearestBuilding} />
          <Row icon={<Accessibility className="h-5 w-5 text-primary" />} label="Accessibility" value={artwork.accessibility} />
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold">
          <Navigation className="h-4 w-4" /> Open in maps
        </button>
        <Link
          to="/artwork/$id/scan"
          params={{ id: artwork.id }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground"
        >
          <QrCode className="h-4 w-4" /> Start tour from here
        </Link>
      </div>
    </MobileShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/60">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
