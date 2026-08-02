import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Users, Eye, Trash2, Download, ShieldCheck } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/settings/privacy")({
  component: Privacy,
});

const visibilities = ["Keep private", "Share anonymously", "Share publicly"];

function Privacy() {
  const [vis, setVis] = useState("Keep private");
  const [consent, setConsent] = useState(true);
  return (
    <MobileShell>
      <AppHeader title="Privacy" subtitle="Settings" back />
      <div className="space-y-6 px-4 py-5">
        <section className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="flex items-center gap-1.5 font-display text-base font-semibold"><Eye className="h-4 w-4 text-primary" /> Default contribution visibility</p>
          <div className="mt-3 space-y-2">
            {visibilities.map((v) => (
              <button key={v} onClick={() => setVis(v)} className={cn("flex w-full items-center justify-between rounded-2xl border p-3 text-sm font-semibold", vis === v ? "border-primary bg-primary/12 text-primary" : "border-border bg-card")}>
                {v} {vis === v && <ShieldCheck className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </section>

        <button onClick={() => toast("Opening your public contributions")} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left text-sm font-semibold">
          <Users className="h-5 w-5 text-primary" /> Manage public contributions
        </button>

        <section className="rounded-3xl border border-border bg-accent/40 p-4">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
            <span><span className="font-semibold">Consent preferences</span><br /><span className="text-xs text-muted-foreground">Allow my public reflections to appear in the community journal.</span></span>
          </label>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => toast("Preparing your data export")} className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-sm font-semibold">
            <Download className="h-4 w-4" /> Download my data
          </button>
          <button onClick={() => toast("Data deletion requested")} className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-sm font-semibold text-destructive">
            <Trash2 className="h-4 w-4" /> Delete my data
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
