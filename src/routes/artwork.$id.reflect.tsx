import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Type, Mic, ImageIcon, PenTool, SkipForward, Lock, Users, Check, Award } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork, reflectionPrompts } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/artwork/$id/reflect")({
  component: Reflect,
});

type Stage = "prompt" | "compose" | "saved";
type Mode = "word" | "text" | "voice" | "image" | "sketch";

const modes: { id: Mode; label: string; icon: typeof Type }[] = [
  { id: "word", label: "One word", icon: Type },
  { id: "text", label: "Short text", icon: Type },
  { id: "voice", label: "Voice note", icon: Mic },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "sketch", label: "Sketch", icon: PenTool },
];

function Reflect() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const artwork = getArtwork(id);
  const { markVisited, collectStamp, completeArtworkInRoute } = useJourney();
  const [stage, setStage] = useState<Stage>("prompt");
  const [mode, setMode] = useState<Mode | null>(null);
  const [text, setText] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "public">("private");

  const prompt = useMemo(() => reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)], []);

  if (!artwork) return <MobileShell><AppHeader title="Reflect" back /><div className="p-8 text-center text-muted-foreground">Not found.</div></MobileShell>;

  const save = () => {
    markVisited(artwork.id);
    collectStamp(artwork.stamp.id);
    collectStamp("first-visit");
    collectStamp("hidden-story");
    completeArtworkInRoute(artwork.id);
    setStage("saved");
  };

  return (
    <MobileShell hideNav>
      <AppHeader title="Reflection" subtitle={artwork.title} back />
      <div className="flex flex-1 flex-col px-4 py-5">
        {stage === "prompt" && (
          <div className="flex flex-1 flex-col">
            <div className="rounded-[2rem] bg-gradient-to-br from-secondary to-navy p-6 text-white shadow-[var(--shadow-card)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">A question for you</p>
              <p className="mt-2 font-display text-2xl font-semibold leading-snug">{prompt}</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Answer however feels right — a word, a note, a photo, or skip for now.</p>
            <div className="mt-auto space-y-3 pt-6">
              <button onClick={() => setStage("compose")} className="w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground">
                What would you add to this place?
              </button>
              <button onClick={save} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground">
                <SkipForward className="h-4 w-4" /> Skip for now
              </button>
            </div>
          </div>
        )}

        {stage === "compose" && (
          <div className="flex flex-1 flex-col">
            <p className="text-sm font-semibold">How would you like to respond?</p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {modes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold",
                      mode === m.id ? "border-primary bg-primary/12 text-primary" : "border-border bg-card",
                    )}
                  >
                    <Icon className="h-5 w-5" /> {m.label}
                  </button>
                );
              })}
            </div>

            {mode && (
              <div className="mt-4">
                {(mode === "word" || mode === "text") && (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={mode === "word" ? 1 : 4}
                    placeholder={mode === "word" ? "One word…" : "Write a short reflection…"}
                    className="w-full rounded-2xl border border-border bg-card p-4 text-sm outline-none focus:border-primary"
                  />
                )}
                {mode === "voice" && (
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6">
                    <button className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground"><Mic className="h-7 w-7" /></button>
                    <p className="text-xs text-muted-foreground">Tap to record a voice note</p>
                  </div>
                )}
                {(mode === "image" || mode === "sketch") && (
                  <div className="grid h-40 place-items-center rounded-2xl border-2 border-dashed border-border bg-accent/40 text-center text-sm text-muted-foreground">
                    {mode === "image" ? "Tap to add a photo" : "Tap to start a sketch"}
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto pt-6">
              <p className="mb-2 text-sm font-semibold">Before you save</p>
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={() => setPrivacy("private")} className={cn("flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold", privacy === "private" ? "border-primary bg-primary/12 text-primary" : "border-border bg-card")}>
                  <Lock className="h-4 w-4" /> Keep private
                </button>
                <button onClick={() => setPrivacy("public")} className={cn("flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold", privacy === "public" ? "border-primary bg-primary/12 text-primary" : "border-border bg-card")}>
                  <Users className="h-4 w-4" /> Share
                </button>
              </div>
              <button onClick={save} disabled={!mode} className="mt-3 w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-50">
                Save reflection
              </button>
            </div>
          </div>
        )}

        {stage === "saved" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-teal/25 text-teal-foreground">
              <Check className="h-10 w-10" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">Saved to your journey</h2>
            <p className="mt-2 max-w-[30ch] text-sm text-muted-foreground">
              You can choose whether to keep it private or share it with the community.
            </p>

            {/* stamp reveal */}
            <div className="mt-6 flex flex-col items-center gap-2 rounded-3xl border border-border bg-accent/40 px-8 py-5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary"><Award className="h-4 w-4" /> Stamp collected</p>
              <span className="grid h-20 w-20 animate-pin-drop place-items-center rounded-full bg-card text-4xl shadow-sm ring-4 ring-primary/30">{artwork.stories[0].emoji}</span>
              <p className="font-display text-base font-semibold">{artwork.stamp.name}</p>
            </div>

            <div className="mt-8 w-full space-y-3">
              <button onClick={() => navigate({ to: "/account/map" })} className="w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground">
                See it on My Map
              </button>
              <Link to="/route-progress" className="block w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold">
                Next stop →
              </Link>

            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
