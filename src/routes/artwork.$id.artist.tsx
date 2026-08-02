import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Palette } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";

export const Route = createFileRoute("/artwork/$id/artist")({
  component: ArtistDetail,
});

function ArtistDetail() {
  const { id } = Route.useParams();
  const artwork = getArtwork(id);
  if (!artwork) return <MobileShell><AppHeader title="Artist" back /><div className="p-8 text-center text-muted-foreground">Not found.</div></MobileShell>;

  const initials = artwork.artist.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <MobileShell hideNav>
      <AppHeader title="Artist" subtitle={artwork.title} back />
      <div className="px-4 py-5">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-primary via-orange to-secondary text-4xl font-bold text-white shadow-[var(--shadow-card)]">
            {initials}
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold">{artwork.artist}</h1>
          <p className="text-sm text-muted-foreground">Public artist · {artwork.year}</p>
        </div>

        <section className="mt-6 space-y-4">
          <div className="rounded-3xl border border-border bg-card p-4">
            <h2 className="font-display text-base font-semibold">About the artist</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{artwork.artistBio}</p>
          </div>
          <div className="rounded-3xl border border-border bg-accent/40 p-4">
            <h2 className="flex items-center gap-1.5 font-display text-base font-semibold"><Palette className="h-4 w-4 text-primary" /> Connection to this artwork</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{artwork.artistConnection}</p>
          </div>
        </section>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold"
        >
          <ExternalLink className="h-4 w-4" /> More works & official page
        </a>

        <Link
          to="/artwork/$id/audio"
          params={{ id: artwork.id }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
        >
          Listen to the audio guide
        </Link>
      </div>
    </MobileShell>
  );
}
