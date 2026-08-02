import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Flag, Mic, ImageIcon, PenTool, Type } from "lucide-react";
import { toast } from "sonner";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { featuredContributions } from "@/data/content";

export const Route = createFileRoute("/community/featured")({
  component: Featured,
});

const typeIcon = { text: Type, voice: Mic, image: ImageIcon, sketch: PenTool };
const typeBg = { text: "bg-accent/70", voice: "bg-teal/25", image: "bg-orange/25", sketch: "bg-primary/12" };

function Featured() {
  return (
    <MobileShell>
      <AppHeader title="Featured contributions" subtitle="Community" back />
      <div className="space-y-3 px-4 py-5">
        <p className="text-sm text-muted-foreground">Selected reflections from students and visitors across Bristol.</p>
        {featuredContributions.map((c) => {
          const Icon = typeIcon[c.type];
          return (
            <article key={c.id} className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${typeBg[c.type]}`}>
                  <Icon className="h-3.5 w-3.5" /> {c.type}
                </span>
                <div className="flex gap-1.5">
                  <button onClick={() => toast("Saved to your collection")} aria-label="Save" className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground">
                    <Bookmark className="h-4 w-4" />
                  </button>
                  <button onClick={() => toast("Reported — thank you, we'll review this")} aria-label="Report" className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground">
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {(c.type === "image" || c.type === "sketch") && (
                <div className="mt-3 grid h-32 place-items-center rounded-2xl bg-accent/50 text-3xl">{c.type === "sketch" ? "✏️" : "🖼️"}</div>
              )}
              <p className="mt-3 text-sm text-foreground/85">{c.preview}</p>
              <Link to="/community/journal/$id" params={{ id: c.artworkId }} className="mt-2 block text-xs font-semibold text-primary">
                {c.artworkTitle} · {c.contributor}
              </Link>
            </article>
          );
        })}
      </div>
    </MobileShell>
  );
}
