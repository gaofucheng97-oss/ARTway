import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, PenLine, HelpCircle } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork, discussionPrompts } from "@/data/content";

export const Route = createFileRoute("/community/forum/$id")({
  component: Forum,
});

const previous = [
  "I pass this place every week but never stopped before.",
  "The audio made the artwork feel more alive.",
  "I liked seeing how other students interpreted it differently.",
];

function Forum() {
  const { id } = Route.useParams();
  const artwork = getArtwork(id);
  if (!artwork) return <MobileShell><AppHeader title="Forum" back /><div className="p-8 text-center text-muted-foreground">Not found.</div></MobileShell>;

  return (
    <MobileShell>
      <AppHeader title={artwork.title} subtitle="Artwork forum" back />
      <div className="space-y-7 px-4 py-5">
        <section className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
          <img src={artwork.image} alt="" width={800} height={600} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold">{artwork.title}</p>
            <p className="text-xs text-muted-foreground">A curated, respectful space to reflect together.</p>
          </div>
        </section>

        {/* Community journal preview */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Community journal</h2>
            <Link to="/community/journal/$id" params={{ id: artwork.id }} className="text-sm font-semibold text-primary">Open</Link>
          </div>
          <div className="space-y-2.5">
            {artwork.reflections.slice(0, 2).map((r, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-3.5">
                <p className="text-sm italic text-foreground/85">"{r}"</p>
                <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">Anonymous · Public</p>
              </div>
            ))}
          </div>
        </section>

        {/* Discussion prompts */}
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Discussion prompts</h2>
          <div className="space-y-2.5">
            {discussionPrompts.map((p) => (
              <Link
                key={p}
                to="/community/create"
                search={{ artwork: artwork.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-accent/40 p-3.5"
              >
                <HelpCircle className="h-5 w-5 shrink-0 text-primary" />
                <span className="flex-1 text-sm font-medium">{p}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Previous reflections */}
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Previous visitors' reflections</h2>
          <div className="space-y-2.5">
            {previous.map((r, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-3.5">
                <p className="flex items-start gap-2 text-sm text-foreground/85"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /> {r}</p>
                <p className="mt-1.5 pl-6 text-[11px] font-semibold text-muted-foreground">Anonymous student</p>
              </div>
            ))}
          </div>
        </section>

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
