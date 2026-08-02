import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, Info, Headphones, Users, Navigation, ChevronRight, ExternalLink } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/artwork/$id/")({
  loader: ({ params }) => {
    const artwork = getArtwork(params.id);
    if (!artwork) throw notFound();
    return { artwork };
  },
  component: ArtworkDetails,
  notFoundComponent: () => (
    <MobileShell>
      <AppHeader title="Artwork Details" back />
      <div className="p-6 text-center text-sm text-muted-foreground">Artwork not found.</div>
    </MobileShell>
  ),
});

function ArtworkDetails() {
  const { artwork } = Route.useLoaderData();
  const { isSaved, toggleSaved } = useJourney();
  const saved = isSaved(artwork.id);

  const actions = [
    { icon: Info, label: "Overview", to: "/artwork/$id" as const, params: { id: artwork.id } },
    ...(artwork.hasAudio ? [{ icon: Headphones, label: "Listen", to: "/artwork/$id/audio" as const, params: { id: artwork.id } }] : []),
    { icon: Users, label: "Community", to: "/community" as const, params: undefined },
    { icon: Navigation, label: "Visit", to: "/artwork/$id/scan" as const, params: { id: artwork.id } },
  ];

  const rows = [
    { label: "Artist", value: artwork.artist, to: "/artwork/$id/artist" as const },
    { label: "Location", value: artwork.location, to: "/artwork/$id/directions" as const },
    { label: "Themes", value: artwork.tags.slice(0, 3).join(" · "), to: undefined },
  ];

  return (
    <MobileShell>
      <AppHeader
        title="Artwork Details"
        back
        right={
          <button onClick={() => toggleSaved(artwork.id)} aria-label="Save" className="grid h-8 w-8 place-items-center">
            <Bookmark className={cn("h-5 w-5", saved && "fill-current")} strokeWidth={1.6} />
          </button>
        }
      />

      <div className="px-4 pb-6 pt-4">
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-border bg-muted/60">
          <img src={artwork.image} alt={artwork.title} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-8">
            <p className="text-[10px] text-white/90">{artwork.imageCredit}</p>
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-semibold">{artwork.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{artwork.year}</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{artwork.description}</p>

        <a
          href={artwork.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline underline-offset-2"
        >
          Official artwork details <ExternalLink className="h-3.5 w-3.5" />
        </a>

        {/* Four action tiles */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                to={a.to}
                params={a.params as never}
                className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card px-2 py-3 text-center"
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} />
                <span className="text-[11px] font-medium">{a.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Rows */}
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {rows.map((r) =>
            r.to ? (
              <Link
                key={r.label}
                to={r.to}
                params={{ id: artwork.id }}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className="truncate text-sm font-medium">{r.value}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ) : (
              <div key={r.label} className="flex items-center gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className="truncate text-sm font-medium">{r.value}</p>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Story hook */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Story hook</p>
          <p className="mt-1 text-sm leading-relaxed">{artwork.hook}</p>
        </div>

        <Link
          to="/artwork/$id/scan"
          params={{ id: artwork.id }}
          className="mt-5 flex items-center justify-center rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background"
        >
          Start on-site experience
        </Link>
      </div>
    </MobileShell>
  );
}
