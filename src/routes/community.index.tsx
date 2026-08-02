import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Play, ImageIcon } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { artworks, featuredContributions } from "@/data/content";

export const Route = createFileRoute("/community/")({
  component: Community,
});

const featured = [
  { name: "Sophia", role: "Local Resident", time: "2h ago", text: "The texture reminds me of my grandmother's home.", likes: 24, comments: 6, kind: "image" as const },
  { name: "Ahmed", role: "Student", time: "5h ago", text: "I learned so much about the history behind this artwork. Thank you!", likes: 18, comments: 4, kind: "video" as const },
  { name: "Lina", role: "Visitor", time: "1d ago", text: "This story about migration and belonging really moved me.", likes: 15, comments: 3, kind: "image" as const },
];

function Community() {
  const collections = artworks.slice(0, 4).map((a, i) => ({
    ...a,
    posts: [12, 8, 6, 5][i],
  }));

  return (
    <MobileShell>
      <AppHeader
        title="Community"
        right={
          <button aria-label="Notifications" className="grid h-8 w-8 place-items-center">
            <Bell className="h-5 w-5" strokeWidth={1.6} />
          </button>
        }
      />

      <div className="px-4 pb-24 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Featured Posts</h2>
          <Link to="/community/featured" className="text-xs text-muted-foreground underline underline-offset-2">
            View all
          </Link>
        </div>

        <div className="mt-3 space-y-3">
          {featured.map((p) => (
            <div key={p.name} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-xs">
                  <span className="font-semibold">{p.name}</span>{" "}
                  <span className="text-muted-foreground">{p.role} · {p.time}</span>
                </p>
                <p className="mt-1 text-sm">{p.text}</p>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <span>♡ {p.likes}</span>
                  <span>💬 {p.comments}</span>
                </div>
              </div>
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-border bg-muted/60">
                {p.kind === "video" ? (
                  <Play className="h-5 w-5" strokeWidth={1.6} />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.4} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Artwork Collections</h2>
          <Link to="/community/featured" className="text-xs text-muted-foreground underline underline-offset-2">
            View all
          </Link>
        </div>

        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
          {collections.map((c) => (
            <Link
              key={c.id}
              to="/community/collection/$id"
              params={{ id: c.id }}
              className="w-32 shrink-0"
            >
              <div className="relative grid aspect-square place-items-center rounded-2xl border border-border bg-muted/60">
                <svg viewBox="0 0 60 50" className="h-12 w-14 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                  <path d="M8 30 L30 18 L52 30 L52 42 L30 50 L8 42 Z" />
                  <path d="M8 30 L30 42 L52 30" />
                </svg>
                <span className="absolute bottom-2 right-2 rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
                  {c.posts}
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-medium">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.posts} posts</p>
            </Link>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {featuredContributions.length} community stories shared this week
        </p>

        {/* Contribute CTA — floats at the bottom of the scrollable area */}
        <div className="sticky bottom-4 z-10 mt-6">
          <Link
            to="/community/create"
            className="flex items-center justify-center rounded-2xl border border-foreground bg-card py-3 text-sm font-semibold text-foreground shadow-sm"
          >
            Share a contribution
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
