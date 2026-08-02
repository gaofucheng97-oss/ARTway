import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, ImageIcon, PenTool, Type, PenLine, Globe, EyeOff, Lock } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";
import { useJourney } from "@/lib/journey";

export const Route = createFileRoute("/community/journal/$id")({
  component: Journal,
});

const privacyMeta = {
  public: { label: "Public", icon: Globe, cls: "bg-teal/25 text-navy" },
  anonymous: { label: "Anonymous", icon: EyeOff, cls: "bg-accent/70 text-foreground" },
  private: { label: "Saved privately", icon: Lock, cls: "bg-muted text-muted-foreground" },
} as const;

const feed = [
  { type: "text", privacy: "public", body: "I never realised this place had such a layered history.", who: "Anonymous" },
  { type: "sketch", privacy: "public", body: "A quick sketch of the patterns.", who: "Maya" },
  { type: "voice", privacy: "anonymous", body: "Voice note · 0:38 — about feeling new to Bristol.", who: "Anonymous" },
  { type: "text", privacy: "public", body: "This made me think differently about walking through campus.", who: "Anonymous" },
  { type: "image", privacy: "public", body: "A photo reflection at golden hour.", who: "Sam" },
] as const;

function Journal() {
  const { id } = Route.useParams();
  const artwork = getArtwork(id);
  const { contributions } = useJourney();
  const mine = contributions.filter((c) => c.artworkId === id);

  if (!artwork) return <MobileShell><AppHeader title="Journal" back /><div className="p-8 text-center text-muted-foreground">Not found.</div></MobileShell>;

  return (
    <MobileShell>
      <AppHeader title="Community journal" subtitle={artwork.title} back />
      <div className="space-y-4 px-4 py-5">
        {mine.map((c) => {
          const p = privacyMeta[c.privacy];
          const P = p.icon;
          return (
            <article key={c.id} className="rounded-3xl border border-primary/40 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">Your reflection</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${p.cls}`}><P className="h-3.5 w-3.5" /> {p.label}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/85">{c.preview}</p>
            </article>
          );
        })}

        {feed.map((c, i) => {
          const p = privacyMeta[c.privacy];
          const P = p.icon;
          return (
            <article key={i} className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.type}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${p.cls}`}><P className="h-3.5 w-3.5" /> {p.label}</span>
              </div>
              {(c.type === "image" || c.type === "sketch") && (
                <div className="mt-3 grid h-32 place-items-center rounded-2xl bg-accent/50 text-3xl">{c.type === "sketch" ? "✏️" : "🖼️"}</div>
              )}
              {c.type === "voice" ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-foreground/85"><Mic className="h-4 w-4 text-primary" /> {c.body}</p>
              ) : (
                <p className="mt-3 text-sm text-foreground/85">{c.type === "text" ? `"${c.body}"` : c.body}</p>
              )}
              <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">{c.who}</p>
            </article>
          );
        })}

        <Link
          to="/community/create"
          search={{ artwork: artwork.id }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground"
        >
          <PenLine className="h-4 w-4" /> Add your reflection
        </Link>
      </div>
    </MobileShell>
  );
}
