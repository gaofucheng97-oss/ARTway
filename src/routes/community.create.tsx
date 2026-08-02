import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Type, Mic, ImageIcon, PenLine, MessageCircle, ChevronRight } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { artworks, discussionPrompts } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/create")({
  component: CreateContribution,
});

const formats = [
  { id: "text", icon: Type, label: "Text" },
  { id: "voice", icon: Mic, label: "Voice" },
  { id: "image", icon: ImageIcon, label: "Image" },
  { id: "sketch", icon: PenLine, label: "Sketch" },
  { id: "question", icon: MessageCircle, label: "Question" },
] as const;

function CreateContribution() {
  const navigate = useNavigate();
  const { addContribution } = useJourney();
  const [artworkId, setArtworkId] = useState(artworks[0].id);
  const [promptIdx, setPromptIdx] = useState(0);
  const [format, setFormat] = useState<(typeof formats)[number]["id"]>("text");
  const [step, setStep] = useState(0);

  const artwork = artworks.find((a) => a.id === artworkId)!;

  const next = () => {
    if (step < 3) return setStep(step + 1);
    addContribution({
      artworkId,
      artworkTitle: artwork.title,
      type: format === "question" ? "text" : format,
      contributor: "You",
      privacy: "public",
      preview: discussionPrompts[promptIdx],
    });
    toast.success("Contribution shared");
    navigate({ to: "/community" });
  };

  return (
    <MobileShell>
      <AppHeader title="Create Contribution" back />

      <div className="flex-1 px-4 pb-6 pt-4">
        {/* Target artwork */}
        <label className="block rounded-2xl border border-border bg-card p-3">
          <span className="mb-2 flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-muted/60">
              <svg viewBox="0 0 60 50" className="h-8 w-9 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                <path d="M8 30 L30 18 L52 30 L52 42 L30 50 L8 42 Z" />
                <path d="M8 30 L30 42 L52 30" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">To</p>
              <p className="truncate text-sm font-semibold">{artwork.title}</p>
              <p className="text-xs text-muted-foreground">{artwork.year}</p>
            </span>
          </span>
          <select
            value={artworkId}
            onChange={(e) => setArtworkId(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            {artworks.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </label>

        {/* Choose a prompt */}
        <h3 className="mt-5 text-sm font-semibold">Choose a prompt</h3>
        <button
          onClick={() => setPromptIdx((promptIdx + 1) % discussionPrompts.length)}
          className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left"
        >
          <span className="flex-1 text-sm">{discussionPrompts[promptIdx]}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="mt-2 flex justify-center gap-1.5">
          {discussionPrompts.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                promptIdx === i ? "w-4 bg-foreground" : "w-1.5 bg-border",
              )}
            />
          ))}
        </div>

        {/* Choose a format */}
        <h3 className="mt-6 text-sm font-semibold">Choose a format</h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {formats.map((f) => {
            const Icon = f.icon;
            const active = format === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border bg-card px-2 py-5 text-xs font-medium",
                  active ? "border-foreground" : "border-border text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Simple input for the chosen format */}
        {step >= 1 && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-3">
            {format === "text" || format === "question" ? (
              <textarea rows={4} placeholder="Write your reflection…" className="w-full resize-none bg-transparent text-sm outline-none" />
            ) : (
              <div className="flex h-24 items-center justify-center rounded-xl bg-muted/60 text-xs text-muted-foreground">
                {format === "voice" ? "Tap to record" : format === "image" ? "Attach a photo" : "Draw a sketch"}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card p-4">
        <button
          onClick={next}
          className="w-full rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background"
        >
          {step < 3 ? "Next" : "Share"}
        </button>
      </div>
    </MobileShell>
  );
}
