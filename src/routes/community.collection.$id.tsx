import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, MessageCircle, Mic, ImageIcon, PenTool, Type, Flame } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";

export const Route = createFileRoute("/community/collection/$id")({
  loader: ({ params }) => {
    const artwork = getArtwork(params.id);
    if (!artwork) throw notFound();
    return { artwork };
  },
  component: Collection,
  notFoundComponent: () => (
    <MobileShell>
      <AppHeader title="Collection" back />
      <div className="p-6 text-center text-sm text-muted-foreground">Collection not found.</div>
    </MobileShell>
  ),
});

type PostKind = "text" | "image" | "voice" | "sketch";

interface Post {
  id: string;
  author: string;
  role: string;
  time: string;
  text: string;
  kind: PostKind;
  likes: number;
  comments: number;
}

// Deterministic sample posts per artwork
function samplePosts(artworkId: string): Post[] {
  const seeds: Post[] = [
    { id: "1", author: "Sophia", role: "Local Resident", time: "2h ago", text: "The texture reminds me of my grandmother's home in Easton.", kind: "image", likes: 128, comments: 24 },
    { id: "2", author: "Ahmed", role: "Student", time: "5h ago", text: "I finally learned the story behind this piece — completely changed how I see it.", kind: "voice", likes: 96, comments: 18 },
    { id: "3", author: "Lina", role: "Visitor", time: "1d ago", text: "The reflection on migration and belonging really moved me today.", kind: "text", likes: 74, comments: 12 },
    { id: "4", author: "Marcus", role: "Student", time: "2d ago", text: "Sketched it during a lunch break — never noticed the small details before.", kind: "sketch", likes: 52, comments: 8 },
    { id: "5", author: "Priya", role: "Student", time: "3d ago", text: "Passed here for a year and never stopped. Grateful I did today.", kind: "text", likes: 41, comments: 6 },
    { id: "6", author: "Jonah", role: "Alumnus", time: "5d ago", text: "Different light in the evening — worth a second visit.", kind: "image", likes: 33, comments: 4 },
  ];
  // rotate slightly by artwork id for variety
  const offset = artworkId.length % seeds.length;
  return [...seeds.slice(offset), ...seeds.slice(0, offset)].sort((a, b) => b.likes - a.likes);
}

const kindIcon: Record<PostKind, typeof Type> = { text: Type, image: ImageIcon, voice: Mic, sketch: PenTool };

function Collection() {
  const { artwork } = Route.useLoaderData();
  const posts = samplePosts(artwork.id);

  return (
    <MobileShell>
      <AppHeader title="Collection" back />

      <div className="px-4 pb-6 pt-4">
        {/* Simple intro */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border bg-muted/60">
              <svg viewBox="0 0 60 50" className="h-8 w-9 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                <path d="M8 30 L30 18 L52 30 L52 42 L30 50 L8 42 Z" />
                <path d="M8 30 L30 42 L52 30" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold">{artwork.title}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{artwork.artist} · {artwork.year}</p>
              <p className="mt-2 text-sm text-foreground/85">{artwork.hook}</p>
            </div>
          </div>
          <Link
            to="/artwork/$id"
            params={{ id: artwork.id }}
            className="mt-3 block rounded-xl border border-border py-2 text-center text-xs font-semibold"
          >
            View artwork details
          </Link>
        </div>

        {/* Posts */}
        <div className="mt-5 flex items-center justify-between">
          <h3 className="text-sm font-semibold">All posts</h3>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5" /> Sorted by popularity
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {posts.map((p) => {
            const Icon = kindIcon[p.kind];
            return (
              <article key={p.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs">
                    <span className="font-semibold">{p.author}</span>{" "}
                    <span className="text-muted-foreground">{p.role} · {p.time}</span>
                  </p>
                  <p className="mt-1 text-sm">{p.text}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {p.likes}</span>
                    <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {p.comments}</span>
                  </div>
                </div>
                {p.kind !== "text" && (
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-border bg-muted/60 text-muted-foreground">
                    <Icon className="h-5 w-5" strokeWidth={1.4} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
