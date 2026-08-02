import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { artworks } from "@/data/content";
import { useJourney } from "@/lib/journey";

export const Route = createFileRoute("/account/stories")({
  component: SavedStories,
});

function SavedStories() {
  const { savedStories } = useJourney();
  const items = savedStories
    .map((key) => {
      const [aid, sid] = key.split(":");
      const artwork = artworks.find((a) => a.id === aid);
      const story = artwork?.stories.find((s) => s.id === sid);
      return artwork && story ? { key, artwork, story } : null;
    })
    .filter(Boolean) as { key: string; artwork: (typeof artworks)[number]; story: (typeof artworks)[number]["stories"][number] }[];

  return (
    <MobileShell>
      <AppHeader title="Saved stories" subtitle="Account" back />
      <div className="space-y-3 px-4 py-5">
        {items.length ? (
          items.map(({ key, artwork, story }) => (
            <Link key={key} to="/artwork/$id/story/$storyId" params={{ id: artwork.id, storyId: story.id }} className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3.5 shadow-[var(--shadow-card)]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/60 text-2xl">{story.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold">{story.title}</p>
                <p className="truncate text-xs text-muted-foreground">{artwork.title}</p>
              </div>
              <Bookmark className="h-4 w-4 shrink-0 fill-primary text-primary" />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-3xl">📖</span>
            <p className="max-w-[26ch] text-sm text-muted-foreground">No saved stories yet — tap the bookmark on any story.</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
