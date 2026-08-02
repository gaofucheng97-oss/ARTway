import { createFileRoute, Link } from "@tanstack/react-router";
import { Type, Mic, ImageIcon, PenTool, Lock, EyeOff, Globe, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { useJourney } from "@/lib/journey";

export const Route = createFileRoute("/account/contributions")({
  component: Contributions,
});

const typeIcon = { text: Type, voice: Mic, image: ImageIcon, sketch: PenTool };
const privacyMeta = {
  public: { label: "Public", icon: Globe, cls: "bg-teal/25 text-navy" },
  anonymous: { label: "Anonymous", icon: EyeOff, cls: "bg-accent/70 text-foreground" },
  private: { label: "Private", icon: Lock, cls: "bg-muted text-muted-foreground" },
} as const;

function Contributions() {
  const { contributions, removeContribution } = useJourney();

  return (
    <MobileShell>
      <AppHeader title="My contributions" subtitle="Account" back />
      <div className="space-y-3 px-4 py-5">
        {contributions.length ? (
          contributions.map((c) => {
            const Icon = typeIcon[c.type];
            const p = privacyMeta[c.privacy];
            const P = p.icon;
            return (
              <article key={c.id} className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/70 px-2.5 py-1 text-xs font-semibold"><Icon className="h-3.5 w-3.5" /> {c.type}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${p.cls}`}><P className="h-3.5 w-3.5" /> {p.label}</span>
                </div>
                <p className="mt-2.5 text-sm text-foreground/85">{c.preview}</p>
                <Link to="/community/journal/$id" params={{ id: c.artworkId }} className="mt-1.5 block text-xs font-semibold text-primary">{c.artworkTitle}</Link>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => toast("Editing coming soon")} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => { removeContribution(c.id); toast("Contribution deleted"); }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-destructive">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-3xl">✍️</span>
            <p className="max-w-[26ch] text-sm text-muted-foreground">You haven't shared anything yet.</p>
            <Link to="/community/create" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Add a contribution</Link>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
