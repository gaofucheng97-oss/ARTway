import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Footprints, Palette, Accessibility, Zap, Sparkles, Mountain, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { Chip, Pill } from "@/components/primitives";
import { curatedRoutes, type CuratedRoute } from "@/data/content";
import { useJourney } from "@/lib/journey";

export const Route = createFileRoute("/routes")({
  component: Routes,
});

const typeMeta: Record<CuratedRoute["type"], { label: string; icon: typeof Zap; tone: string }> = {
  quick: { label: "Quick Route", icon: Zap, tone: "bg-orange/25 text-orange-foreground" },
  recommend: { label: "Recommended", icon: Sparkles, tone: "bg-primary/15 text-primary" },
  deep: { label: "Deep Route", icon: Mountain, tone: "bg-teal/25 text-navy" },
};

function Routes() {
  const navigate = useNavigate();
  const { startRoute } = useJourney();
  const [time, setTime] = useState("20 min");
  const [company, setCompany] = useState("With friends");
  const [pref, setPref] = useState("Interactive");

  const begin = (id: string, name: string) => {
    startRoute(id);
    toast.success(`Started "${name}"`);
    navigate({ to: "/route-progress" });
  };

  const quick = curatedRoutes.find((r) => r.type === "quick")!;

  return (
    <MobileShell>
      <AppHeader title="Curated routes" subtitle="Guide" />

      <div className="space-y-7 px-4 py-5">
        {/* Quick route highlight */}
        <section
          className="overflow-hidden rounded-3xl p-5 text-white shadow-[var(--shadow-card)]"
          style={{ background: "var(--gradient-warm)" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
            <Zap className="h-3.5 w-3.5" /> Quick Route
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold">{quick.name}</h2>
          <p className="mt-1 text-sm text-white/85">
            A short 15–20 minute intro to public art between classes.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-white">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold"><Clock className="h-3.5 w-3.5" /> {quick.duration}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">{quick.artworkCount} artworks</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold"><Footprints className="h-3.5 w-3.5" /> {quick.distance}</span>
          </div>
          <button
            onClick={() => begin(quick.id, quick.name)}
            className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-primary"
          >
            Start Route
          </button>
        </section>

        {/* Recommend route builder */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Wand2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold">Recommend a route</h2>
              <p className="text-xs text-muted-foreground">Personalised to your time & mood</p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <QuestionRow label="How much time do you have?" options={["15 min", "20 min", "45 min"]} value={time} onChange={setTime} />
            <QuestionRow label="Are you alone or with friends?" options={["Alone", "With friends"]} value={company} onChange={setCompany} />
            <QuestionRow label="What do you prefer?" options={["Audio", "Visuals", "History", "Interactive"]} value={pref} onChange={setPref} />
          </div>

          <div className="mt-4 rounded-2xl bg-accent/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Your match</p>
            <p className="font-display text-base font-semibold">Hidden Makers Trail</p>
            <p className="text-xs text-muted-foreground">
              {time} · {company.toLowerCase()} · {pref.toLowerCase()} focus
            </p>
          </div>
          <button
            onClick={() => begin("hidden-makers-trail", "Hidden Makers Trail")}
            className="mt-3 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
          >
            Start recommended route
          </button>
        </section>

        {/* All routes */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">All routes</h2>
          {curatedRoutes.map((r) => {
            const meta = typeMeta[r.type];
            const Icon = meta.icon;
            return (
              <article key={r.id} className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${meta.tone}`}>
                      <Icon className="h-3.5 w-3.5" /> {meta.label}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">{r.theme}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill icon={<Clock className="h-3.5 w-3.5" />} tone="teal">{r.duration}</Pill>
                  <Pill tone="muted">{r.artworkCount} artworks</Pill>
                  <Pill icon={<Footprints className="h-3.5 w-3.5" />} tone="muted">{r.distance}</Pill>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Accessibility className="h-3.5 w-3.5" /> {r.accessibility}
                </p>
                <button
                  onClick={() => begin(r.id, r.name)}
                  className="mt-3 w-full rounded-2xl bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-foreground"
                >
                  Start Route
                </button>
              </article>
            );
          })}
        </section>
      </div>
    </MobileShell>
  );
}

function QuestionRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
        <Palette className="h-4 w-4 text-primary" /> {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => onChange(o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}
