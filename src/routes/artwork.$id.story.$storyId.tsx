import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Play, Pause, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/artwork/$id/story/$storyId")({
  component: StoryDetail,
});

function StoryDetail() {
  const { id, storyId } = Route.useParams();
  const artwork = getArtwork(id);
  const story = artwork?.stories.find((s) => s.id === storyId);
  const { savedStories, toggleSavedStory } = useJourney();
  const [playing, setPlaying] = useState(false);

  if (!artwork || !story) {
    return <MobileShell><AppHeader title="Story" back /><div className="p-8 text-center text-muted-foreground">Story not found.</div></MobileShell>;
  }

  const key = `${artwork.id}:${story.id}`;
  const saved = savedStories.includes(key);
  const idx = artwork.stories.findIndex((s) => s.id === story.id);
  const next = artwork.stories[idx + 1];

  return (
    <MobileShell hideNav>
      <AppHeader
        title={artwork.title}
        subtitle="Story"
        back
        right={
          <button
            onClick={() => { toggleSavedStory(key); toast(saved ? "Removed from saved stories" : "Saved to your stories"); }}
            aria-label="Save story"
            className={cn("grid h-10 w-10 place-items-center rounded-full border", saved ? "border-primary bg-primary/12 text-primary" : "border-border bg-card")}
          >
            <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
          </button>
        }
      />
      <div className="px-4 py-4">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={artwork.image} alt="" width={800} height={600} className="h-52 w-full object-cover" />
          <span className="absolute bottom-3 left-3 grid h-14 w-14 place-items-center rounded-2xl bg-card/90 text-3xl backdrop-blur">{story.emoji}</span>
        </div>

        <h1 className="mt-4 font-display text-2xl font-semibold leading-tight">{story.title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{story.text}</p>

        {story.hasAudio && (
          <button
            onClick={() => setPlaying((p) => !p)}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-border bg-gradient-to-r from-teal/25 to-teal/5 p-4"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-teal text-navy">
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
            </span>
            <span className="flex-1 text-left">
              <span className="block font-display text-sm font-semibold">Listen to this story</span>
              <span className="block text-xs text-muted-foreground">{playing ? "Playing… 0:42 / 1:20" : "1:20 · with transcript"}</span>
            </span>
          </button>
        )}

        {next && (
          <a
            href={`/artwork/${artwork.id}/story/${next.id}`}
            className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card p-4"
          >
            <span className="text-2xl">{next.emoji}</span>
            <span className="flex-1">
              <span className="block text-xs text-muted-foreground">Next story</span>
              <span className="block font-display text-sm font-semibold">{next.title}</span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </a>
        )}
      </div>
    </MobileShell>
  );
}
