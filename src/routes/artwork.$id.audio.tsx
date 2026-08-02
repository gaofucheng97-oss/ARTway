import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Pause, FileText, Captions, SkipForward, Rewind, FastForward, Globe } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";
import { useJourney } from "@/lib/journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/artwork/$id/audio")({
  component: AudioGuide,
});

function AudioGuide() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const artwork = getArtwork(id);
  const { collectStamp } = useJourney();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(18);
  const [showTranscript, setShowTranscript] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [lang, setLang] = useState<"en" | "zh">("en");
  const zh = lang === "zh";

  useEffect(() => {
    collectStamp("audio-listener");
  }, [collectStamp]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress((p) => Math.min(100, p + 1)), 400);
    return () => clearInterval(t);
  }, [playing]);

  const t = {
    header: zh ? "语音导览" : "Audio guide",
    nowPlaying: zh ? "正在播放" : "Now playing",
    caption: zh
      ? "……这些图案由数百段布里斯托的记忆缝合而成，它记得谁曾来过这里。"
      : "…stitched from hundreds of Bristol memories, this pattern remembers who was here before.",
    transcript: zh ? "文字稿" : "Transcript",
    captions: zh ? "字幕" : "Captions",
    on: zh ? "开" : "on",
    off: zh ? "关" : "off",
    next: zh ? "下一步：写下你的感受" : "Next: reflect on this artwork",
    lines: zh
      ? [
          "[0:00] 欢迎。请花一点时间，看看眼前的形状与色彩。",
          "[0:20] 这里的每一个图案，都来自城市各处收集来的数百段布里斯托记忆……",
          "[0:55] 随着校区不断扩建，这件作品在问：这个新的地方，是为谁而建的？",
        ]
      : [
          "[0:00] Welcome. Take a moment to look at the shapes and colours in front of you.",
          "[0:20] Each pattern here was stitched from hundreds of Bristol memories gathered across the city…",
          "[0:55] As the campus grows, the artwork asks: who is this new place for?",
        ],
  };

  if (!artwork) return <MobileShell><AppHeader title={t.header} back /><div className="p-8 text-center text-muted-foreground">Not found.</div></MobileShell>;

  return (
    <MobileShell hideNav>
      <AppHeader
        title={t.header}
        subtitle={artwork.title}
        back
        right={
          <button
            onClick={() => setLang((l) => (l === "en" ? "zh" : "en"))}
            aria-label={zh ? "切换到英文" : "Switch to Chinese"}
            className="flex h-8 items-center gap-1 rounded-full border border-border px-2 text-[11px] font-semibold"
          >
            <Globe className="h-3.5 w-3.5" strokeWidth={1.8} />
            {zh ? "中" : "EN"}
          </button>
        }
      />

      <div className="flex flex-1 flex-col px-4 py-5">
        <div className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
          <img src={artwork.image} alt="" width={800} height={600} className="h-64 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{t.nowPlaying}</p>
            <p className="font-display text-lg font-semibold leading-snug">{artwork.audio.title}</p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">{artwork.audio.caption}</p>

        {captions && playing && (
          <p className="mx-auto mt-3 max-w-[32ch] rounded-2xl bg-navy px-4 py-2 text-center text-sm font-medium text-navy-foreground">
            “{t.caption}”
          </p>
        )}

        {/* progress */}
        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{fmt(progress, artwork.audio.duration)}</span>
            <span>{artwork.audio.duration}</span>
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <button aria-label="Rewind" onClick={() => setProgress((p) => Math.max(0, p - 8))} className="text-muted-foreground"><Rewind className="h-6 w-6" /></button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-float)]"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-0.5" />}
          </button>
          <button aria-label="Forward" onClick={() => setProgress((p) => Math.min(100, p + 8))} className="text-muted-foreground"><FastForward className="h-6 w-6" /></button>
        </div>

        {/* toggles */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowTranscript((s) => !s)}
            className={cn("flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold", showTranscript ? "border-primary bg-primary/12 text-primary" : "border-border bg-card")}
          >
            <FileText className="h-4 w-4" /> {t.transcript}
          </button>
          <button
            onClick={() => setCaptions((c) => !c)}
            className={cn("flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold", captions ? "border-primary bg-primary/12 text-primary" : "border-border bg-card")}
          >
            <Captions className="h-4 w-4" /> {t.captions} {captions ? t.on : t.off}
          </button>
        </div>

        {showTranscript && (
          <div className="mt-3 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground/85">
            {t.lines.map((line, i) => (
              <p key={i} className={i ? "mt-2" : undefined}>{line}</p>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate({ to: "/artwork/$id/reflect", params: { id: artwork.id } })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-3.5 text-sm font-bold text-secondary-foreground"
        >
          {t.next} <SkipForward className="h-4 w-4" />
        </button>
      </div>
    </MobileShell>
  );
}

function fmt(pct: number, dur: string) {
  const [m, s] = dur.split(":").map(Number);
  const total = m * 60 + s;
  const cur = Math.round((pct / 100) * total);
  return `${Math.floor(cur / 60)}:${String(cur % 60).padStart(2, "0")}`;
}
