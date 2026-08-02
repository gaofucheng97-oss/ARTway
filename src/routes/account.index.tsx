import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, ChevronRight, PenLine, Bookmark, MapPin, Award } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { useJourney } from "@/lib/journey";
import { artworks } from "@/data/content";

export const Route = createFileRoute("/account/")({
  component: Account,
});

function Account() {
  const { visited, saved, stamps, contributions } = useJourney();
  const total = artworks.length;
  const pct = Math.round((visited.length / total) * 100);

  const stats = [
    { label: "Visited", value: visited.length },
    { label: "Contributions", value: contributions.length },
    { label: "Routes", value: 2 },
  ];

  const links = [
    { to: "/account/contributions", label: "My Contributions", icon: PenLine, desc: `${contributions.length} shared` },
    { to: "/account/stories", label: "Saved Stories", icon: Bookmark, desc: `${saved.length} kept` },
    { to: "/account/visited", label: "Visited Artworks", icon: MapPin, desc: `${visited.length} explored` },
    { to: "/account/stamps", label: "Digital Stamps", icon: Award, desc: `${stamps.length} collected` },
    { to: "/account/settings", label: "Settings", icon: Settings, desc: "Language · Privacy · Notifications" },
  ] as const;

  return (
    <MobileShell>
      <AppHeader
        title="Account"
        right={
          <Link to="/account/settings" aria-label="Settings" className="grid h-8 w-8 place-items-center">
            <Settings className="h-5 w-5" strokeWidth={1.6} />
          </Link>
        }
      />

      <div className="px-4 pb-6 pt-4">
        {/* Profile card */}
        <Link to="/account/settings" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">
            J
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold">Jessica</p>
            <p className="text-xs text-muted-foreground">Explore · Connect · Remember</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        {/* My Map */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">My Map</p>
            <Link to="/account/map" className="text-xs text-muted-foreground underline underline-offset-2">
              View all
            </Link>
          </div>
          <p className="mt-3 text-sm">{visited.length} visited artworks</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold">{pct}%</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Link list */}
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link key={l.to} to={l.to} className="flex items-center gap-3 px-4 py-3.5">
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.6} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{l.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{l.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
